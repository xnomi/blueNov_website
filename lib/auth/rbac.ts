import { createClient, createServiceClient } from "@/lib/supabase/server";
import { UserRole, UserProfile, EditorActivity, EditorSummary } from "@/types";

/**
 * Resolves the authenticated user's role: 'admin' | 'editor' | 'user'.
 * Prioritizes profiles table, then auth user_metadata, then admin email fallback.
 */
export async function getCurrentUserRole(userId?: string, userEmail?: string): Promise<UserRole> {
  if (!userId && !userEmail) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return "user";
    userId = user.id;
    userEmail = user.email || "";
  }

  // Fallback check against known admin emails
  const adminEmail = process.env.ADMIN_EMAIL || "admin@bluenov.me";
  const defaultAdmins = [adminEmail.toLowerCase(), "xnomi555@gmail.com", "nomiash1122@gmail.com"];
  if (userEmail && defaultAdmins.includes(userEmail.toLowerCase())) {
    return "admin";
  }

  try {
    const supabase = await createClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId!)
      .single();

    if (profile?.role) {
      return profile.role as UserRole;
    }
  } catch {
    // ignore query failure, check next source
  }

  // Check auth user metadata
  try {
    const serviceClient = await createServiceClient();
    const { data: authUser } = await serviceClient.auth.admin.getUserById(userId!);
    if (authUser?.user?.user_metadata?.role) {
      return authUser.user.user_metadata.role as UserRole;
    }
  } catch {
    // fallback
  }

  return "editor";
}

/**
 * Record an activity performed by an editor or admin
 */
export async function recordEditorActivity(entry: {
  userId?: string;
  userEmail: string;
  userName?: string;
  action: EditorActivity["action"];
  targetType: EditorActivity["target_type"];
  targetId?: string;
  targetTitle?: string;
  details?: Record<string, any>;
}) {
  try {
    const serviceClient = await createServiceClient();
    await serviceClient.from("editor_activities").insert({
      user_id: entry.userId,
      user_email: entry.userEmail,
      user_name: entry.userName || entry.userEmail.split("@")[0],
      action: entry.action,
      target_type: entry.targetType,
      target_id: entry.targetId,
      target_title: entry.targetTitle,
      details: entry.details || {},
      created_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn("Could not record editor activity to database:", err);
  }
}

/**
 * Fetches all editors and admins with their posting metrics
 */
export async function getStaffMembers(): Promise<EditorSummary[]> {
  try {
    const serviceClient = await createServiceClient();
    
    // 1. Get auth users
    const { data: usersData, error: uErr } = await serviceClient.auth.admin.listUsers();
    if (uErr || !usersData?.users) {
      return [];
    }

    // 2. Get profiles
    const { data: profiles } = await serviceClient.from("profiles").select("*");
    const profileMap = new Map((profiles || []).map((p: any) => [p.id, p]));

    // 3. Get all novels and chapters to calculate productivity per author
    const { data: novels } = await serviceClient
      .from("novels")
      .select("id, author, view_count, created_at");

    const { data: chapters } = await serviceClient
      .from("chapters")
      .select("id, novel_id, view_count, created_at");

    // 4. Try fetching activities
    const { data: activities } = await serviceClient
      .from("editor_activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100);

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@bluenov.me").toLowerCase();

    const staff: EditorSummary[] = usersData.users.map((u) => {
      const prof = profileMap.get(u.id);
      const defaultAdmins = [adminEmail, "xnomi555@gmail.com", "nomiash1122@gmail.com"];
      const isConfigAdmin = defaultAdmins.includes((u.email || "").toLowerCase());
      const role: UserRole = isConfigAdmin
        ? "admin"
        : (prof?.role || u.user_metadata?.role || "editor");

      const name =
        prof?.full_name ||
        u.user_metadata?.full_name ||
        u.user_metadata?.name ||
        (u.email ? u.email.split("@")[0] : "Staff Member");

      // Count novels authored by this user name or email prefix
      const userNovels = (novels || []).filter((n) => {
        if (!n.author) return false;
        const normAuthor = n.author.toLowerCase().trim();
        const normName = name.toLowerCase().trim();
        const normEmailUser = (u.email?.split("@")[0] || "").toLowerCase().trim();
        return normAuthor === normName || normAuthor === normEmailUser;
      });

      const novelIds = new Set(userNovels.map((n) => n.id));
      const userChapters = (chapters || []).filter((c) => novelIds.has(c.novel_id));
      
      const novelViews = userNovels.reduce((sum, n) => sum + (Number(n.view_count) || 0), 0);
      const chapterViews = userChapters.reduce((sum, c) => sum + (Number(c.view_count) || 0), 0);

      // Latest activity
      const userActs = (activities || []).filter((a) => a.user_id === u.id || a.user_email === u.email);
      const lastActive = userActs[0]?.created_at || u.last_sign_in_at || u.created_at;

      return {
        id: u.id,
        email: u.email || "",
        name,
        role,
        novels_count: userNovels.length,
        chapters_count: userChapters.length,
        total_views: novelViews + chapterViews,
        last_active: lastActive,
        created_at: u.created_at,
      };
    });

    return staff;
  } catch (err) {
    console.error("Failed to load staff members:", err);
    return [];
  }
}

/**
 * Get recent activity feed across all editors
 */
export async function getRecentActivityFeed(limit = 15): Promise<EditorActivity[]> {
  try {
    const serviceClient = await createServiceClient();
    const { data, error } = await serviceClient
      .from("editor_activities")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (!error && data && data.length > 0) {
      return data as EditorActivity[];
    }
  } catch {
    // fallback to recent chapters and novels
  }

  // Fallback dynamic reconstruction from recent chapters & novels
  try {
    const serviceClient = await createServiceClient();
    const [{ data: chapters }, { data: novels }] = await Promise.all([
      serviceClient
        .from("chapters")
        .select("id, title, chapter_number, created_at, novels(title, author)")
        .order("created_at", { ascending: false })
        .limit(limit),
      serviceClient
        .from("novels")
        .select("id, title, author, created_at")
        .order("created_at", { ascending: false })
        .limit(limit),
    ]);

    const items: EditorActivity[] = [];

    (chapters || []).forEach((c: any) => {
      items.push({
        id: `ch-${c.id}`,
        user_email: c.novels?.author ? `${c.novels.author.toLowerCase().replace(/\s+/g, '')}@bluenov.me` : "editor@bluenov.me",
        user_name: c.novels?.author || "Editor",
        action: "created_chapter",
        target_type: "chapter",
        target_id: c.id,
        target_title: `Ch. ${c.chapter_number}: ${c.title} (${c.novels?.title || "Novel"})`,
        created_at: c.created_at,
      });
    });

    (novels || []).forEach((n: any) => {
      items.push({
        id: `nov-${n.id}`,
        user_email: n.author ? `${n.author.toLowerCase().replace(/\s+/g, '')}@bluenov.me` : "editor@bluenov.me",
        user_name: n.author || "Editorial Desk",
        action: "created_novel",
        target_type: "novel",
        target_id: n.id,
        target_title: n.title,
        created_at: n.created_at,
      });
    });

    return items
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, limit);
  } catch {
    return [];
  }
}
