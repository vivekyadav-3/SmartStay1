"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getDemoRole(): Promise<"STUDENT" | "WARDEN" | "SECURITY"> {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get("kiit_demo_role")?.value;
    if (role === "WARDEN" || role === "SECURITY" || role === "STUDENT") {
      return role;
    }
    return "STUDENT";
  } catch {
    return "STUDENT";
  }
}

export async function setDemoRole(role: "STUDENT" | "WARDEN" | "SECURITY") {
  try {
    const cookieStore = await cookies();
    cookieStore.set("kiit_demo_role", role, { path: "/", maxAge: 60 * 60 * 24 });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/warden");
    revalidatePath("/dashboard/security-gate");
    revalidatePath("/dashboard/timings");
    return { success: true, role };
  } catch (error) {
    console.error("Set demo role error:", error);
    return { error: "Failed to switch role" };
  }
}

export async function syncUser() {
  try {
    const activeRole = await getDemoRole();

    // 1. If Warden role selected in demo switcher
    if (activeRole === "WARDEN") {
      let warden = await prisma.user.findFirst({
        where: { role: "WARDEN" },
        include: {
          studentProfile: { include: { hostel: true } },
        },
      });
      if (!warden) {
        warden = await prisma.user.create({
          data: {
            id: "warden_kp7",
            name: "Prof. S. K. Mohapatra",
            email: "warden.kp7@kiit.ac.in",
            role: "WARDEN",
            biometricStatus: "IN_HOSTEL",
          },
          include: {
            studentProfile: { include: { hostel: true } },
          },
        });
      }
      return warden;
    }

    // 2. If Security Guard role selected in demo switcher
    if (activeRole === "SECURITY") {
      let guard = await prisma.user.findFirst({
        where: { role: "SECURITY" },
        include: {
          studentProfile: { include: { hostel: true } },
        },
      });
      if (!guard) {
        guard = await prisma.user.create({
          data: {
            id: "guard_kp7",
            name: "Havildar R. K. Swain",
            email: "security.kp7@kiit.ac.in",
            role: "SECURITY",
            biometricStatus: "IN_HOSTEL",
          },
          include: {
            studentProfile: { include: { hostel: true } },
          },
        });
      }
      return guard;
    }

    // 3. Student selection from DB
    const cookieStore = await cookies();
    const activeStudentId = cookieStore.get("kiit_active_student_id")?.value;
    let demoStudent = null;

    if (activeStudentId) {
      demoStudent = await prisma.user.findFirst({
        where: { id: activeStudentId, role: "STUDENT" },
        include: {
          studentProfile: { include: { hostel: true } },
        },
      });
    }

    if (!demoStudent) {
      demoStudent = await prisma.user.findFirst({
        where: { id: "student_vivek_22051934" },
        include: {
          studentProfile: { include: { hostel: true } },
        },
      });
    }

    if (!demoStudent) {
      demoStudent = await prisma.user.findFirst({
        where: { role: "STUDENT" },
        include: {
          studentProfile: { include: { hostel: true } },
        },
      });
    }

    return demoStudent;
  } catch (error) {
    console.error("User Sync Error:", error);
    return await prisma.user.findFirst({
      include: {
        studentProfile: { include: { hostel: true } },
      },
    });
  }
}

export async function switchActiveStudent(studentId: string) {
  try {
    const cookieStore = await cookies();
    cookieStore.set("kiit_active_student_id", studentId, { path: "/", maxAge: 60 * 60 * 24 });
    cookieStore.set("kiit_demo_role", "STUDENT", { path: "/", maxAge: 60 * 60 * 24 });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/timings");
    revalidatePath("/dashboard/profile");
    return { success: true, studentId };
  } catch (error) {
    console.error("Switch active student error:", error);
    return { error: "Failed to switch active student" };
  }
}

export async function updateStudentProfile(formData: {
  userId: string;
  name?: string;
  rollNo?: string;
  hostelName?: string;
  roomNo?: string;
  bedNo?: string;
  phone?: string;
}) {
  try {
    if (formData.name) {
      await prisma.user.update({
        where: { id: formData.userId },
        data: { name: formData.name },
      });
    }

    const updatedProfile = await prisma.studentProfile.update({
      where: { userId: formData.userId },
      data: {
        rollNo: formData.rollNo,
        roomNo: formData.roomNo,
        bedNo: formData.bedNo,
        phone: formData.phone,
      },
      include: { hostel: true, user: true },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    return { success: true, profile: updatedProfile };
  } catch (error) {
    console.error("Update profile error:", error);
    return { error: "Failed to update profile details" };
  }
}

export async function toggleBiometricPunch(userId: string) {
  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return { error: "User not found" };

    const isCurrentlyIn = user.biometricStatus === "IN_HOSTEL";
    const newStatus = isCurrentlyIn ? "OUTSIDE_CAMPUS" : "IN_HOSTEL";
    const action = isCurrentlyIn ? "PUNCH_OUT" : "PUNCH_IN";

    // Update status and audit in GateLog
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { biometricStatus: newStatus },
      }),
      prisma.gateLog.create({
        data: {
          userId,
          action,
        },
      }),
    ]);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/timings");
    revalidatePath("/dashboard/security-gate");
    revalidatePath("/dashboard/warden");
    return { success: true, status: newStatus };
  } catch (error) {
    console.error("Toggle biometric error:", error);
    return { error: "Failed to punch biometric" };
  }
}

export async function getAdminStats() {
  try {
    const pendingComplaints = await prisma.complaint.count({ where: { status: "REGISTERED" } });
    const pendingPasses = await prisma.gatePass.count({ where: { status: "PENDING" } });

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const laundryToday = await prisma.laundryBooking.count({
      where: { bookingDate: { gte: today } },
    });

    const totalStudents = await prisma.user.count({ where: { role: "STUDENT" } });
    const studentsOutside = await prisma.user.count({
      where: { role: "STUDENT", biometricStatus: "OUTSIDE_CAMPUS" },
    });

    const complaintsCount = await prisma.complaint.findMany({ select: { category: true } });
    const categoryMap: Record<string, number> = {};
    complaintsCount.forEach((c) => {
      categoryMap[c.category] = (categoryMap[c.category] || 0) + 1;
    });

    const categoryData = Object.keys(categoryMap).map((name) => ({
      name,
      value: categoryMap[name],
    }));

    return {
      pendingComplaints,
      pendingVisitors: pendingPasses,
      laundryToday,
      totalStudents,
      studentsOutside,
      categoryData,
      revenue: {
        collected: 45000 + 5200,
        pending: 0,
      },
    };
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return null;
  }
}

export async function updateRoom(roomNo: string) {
  try {
    const user = await syncUser();
    if (!user) return { error: "User session not found" };

    if (user.studentProfile) {
      await prisma.studentProfile.update({
        where: { id: user.studentProfile.id },
        data: { roomNo },
      });
    }

    revalidatePath("/dashboard");
    return { success: true };
  } catch (error) {
    console.error("Update room error:", error);
    return { error: "Failed to update room" };
  }
}
