import fs from "fs";
import path from "path";

export interface PersistedFeedback {
  id: string;
  userId?: string;
  rating: number;
  reviewText: string;
  category: string;
  createdAt: string;
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

function getStoreFilePath(): string {
  const isServerless = Boolean(
    process.env.VERCEL ||
    process.env.AWS_LAMBDA_FUNCTION_NAME ||
    (process.platform === "linux" && process.env.NODE_ENV === "production")
  );

  if (isServerless) {
    return "/tmp/kiit-persistent-feedbacks.json";
  }

  return path.join(process.cwd(), "prisma", "custom-feedbacks.json");
}

export function saveFeedbackToBackupStore(feedback: PersistedFeedback) {
  try {
    const filePath = getStoreFilePath();
    let list: PersistedFeedback[] = [];

    if (fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        list = JSON.parse(raw);
        if (!Array.isArray(list)) list = [];
      } catch {
        list = [];
      }
    }

    // Prepend new feedback and deduplicate by id
    const filtered = list.filter((f) => f.id !== feedback.id);
    filtered.unshift(feedback);

    fs.writeFileSync(filePath, JSON.stringify(filtered.slice(0, 500), null, 2), "utf-8");
  } catch (err) {
    console.error("[FeedbackStore] Failed to write backup feedback:", err);
  }
}

export function getFeedbacksFromBackupStore(): PersistedFeedback[] {
  try {
    const filePath = getStoreFilePath();
    if (!fs.existsSync(filePath)) return [];

    const raw = fs.readFileSync(filePath, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error("[FeedbackStore] Failed to read backup feedbacks:", err);
    return [];
  }
}
