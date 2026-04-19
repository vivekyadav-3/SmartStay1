"use server";

import { prisma } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function bookLaundry(formData: FormData) {
  try {
    const { userId } = await auth();
    if (!userId) return { error: "Unauthorized" };

    const dateStr = formData.get("date")?.toString();
    const slot = formData.get("slot")?.toString();

    if (!dateStr || !slot) return { error: "Date and slot are required" };

    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!dbUser) return { error: "Profile not synced. Please refresh your dashboard." };

    const date = new Date(dateStr);

    const dateObj = new Date(date);
    
    // Advanced Check: Is the slot full? (Limit: 3 students per slot)
    const existingBookings = await prisma.laundryBooking.count({
      where: {
        date: dateObj,
        slot: slot
      }
    });

    if (existingBookings >= 3) {
      return { error: "This slot is already full. Please pick another time." };
    }

    await prisma.laundryBooking.create({
      data: {
        userId: userId,
        date: dateObj,
        slot: slot
      }
    });

    revalidatePath("/dashboard/laundry");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to book" };
  }
}

export async function getLaundryBookings() {
  const { userId } = await auth();
  if (!userId) return [];

  const dbUser = await prisma.user.findUnique({ where: { id: userId } });

  return await prisma.laundryBooking.findMany({
    where: dbUser?.role === "ADMIN" ? undefined : { userId },
    orderBy: { date: "desc" },
    include: dbUser?.role === "ADMIN" ? { user: { select: { name: true, roomNo: true } } } : undefined
  });
}
