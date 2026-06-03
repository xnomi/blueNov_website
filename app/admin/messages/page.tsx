"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatDateShort } from "@/lib/utils";
import { Mail, Trash2, Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  is_read: boolean;
  created_at: string;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMessage, setActiveMessage] = useState<ContactMessage | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch messages from Supabase
  const fetchMessages = async () => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("contact_messages")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      setMessages(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Mark message as read/unread
  const toggleReadStatus = async (msg: ContactMessage) => {
    setUpdatingId(msg.id);
    const supabase = createClient();
    const newStatus = !msg.is_read;
    const { error } = await supabase
      .from("contact_messages")
      .update({ is_read: newStatus })
      .eq("id", msg.id);

    if (!error) {
      setMessages((prev) =>
        prev.map((m) => (m.id === msg.id ? { ...m, is_read: newStatus } : m))
      );
      if (activeMessage && activeMessage.id === msg.id) {
        setActiveMessage((prev) => prev ? { ...prev, is_read: newStatus } : null);
      }
    }
    setUpdatingId(null);
  };

  // Delete message
  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message permanently?")) return;
    setUpdatingId(id);
    const supabase = createClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);

    if (!error) {
      setMessages((prev) => prev.filter((m) => m.id !== id));
      if (activeMessage && activeMessage.id === id) {
        setActiveMessage(null);
      }
    }
    setUpdatingId(null);
  };

  if (loading) {
    return <div style={{ padding: "2rem", color: "var(--text-muted)" }}>Loading messages...</div>;
  }

  return (
    <div style={{ maxWidth: "1200px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 className="h2">Contact Messages</h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.875rem" }}>
          Manage user feedback and inquiries ({messages.filter(m => !m.is_read).length} unread)
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1.8fr", gap: "1.5rem", alignItems: "start" }}>
        {/* Messages List */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          overflow: "hidden",
        }}>
          <div style={{
            padding: "1rem",
            background: "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-color)",
            fontWeight: 600,
            fontSize: "0.9rem",
          }}>
            Inbox
          </div>
          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
            {messages.length === 0 ? (
              <div style={{ padding: "3rem 1rem", textAlign: "center", color: "var(--text-muted)" }}>
                <Mail size={32} style={{ marginBottom: "0.5rem", opacity: 0.5 }} />
                <p>No messages received yet.</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  onClick={() => setActiveMessage(msg)}
                  style={{
                    padding: "1rem",
                    borderBottom: "1px solid var(--border-color)",
                    cursor: "pointer",
                    background: activeMessage?.id === msg.id 
                      ? "var(--accent-light)" 
                      : msg.is_read ? "transparent" : "rgba(59, 130, 246, 0.03)",
                    borderLeft: msg.is_read 
                      ? "3px solid transparent" 
                      : "3px solid var(--accent)",
                    transition: "all 0.15s ease",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.25rem" }}>
                    <span style={{ fontWeight: msg.is_read ? 500 : 700, fontSize: "0.875rem", color: "var(--text-primary)" }}>
                      {msg.name}
                    </span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                      {formatDateShort(msg.created_at)}
                    </span>
                  </div>
                  <div style={{
                    fontWeight: msg.is_read ? 500 : 600,
                    fontSize: "0.825rem",
                    color: msg.is_read ? "var(--text-secondary)" : "var(--text-primary)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginBottom: "0.25rem",
                  }}>
                    {msg.subject || "(No Subject)"}
                  </div>
                  <div style={{
                    fontSize: "0.8rem",
                    color: "var(--text-muted)",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>
                    {msg.message}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Message Details */}
        <div style={{
          background: "var(--bg-card)",
          border: "1px solid var(--border-color)",
          borderRadius: "12px",
          padding: "2rem",
          minHeight: "400px",
          display: "flex",
          flexDirection: "column",
        }}>
          {activeMessage ? (
            <div style={{ display: "flex", flexDirection: "column", height: "100%", flex: 1 }}>
              {/* Header */}
              <div style={{ borderBottom: "1px solid var(--border-color)", paddingBottom: "1.25rem", marginBottom: "1.5rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", marginBottom: "1rem" }}>
                  <div>
                    <h2 className="h3" style={{ margin: 0, marginBottom: "0.5rem" }}>
                      {activeMessage.subject || "(No Subject)"}
                    </h2>
                    <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", margin: 0 }}>
                      From: <span style={{ fontWeight: 600, color: "var(--text-primary)" }}>{activeMessage.name}</span> ({activeMessage.email})
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      onClick={() => toggleReadStatus(activeMessage)}
                      disabled={updatingId === activeMessage.id}
                      title={activeMessage.is_read ? "Mark as Unread" : "Mark as Read"}
                      style={{
                        padding: "0.5rem",
                        borderRadius: "8px",
                        border: "1px solid var(--border-color)",
                        background: "var(--bg-secondary)",
                        color: "var(--text-secondary)",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {updatingId === activeMessage.id ? (
                        <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                      ) : activeMessage.is_read ? (
                        <EyeOff size={16} />
                      ) : (
                        <Eye size={16} />
                      )}
                    </button>
                    <button
                      onClick={() => deleteMessage(activeMessage.id)}
                      disabled={updatingId === activeMessage.id}
                      title="Delete Permanently"
                      style={{
                        padding: "0.5rem",
                        borderRadius: "8px",
                        border: "1px solid rgba(239,68,68,0.2)",
                        background: "rgba(239,68,68,0.05)",
                        color: "#ef4444",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      {updatingId === activeMessage.id ? (
                        <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />
                      ) : (
                        <Trash2 size={16} />
                      )}
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                  Received on {new Date(activeMessage.created_at).toLocaleString("en-US", { dateStyle: "long", timeStyle: "short" })}
                </div>
              </div>

              {/* Message Content */}
              <div style={{ 
                flex: 1, 
                whiteSpace: "pre-wrap", 
                lineHeight: "1.6", 
                fontSize: "0.95rem", 
                color: "var(--text-primary)",
                background: "var(--bg-secondary)",
                padding: "1.5rem",
                borderRadius: "8px",
                border: "1px solid var(--border-color)",
              }}>
                {activeMessage.message}
              </div>
            </div>
          ) : (
            <div style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              color: "var(--text-muted)",
              padding: "4rem 1rem",
            }}>
              <Mail size={40} style={{ marginBottom: "1rem", opacity: 0.3 }} />
              <p style={{ margin: 0 }}>Select a message from the inbox to read its contents.</p>
            </div>
          )}
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
