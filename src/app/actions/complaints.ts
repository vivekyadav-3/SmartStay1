"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function submitComplaint(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const title = formData.get("title")?.toString();
    const desc = formData.get("desc")?.toString();

    if (!title || !desc) return { error: "Title and description are required" };

    // Ensure user exists in local DB before creating complaint
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) return { error: "Profile not synced. Please refresh your dashboard." };

    await prisma.complaint.create({
      data: {
        userId,
        title,
        desc,
      }
    });

    revalidatePath("/dashboard/complaints");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to submit complaint" };
  }
}

export async function getComplaints() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const dbUser = await prisma.user.findUnique({
      where: { id: userId }
    });

    // If Admin, get all
    if (dbUser?.role === "ADMIN") {
      return await prisma.complaint.findMany({
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true, roomNo: true } } }
      });
    }

    return await prisma.complaint.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateComplaintStatus(id: string, status: "PENDING" | "RESOLVED") {
  try {
    const { userId } = await auth();
    const dbUser = await prisma.user.findUnique({ where: { id: userId || "" } });

    if (dbUser?.role !== "ADMIN") return { error: "Unauthorized" };

    await prisma.complaint.update({
      where: { id },
      data: { status }
    });
    
    revalidatePath("/dashboard/complaints");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Update failed" };
  }
}
