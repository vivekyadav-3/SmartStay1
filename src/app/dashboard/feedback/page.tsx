"use client";

import { useState } from "react";
import { Star, MessageSquare, Send, CheckCircle2, Sparkles, ThumbsUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { submitStudentFeedback } from "@/app/actions/feedback";

const categories = [
  { id: "OVERALL", label: "Overall SmartStay" },
  { id: "GATE_PASS", label: "Gate Pass System" },
  { id: "MESS", label: "Mess & Food Quality" },
  { id: "LAUNDRY", label: "Laundry Service" },
  { id: "COMPLAINTS", label: "Maintenance & Complaints" },
  { id: "ANNOUNCEMENTS", label: "Hostel Notices" },
];

export default function FeedbackPage() {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [category, setCategory] = useState<any>("OVERALL");
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewText.trim()) {
      setError("Please write a sentence describing your experience.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const res = await submitStudentFeedback({
      rating,
      category,
      reviewText,
    });

    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      {/* Clean Header */}
      <div className="border-b border-white/10 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
          <Sparkles className="size-3.5" />
          <span>Feedback-Driven Engineering</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
          Student Feedback Portal
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Your feedback directly influences what the development team prioritizes for Prototype 2.
        </p>
      </div>

      {submitted ? (
        <Card className="bg-emerald-950/20 border-emerald-500/30 text-center p-8 shadow-xl">
          <CardContent className="space-y-4 pt-6">
            <div className="size-16 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center mx-auto text-emerald-400">
              <CheckCircle2 className="size-8" />
            </div>
            <h2 className="text-xl font-bold text-foreground">Thank You for Your Feedback!</h2>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
              Your submission has been permanently recorded in the database. The Head Warden and developer team review these ratings to guide future sprints.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSubmitted(false);
                setReviewText("");
                setRating(5);
              }}
              className="text-xs mt-2"
            >
              Submit Another Review
            </Button>
          </CardContent>
        </Card>
      ) : (
        <form onSubmit={handleSubmit}>
          <Card className="bg-slate-900/60 border-white/10 shadow-xl">
            <CardHeader>
              <CardTitle className="text-base font-semibold">How is your experience with SmartStay?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Star Rating Interactive Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Overall Rating (1 to 5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const isFilled = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-110 focus:outline-none"
                      >
                        <Star
                          className={`size-8 transition-colors ${
                            isFilled
                              ? "text-amber-400 fill-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]"
                              : "text-slate-600 hover:text-slate-500"
                          }`}
                        />
                      </button>
                    );
                  })}
                  <span className="ml-3 text-sm font-semibold text-amber-400 font-mono">
                    {rating} of 5 Stars
                  </span>
                </div>
              </div>

              {/* Category Pills */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  What feature are you reviewing?
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        category === cat.id
                          ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Your Suggestions / Thoughts
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="e.g. The gate pass process is very smooth, but we need the weekly mess menu uploaded every Sunday..."
                  rows={4}
                  className="w-full bg-black/60 border border-white/15 rounded-xl p-3 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm h-11 rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Recording in Database...</span>
                ) : (
                  <>
                    <Send className="size-4" />
                    <span>Submit Feedback to Head Warden</span>
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      )}
    </div>
  );
}
