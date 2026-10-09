"use client";

import { useState, useEffect } from "react";
import { 
  Star, 
  Sparkles, 
  UtensilsCrossed, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  Send,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { submitFoodReview, getFoodReviews, getFoodReviewStats } from "@/app/actions/food-review";
import { getCurrentUser } from "@/app/actions/user";

interface Review {
  id: string;
  mealType: string;
  overallRating: number;
  tasteRating: number;
  hygieneRating: number;
  quantityRating: number;
  comment?: string | null;
  isAnonymous: boolean;
  createdAt: string | Date;
  user?: {
    name?: string | null;
    rollNo?: string | null;
    hostelName?: string | null;
  };
}

export default function FoodReviewPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [stats, setStats] = useState<any>({
    totalReviews: 0,
    averageOverall: 4.5,
    averageTaste: 4.4,
    averageHygiene: 4.7,
    averageQuantity: 4.3,
  });

  const [mealType, setMealType] = useState("LUNCH");
  const [overallRating, setOverallRating] = useState(5);
  const [tasteRating, setTasteRating] = useState(4);
  const [hygieneRating, setHygieneRating] = useState(5);
  const [quantityRating, setQuantityRating] = useState(4);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    // 1. Fetch current user
    getCurrentUser().then((u) => {
      if (u) setCurrentUser(u);
    });

    // 2. Load food reviews from DB & LocalStorage
    getFoodReviews(50).then((data) => {
      let list = (data || []) as any[];
      try {
        const stored = JSON.parse(localStorage.getItem("kiit_food_reviews") || "[]");
        if (Array.isArray(stored) && stored.length > 0) {
          const ids = new Set(list.map((r: any) => r.id));
          const toAdd = stored.filter((s: any) => !ids.has(s.id));
          list = [...toAdd, ...list];
        }
      } catch {}
      if (list.length > 0) {
        setReviews(list as any);
      }
    });

    // 3. Load stats
    getFoodReviewStats().then((st) => {
      if (st) setStats(st);
    });
  }, []);

  const studentName = currentUser?.name || "KIIT Resident";
  const rollNo = currentUser?.studentProfile?.rollNo || currentUser?.email?.split("@")[0] || "2428021";
  const hostelName = currentUser?.studentProfile?.hostel?.name || "King's Palace 7";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);

    const res = await submitFoodReview({
      mealType,
      overallRating,
      tasteRating,
      hygieneRating,
      portionRating: quantityRating,
      serviceRating: 4,
      comment,
      isAnonymous,
    });

    if (res.success && res.review) {
      const newRev: Review = {
        id: res.review.id,
        mealType: res.review.mealType,
        overallRating: res.review.overallRating,
        tasteRating: res.review.tasteRating,
        hygieneRating: res.review.hygieneRating,
        quantityRating: res.review.portionRating,
        comment: res.review.comment,
        isAnonymous: res.review.anonymous,
        createdAt: new Date().toISOString(),
        user: {
          name: isAnonymous ? "Anonymous Resident" : studentName,
          rollNo: isAnonymous ? undefined : rollNo,
          hostelName,
        },
      };

      setReviews((prev) => [newRev, ...prev]);
      setSubmitSuccess(true);
      setComment("");
      setTimeout(() => setSubmitSuccess(false), 5000);

      try {
        const stored = JSON.parse(localStorage.getItem("kiit_food_reviews") || "[]");
        stored.unshift(newRev);
        localStorage.setItem("kiit_food_reviews", JSON.stringify(stored.slice(0, 50)));
      } catch {}
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header Banner: Clean Blue & White */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <UtensilsCrossed className="size-5" />
            </div>
            <h2 className="text-xl font-extrabold text-blue-950">Hostel Mess Food Review</h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Rate today's meals on taste, hygiene, and portion size. Ratings are compiled live for the Hostel Mess Committee & Chief Warden.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl shrink-0">
          <Star className="size-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-black text-blue-950">{stats.averageOverall || 4.5} / 5.0</span>
          <span className="text-xs text-slate-500 font-medium">({hostelName} Residents)</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Overall Rating</span>
          <span className="text-xl font-extrabold text-blue-950 flex items-center gap-1 mt-1">
            ⭐ {stats.averageOverall || 4.5} <span className="text-xs text-slate-400 font-normal">/ 5.0</span>
          </span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Taste & Flavors</span>
          <span className="text-xl font-extrabold text-blue-900 mt-1 block">{stats.averageTaste || 4.4} / 5.0</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Hygiene & Trays</span>
          <span className="text-xl font-extrabold text-blue-900 mt-1 block">{stats.averageHygiene || 4.7} / 5.0</span>
        </div>
        <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Portion Quantity</span>
          <span className="text-xl font-extrabold text-blue-900 mt-1 block">Unlimited</span>
        </div>
      </div>

      {/* Split: Form (Left) & Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Review Submission Form */}
        <div className="lg:col-span-5">
          <Card className="bg-white border-slate-200 shadow-sm">
            <CardHeader className="pb-3 border-b border-slate-100">
              <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <UtensilsCrossed className="size-4 text-blue-600" />
                <span>Submit Today's Meal Review</span>
              </CardTitle>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Posting as: <strong className="text-slate-800">{studentName}</strong> (Roll: {rollNo})
              </p>
            </CardHeader>

            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {/* Select Meal Slot */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">Select Meal</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none"
                  >
                    <option value="BREAKFAST">Breakfast (Idli, Parathas, Tea)</option>
                    <option value="LUNCH">Lunch (Pulao, Dalma, Paneer / Chicken)</option>
                    <option value="SNACKS">Evening Snacks (Pav Bhaji, Samosa, Chai)</option>
                    <option value="DINNER">Dinner (Naan, Dal Makhani, Paneer, Sweet)</option>
                  </select>
                </div>

                {/* Overall Star Rating */}
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 space-y-1.5">
                  <label className="text-[11px] font-bold text-blue-950 block">
                    Overall Meal Experience ({overallRating} / 5 Stars)
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setOverallRating(star)}
                        className="p-1 hover:scale-125 transition-transform"
                      >
                        <Star
                          className={`size-6 ${
                            star <= overallRating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-slate-300 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Ratings */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Taste & Flavor:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setTasteRating(s)}
                          className={`size-5 rounded flex items-center justify-center text-[10px] font-bold ${
                            s <= tasteRating ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Cleanliness & Hygiene:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setHygieneRating(s)}
                          className={`size-5 rounded flex items-center justify-center text-[10px] font-bold ${
                            s <= hygieneRating ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Portion & Availability:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setQuantityRating(s)}
                          className={`size-5 rounded flex items-center justify-center text-[10px] font-bold ${
                            s <= quantityRating ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comment */}
                <div>
                  <label className="text-[11px] font-semibold text-slate-600 block mb-1">
                    Comments or Suggestions for Mess Chef
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="e.g. Rice was well-cooked, paneer was soft, dal was tasty..."
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:ring-2 focus:ring-blue-600 outline-none resize-none"
                  />
                </div>

                {/* Anonymous Checkbox */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="anon"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="anon" className="text-slate-600 cursor-pointer">
                    Submit review anonymously (hide Roll Number)
                  </label>
                </div>

                {submitSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600" />
                    <span>Your food review has been recorded permanently and sent to Chief Warden!</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs h-9 shadow-sm"
                >
                  <Send className="size-3.5 mr-1.5" />
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Recent Reviews Feed */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="size-4 text-blue-600" />
              <span>Resident Reviews Feed ({reviews.length})</span>
            </span>
            <span className="text-[11px] text-slate-500 font-semibold">
              Verified {hostelName} Residents
            </span>
          </div>

          {reviews.length === 0 ? (
            <div className="p-8 bg-white border border-slate-200 rounded-xl text-center space-y-2">
              <UtensilsCrossed className="size-8 text-slate-300 mx-auto" />
              <p className="text-xs font-bold text-slate-600">No meal reviews yet today</p>
              <p className="text-[11px] text-slate-400">Be the first resident to rate today's lunch or breakfast!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviews.map((rev) => (
                <Card key={rev.id} className="bg-white border-slate-200 shadow-sm">
                  <CardContent className="pt-4 pb-4 space-y-2.5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            {rev.isAnonymous ? "Anonymous Resident" : rev.user?.name || "Verified Resident"}
                          </span>
                          <Badge className="text-[9px] bg-blue-100 text-blue-800 border-blue-200 font-semibold">
                            {rev.mealType}
                          </Badge>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {rev.isAnonymous ? "Verified Resident" : `Roll: ${rev.user?.rollNo || "2428021"} • ${rev.user?.hostelName || "KP-7"}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-0.5 text-yellow-400 shrink-0">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`size-3.5 ${i < rev.overallRating ? "fill-yellow-400" : "fill-slate-200"}`}
                          />
                        ))}
                      </div>
                    </div>

                    {rev.comment && (
                      <p className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-200 leading-relaxed italic">
                        "{rev.comment}"
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                      <div className="flex items-center gap-3">
                        <span>Taste: <strong className="text-slate-800">{rev.tasteRating}/5</strong></span>
                        <span>Hygiene: <strong className="text-slate-800">{rev.hygieneRating}/5</strong></span>
                        <span>Portion: <strong className="text-slate-800">{rev.quantityRating}/5</strong></span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric"
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
