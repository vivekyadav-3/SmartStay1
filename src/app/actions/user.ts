"use server";

import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function syncUser() {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    const email = clerkUser.emailAddresses[0]?.emailAddress;
    const name = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim();

    const ADMIN_EMAILS = process.env.ADMIN_EMAILS?.split(",") || [];
    const isAdmin = email ? ADMIN_EMAILS.includes(email) : false;

    const user = await prisma.user.upsert({
      where: { id: clerkUser.id },
      update: {
        name: name || undefined,
        email: email,
      },
      create: {
        id: clerkUser.id,
        name: name || "Student",
        email: email,
        role: isAdmin ? "ADMIN" : "STUDENT",
      },
    });

    // Forced upgrade for existing account
    if (isAdmin && user.role !== "ADMIN") {
        return await prisma.user.update({
            where: { id: clerkUser.id },
            data: { role: "ADMIN" }
        });
    }

    return user;
  } catch (error) {
    console.error("Clerk Sync Error Details:", error);
    return null;
  }
}

export async function updateRoom(roomNo: string) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return { error: "Unauthorized" };

    await prisma.user.update({
      where: { id: clerkUser.id },
      data: { roomNo }
    });

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update" };
  }
}

export async function getAdminStats() {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return null;

        const dbUser = await prisma.user.findUnique({ where: { id: clerkUser.id } });
        if (dbUser?.role !== "ADMIN") return null;

        const pendingComplaints = await prisma.complaint.count({ where: { status: "PENDING" } });
        const pendingVisitors = await prisma.visitorPass.count({ where: { status: "PENDING" } });
        
        const today = new Date();
        today.setHours(0,0,0,0);
        const laundryToday = await prisma.laundryBooking.count({
            where: { date: { gte: today } }
        });

        const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });

        // Category Breakdown
        const complaintsCount = await prisma.complaint.findMany({ select: { category: true } });
        const categoryMap: Record<string, number> = {};
        complaintsCount.forEach(c => {
            categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
        });

        const categoryData = Object.keys(categoryMap).map(name => ({
            name,
            value: categoryMap[name]
        }));

        // Finance Summary
        const totalCollected = await prisma.fee.aggregate({
            where: { status: "PAID" },
            _sum: { amount: true }
        });
        const totalPending = await prisma.fee.aggregate({
            where: { status: "PENDING" },
            _sum: { amount: true }
        });

        return {
            pendingComplaints,
            pendingVisitors,
            laundryToday,
            totalStudents,
            categoryData,
            revenue: {
                collected: totalCollected._sum.amount || 0,
                pending: totalPending._sum.amount || 0
            }
        };
    } catch (error) {
        console.error("Admin Stats Error:", error);
        return null;
    }
}
