import { syncUser } from "@/app/actions/user";
import { getFeedbacksList } from "@/app/actions/feedback";
import { FeedbackClient } from "./client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const user = await syncUser();
  if (!user) redirect("/login");

  // Fetch up to 200 reviews so all 100+ seeded reviews are immediately rendered
  const feedbackData = await getFeedbacksList(200);

  return (
    <FeedbackClient
      initialReviews={(feedbackData?.reviews as any) || []}
      currentUser={user as any}
    />
  );
}
