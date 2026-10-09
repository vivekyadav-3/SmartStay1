"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { findKiitStudent } from "@/lib/kiit-students";
import { enforceRateLimit } from "@/lib/rate-limiter";

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

    // 3. Student selection from DB based on authenticated session cookie
    const cookieStore = await cookies();
    const activeStudentId = cookieStore.get("kiit_active_student_id")?.value;

    if (activeStudentId) {
      const student = await prisma.user.findFirst({
        where: { id: activeStudentId, role: "STUDENT" },
        include: {
          studentProfile: { include: { hostel: true } },
        },
      });
      if (student) return student;
    }

    // No authenticated student session
    return null;
  } catch (error) {
    console.error("User Sync Error:", error);
    return null;
  }
}

export async function getCurrentUser() {
  return await syncUser();
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
    const rawInput = email.trim().toLowerCase();
    if (!rawInput) return { error: "Please enter your KIIT Roll Number or Email" };
    if (!password) return { error: "Please enter your password" };

    const rateCheck = await enforceRateLimit({
      action: "student-login",
      maxRequests: 3,
      windowSeconds: 120,
      secondaryIdentifier: rawInput,
    });
    if (!rateCheck.allowed) {
      return { error: rateCheck.error };
    }

    // 1. Look up student in official 4th SEM directory (4,385 students)
    const studentInfo = findKiitStudent(rawInput);

    let cleanEmail = rawInput;
    let cleanRoll = rawInput.match(/\d+/)?.[0] || rawInput;

    if (studentInfo) {
      cleanEmail = studentInfo.email;
      cleanRoll = studentInfo.roll;
    } else {
      if (!cleanEmail.includes("@")) {
        cleanEmail = `${cleanRoll}@kiit.ac.in`;
      }
    }

    // 2. Find in database by email OR by studentProfile rollNo
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { studentProfile: { rollNo: cleanRoll } },
        ],
      },
      include: { studentProfile: { include: { hostel: true } } },
    });

    // 3. If found and exists in 4th SEM sheet, ensure official name matches
    if (user && studentInfo) {
      if (user.name !== studentInfo.name || user.email !== studentInfo.email) {
        await prisma.user.update({
          where: { id: user.id },
          data: { name: studentInfo.name, email: studentInfo.email },
        });
        user.name = studentInfo.name;
        user.email = studentInfo.email;
      }
    }

    // 4. If user does not exist in database yet, create new student record
    if (!user) {
      if (password !== "Kiit@123") {
        return { error: "First-time login default password for KIIT students is Kiit@123" };
      }

      const studentName = studentInfo?.name || `Student ${cleanRoll}`;
      const hostelCode = studentInfo?.hostelCode || "KP-7";
      const hostelName = studentInfo?.hostelName || "King's Palace 7";
      const campus = studentInfo?.campus || "Campus 12";
      const roomNo = studentInfo?.roomNo || `${Math.floor(100 + Math.random() * 400)}`;
      const bedNo = studentInfo?.bedNo || "B";
      const phone = studentInfo?.phone || "+91 98765 43210";
      const branch = studentInfo?.branch || "Computer Science & Engineering";

      let hostel = await prisma.hostel.findFirst({
        where: { code: hostelCode },
      });
      if (!hostel) {
        hostel = await prisma.hostel.create({
          data: { name: hostelName, code: hostelCode, campus },
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
              rollNo: cleanRoll,
              branch,
              semester: studentInfo?.semester || 5,
              year: studentInfo?.year || 3,
              hostelId: hostel.id,
              roomNo,
              bedNo,
              phone,
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
    return { error: "Failed to login. Please verify Roll Number or Email and try again." };
  }
}

export async function changeStudentPassword(currentPassword: string, newPassword: string) {
  try {
    const rateCheck = await enforceRateLimit({
      action: "change-password",
      maxRequests: 2,
      windowSeconds: 300,
    });
    if (!rateCheck.allowed) {
      return { error: rateCheck.error };
    }

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
