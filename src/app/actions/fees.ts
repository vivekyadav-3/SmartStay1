"use server";

import { prisma } from "@/lib/db";
import { syncUser } from "@/app/actions/user";
import { revalidatePath } from "next/cache";

export async function getUserFees() {
  try {
    const user = await syncUser();
    if (!user) return [];

    const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
    
    const existingFees = await prisma.fee.findFirst({
      where: { userId: user.id }
    });

    if (!existingFees && user.role === "STUDENT") {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 7);
      
      await prisma.fee.createMany({
        data: [
          { userId: user.id, month: "Semester Spring 2026", amount: 45000.0, type: "HOSTEL", dueDate, status: "PAID" },
          { userId: user.id, month: "March 2026 Mess Dues", amount: 5200.0, type: "MESS", dueDate, status: "PAID" }
        ]
      });
    }

    return await prisma.fee.findMany({
      where: user.role === "ADMIN" ? {} : { userId: user.id },
      include: user.role === "ADMIN" ? { user: { include: { studentProfile: true } } } : undefined,
      orderBy: { createdAt: "desc" }
    });
  } catch (error) {
    console.error("Get Fees Error:", error);
    return [];
  }
}

export async function updateFeeStatus(feeId: string, status: string) {
  try {
    await prisma.fee.update({
      where: { id: feeId },
      data: { status }
    });

    revalidatePath("/dashboard/fees");
    return { success: true };
  } catch (error) {
    return { error: "Failed to update fee status" };
  }
}
