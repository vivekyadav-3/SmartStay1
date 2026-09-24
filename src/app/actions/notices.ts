"use server";

import { prisma } from "@/lib/db";
import { syncUser } from "@/app/actions/user";
import { revalidatePath } from "next/cache";

export async function createNotice(formData: {
  title: string;
  content: string;
  category?: string;
  priority?: string;
  issuedBy?: string;
}) {
  try {
    const user = await syncUser();
    if (!user) return { error: "User session not found" };

    if (!formData.title || !formData.content) {
      return { error: "Title and announcement content are required" };
    }

    const notice = await prisma.announcement.create({
      data: {
        title: formData.title,
        description: formData.content,
        category: formData.category || "GENERAL",
        priority: formData.priority || "NORMAL",
        issuedBy: formData.issuedBy || "Hostel Superintendent, KP-7",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/announcements");
    return {
      success: true,
      notice: {
        ...notice,
        content: notice.description,
      },
    };
  } catch (error) {
    console.error("Create notice error:", error);
    return { error: "Failed to post announcement" };
  }
}

export async function getNotices(category?: string) {
  try {
    const announcements = await prisma.announcement.findMany({
      where: category && category !== "ALL" ? { category } : undefined,
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return announcements.map((a) => ({
      ...a,
      content: a.description,
    }));
  } catch (error) {
    console.error("Get notices error:", error);
    return [];
  }
}

export async function deleteNotice(id: string) {
  try {
    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/announcements");
    return { success: true };
  } catch (error) {
    console.error("Delete notice error:", error);
    return { error: "Failed to delete announcement" };
  }
}
