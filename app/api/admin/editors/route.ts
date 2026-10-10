import { NextResponse, type NextRequest } from "next/server";
import { createClient, createServiceClient } from "@/lib/supabase/server";
import { getCurrentUserRole, getStaffMembers, recordEditorActivity } from "@/lib/auth/rbac";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getCurrentUserRole(user.id, user.email);
    if (role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
    }

    const staff = await getStaffMembers();
    return NextResponse.json({ staff });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch staff" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getCurrentUserRole(user.id, user.email);
    if (role !== "admin") {
      return NextResponse.json({ error: "Only Administrators can add editors" }, { status: 403 });
    }

    const body = await req.json();
    const { email, password, full_name, role: newRole = "editor" } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
    }

    const serviceClient = await createServiceClient();

    // 1. Create in Supabase Auth
    const { data: created, error: authErr } = await serviceClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        role: newRole,
        full_name: full_name || email.split("@")[0],
      },
    });

    if (authErr) {
      const msg = authErr.message.includes("Database error")
        ? `${authErr.message}. Please ensure supabase-rbac-migration.sql has been executed in your Supabase SQL editor.`
        : authErr.message;
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    const newUserId = created.user.id;

    // 2. Upsert into profiles table
    try {
      await serviceClient.from("profiles").upsert({
        id: newUserId,
        email,
        role: newRole,
      });
    } catch {
      // ignore
    }

    // 3. Log activity
    await recordEditorActivity({
      userId: user.id,
      userEmail: user.email || "admin@bluenov.me",
      userName: "Administrator",
      action: "created_editor",
      targetType: "editor",
      targetId: newUserId,
      targetTitle: email,
      details: { role: newRole, full_name },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUserId,
        email,
        full_name: full_name || email.split("@")[0],
        role: newRole,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create editor" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getCurrentUserRole(user.id, user.email);
    if (role !== "admin") {
      return NextResponse.json({ error: "Only Administrators can modify editors" }, { status: 403 });
    }

    const body = await req.json();
    const { id, password, role: targetRole, full_name } = body;

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const serviceClient = await createServiceClient();

    const updates: Record<string, any> = {};
    if (password) {
      if (password.length < 6) {
        return NextResponse.json({ error: "Password must be at least 6 characters" }, { status: 400 });
      }
      updates.password = password;
    }

    const metaUpdates: Record<string, any> = {};
    if (targetRole) metaUpdates.role = targetRole;
    if (full_name) metaUpdates.full_name = full_name;

    if (Object.keys(metaUpdates).length > 0) {
      updates.user_metadata = metaUpdates;
    }

    const { error: updateErr } = await serviceClient.auth.admin.updateUserById(id, updates);
    if (updateErr) {
      return NextResponse.json({ error: updateErr.message }, { status: 400 });
    }

    // Update profile table
    try {
      if (targetRole) {
        await serviceClient.from("profiles").update({ role: targetRole }).eq("id", id);
      }
    } catch {
      // ignore
    }

    await recordEditorActivity({
      userId: user.id,
      userEmail: user.email || "admin@bluenov.me",
      userName: "Administrator",
      action: password ? "reset_password" : "updated_editor",
      targetType: "editor",
      targetId: id,
      targetTitle: full_name || id,
      details: { roleUpdated: !!targetRole, passwordReset: !!password },
    });

    return NextResponse.json({ success: true, message: "Editor updated successfully" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update editor" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const role = await getCurrentUserRole(user.id, user.email);
    if (role !== "admin") {
      return NextResponse.json({ error: "Only Administrators can delete editors" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    if (id === user.id) {
      return NextResponse.json({ error: "Cannot delete your own administrator account" }, { status: 400 });
    }

    const serviceClient = await createServiceClient();

    // Remove profile first then auth user
    try {
      await serviceClient.from("profiles").delete().eq("id", id);
    } catch {
      // ignore
    }

    const { error: delErr } = await serviceClient.auth.admin.deleteUser(id);
    if (delErr) {
      return NextResponse.json({ error: delErr.message }, { status: 400 });
    }

    await recordEditorActivity({
      userId: user.id,
      userEmail: user.email || "admin@bluenov.me",
      userName: "Administrator",
      action: "updated_editor",
      targetType: "editor",
      targetId: id,
      targetTitle: `Deleted user ${id}`,
      details: { action: "delete" },
    });

    return NextResponse.json({ success: true, message: "Editor deleted" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to delete editor" }, { status: 500 });
  }
}
