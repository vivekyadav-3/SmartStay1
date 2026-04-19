"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getUserFees() {
  try {
    const { userId } = await auth();
    if (!userId) return [];

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) return [];

    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const existingFees = await prisma.fee.findFirst({
      where: { userId: dbUser.id, month: currentMonth }
    });

    if (!existingFees && dbUser.role === "STUDENT") {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      
      await prisma.fee.createMany({
          data: [
              { userId: dbUser.id, month: currentMonth, amount: 4500.0, type: "HOSTEL", dueDate, status: "PENDING" },
              { userId: dbUser.id, month: currentMonth, amount: 2800.0, type: "MESS", dueDate, status: "PENDING" }
          ]
      });
    }

    return await prisma.fee.findMany({
      where: dbUser.role === "ADMIN" ? {} : { userId: dbUser.id },
      include: dbUser.role === "ADMIN" ? { user: { select: { name: true, roomNo: true } } } : undefined,
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Get Fees Error:", error);
    return [];
  }
}

export async function updateFeeStatus(feeId: string, status: "PAID" | "PENDING" | "OVERDUE") {
  try {
    const { userId } = await auth();
    const dbUser = await prisma.user.findUnique({ where: { id: userId || "" } });
    
    if (dbUser?.role !== "ADMIN") return { error: "Unauthorized" };

    await prisma.fee.update({
      where: { id: feeId },
      data: { status }
    });

    revalidatePath("/dashboard/fees");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update" };
  }
}
