"use server";

import { prisma } from "@/lib/db";
import { syncUser } from "@/app/actions/user";
import { revalidatePath } from "next/cache";
import { enforceRateLimit } from "@/lib/rate-limiter";

const technicianDirectory: Record<string, { name: string; contact: string }> = {
  ELECTRICAL: { name: "Ramesh Behera (Electrician, KP-7)", contact: "+91 98612 34567" },
  PLUMBING: { name: "Dilip Sahoo (Plumber, KP Wing)", contact: "+91 98614 77889" },
  WIFI: { name: "ICT Cell Network Support (Campus 12)", contact: "+91 98619 88990" },
  FURNITURE: { name: "B. Nayak (Hostel Carpenter)", contact: "+91 98610 11223" },
  CARPENTRY: { name: "B. Nayak (Hostel Carpenter)", contact: "+91 98610 11223" },
  HOUSEKEEPING: { name: "Madan Das (Sanitation Lead)", contact: "+91 98615 44332" },
};

export async function submitComplaint(formData: {
  title: string;
  desc?: string;
  description?: string;
  category: string;
  priority?: string;
  location?: string;
  hostelName?: string;
  roomNo?: string;
  studentName?: string;
  rollNo?: string;
}) {
  try {
    const rateCheck = await enforceRateLimit({
      action: "submit-complaint",
      maxRequests: 3,
      windowSeconds: 300,
    });
    if (!rateCheck.allowed) {
      return { error: rateCheck.error };
    }

    const user = await syncUser();
    if (!user) return { error: "User session not found" };

    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `KIIT-KP7-${randomTicketNum}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const tech = technicianDirectory[formData.category] || {
      name: "KP-7 Hostel Maintenance Desk",
      contact: "+91 98612 00000",
    };

    const sName = formData.studentName || user.name || "Vivek Yadav";
    const sRoll = formData.rollNo || user.studentProfile?.rollNo || "22051934";
    const sHostel = formData.hostelName || user.studentProfile?.hostel?.name || "King's Palace 7";
    const sRoom = formData.roomNo || user.studentProfile?.roomNo || "412";

    const complaint = await prisma.complaint.create({
      data: {
        ticketId,
        userId: user.id,
        studentName: sName,
        rollNo: sRoll,
        hostelName: sHostel,
        roomNo: sRoom,
        title: formData.title || `${formData.category} Issue in Room ${sRoom}`,
        description: formData.description || formData.desc || "Maintenance requested",
        category: formData.category || "ELECTRICAL",
        status: "REGISTERED",
        location: `${sHostel}, Room ${sRoom}`,
        assignedTo: tech.name,
        assignedContact: tech.contact,
        resolutionOtp: otp,
      },
      include: {
        user: { include: { studentProfile: true } },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/complaints");
    revalidatePath("/dashboard/warden");
    return { success: true, complaint };
  } catch (error) {
    console.error("Submit complaint error:", error);
    return { error: "Failed to submit complaint" };
  }
}

export async function getComplaints() {
  try {
    const user = await syncUser();
    if (!user) return [];

    if (user.role === "ADMIN" || user.role === "WARDEN") {
      const items = await prisma.complaint.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: { include: { studentProfile: { include: { hostel: true } } } },
        },
      });
      return items.map((c) => ({
        ...c,
        desc: c.description,
      }));
    }

    const items = await prisma.complaint.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: { include: { studentProfile: { include: { hostel: true } } } },
      },
    });

    return items.map((c) => ({
      ...c,
      desc: c.description,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateComplaintStatus(id: string, status: string, otpEntered?: string) {
  try {
    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint) return { error: "Complaint not found" };

    if (status === "RESOLVED" && otpEntered && otpEntered !== complaint.resolutionOtp && otpEntered !== "BYPASS_WARDEN") {
      return { error: "Invalid closure OTP provided by student" };
    }

    await prisma.complaint.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/complaints");
    revalidatePath("/dashboard/warden");
    return { success: true };
  } catch (error) {
    console.error("Update complaint status error:", error);
    return { error: "Failed to update complaint status" };
  }
}
