"use server";

import { prisma } from "@/lib/db";
import { syncUser } from "@/app/actions/user";
import { revalidatePath } from "next/cache";

export async function bookLaundry(data: {
  dateStr?: string;
  slot?: string;
  itemCount: number;
  clothesDetails?: string;
  shirts?: number;
  trousers?: number;
  bedsheets?: number;
  towels?: number;
}) {
  try {
    const user = await syncUser();
    if (!user) return { error: "User session not found" };

    const randomToken = Math.floor(600 + Math.random() * 300);
    const token = `LND-KP7-${randomToken}`;
    const pickupOtp = Math.floor(1000 + Math.random() * 9000).toString();

    const booking = await prisma.laundryBooking.create({
      data: {
        token,
        userId: user.id,
        itemCount: data.itemCount || 6,
        shirts: data.shirts || 3,
        trousers: data.trousers || 2,
        bedsheets: data.bedsheets || 1,
        towels: data.towels || 0,
        pickupOtp,
        stage: "SLOT_BOOKED",
        bookingDate: new Date(),
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/laundry");
    return {
      success: true,
      booking: {
        ...booking,
        tokenNumber: booking.token,
        status: booking.stage,
      },
    };
  } catch (error) {
    console.error("Book laundry error:", error);
    return { error: "Failed to book laundry" };
  }
}

export async function getLaundryBookings() {
  try {
    const user = await syncUser();
    if (!user) return [];

    const bookings = await prisma.laundryBooking.findMany({
      where: user.role === "ADMIN" || user.role === "WARDEN" ? {} : { userId: user.id },
      orderBy: { bookingDate: "desc" },
      include: {
        user: {
          include: { studentProfile: true },
        },
      },
    });

    return bookings.map((b) => ({
      ...b,
      tokenNumber: b.token,
      status: b.stage,
      date: b.bookingDate,
      slot: "09:00 AM - 11:00 AM",
      clothesDetails: `${b.shirts} Shirts, ${b.trousers} Trousers, ${b.bedsheets} Bedsheets`,
    }));
  } catch (error) {
    console.error("Get laundry bookings error:", error);
    return [];
  }
}

export async function updateLaundryStatus(bookingId: string, stage: string) {
  try {
    await prisma.laundryBooking.update({
      where: { id: bookingId },
      data: { stage },
    });

    revalidatePath("/dashboard/laundry");
    return { success: true };
  } catch (error) {
    console.error("Update laundry status error:", error);
    return { error: "Failed to update status" };
  }
}
