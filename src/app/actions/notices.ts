"use server";

import { prisma } from "@/lib/db";
import { syncUser } from "@/app/actions/user";
import { revalidatePath } from "next/cache";

export async function createNotice(formData: {
  title: string;
  content: string;
  category?: string;
  priority?: string;
  issuedBy?: string;
}) {
  try {
    const user = await syncUser();
    if (!user) return { error: "User session not found" };

    if (!formData.title || !formData.content) {
      return { error: "Title and announcement content are required" };
    }

    const notice = await prisma.announcement.create({
      data: {
        title: formData.title,
        description: formData.content,
        category: formData.category || "GENERAL",
        priority: formData.priority || "NORMAL",
        issuedBy: formData.issuedBy || "Hostel Superintendent, KP-7",
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/announcements");
    return {
      success: true,
      notice: {
        ...notice,
        content: notice.description,
      },
    };
  } catch (error) {
    console.error("Create notice error:", error);
    return { error: "Failed to post announcement" };
  }
}

export async function getNotices(category?: string) {
  try {
    let count = await prisma.announcement.count();
    if (count === 0) {
      await prisma.announcement.createMany({
        data: [
          {
            title: "Special Sunday Biryani Feast & Dessert Counter",
            description: "On account of Annual Fest celebrations, special Hyderabadi Dum Biryani (Chicken/Paneer) with Gulab Jamun & Raita will be served for lunch between 12:30 PM to 03:00 PM.",
            category: "SPECIAL_MESS_MENU",
            priority: "IMPORTANT",
            issuedBy: "Chief Mess Warden, KP-7",
          },
          {
            title: "Inter-Hostel Night Cricket Tournament 2026",
            description: "Registration is now open for the KP-7 Premier Cricket League. Matches will be conducted at Campus 12 sports ground starting this Friday at 7:00 PM. Contact Room 412 for team rosters.",
            category: "HOSTEL_EVENT",
            priority: "NORMAL",
            issuedBy: "Hostel Sports Committee",
          },
          {
            title: "Central Library Evening Pass Guidelines (Curfew 08:30 PM)",
            description: "All students utilizing the Library Pass must punch out with the security biometric sensor and return strictly before the 08:30 PM curfew. Late returns will require warden counseling.",
            category: "GENERAL",
            priority: "URGENT",
            issuedBy: "Prof. S. K. Mohapatra (Hostel Superintendent)",
          },
        ],
      });
    }

    const announcements = await prisma.announcement.findMany({
      where: category && category !== "ALL" ? { category } : undefined,
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return announcements.map((a) => ({
      ...a,
      content: a.description,
    }));
  } catch (error) {
    console.error("Get notices error:", error);
    return [];
  }
}

export async function deleteNotice(id: string) {
  try {
    await prisma.announcement.delete({ where: { id } });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/announcements");
    return { success: true };
  } catch (error) {
    console.error("Delete notice error:", error);
    return { error: "Failed to delete announcement" };
  }
}
