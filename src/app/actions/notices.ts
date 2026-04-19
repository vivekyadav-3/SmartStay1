"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function createNotice(formData: FormData) {
  try {
    const { userId } = await auth();
    const dbUser = await prisma.user.findUnique({ where: { id: userId || "" } });

    if (dbUser?.role !== "ADMIN") return { error: "Unauthorized" };

    const title = formData.get("title")?.toString();
    const content = formData.get("content")?.toString();
    const priority = formData.get("priority")?.toString() || "NORMAL";

    if (!title || !content) return { error: "Required fields missing" };

    await prisma.notice.create({
      data: { title, content, priority }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to post notice" };
  }
}

export async function getNotices() {
  return await prisma.notice.findMany({
    orderBy: { createdAt: "desc" },
    take: 10
  });
}

export async function deleteNotice(id: string) {
  const { userId } = await auth();
  const dbUser = await prisma.user.findUnique({ where: { id: userId || "" } });
  if (dbUser?.role !== "ADMIN") return { error: "Unauthorized" };

  await prisma.notice.delete({ where: { id } });
  revalidatePath("/dashboard");
  return { success: true };
}
