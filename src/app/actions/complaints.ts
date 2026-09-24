"use server";

import { prisma } from "@/lib/db";
import { syncUser } from "@/app/actions/user";
import { revalidatePath } from "next/cache";

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
}) {
  try {
    const user = await syncUser();
    if (!user) return { error: "User session not found" };

    const randomTicketNum = Math.floor(1000 + Math.random() * 9000);
    const ticketId = `KIIT-KP7-${randomTicketNum}`;
    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const tech = technicianDirectory[formData.category] || {
      name: "KP-7 Hostel Maintenance Desk",
      contact: "+91 98612 00000",
    };

    const complaint = await prisma.complaint.create({
      data: {
        ticketId,
        userId: user.id,
        title: formData.title,
        description: formData.description || formData.desc || "Maintenance requested",
        category: formData.category || "ELECTRICAL",
        status: "ASSIGNED",
        location: formData.location || `Room ${user.studentProfile?.roomNo || "412"}`,
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

    if (status === "RESOLVED" && otpEntered && otpEntered !== complaint.resolutionOtp) {
      return { error: "Invalid closure OTP provided by student" };
    }

    await prisma.complaint.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/complaints");
    return { success: true };
  } catch (error) {
    console.error("Update complaint status error:", error);
    return { error: "Failed to update complaint status" };
  }
}
