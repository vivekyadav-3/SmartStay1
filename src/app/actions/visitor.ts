"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function requestVisitorPass(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const visitorName = formData.get("visitorName")?.toString();
    const dateStr = formData.get("date")?.toString();

    if (!visitorName || !dateStr) return { error: "Required fields missing" };

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) return { error: "Profile not synced. Please refresh your dashboard." };

    await prisma.visitorPass.create({
      data: {
        userId,
        visitorName,
        date: new Date(dateStr),
        status: "PENDING"
      }
    });

    revalidatePath("/dashboard/visitor-pass");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to submit request" };
  }
}

export async function getVisitorPasses() {
  const { userId } = await auth();
  if (!userId) return [];

  const dbUser = await prisma.user.findUnique({ where: { id: userId } });

  return await prisma.visitorPass.findMany({
    where: dbUser?.role === "ADMIN" ? undefined : { userId },
    orderBy: { createdAt: "desc" },
    include: dbUser?.role === "ADMIN" ? { user: { select: { name: true, roomNo: true } } } : undefined
  });
}

export async function updateVisitorStatus(id: string, status: "APPROVED" | "REJECTED") {
  try {
    const { userId } = await auth();
    const dbUser = await prisma.user.findUnique({ where: { id: userId || "" } });

    if (dbUser?.role !== "ADMIN") return { error: "Unauthorized" };

    await prisma.visitorPass.update({
      where: { id },
      data: { status }
    });
    
    revalidatePath("/dashboard/visitor-pass");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Update failed" };
  }
}
