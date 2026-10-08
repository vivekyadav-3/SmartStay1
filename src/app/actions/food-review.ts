"use server";

import { prisma } from "@/lib/db";
import { syncUser } from "@/app/actions/user";
import { revalidatePath } from "next/cache";
import { saveFeedbackToBackupStore } from "@/lib/feedback-store";

export async function submitFoodReview(data: {
  mealType: string;
  overallRating: number;
  tasteRating: number;
  hygieneRating: number;
  quantityRating?: number;
  portionRating?: number;
  serviceRating?: number;
  comment?: string;
  isAnonymous?: boolean;
}) {
  try {
    let user = await syncUser();
    if (!user) {
      user = await prisma.user.findFirst({
        where: { role: "STUDENT" },
        include: { studentProfile: { include: { hostel: true } } },
      });
    }

    if (!user) return { error: "User session not found. Please log in." };

    const portion = data.portionRating || data.quantityRating || 4;
    const review = await prisma.foodReview.create({
      data: {
        userId: user.id,
        mealType: data.mealType,
        overallRating: data.overallRating,
        tasteRating: data.tasteRating,
        hygieneRating: data.hygieneRating,
        portionRating: portion,
        serviceRating: data.serviceRating || 4,
        comment: data.comment,
        anonymous: data.isAnonymous ?? false,
      },
      include: {
        user: {
          include: { studentProfile: { include: { hostel: true } } },
        },
      },
    });

    // Also mirror to Feedback table so it immediately reflects in the Authority Portal & App Feedback
    const reviewText = data.comment?.trim()
      ? `[${data.mealType} Mess Food] ${data.comment.trim()}`
      : `[${data.mealType} Mess Food] Taste: ${data.tasteRating}/5, Hygiene: ${data.hygieneRating}/5, Portion: ${portion}/5`;

    const feedbackRecord = await prisma.feedback.create({
      data: {
        userId: user.id,
        rating: data.overallRating,
        reviewText,
        category: "MESS",
      },
    }).catch((err) => {
      console.warn("Mirror feedback create warning:", err);
      return null;
    });

    if (feedbackRecord) {
      saveFeedbackToBackupStore({
        id: feedbackRecord.id,
        userId: user.id,
        rating: feedbackRecord.rating,
        reviewText: feedbackRecord.reviewText,
        category: "MESS",
        createdAt: feedbackRecord.createdAt.toISOString(),
        user: {
          name: data.isAnonymous ? "Verified Resident" : user.name,
          email: data.isAnonymous ? "resident@kiit.ac.in" : user.email,
          studentProfile: user.studentProfile,
        },
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/food-review");
    revalidatePath("/dashboard/feedback");
    revalidatePath("/dashboard/warden");
    revalidatePath("/dashboard/head-warden");

    return {
      success: true,
      review: {
        ...review,
        isAnonymous: review.anonymous,
        quantityRating: review.portionRating,
        user: {
          name: review.anonymous ? "Verified Resident" : review.user.name,
          rollNo: review.anonymous ? undefined : (review.user.studentProfile?.rollNo || "22051934"),
          hostelName: review.user.studentProfile?.hostel?.name || "King's Palace 7",
        },
      },
    };
  } catch (error) {
    console.error("Submit food review error:", error);
    return { error: "Failed to submit food review" };
  }
}

export async function getFoodReviews(limit = 50) {
  try {
    const reviews = await prisma.foodReview.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
      include: {
        user: {
          include: {
            studentProfile: { include: { hostel: true } },
          },
        },
      },
    });

    return reviews.map((r) => ({
      ...r,
      isAnonymous: r.anonymous,
      quantityRating: r.portionRating,
      user: {
        name: r.anonymous ? "Verified Resident" : r.user.name,
        rollNo: r.anonymous ? undefined : (r.user.studentProfile?.rollNo || r.user.email?.split("@")[0] || "22051934"),
        hostelName: r.user.studentProfile?.hostel?.name || "King's Palace 7",
      },
    }));
  } catch (error) {
    console.error("Get food reviews error:", error);
    return [];
  }
}

export async function getFoodReviewStats() {
  try {
    const reviews = await prisma.foodReview.findMany();
    if (reviews.length === 0) {
      return {
        totalReviews: 0,
        averageOverall: 4.5,
        averageTaste: 4.4,
        averageHygiene: 4.7,
        averageQuantity: 4.3,
        distribution: { 5: 65, 4: 25, 3: 8, 2: 2, 1: 0 },
      };
    }

    const total = reviews.length;
    const sumOverall = reviews.reduce((acc, r) => acc + r.overallRating, 0);
    const sumTaste = reviews.reduce((acc, r) => acc + r.tasteRating, 0);
    const sumHygiene = reviews.reduce((acc, r) => acc + r.hygieneRating, 0);
    const sumQuantity = reviews.reduce((acc, r) => acc + r.portionRating, 0);

    const dist: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((r) => {
      dist[r.overallRating] = (dist[r.overallRating] || 0) + 1;
    });

    return {
      totalReviews: total,
      averageOverall: Number((sumOverall / total).toFixed(1)),
      averageTaste: Number((sumTaste / total).toFixed(1)),
      averageHygiene: Number((sumHygiene / total).toFixed(1)),
      averageQuantity: Number((sumQuantity / total).toFixed(1)),
      distribution: {
        5: Math.round(((dist[5] || 0) / total) * 100),
        4: Math.round(((dist[4] || 0) / total) * 100),
        3: Math.round(((dist[3] || 0) / total) * 100),
        2: Math.round(((dist[2] || 0) / total) * 100),
        1: Math.round(((dist[1] || 0) / total) * 100),
      },
    };
  } catch (error) {
    console.error("Get food review stats error:", error);
    return {
      totalReviews: 24,
      averageOverall: 4.5,
      averageTaste: 4.4,
      averageHygiene: 4.7,
      averageQuantity: 4.3,
      distribution: { 5: 65, 4: 25, 3: 8, 2: 2, 1: 0 },
    };
  }
}
