"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function getDemoRole(): Promise<"STUDENT" | "WARDEN" | "HEAD_WARDEN" | "SECURITY"> {
  try {
    const cookieStore = await cookies();
    const role = cookieStore.get("kiit_demo_role")?.value;
    if (role === "WARDEN" || role === "HEAD_WARDEN" || role === "SECURITY" || role === "STUDENT") {
      return role as "STUDENT" | "WARDEN" | "HEAD_WARDEN" | "SECURITY";
    }
    return "STUDENT";
  } catch {
    return "STUDENT";
  }
}

export async function setDemoRole(role: "STUDENT" | "WARDEN" | "HEAD_WARDEN" | "SECURITY") {
  try {
    const cookieStore = await cookies();
    cookieStore.set("kiit_demo_role", role, { path: "/", maxAge: 60 * 60 * 24 });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/warden");
    revalidatePath("/dashboard/head-warden");
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

    // 1. If Head Warden selected
    if (activeRole === "HEAD_WARDEN") {
      let headWarden = await prisma.user.findFirst({
        where: { role: "HEAD_WARDEN" },
        include: {
          studentProfile: { include: { hostel: true } },
        },
      });
      if (!headWarden) {
        headWarden = await prisma.user.create({
          data: {
            id: "head_warden_kiit",
            name: "Dr. J. R. Mohanty",
            email: "headwarden@kiit.ac.in",
            role: "HEAD_WARDEN",
            biometricStatus: "IN_HOSTEL",
          },
          include: {
            studentProfile: { include: { hostel: true } },
          },
        });
      }
      return headWarden;
    }

    // 2. If Warden role selected in demo switcher
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

export async function loginWithKiitCredentials(email: string, password: string) {
  try {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return { error: "Please provide a valid KIIT email address" };
    if (!password) return { error: "Please enter your password" };

    let user = await prisma.user.findUnique({
      where: { email: cleanEmail },
      include: { studentProfile: { include: { hostel: true } } },
    });

    // If user does not exist yet, allow ANY n number of students to login with default password Kiit@123!
    if (!user) {
      if (password !== "Kiit@123") {
        return { error: "First-time login default password for KIIT students is Kiit@123" };
      }

      // Extract roll or create
      const matchRoll = cleanEmail.match(/\d+/);
      const rollNo = matchRoll ? matchRoll[0] : Math.floor(22051000 + Math.random() * 8999).toString();
      const extractedName = cleanEmail.split("@")[0].replace(/[._-]/g, " ").replace(/\d+/g, "").trim();
      const studentName = extractedName ? extractedName.charAt(0).toUpperCase() + extractedName.slice(1) : `Student ${rollNo}`;

      let hostel = await prisma.hostel.findFirst();
      if (!hostel) {
        hostel = await prisma.hostel.create({
          data: { name: "King's Palace 7", code: "KP-7", campus: "Campus 12" },
        });
      }

      user = await prisma.user.create({
        data: {
          name: studentName,
          email: cleanEmail,
          passwordHash: "Kiit@123",
          role: "STUDENT",
          biometricStatus: "IN_HOSTEL",
          studentProfile: {
            create: {
              rollNo,
              branch: "Computer Science & Engineering",
              semester: 6,
              year: 3,
              hostelId: hostel.id,
              roomNo: `${Math.floor(100 + Math.random() * 400)}`,
              bedNo: "B",
              phone: "+91 98765 43210",
            },
          },
        },
        include: { studentProfile: { include: { hostel: true } } },
      });
    } else {
      // User exists: verify password
      const isDefault = user.passwordHash === "$2a$10$demoHashedPasswordSmartStay2026" || user.passwordHash === "Kiit@123";
      if (isDefault) {
        if (password !== "Kiit@123" && password !== "demoHashedPasswordSmartStay2026") {
          return { error: "Invalid password. Default password for first login is Kiit@123" };
        }
      } else {
        if (user.passwordHash !== password && password !== "Kiit@123") {
          return { error: "Incorrect password. Please enter your updated password or Kiit@123" };
        }
      }
    }

    // Set cookies
    const cookieStore = await cookies();
    cookieStore.set("kiit_active_student_id", user.id, { path: "/", maxAge: 60 * 60 * 24 * 7 });
    cookieStore.set("kiit_demo_role", "STUDENT", { path: "/", maxAge: 60 * 60 * 24 * 7 });

    // Record login activity
    await prisma.loginActivity.create({
      data: {
        userId: user.id,
        device: "KIIT Web Portal",
        success: true,
      },
    }).catch(() => {});

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    revalidatePath("/dashboard/feedback");

    const isDefaultPw = user.passwordHash === "$2a$10$demoHashedPasswordSmartStay2026" || user.passwordHash === "Kiit@123";
    return { success: true, user, isDefaultPassword: isDefaultPw };
  } catch (error) {
    console.error("Login error:", error);
    return { error: "Failed to login. Please verify email and try again." };
  }
}

export async function changeStudentPassword(currentPassword: string, newPassword: string) {
  try {
    const user = await syncUser();
    if (!user) return { error: "Session expired. Please log in again." };

    if (!newPassword || newPassword.length < 6) {
      return { error: "New password must be at least 6 characters long." };
    }

    const isDefault = user.passwordHash === "$2a$10$demoHashedPasswordSmartStay2026" || user.passwordHash === "Kiit@123";
    if (isDefault) {
      if (currentPassword !== "Kiit@123" && currentPassword !== "demoHashedPasswordSmartStay2026") {
        return { error: "Current password does not match Kiit@123" };
      }
    } else {
      if (user.passwordHash !== currentPassword && currentPassword !== "Kiit@123") {
        return { error: "Current password is incorrect." };
      }
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: newPassword },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/profile");
    return { success: true };
  } catch (error) {
    console.error("Change password error:", error);
    return { error: "Failed to update password." };
  }
}

export async function logoutStudent() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("kiit_active_student_id");
    cookieStore.delete("kiit_demo_role");
    revalidatePath("/dashboard");
    return { success: true };
  } catch {
    return { success: true };
  }
}
