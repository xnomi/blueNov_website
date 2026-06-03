"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, AlertTriangle } from "lucide-react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      setError("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    setError("");

    const supabase = createClient();
    const { error: err } = await supabase.from("contact_messages").insert([
      {
        name,
        email,
        subject: subject || null,
        message,
      },
    ]);

    setSubmitting(false);

    if (err) {
      setError(err.message || "Failed to send message. Please try again.");
      return;
    }

    setSuccess(true);
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
  };

  if (success) {
    return (
      <div 
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem 1rem",
          background: "rgba(16, 185, 129, 0.05)",
          border: "1px dashed #10b981",
          borderRadius: "12px",
        }}
      >
        <CheckCircle size={44} color="#10b981" style={{ marginBottom: "1rem" }} />
        <h3 className="h3" style={{ marginBottom: "0.5rem", color: "var(--text-primary)" }}>Thank You!</h3>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", maxWidth: "400px" }}>
          Your message has been received successfully. We will get back to you as soon as possible.
        </p>
        <button 
          onClick={() => setSuccess(false)}
          className="btn-ghost" 
          style={{ marginTop: "1.5rem" }}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      {error && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.75rem 1rem",
          background: "rgba(239, 68, 68, 0.1)",
          border: "1px solid rgba(239, 68, 68, 0.3)",
          color: "#ef4444",
          borderRadius: "8px",
          fontSize: "0.875rem",
          marginBottom: "0.5rem",
        }}>
          <AlertTriangle size={16} />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="form-label">Your Name *</label>
        <input 
          type="text" 
          required
          placeholder="John Doe" 
          className="form-input" 
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="form-label">Email Address *</label>
        <input 
          type="email" 
          required
          placeholder="you@example.com" 
          className="form-input" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="form-label">Subject</label>
        <input 
          type="text" 
          placeholder="How can we help?" 
          className="form-input" 
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
      </div>

      <div>
        <label className="form-label">Message *</label>
        <textarea
          required
          rows={5}
          placeholder="Write your message here..."
          className="form-input"
          style={{ resize: "vertical" }}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      <button 
        type="submit" 
        disabled={submitting} 
        className="btn-primary" 
        style={{ width: "fit-content" }}
      >
        {submitting ? (
          <>
            <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
            Sending...
          </>
        ) : (
          "Send Message"
        )}
      </button>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </form>
  );
}
