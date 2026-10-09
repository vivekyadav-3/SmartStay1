"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { enforceRateLimit } from "@/lib/rate-limiter";

export async function dispatchEmergencyAlert(data: {
  studentName: string;
  rollNo: string;
  hostelName: string;
  roomNo: string;
  phone?: string;
  symptoms?: string;
}) {
  try {
    const rateCheck = await enforceRateLimit({
      action: "medical-emergency-alert",
      maxRequests: 5,
      windowSeconds: 60,
    });
    if (!rateCheck.allowed) {
      return { error: rateCheck.error };
    }

    if (!data.studentName || !data.rollNo || !data.hostelName || !data.roomNo) {
      return { error: "Missing essential student emergency details" };
    }

    const alert = await prisma.medicalEmergency.create({
      data: {
        studentName: data.studentName,
        rollNo: data.rollNo,
        hostelName: data.hostelName,
        roomNo: data.roomNo,
        phone: data.phone || "+91 98765 43210",
        symptoms: data.symptoms || "Immediate Medical Emergency Reported",
        status: "ALERT_SENT",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/warden");
    return { success: true, alert };
  } catch (error) {
    console.error("Emergency dispatch error:", error);
    return { error: "Failed to broadcast medical emergency alert." };
  }
}

export async function getMedicalAlerts() {
  try {
    const alerts = await prisma.medicalEmergency.findMany({
      orderBy: { createdAt: "desc" },
      take: 15,
    });
    return alerts;
  } catch (error) {
    console.error("Fetch medical alerts error:", error);
    return [];
  }
}

export async function updateMedicalAlertStatus(
  id: string,
  status: "ALERT_SENT" | "DISPATCHED" | "ATTENDED",
  wardenNotes?: string
) {
  try {
    const updated = await prisma.medicalEmergency.update({
      where: { id },
      data: {
        status,
        wardenNotes: wardenNotes || (status === "DISPATCHED" ? "Ambulance dispatched to hostel gate. Medical team alerted." : "Attended by hostel medical team."),
        dispatchedAt: status === "DISPATCHED" ? new Date() : undefined,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/warden");
    return { success: true, alert: updated };
  } catch (error) {
    console.error("Update medical alert error:", error);
    return { error: "Failed to update medical alert status." };
  }
}
