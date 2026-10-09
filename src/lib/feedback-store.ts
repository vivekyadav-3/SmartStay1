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
    const tmpPath = "/tmp/kiit-persistent-feedbacks.json";
    const bundledPath = path.join(process.cwd(), "prisma", "custom-feedbacks.json");
    try {
      if (!fs.existsSync(tmpPath) && fs.existsSync(bundledPath)) {
        fs.copyFileSync(bundledPath, tmpPath);
      }
    } catch {}
    return tmpPath;
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
    const items: PersistedFeedback[] = [];
    const seen = new Set<string>();

    // 1. Read from bundled static store
    const bundledPath = path.join(process.cwd(), "prisma", "custom-feedbacks.json");
    if (fs.existsSync(bundledPath)) {
      try {
        const raw = fs.readFileSync(bundledPath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item?.id && !seen.has(item.id)) {
              seen.add(item.id);
              items.push(item);
            }
          }
        }
      } catch {}
    }

    // 2. Read from active store (/tmp in serverless or custom-feedbacks.json)
    const filePath = getStoreFilePath();
    if (filePath !== bundledPath && fs.existsSync(filePath)) {
      try {
        const raw = fs.readFileSync(filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          for (const item of parsed) {
            if (item?.id && !seen.has(item.id)) {
              seen.add(item.id);
              items.unshift(item); // dynamic items go first
            }
          }
        }
      } catch {}
    }

    return items;
  } catch (err) {
    console.error("[FeedbackStore] Failed to read backup feedbacks:", err);
    return [];
  }
}
