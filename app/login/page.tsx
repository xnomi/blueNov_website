"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Logo } from "@/components/common/Logo";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  CheckCircle2,
  BookOpen,
  ArrowRight,
  Sparkles,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/";
  const urlError = searchParams.get("error");

  const { user, loading: authLoading, signInWithGoogle } = useAuth();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(urlError || null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      router.push(next);
    }
  }, [user, authLoading, next, router]);

  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    try {
      await signInWithGoogle(next);
    } catch (err: unknown) {
      console.error("Google login error:", err);
      const message =
        err instanceof Error
          ? err.message
          : "Failed to initialize Google login. Check your internet connection or Supabase settings.";
      setError(message);
      setGoogleLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
    setLoading(true);

    const supabase = createClient();

    try {
      if (mode === "signin") {
        const { error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (signInErr) throw signInErr;
        router.push(next);
        router.refresh();
      } else {
        const { data, error: signUpErr } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(
              next
            )}`,
          },
        });
        if (signUpErr) throw signUpErr;

        if (data.session) {
          router.push(next);
          router.refresh();
        } else {
          setSuccessMessage(
            "Account created! Please check your email inbox to confirm your account."
          );
        }
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Authentication failed.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "440px",
        margin: "0 auto",
      }}
    >
      {/* Brand Header */}
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div
          style={{
            display: "inline-flex",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <Logo size="lg" href="/" />
        </div>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "1.75rem",
            fontWeight: 700,
            color: "var(--text-primary)",
            marginBottom: "0.4rem",
          }}
        >
          {mode === "signin" ? "Welcome Back, Reader" : "Begin Your Reading Journey"}
        </h1>
        <p
          style={{
            color: "var(--text-secondary)",
            fontSize: "0.92rem",
            lineHeight: 1.5,
          }}
        >
          {mode === "signin"
            ? "Sign in to sync your bookmarks, reading shelves, and personalized typography across all devices."
            : "Create a free account to track reading history, write reviews, and build your digital bookshelf."}
        </p>
      </div>

      {/* Card Container */}
      <div
        style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "18px",
          padding: "2.25rem 2rem",
          boxShadow: "var(--shadow-lg)",
        }}
      >
        {/* Error Alert */}
        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.25)",
              color: "#ef4444",
              borderRadius: "12px",
              padding: "0.85rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.88rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.6rem",
              lineHeight: 1.4,
            }}
          >
            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>
              <div style={{ fontWeight: 600 }}>Authentication Error</div>
              <div style={{ fontSize: "0.84rem", opacity: 0.9 }}>{error}</div>
            </div>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div
            style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.25)",
              color: "#10b981",
              borderRadius: "12px",
              padding: "0.85rem 1rem",
              marginBottom: "1.25rem",
              fontSize: "0.88rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "0.6rem",
              lineHeight: 1.4,
            }}
          >
            <CheckCircle2 size={18} style={{ flexShrink: 0, marginTop: "2px" }} />
            <div>{successMessage}</div>
          </div>
        )}

        {/* GOOGLE SIGN IN BUTTON */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={googleLoading || loading}
          style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.85rem",
            padding: "0.85rem 1.25rem",
            background: "var(--bg-primary)",
            color: "var(--text-primary)",
            border: "1px solid var(--border-color)",
            borderRadius: "12px",
            fontSize: "0.95rem",
            fontWeight: 600,
            cursor: googleLoading ? "not-allowed" : "pointer",
            transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            boxShadow: "0 2px 6px rgba(0, 0, 0, 0.04)",
          }}
          onMouseEnter={(e) => {
            if (!googleLoading) {
              e.currentTarget.style.borderColor = "var(--accent)";
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow = "var(--shadow-md)";
            }
          }}
          onMouseLeave={(e) => {
            if (!googleLoading) {
              e.currentTarget.style.borderColor = "var(--border-color)";
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "0 2px 6px rgba(0, 0, 0, 0.04)";
            }
          }}
        >
          {googleLoading ? (
            <Loader2
              size={20}
              className="animate-spin"
              style={{ animation: "spin 1s linear infinite", color: "var(--accent)" }}
            />
          ) : (
            <Image
              src="/google_icon.png"
              alt="Google Icon"
              width={22}
              height={22}
              style={{ objectFit: "contain" }}
            />
          )}
          <span>
            {googleLoading ? "Connecting to Google..." : "Continue with Google"}
          </span>
        </button>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            margin: "1.75rem 0",
            gap: "1rem",
          }}
        >
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "var(--border-color)",
            }}
          />
          <span
            style={{
              color: "var(--text-muted)",
              fontSize: "0.82rem",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            or with email
          </span>
          <div
            style={{
              flex: 1,
              height: "1px",
              background: "var(--border-color)",
            }}
          />
        </div>

        {/* Email & Password Form */}
        <form onSubmit={handleEmailAuth}>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div>
              <label
                htmlFor="login-email"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.4rem",
                }}
              >
                Email Address
              </label>
              <div style={{ position: "relative" }}>
                <Mail
                  size={16}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  id="login-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="reader@bluenov.me"
                  className="form-input"
                  style={{
                    width: "100%",
                    paddingLeft: "2.5rem",
                    background: "var(--bg-primary)",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="login-password"
                style={{
                  display: "block",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: "0.4rem",
                }}
              >
                Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={16}
                  style={{
                    position: "absolute",
                    left: "0.875rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--text-muted)",
                  }}
                />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="form-input"
                  style={{
                    width: "100%",
                    paddingLeft: "2.5rem",
                    paddingRight: "2.5rem",
                    background: "var(--bg-primary)",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: "0.85rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    padding: 0,
                    display: "flex",
                  }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.85rem",
                fontSize: "0.95rem",
                justifyContent: "center",
                marginTop: "0.5rem",
              }}
            >
              {loading ? (
                <Loader2
                  size={18}
                  className="animate-spin"
                  style={{ animation: "spin 1s linear infinite" }}
                />
              ) : null}
              <span>
                {loading
                  ? mode === "signin"
                    ? "Signing in..."
                    : "Creating account..."
                  : mode === "signin"
                  ? "Sign In with Email"
                  : "Create Free Account"}
              </span>
            </button>
          </div>
        </form>

        {/* Toggle between Sign In and Sign Up */}
        <div
          style={{
            marginTop: "1.5rem",
            paddingTop: "1.25rem",
            borderTop: "1px solid var(--border-color)",
            textAlign: "center",
            fontSize: "0.88rem",
            color: "var(--text-secondary)",
          }}
        >
          {mode === "signin" ? (
            <>
              Don&apos;t have an account yet?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signup");
                  setError(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign Up Free
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("signin");
                  setError(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--accent)",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>

      {/* Guest Link */}
      <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
        <Link
          href={next}
          style={{
            fontSize: "0.85rem",
            color: "var(--text-muted)",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.35rem",
          }}
        >
          <span>Continue reading as guest</span>
          <ArrowRight size={14} />
        </Link>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "calc(100vh - 140px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1.25rem",
        background: "radial-gradient(ellipse at top, var(--accent-light) 0%, transparent 60%)",
      }}
    >
      <Suspense
        fallback={
          <div style={{ display: "flex", justifyContent: "center", padding: "4rem" }}>
            <Loader2
              size={32}
              className="animate-spin"
              style={{ animation: "spin 1s linear infinite", color: "var(--accent)" }}
            />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  );
}
