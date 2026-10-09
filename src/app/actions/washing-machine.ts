"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { enforceRateLimit } from "@/lib/rate-limiter";

export async function getWashingMachines() {
  try {
    // Seed default machines if none exist
    let count = await prisma.washingMachine.count();
    if (count === 0) {
      await prisma.washingMachine.createMany({
        data: [
          { machineNumber: "WM-01 (Ground Floor - Machine 1)", floor: "Ground Floor Laundry Wing", status: "VACANT" },
          { machineNumber: "WM-02 (Ground Floor - Machine 2)", floor: "Ground Floor Laundry Wing", status: "OCCUPIED", currentStudent: "Kunal Verma", currentRollNo: "22051840" },
          { machineNumber: "WM-03 (Ground Floor - Machine 3)", floor: "Ground Floor Laundry Wing", status: "VACANT" },
          { machineNumber: "WM-04 (1st Floor - Machine 4)", floor: "1st Floor East Wing", status: "VACANT" },
          { machineNumber: "WM-05 (1st Floor - Machine 5)", floor: "1st Floor East Wing", status: "VACANT" },
          { machineNumber: "WM-06 (2nd Floor - Machine 6)", floor: "2nd Floor West Wing", status: "MAINTENANCE" },
        ],
      });
    }

    const machines = await prisma.washingMachine.findMany({
      orderBy: { machineNumber: "asc" },
      include: {
        bookings: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    });

    return machines;
  } catch (error) {
    console.error("Error fetching washing machines:", error);
    return [];
  }
}

export async function updateMachineStatus(id: string, status: "VACANT" | "OCCUPIED" | "MAINTENANCE", currentStudent?: string, currentRollNo?: string) {
  try {
    const updated = await prisma.washingMachine.update({
      where: { id },
      data: {
        status,
        currentStudent: status === "OCCUPIED" ? (currentStudent || "Student In Use") : null,
        currentRollNo: status === "OCCUPIED" ? (currentRollNo || "2205xxxx") : null,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/laundry");
    revalidatePath("/dashboard/warden");
    return { success: true, machine: updated };
  } catch (error) {
    console.error("Error updating machine status:", error);
    return { error: "Failed to update machine status" };
  }
}

export async function addWashingMachine(machineNumber: string, floor: string) {
  try {
    if (!machineNumber.trim()) return { error: "Machine number is required" };
    const machine = await prisma.washingMachine.create({
      data: {
        machineNumber: machineNumber.trim(),
        floor: floor.trim() || "Ground Floor Laundry Wing",
        status: "VACANT",
      },
    });

    revalidatePath("/dashboard/laundry");
    revalidatePath("/dashboard/warden");
    return { success: true, machine };
  } catch (error) {
    console.error("Error adding washing machine:", error);
    return { error: "Failed to add machine. Ensure machine number is unique." };
  }
}

export async function bookMachineSlot(data: {
  machineId: string;
  studentName: string;
  rollNo: string;
  hostelName?: string;
  roomNo?: string;
  slotTime: string;
}) {
  try {
    const rateCheck = await enforceRateLimit({
      action: "book-washing-machine",
      maxRequests: 3,
      windowSeconds: 300,
    });
    if (!rateCheck.allowed) {
      return { error: rateCheck.error };
    }

    if (!data.machineId || !data.studentName || !data.rollNo || !data.slotTime) {
      return { error: "Please provide all required booking information." };
    }

    const pin = Math.floor(1000 + Math.random() * 9000).toString();

    const booking = await prisma.machineBooking.create({
      data: {
        machineId: data.machineId,
        studentName: data.studentName,
        rollNo: data.rollNo,
        hostelName: data.hostelName || "King's Palace 7",
        roomNo: data.roomNo || "412",
        slotTime: data.slotTime,
        status: "CONFIRMED",
        accessPin: pin,
      },
      include: {
        machine: true,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/laundry");
    revalidatePath("/dashboard/warden");
    return { success: true, booking };
  } catch (error) {
    console.error("Error booking washing machine:", error);
    return { error: "Failed to book machine slot" };
  }
}

export async function getStudentBookings(rollNo?: string) {
  try {
    const bookings = await prisma.machineBooking.findMany({
      where: rollNo ? { rollNo } : undefined,
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        machine: true,
      },
    });
    return bookings;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}
