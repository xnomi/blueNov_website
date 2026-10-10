"use client";

import React, { useState, useEffect } from "react";
import { Star, MessageSquare, ThumbsUp, Send, Loader2, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { formatDateShort } from "@/lib/utils";
import { Review } from "@/types";

interface NovelReviewsProps {
  novelSlug: string;
  novelId?: string;
}

const RATING_LABELS: Record<number, string> = {
  1: "Disappointing",
  2: "Could Be Better",
  3: "Good Read",
  4: "Great Story",
  5: "Masterpiece",
};

export function NovelReviews({ novelSlug, novelId }: NovelReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [totalReviews, setTotalReviews] = useState<number>(0);
  const [distribution, setDistribution] = useState<Record<number, number>>({ 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });

  // Form states
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [content, setContent] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState(false);

  // Liked review IDs from localStorage
  const [likedReviews, setLikedReviews] = useState<Set<string>>(new Set());

  // Load reviews on mount or when novelSlug changes
  useEffect(() => {
    let isCancelled = false;

    // Load saved author name from localStorage for user convenience
    try {
      const savedName = localStorage.getItem("bluenov_reviewer_name");
      if (savedName) setName(savedName);
      const storedLikes = localStorage.getItem("bluenov_liked_reviews");
      if (storedLikes) setLikedReviews(new Set(JSON.parse(storedLikes)));
    } catch {}

    async function fetchReviews() {
      setLoading(true);
      try {
        const queryParam = novelId ? `novel_id=${novelId}` : `novel_slug=${novelSlug}`;
        const res = await fetch(`/api/reviews?${queryParam}`);
        const data = await res.json();

        if (!isCancelled && data.success) {
          setReviews(data.reviews || []);
          setAverageRating(data.averageRating || 0);
          setTotalReviews(data.totalReviews || 0);
          setDistribution(data.ratingDistribution || { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 });
        }
      } catch (e) {
        console.error("Failed to load reviews:", e);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    fetchReviews();
    return () => {
      isCancelled = true;
    };
  }, [novelSlug, novelId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const trimmedName = name.trim();
    const trimmedContent = content.trim();

    if (!trimmedName) {
      setFormError("Please enter your name or reader alias.");
      return;
    }
    if (!trimmedContent || trimmedContent.length < 5) {
      setFormError("Please write at least a few words (minimum 5 characters).");
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          novel_id: novelId,
          novel_slug: novelSlug,
          author_name: trimmedName,
          rating,
          content: trimmedContent,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to submit review");
      }

      // Save name for future convenience
      try {
        localStorage.setItem("bluenov_reviewer_name", trimmedName);
      } catch {}

      // Prepend review into local state
      const updatedList = [data.review, ...reviews];
      setReviews(updatedList);
      setTotalReviews((prev) => prev + 1);

      // Recalculate average
      const sum = updatedList.reduce((acc, r) => acc + r.rating, 0);
      setAverageRating(Number((sum / updatedList.length).toFixed(1)));
      setDistribution((prev) => ({
        ...prev,
        [rating]: (prev[rating] || 0) + 1,
      }));

      setContent("");
      setFormSuccess(true);
      setTimeout(() => {
        setFormOpen(false);
        setFormSuccess(false);
      }, 1500);
    } catch (err: any) {
      setFormError(err.message || "Failed to submit review. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    if (likedReviews.has(reviewId)) return;

    // Optimistically update UI
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, likes: (r.likes || 0) + 1 } : r))
    );

    const updatedLikes = new Set(likedReviews).add(reviewId);
    setLikedReviews(updatedLikes);
    try {
      localStorage.setItem("bluenov_liked_reviews", JSON.stringify(Array.from(updatedLikes)));
    } catch {}

    // Send API update
    try {
      await fetch(`/api/reviews/${reviewId}/like`, { method: "POST" });
    } catch {}
  };

  const activeStarRating = hoverRating !== null ? hoverRating : rating;

  return (
    <section style={{ marginTop: "3rem" }}>
      {/* Section Header */}
      <div
        className="section-title"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div className="section-title-left">
          <div className="section-title-bar" />
          <div>
            <h2 className="h3" style={{ margin: 0 }}>
              Reader Reviews ({totalReviews})
            </h2>
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              Authentic feedback from verified readers
            </span>
          </div>
        </div>

        <button
          onClick={() => {
            setFormOpen(!formOpen);
            setFormError("");
          }}
          className="btn-primary"
          style={{
            fontSize: "0.85rem",
            padding: "0.5rem 1.15rem",
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <MessageSquare size={15} />
          {formOpen ? "Close Form" : "Write a Review"}
        </button>
      </div>

      {/* Review Submission Form */}
      {formOpen && (
        <form
          onSubmit={handleSubmit}
          className="card"
          style={{
            padding: "1.75rem",
            marginBottom: "2rem",
            background: "var(--bg-secondary)",
            border: "1px solid var(--accent)",
            boxShadow: "var(--shadow-md)",
            borderRadius: "16px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.25rem" }}>
            <Sparkles size={18} color="var(--accent)" />
            <h3 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "var(--text-primary)" }}>
              Share Your Thoughts
            </h3>
          </div>

          {formError && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                color: "#EF4444",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                marginBottom: "1rem",
                fontSize: "0.85rem",
              }}
            >
              <AlertCircle size={16} />
              <span>{formError}</span>
            </div>
          )}

          {formSuccess && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                background: "rgba(16, 185, 129, 0.1)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                color: "#10B981",
                padding: "0.75rem 1rem",
                borderRadius: "10px",
                marginBottom: "1rem",
                fontSize: "0.85rem",
              }}
            >
              <CheckCircle2 size={16} />
              <span>Thank you! Your review has been published.</span>
            </div>
          )}

          {/* Rating Selection */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "0.4rem",
              }}
            >
              Your Rating
            </label>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
              <div
                style={{ display: "inline-flex", gap: "0.25rem", cursor: "pointer" }}
                onMouseLeave={() => setHoverRating(null)}
              >
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    type="button"
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    style={{
                      background: "none",
                      border: "none",
                      padding: "0.2rem",
                      cursor: "pointer",
                      transition: "transform 0.15s ease",
                    }}
                    aria-label={`${star} Stars`}
                  >
                    <Star
                      size={26}
                      fill={star <= activeStarRating ? "#FBBF24" : "none"}
                      color={star <= activeStarRating ? "#FBBF24" : "var(--border-color)"}
                      style={{
                        transform: star <= activeStarRating ? "scale(1.1)" : "scale(1)",
                        transition: "all 0.15s ease",
                      }}
                    />
                  </button>
                ))}
              </div>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--accent)",
                  background: "var(--accent-light)",
                  padding: "0.2rem 0.6rem",
                  borderRadius: "999px",
                }}
              >
                {RATING_LABELS[activeStarRating]} ({activeStarRating}/5)
              </span>
            </div>
          </div>

          {/* Reviewer Name */}
          <div style={{ marginBottom: "1.25rem" }}>
            <label
              htmlFor="review-name"
              style={{
                display: "block",
                fontSize: "0.82rem",
                fontWeight: 600,
                color: "var(--text-secondary)",
                marginBottom: "0.4rem",
              }}
            >
              Your Name or Nickname
            </label>
            <input
              id="review-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. NocturneReader"
              maxLength={50}
              style={{
                width: "100%",
                maxWidth: "400px",
                padding: "0.7rem 0.9rem",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                fontSize: "1rem",
              }}
              required
            />
          </div>

          {/* Content */}
          <div style={{ marginBottom: "1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
              <label
                htmlFor="review-content"
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                }}
              >
                Review Comments
              </label>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                {content.length}/2000
              </span>
            </div>
            <textarea
              id="review-content"
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What did you think of the plot, characters, and writing style? Share your honest thoughts..."
              maxLength={2000}
              style={{
                width: "100%",
                padding: "0.75rem 0.9rem",
                borderRadius: "10px",
                border: "1px solid var(--border-color)",
                background: "var(--bg-card)",
                color: "var(--text-primary)",
                fontSize: "1rem",
                fontFamily: "inherit",
                resize: "vertical",
                lineHeight: 1.6,
              }}
              required
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
            <button
              type="button"
              onClick={() => setFormOpen(false)}
              className="btn-ghost"
              style={{ padding: "0.6rem 1.25rem", fontSize: "0.85rem" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="btn-primary"
              style={{
                padding: "0.6rem 1.5rem",
                fontSize: "0.85rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <Send size={15} /> Post Review
                </>
              )}
            </button>
          </div>
        </form>
      )}

      {/* Ratings Summary Card */}
      <div
        className="card"
        style={{
          padding: "1.75rem",
          marginBottom: "2rem",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "2rem",
          alignItems: "center",
        }}
      >
        {/* Left: Overall Score */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            paddingRight: "1rem",
          }}
        >
          <div
            style={{
              fontSize: "3.25rem",
              fontWeight: 800,
              color: "var(--text-primary)",
              lineHeight: 1,
              letterSpacing: "-0.02em",
            }}
          >
            {totalReviews > 0 ? averageRating.toFixed(1) : "—"}
          </div>

          <div style={{ display: "flex", gap: "0.2rem", margin: "0.5rem 0" }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star
                key={s}
                size={18}
                fill={s <= Math.round(averageRating) && totalReviews > 0 ? "#FBBF24" : "none"}
                color={s <= Math.round(averageRating) && totalReviews > 0 ? "#FBBF24" : "var(--border-color)"}
              />
            ))}
          </div>

          <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>
            {totalReviews === 0
              ? "No reviews yet"
              : `Based on ${totalReviews} reader review${totalReviews === 1 ? "" : "s"}`}
          </span>
        </div>

        {/* Right: Distribution Bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {[5, 4, 3, 2, 1].map((stars) => {
            const count = distribution[stars] || 0;
            const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0;
            return (
              <div
                key={stars}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  fontSize: "0.78rem",
                  color: "var(--text-secondary)",
                }}
              >
                <span style={{ minWidth: "35px", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                  {stars} <Star size={11} fill="#FBBF24" color="#FBBF24" />
                </span>

                <div
                  style={{
                    flex: 1,
                    height: "8px",
                    background: "var(--bg-primary)",
                    borderRadius: "999px",
                    overflow: "hidden",
                    border: "1px solid var(--border-color)",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${percentage}%`,
                      background: "linear-gradient(90deg, #1F5FE0 0%, #5BB8F5 100%)",
                      borderRadius: "999px",
                      transition: "width 0.4s ease",
                    }}
                  />
                </div>

                <span style={{ minWidth: "45px", textAlign: "right", color: "var(--text-muted)" }}>
                  {percentage}% ({count})
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: "center", padding: "3rem 1rem", color: "var(--text-muted)" }}>
          <Loader2 size={24} className="animate-spin" style={{ margin: "0 auto 0.5rem" }} />
          <p style={{ fontSize: "0.9rem" }}>Loading reader reviews...</p>
        </div>
      )}

      {/* Empty State: NO fake reviews! */}
      {!loading && reviews.length === 0 && (
        <div
          className="card"
          style={{
            padding: "3rem 1.5rem",
            textAlign: "center",
            background: "var(--bg-card)",
            borderRadius: "16px",
            border: "1px dashed var(--border-color)",
          }}
        >
          <div
            style={{
              width: "56px",
              height: "56px",
              borderRadius: "50%",
              background: "var(--accent-light)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1rem",
              color: "var(--accent)",
            }}
          >
            <MessageSquare size={26} />
          </div>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, margin: "0 0 0.5rem", color: "var(--text-primary)" }}>
            Be the First to Review!
          </h3>
          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-muted)",
              maxWidth: "460px",
              margin: "0 auto 1.5rem",
              lineHeight: 1.6,
            }}
          >
            No reader reviews have been shared for this novel yet. Start the conversation and let fellow readers know your thoughts on this story.
          </p>
          <button
            onClick={() => setFormOpen(true)}
            className="btn-primary"
            style={{ fontSize: "0.85rem", padding: "0.6rem 1.5rem" }}
          >
            <Sparkles size={15} /> Write the First Review
          </button>
        </div>
      )}

      {/* Reviews List */}
      {!loading && reviews.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {reviews.map((rev) => {
            const isLiked = likedReviews.has(rev.id);
            const initials = rev.author_name
              ? rev.author_name
                  .split(" ")
                  .map((w) => w[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)
              : "R";

            return (
              <article
                key={rev.id}
                className="card"
                style={{
                  padding: "1.5rem",
                  borderRadius: "14px",
                  background: "var(--bg-card)",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Header: Author & Rating */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    flexWrap: "wrap",
                    gap: "0.75rem",
                    marginBottom: "0.85rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "50%",
                        background: "linear-gradient(135deg, #1F5FE0 0%, #0A1F5C 100%)",
                        color: "#FFFFFF",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: "0.85rem",
                        flexShrink: 0,
                      }}
                    >
                      {initials}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                        <strong style={{ fontSize: "0.95rem", color: "var(--text-primary)" }}>
                          {rev.author_name}
                        </strong>
                        <span
                          style={{
                            fontSize: "0.65rem",
                            padding: "0.1rem 0.45rem",
                            borderRadius: "999px",
                            background: "var(--accent-light)",
                            color: "var(--accent)",
                            fontWeight: 600,
                          }}
                        >
                          Reader
                        </span>
                      </div>
                      <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                        {formatDateShort(rev.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* Star Rating Badge */}
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.2rem",
                      background: "rgba(251, 191, 36, 0.12)",
                      padding: "0.25rem 0.6rem",
                      borderRadius: "8px",
                      border: "1px solid rgba(251, 191, 36, 0.3)",
                    }}
                  >
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={13}
                        fill={s <= rev.rating ? "#FBBF24" : "none"}
                        color={s <= rev.rating ? "#FBBF24" : "rgba(251, 191, 36, 0.3)"}
                      />
                    ))}
                    <span
                      style={{
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        color: "#D97706",
                        marginLeft: "0.25rem",
                      }}
                    >
                      {rev.rating}.0
                    </span>
                  </div>
                </div>

                {/* Review Body */}
                <p
                  style={{
                    fontSize: "0.925rem",
                    color: "var(--text-secondary)",
                    lineHeight: 1.65,
                    margin: "0 0 1rem",
                    whiteSpace: "pre-line",
                  }}
                >
                  {rev.content}
                </p>

                {/* Footer: Helpful Action */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    borderTop: "1px solid var(--border-color)",
                    paddingTop: "0.75rem",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => handleLike(rev.id)}
                    disabled={isLiked}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "0.4rem",
                      fontSize: "0.78rem",
                      color: isLiked ? "var(--accent)" : "var(--text-muted)",
                      background: isLiked ? "var(--accent-light)" : "transparent",
                      border: "1px solid",
                      borderColor: isLiked ? "var(--accent)" : "var(--border-color)",
                      padding: "0.3rem 0.75rem",
                      borderRadius: "999px",
                      cursor: isLiked ? "default" : "pointer",
                      transition: "all 0.2s ease",
                    }}
                    title={isLiked ? "You found this helpful" : "Helpful"}
                  >
                    <ThumbsUp size={12} fill={isLiked ? "currentColor" : "none"} />
                    <span>{rev.likes > 0 ? `Helpful (${rev.likes})` : "Helpful"}</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
