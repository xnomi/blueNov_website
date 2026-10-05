"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, ThumbsUp, Send } from "lucide-react";
import { formatDateShort } from "@/lib/utils";

interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  date: string;
  likes: number;
}

const DEFAULT_REVIEWS: Review[] = [
  {
    id: "r1",
    author: "Elena Rostova",
    rating: 5,
    content: "The pacing is immaculate and the character development kept me hooked from chapter 1. Hands down one of the best web novels on the site.",
    date: new Date(Date.now() - 86400000 * 3).toISOString(),
    likes: 24,
  },
  {
    id: "r2",
    author: "Marcus Chen",
    rating: 5,
    content: "Incredible world-building. The magic system feels fresh and the dialogue isn't cliché like so many other stories. Highly recommend reading!",
    date: new Date(Date.now() - 86400000 * 7).toISOString(),
    likes: 19,
  },
  {
    id: "r3",
    author: "Aria Thorne",
    rating: 4,
    content: "A compelling read with surprising plot twists in the middle chapters. Can't wait for the next update!",
    date: new Date(Date.now() - 86400000 * 14).toISOString(),
    likes: 11,
  },
];

export function NovelReviews({ novelSlug }: { novelSlug: string }) {
  const [reviews, setReviews] = useState<Review[]>(DEFAULT_REVIEWS);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem(`bluenov-reviews-${novelSlug}`);
    if (stored) {
      try {
        setReviews(JSON.parse(stored));
      } catch (e) {}
    }
  }, [novelSlug]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;

    const newReview: Review = {
      id: `r-${Date.now()}`,
      author: name.trim(),
      rating,
      content: content.trim(),
      date: new Date().toISOString(),
      likes: 1,
    };

    const updated = [newReview, ...reviews];
    setReviews(updated);
    localStorage.setItem(`bluenov-reviews-${novelSlug}`, JSON.stringify(updated));

    setName("");
    setContent("");
    setFormOpen(false);
  };

  const avgRating = (
    reviews.reduce((acc, r) => acc + r.rating, 0) / (reviews.length || 1)
  ).toFixed(1);

  return (
    <section style={{ marginTop: "3rem" }}>
      <div className="section-title">
        <div className="section-title-left">
          <div className="section-title-bar" />
          <h2 className="h3" style={{ margin: 0 }}>Reader Reviews ({reviews.length})</h2>
        </div>

        <button
          onClick={() => setFormOpen(!formOpen)}
          className="btn-primary"
          style={{ fontSize: "0.85rem", padding: "0.45rem 1rem" }}
        >
          <MessageSquare size={15} /> Write a Review
        </button>
      </div>

      {/* Rating Summary Card */}
      <div
        className="card"
        style={{
          padding: "1.5rem",
          display: "flex",
          alignItems: "center",
          gap: "2rem",
          marginBottom: "1.5rem",
          flexWrap: "wrap",
        }}
      >
        <div style={{ textAlign: "center", minWidth: "120px" }}>
          <div style={{ fontSize: "2.75rem", fontWeight: 800, color: "var(--text-primary)", lineHeight: 1 }}>
            {avgRating}
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: "0.2rem", margin: "0.4rem 0" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={16}
                fill={s <= Math.round(Number(avgRating)) ? "#FBBF24" : "none"}
                color="#FBBF24"
              />
            ))}
          </div>
          <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
            Based on {reviews.length} reviews
          </span>
        </div>

        <div style={{ flex: 1, borderLeft: "1px solid var(--border-color)", paddingLeft: "1.5rem" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", margin: 0 }}>
            Read authentic reviews from readers. Share your thoughts on character development, plot twists, and world-building!
          </p>
        </div>
      </div>

      {/* Review Form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="card"
          style={{
            padding: "1.5rem",
            marginBottom: "1.5rem",
            background: "var(--bg-secondary)",
          }}
        >
          <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: "1rem" }}>
            Write Your Review
          </h3>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
            <div>
              <label className="form-label">Your Name or Pen Name</label>
              <input
                type="text"
                required
                placeholder="e.g. StoryLover42"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Rating</label>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", height: "42px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                      padding: "0.2rem",
                    }}
                  >
                    <Star
                      size={24}
                      fill={star <= rating ? "#FBBF24" : "none"}
                      color="#FBBF24"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: "1rem" }}>
            <label className="form-label">Your Review</label>
            <textarea
              required
              rows={3}
              placeholder="What did you love most about this story? What would you tell new readers?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="form-input"
              style={{ resize: "vertical" }}
            />
          </div>

          <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="btn-ghost"
              style={{ fontSize: "0.85rem" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              style={{ fontSize: "0.85rem", padding: "0.5rem 1.25rem" }}
            >
              <Send size={14} /> Submit Review
            </button>
          </div>
        </form>
      )}

      {/* Review List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {reviews.map((r) => (
          <div
            key={r.id}
            className="card"
            style={{ padding: "1.25rem" }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <div
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "var(--accent-light)",
                    color: "var(--accent)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                  }}
                >
                  {r.author[0]}
                </div>
                <div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>
                    {r.author}
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "var(--text-muted)" }}>
                    {formatDateShort(r.date)}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.15rem" }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={14}
                    fill={s <= r.rating ? "#FBBF24" : "none"}
                    color="#FBBF24"
                  />
                ))}
              </div>
            </div>

            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, margin: 0 }}>
              {r.content}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
