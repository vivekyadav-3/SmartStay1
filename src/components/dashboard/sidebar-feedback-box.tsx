"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  Star, 
  X, 
  Send, 
  CheckCircle2, 
  MessageSquare, 
  Users, 
  ShieldCheck, 
  Sparkles,
  Search,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { submitStudentFeedback, getFeedbacksList } from "@/app/actions/feedback";

interface FeedbackItem {
  id: string;
  rating: number;
  reviewText: string;
  category: string;
  createdAt: string | Date;
  user?: {
    name?: string | null;
    email?: string | null;
    studentProfile?: {
      rollNo?: string | null;
      roomNo?: string | null;
      hostel?: { name?: string | null } | null;
    } | null;
  } | null;
}

export function SidebarFeedbackBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"give" | "view">("give");
  const [mounted, setMounted] = useState(false);

  // Form states
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [selectedFeature, setSelectedFeature] = useState("Library Pass (Curfew 08:30 & QR)");
  const [reviewText, setReviewText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Reviews list states
  const [reviews, setReviews] = useState<FeedbackItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(80);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStar, setFilterStar] = useState<number | "ALL">("ALL");

  const mergeLocalReviews = (serverReviews: FeedbackItem[]) => {
    try {
      const stored = JSON.parse(localStorage.getItem("kiit_resident_reviews") || "[]");
      if (Array.isArray(stored) && stored.length > 0) {
        const ids = new Set(serverReviews.map((r) => r.id));
        const toAdd = stored.filter((s: any) => !ids.has(s.id));
        return [...toAdd, ...serverReviews];
      }
    } catch {}
    return serverReviews;
  };

  useEffect(() => {
    setMounted(true);
    getFeedbacksList(150).then((data) => {
      if (data?.reviews) {
        const merged = mergeLocalReviews(data.reviews as any);
        setReviews(merged);
        setTotalCount(merged.length);
      }
    });
  }, []);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Load latest reviews when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoadingReviews(true);
      getFeedbacksList(150).then((data) => {
        if (data?.reviews) {
          const merged = mergeLocalReviews(data.reviews as any);
          setReviews(merged);
          setTotalCount(merged.length);
        }
        setLoadingReviews(false);
      });
    }
  }, [isOpen]);

  const featureOptions = [
    { label: "Library Pass (Curfew 08:30 & QR verification)", category: "GATE_PASS" },
    { label: "Washing Machine live slots & 1h advance booking", category: "LAUNDRY" },
    { label: "Digital Notice Board & special meal circulars", category: "ANNOUNCEMENTS" },
    { label: "Maintenance complaints with closure OTP", category: "COMPLAINTS" },
    { label: "Mess Food Reviews & transparent ratings", category: "MESS" },
    { label: "Clean UI & Fast responsiveness", category: "OVERALL" },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (rating < 1 || rating > 5) {
      setError("Rating must be between 1 and 5 stars");
      return;
    }

    const featureObj = featureOptions.find((f) => f.label === selectedFeature);
    const category = (featureObj?.category || "OVERALL") as any;
    const finalComment = reviewText.trim()
      ? `[Liked: ${selectedFeature}] - ${reviewText.trim()}`
      : `Really liked ${selectedFeature}. Good overall experience with SmartStay.`;

    setIsSubmitting(true);
    const res = await submitStudentFeedback({
      rating,
      category,
      reviewText: finalComment,
    });
    setIsSubmitting(false);

    if (res.error) {
      setError(res.error);
    } else {
      setSubmitted(true);
      const fbUser = (res.feedback as any)?.user;
      const newReviewItem: FeedbackItem = {
        id: (res.feedback as any)?.id || `fb-${Date.now()}`,
        rating,
        category,
        reviewText: finalComment,
        createdAt: new Date(),
        user: {
          name: fbUser?.name || "Verified Resident",
          email: fbUser?.email || "student@kiit.ac.in",
          studentProfile: {
            rollNo: fbUser?.studentProfile?.rollNo || "2428021",
            roomNo: fbUser?.studentProfile?.roomNo || "412",
            hostel: fbUser?.studentProfile?.hostel || { name: "King's Palace 7" },
          },
        },
      };
      setReviews((prev) => [newReviewItem, ...prev]);
      setTotalCount((prev) => prev + 1);
      setReviewText("");

      try {
        const stored = JSON.parse(localStorage.getItem("kiit_resident_reviews") || "[]");
        stored.unshift(newReviewItem);
        localStorage.setItem("kiit_resident_reviews", JSON.stringify(stored.slice(0, 50)));
      } catch {}
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filterStar !== "ALL" && Math.round(r.rating) !== filterStar) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = r.user?.name?.toLowerCase() || "";
      const email = r.user?.email?.toLowerCase() || "";
      const text = r.reviewText.toLowerCase();
      if (!name.includes(q) && !email.includes(q) && !text.includes(q)) return false;
    }
    return true;
  });

  const modalContent = isOpen && mounted ? (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-sm animate-in fade-in"
    >
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 relative max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Top Header with small cross X button */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
              <Sparkles className="size-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900 leading-none">
                SmartStay Resident Feedback
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                KIIT University Hostel Quality Assessment
              </p>
            </div>
          </div>

          {/* Small Cross on top right corner */}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="size-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors"
            title="Close popup"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tab switcher: Give Feedback vs View All Reviews */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl my-3 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("give")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "give"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            ⭐ Submit Feedback
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("view")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "view"
                ? "bg-white text-blue-700 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Users className="size-3.5" />
            <span>Read Other Reviews ({totalCount})</span>
          </button>
        </div>

        {/* Content based on Active Tab */}
        {activeTab === "give" ? (
          /* TAB 1: USERSNAP STYLE FEEDBACK FORM */
          submitted ? (
            <div className="py-8 text-center space-y-4 overflow-y-auto flex-1">
              <div className="size-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="size-8" />
              </div>
              <h4 className="font-extrabold text-lg text-slate-900">Thank You for Your Feedback!</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto leading-relaxed">
                Your rating and review have been recorded in the central database. Wardens review student feedback daily to improve hostel services.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setActiveTab("view");
                  }}
                  className="text-xs font-bold border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  See What Others Said →
                </Button>
                <Button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
                >
                  Done
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 pr-1 py-1">
              {error && (
                <div className="p-2.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
                  {error}
                </div>
              )}

              {/* Question 1: Stars */}
              <div className="space-y-2 text-center pt-1">
                <label className="text-sm sm:text-base font-bold text-slate-900 block">
                  How is your impression of SmartStay?
                </label>
                <div className="flex items-center justify-center gap-2 py-1">
                  {[1, 2, 3, 4, 5].map((star) => {
                    const active = star <= (hoverRating || rating);
                    return (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="p-1 transition-transform hover:scale-120 focus:outline-none"
                      >
                        <Star
                          className={`size-8 sm:size-9 transition-colors ${
                            active
                              ? "fill-blue-500 text-blue-500 drop-shadow-[0_2px_8px_rgba(59,130,246,0.4)]"
                              : "text-slate-200 hover:text-slate-300"
                          }`}
                        />
                      </button>
                    );
                  })}
                </div>
                <span className="text-xs font-semibold text-blue-600 font-mono">
                  {hoverRating || rating} of 5 Stars
                </span>
              </div>

              {/* Question 2: What did you like the most? (Radio options matching screenshot) */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="text-xs font-bold text-slate-800 block">
                  What did you like the most?
                </label>
                <div className="space-y-1.5">
                  {featureOptions.map((opt) => (
                    <label
                      key={opt.label}
                      className={`flex items-center gap-2.5 p-2 rounded-xl border text-xs cursor-pointer transition-all ${
                        selectedFeature === opt.label
                          ? "bg-blue-50/70 border-blue-400 text-blue-950 font-semibold shadow-2xs"
                          : "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100/80"
                      }`}
                    >
                      <input
                        type="radio"
                        name="feature"
                        checked={selectedFeature === opt.label}
                        onChange={() => setSelectedFeature(opt.label)}
                        className="size-3.5 text-blue-600 accent-blue-600"
                      />
                      <span>{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Question 3: Review Text */}
              <div className="space-y-1 pt-1">
                <label className="text-xs font-bold text-slate-800 block">
                  What would you like to explore next or suggest?
                </label>
                <textarea
                  rows={2}
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="We'd love to give you the full experience :)"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-colors"
                />
              </div>

              {/* Send feedback button matching Usersnap blue button */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold h-11 rounded-xl shadow-md shadow-blue-600/25 text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    "Sending feedback..."
                  ) : (
                    <>
                      <Send className="size-4" />
                      <span>Send feedback</span>
                    </>
                  )}
                </Button>
              </div>

              {/* Bottom text */}
              <div className="text-center pt-1 text-[10px] text-slate-400">
                <span>Want to see other student reviews? </span>
                <button
                  type="button"
                  onClick={() => setActiveTab("view")}
                  className="text-blue-600 font-bold hover:underline"
                >
                  View {totalCount} Reviews
                </button>
              </div>
            </form>
          )
        ) : (
          /* TAB 2: READ OTHER REVIEWS (79) */
          <div className="space-y-3 overflow-y-auto flex-1 pr-1 py-1">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by student roll number..."
                  className="w-full pl-8 pr-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600"
                />
              </div>
              <div className="flex items-center gap-1">
                {[5, 4, 3].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setFilterStar(filterStar === s ? "ALL" : s)}
                    className={`px-2 py-1 rounded-lg text-[11px] font-bold transition-colors ${
                      filterStar === s
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {s}★
                  </button>
                ))}
              </div>
            </div>

            {loadingReviews ? (
              <div className="py-12 text-center text-xs text-slate-400">
                Loading authentic reviews...
              </div>
            ) : filteredReviews.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                No reviews found matching "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-2.5 max-h-[50vh] overflow-y-auto pr-1">
                {filteredReviews.slice(0, 30).map((r, idx) => {
                  const roll = r.user?.studentProfile?.rollNo || r.user?.email?.split("@")[0] || `Student`;
                  const email = r.user?.email || `${roll}@kiit.ac.in`;
                  const formattedDate = new Date(r.createdAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  });

                  return (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-left"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-bold text-slate-900 font-mono">Roll: {roll}</p>
                          <p className="text-[10px] text-blue-700 font-mono">{email}</p>
                        </div>
                        <div className="flex items-center gap-0.5 text-blue-500">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              className={`size-3 ${
                                s <= r.rating ? "fill-blue-500 text-blue-500" : "text-slate-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 leading-snug italic">
                        "{r.reviewText}"
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
                        <span className="font-semibold text-slate-500 font-mono">Roll: {roll}</span>
                        <span>{formattedDate}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Link to Full Authority Audit page */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-500 font-medium">
                Showing {filteredReviews.length} reviews
              </span>
              <Link
                href="/dashboard/feedback"
                onClick={() => setIsOpen(false)}
                className="text-blue-700 hover:text-blue-900 font-bold inline-flex items-center gap-1 text-[11px]"
              >
                <span>Full Audit Page</span>
                <ExternalLink className="size-3" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* Feedback Box in the Left Panel (Usersnap Style Preview) */}
      <div className="p-3 rounded-2xl bg-gradient-to-b from-blue-50/80 to-slate-50 border border-blue-200/80 shadow-2xs space-y-2 text-left group">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700">
            Student Feedback
          </span>
          <span className="text-[9px] font-bold text-blue-900 bg-blue-100 px-1.5 py-0.5 rounded">
            {totalCount} Reviews
          </span>
        </div>

        <p className="text-xs font-bold text-slate-800 leading-tight">
          How is your experience with SmartStay?
        </p>

        {/* 5 Blue Stars in left panel */}
        <button
          type="button"
          onClick={() => {
            setRating(5);
            setIsOpen(true);
          }}
          className="w-full flex items-center justify-center gap-1 py-1 rounded-lg bg-white border border-blue-100 hover:border-blue-300 transition-all shadow-3xs"
          title="Click to rate SmartStay"
        >
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              className="size-4 text-blue-500 fill-blue-500 hover:scale-120 transition-transform"
            />
          ))}
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab("give");
              setIsOpen(true);
            }}
            className="flex-1 py-1.5 px-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold text-center transition-colors shadow-2xs"
          >
            Rate App
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("view");
              setIsOpen(true);
            }}
            className="py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[10px] font-semibold transition-colors"
            title="Read other reviews"
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Render Centered Popup via Portal */}
      {mounted && typeof document !== "undefined" && modalContent
        ? createPortal(modalContent, document.body)
        : null}
    </>
  );
}
