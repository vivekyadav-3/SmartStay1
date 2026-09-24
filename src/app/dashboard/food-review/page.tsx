"use client";

import { useState } from "react";
import { 
  Star, 
  Sparkles, 
  UtensilsCrossed, 
  ThumbsUp, 
  MessageSquare, 
  CheckCircle2, 
  TrendingUp,
  ShieldCheck,
  Send,
  UserCheck,
  Calendar
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { submitFoodReview } from "@/app/actions/food-review";

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

const sampleReviews: Review[] = [
  {
    id: "rev_1",
    mealType: "LUNCH",
    overallRating: 5,
    tasteRating: 5,
    hygieneRating: 5,
    quantityRating: 4,
    comment: "The authentic Odia Dalma and Butter Chicken / Paneer Lababdar were incredible today! Fresh phulkas served piping hot at the counter.",
    isAnonymous: false,
    createdAt: new Date().toISOString(),
    user: {
      name: "Vivek Yadav",
      rollNo: "22051934",
      hostelName: "King's Palace 7",
    },
  },
  {
    id: "rev_2",
    mealType: "BREAKFAST",
    overallRating: 4,
    tasteRating: 4,
    hygieneRating: 5,
    quantityRating: 5,
    comment: "Crispy Medu Vada and hot Madras Sambar were great. Coconut chutney was fresh and cold.",
    isAnonymous: false,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    user: {
      name: "Ayush Sharma",
      rollNo: "22051410",
      hostelName: "King's Palace 6",
    },
  },
  {
    id: "rev_3",
    mealType: "DINNER",
    overallRating: 5,
    tasteRating: 5,
    hygieneRating: 4,
    quantityRating: 5,
    comment: "Warm Gulab Jamuns after a heavy lab day made my day! Good hygiene maintained by kitchen staff wearing caps and gloves.",
    isAnonymous: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    user: {
      name: "Student (Anonymous)",
      rollNo: "KP-7 Resident",
      hostelName: "King's Palace 7",
    },
  },
];

export default function FoodReviewPage() {
  const [reviews, setReviews] = useState<Review[]>(sampleReviews);
  const [mealType, setMealType] = useState("LUNCH");
  const [overallRating, setOverallRating] = useState(5);
  const [tasteRating, setTasteRating] = useState(4);
  const [hygieneRating, setHygieneRating] = useState(5);
  const [quantityRating, setQuantityRating] = useState(4);
  const [comment, setComment] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const res = await submitFoodReview({
      mealType,
      overallRating,
      tasteRating,
      hygieneRating,
      quantityRating,
      comment,
      isAnonymous,
    });

    if (res.success && res.review) {
      const newReview: Review = {
        id: res.review.id,
        mealType: res.review.mealType,
        overallRating: res.review.overallRating,
        tasteRating: res.review.tasteRating || 4,
        hygieneRating: res.review.hygieneRating || 5,
        quantityRating: res.review.quantityRating || 4,
        comment: res.review.comment,
        isAnonymous: res.review.isAnonymous,
        createdAt: res.review.createdAt,
        user: {
          name: isAnonymous ? "Student (Anonymous)" : "Vivek Yadav",
          rollNo: isAnonymous ? "KP-7 Resident" : "22051934",
          hostelName: "King's Palace 7",
        },
      };
      setReviews([newReview, ...reviews]);
      setComment("");
      setSubmitSuccess(true);
      setTimeout(() => setSubmitSuccess(false), 3000);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-xs">
              Resident Voice
            </Badge>
            <Badge variant="outline" className="text-xs">
              Reviewed by Mess Committee
            </Badge>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mt-1 text-foreground">
            Hostel Food Review & Rating
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Rate today's meals on taste, hygiene, and portion size to improve the dining experience.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-card/60 border border-emerald-500/30 px-3 py-1.5 rounded-xl">
          <Star className="size-4 text-yellow-400 fill-yellow-400" />
          <span className="text-sm font-bold text-foreground">4.4 / 5.0</span>
          <span className="text-xs text-muted-foreground">(340 KIIT Residents)</span>
        </div>
      </div>

      {/* Mess Satisfaction Index Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Overall Score */}
        <Card className="bg-gradient-to-br from-emerald-950/40 via-card/70 to-card/90 border border-emerald-500/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Hostel Community Average
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-foreground font-mono">4.4</span>
              <span className="text-xs text-muted-foreground">/ 5.0 (340 Ratings)</span>
            </div>
            <div className="flex items-center gap-1 mt-2 text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`size-3.5 ${i < 4 ? "fill-yellow-400" : "fill-yellow-400/30"}`} />
              ))}
              <span className="text-[11px] text-muted-foreground ml-1">Overall Satisfaction</span>
            </div>
          </CardContent>
        </Card>

        {/* Taste */}
        <Card className="bg-card/70 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Taste & Flavor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground font-mono">4.3</span>
              <span className="text-xs text-emerald-400 font-semibold">+8% this week</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Special Odia Dalma & Sunday Biryani praised.
            </p>
          </CardContent>
        </Card>

        {/* Hygiene */}
        <Card className="bg-card/70 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Hygiene & Cleanliness
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground font-mono">4.6</span>
              <span className="text-xs text-emerald-400 font-semibold">Excellent</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Clean stainless steel trays, sanitized cutlery.
            </p>
          </CardContent>
        </Card>

        {/* Quantity */}
        <Card className="bg-card/70 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Portion & Service
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-foreground font-mono">4.2</span>
              <span className="text-xs text-emerald-400 font-semibold">Unlimited</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-2">
              Unlimited rice, rotis & dal counters.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Split: Review Form (Left) + Recent Feedback Feed (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Review Submission Form */}
        <div className="lg:col-span-5">
          <Card className="bg-card/80 border-white/10 backdrop-blur-xl">
            <CardHeader className="pb-3 border-b border-white/5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-foreground flex items-center gap-2">
                  <UtensilsCrossed className="size-4 text-emerald-400" />
                  <span>Your Personal Meal Rating</span>
                </CardTitle>
                <Badge variant="outline" className="text-[10px] font-mono">
                  Roll: 22051934
                </Badge>
              </div>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Rating as: <strong>Vivek Yadav</strong> • King's Palace 7 (KP-7)
              </p>
            </CardHeader>
            <CardContent className="pt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Select Meal Slot */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Select Meal</label>
                  <select
                    value={mealType}
                    onChange={(e) => setMealType(e.target.value)}
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500"
                  >
                    <option value="BREAKFAST">Breakfast (Idli, Parathas, Tea)</option>
                    <option value="LUNCH">Lunch (Pulao, Dalma, Paneer / Chicken)</option>
                    <option value="SNACKS">Evening Snacks (Pav Bhaji, Samosa, Chai)</option>
                    <option value="DINNER">Dinner (Naan, Dal Makhani, Kofta, Sweet)</option>
                  </select>
                </div>

                {/* Overall 5-Star Interactive Rating */}
                <div className="space-y-1.5 p-3 rounded-xl bg-black/40 border border-white/5">
                  <label className="text-xs font-semibold text-foreground block">
                    Overall Meal Experience ({overallRating} / 5 Stars)
                  </label>
                  <div className="flex items-center gap-2">
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
                              : "text-muted-foreground/40 hover:text-yellow-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Metric Ratings (Taste, Hygiene, Portion) */}
                <div className="space-y-2.5 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Taste & Seasoning:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setTasteRating(s)}
                          className={`size-5 rounded flex items-center justify-center text-[10px] font-bold ${
                            s <= tasteRating ? "bg-emerald-600 text-white" : "bg-white/5 text-muted-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Cleanliness & Hygiene:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setHygieneRating(s)}
                          className={`size-5 rounded flex items-center justify-center text-[10px] font-bold ${
                            s <= hygieneRating ? "bg-emerald-600 text-white" : "bg-white/5 text-muted-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Portion & Availability:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setQuantityRating(s)}
                          className={`size-5 rounded flex items-center justify-center text-[10px] font-bold ${
                            s <= quantityRating ? "bg-emerald-600 text-white" : "bg-white/5 text-muted-foreground"
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Comments / Suggestion */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">
                    Comments or Suggestions for Kitchen Chef
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    placeholder="e.g. Rice was well-cooked, dal needed a little less salt..."
                    className="w-full bg-black/60 border border-white/15 rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>

                {/* Anonymous Toggle */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="anon"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded border-white/20 bg-black/40 text-emerald-600 focus:ring-emerald-500"
                  />
                  <label htmlFor="anon" className="text-xs text-muted-foreground cursor-pointer">
                    Submit review anonymously (hide my Roll Number)
                  </label>
                </div>

                {submitSuccess && (
                  <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                    <CheckCircle2 className="size-4 shrink-0" />
                    <span>Thank you! Your feedback was logged for the Mess Committee.</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white gap-2 text-xs h-10 shadow-lg shadow-emerald-600/20"
                >
                  <Send className="size-3.5" />
                  <span>{isSubmitting ? "Submitting..." : "Submit Review"}</span>
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Right: Recent Student Reviews Feed */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MessageSquare className="size-4 text-emerald-400" />
              <span>Recent Resident Reviews ({reviews.length})</span>
            </span>
            <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
              Verified Residents Only
            </Badge>
          </div>

          <div className="space-y-3">
            {reviews.map((rev) => (
              <Card key={rev.id} className="bg-card/70 border-white/10 backdrop-blur-md">
                <CardContent className="pt-4 pb-4 space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-foreground">
                          {rev.isAnonymous ? "Anonymous Resident" : rev.user?.name || "Vivek Yadav"}
                        </span>
                        <Badge variant="outline" className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
                          {rev.mealType}
                        </Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-mono">
                        {rev.isAnonymous ? "Resident (Identity Hidden)" : `Roll: ${rev.user?.rollNo || "22051934"} • ${rev.user?.hostelName || "KP-7"}`}
                      </p>
                    </div>

                    {/* Star Rating Display */}
                    <div className="flex items-center gap-1 text-yellow-400 shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`size-3.5 ${i < rev.overallRating ? "fill-yellow-400" : "fill-yellow-400/20"}`}
                        />
                      ))}
                    </div>
                  </div>

                  {rev.comment && (
                    <p className="text-xs text-foreground/90 bg-black/20 p-3 rounded-lg border border-white/5 leading-relaxed">
                      "{rev.comment}"
                    </p>
                  )}

                  <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1">
                    <div className="flex items-center gap-3">
                      <span>Taste: <strong className="text-foreground">{rev.tasteRating}/5</strong></span>
                      <span>Hygiene: <strong className="text-foreground">{rev.hygieneRating}/5</strong></span>
                      <span>Portion: <strong className="text-foreground">{rev.quantityRating}/5</strong></span>
                    </div>
                    <span className="text-[10px] font-mono">
                      {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
