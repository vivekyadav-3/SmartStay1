"use server";

import { prisma } from "@/lib/db";
import { syncUser } from "@/app/actions/user";
import { revalidatePath } from "next/cache";

export async function requestGatePass(data: {
  destination: string;
  purpose: string;
  expectedInTimeHours: number;
  passType?: string;
}) {
  try {
    const user = await syncUser();
    if (!user) return { error: "User session not found" };

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const passCode = `GP-2026-${randomNum}`;

    const departureTime = new Date();
    const returnTime = new Date(Date.now() + (data.expectedInTimeHours || 2) * 60 * 60 * 1000);

    const gatePass = await prisma.gatePass.create({
      data: {
        passCode,
        userId: user.id,
        destination: data.destination,
        purpose: data.purpose,
        departureTime,
        returnTime,
        status: "APPROVED",
        curfewDeadline: "08:30 PM",
        qrData: `KIIT-PASS-${user.studentProfile?.rollNo || "22051934"}-${passCode}-VALID`,
        wardenRemark: "Digital Auto-Pass: Approved by KP-7 Chief Warden Office",
      },
      include: {
        user: { include: { studentProfile: true } },
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/timings");
    return { success: true, gatePass };
  } catch (error) {
    console.error("Request gate pass error:", error);
    return { error: "Failed to create gate pass" };
  }
}

export async function getGatePasses() {
  try {
    const user = await syncUser();
    if (!user) return [];

    if (user.role === "ADMIN" || user.role === "WARDEN") {
      return await prisma.gatePass.findMany({
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            include: { studentProfile: true },
          },
        },
      });
    }

    return await prisma.gatePass.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: { studentProfile: true },
        },
      },
    });
  } catch (error) {
    console.error("Get gate passes error:", error);
    return [];
  }
}

export async function getPendingGatePasses() {
  try {
    return await prisma.gatePass.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          include: { studentProfile: { include: { hostel: true } } },
        },
      },
    });
  } catch (error) {
    console.error("Get pending gate passes error:", error);
    return [];
  }
}

export async function approveGatePass(passId: string) {
  try {
    const pass = await prisma.gatePass.update({
      where: { id: passId },
      data: {
        status: "APPROVED",
        wardenRemark: "Approved by Prof. S. K. Mohapatra (Chief Warden KP-7)",
        approvedAt: new Date(),
      },
      include: {
        user: { include: { studentProfile: true } },
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/timings");
    revalidatePath("/dashboard/warden");
    revalidatePath("/dashboard/security-gate");
    return { success: true, pass };
  } catch (error) {
    console.error("Approve gate pass error:", error);
    return { error: "Failed to approve gate pass" };
  }
}

export async function rejectGatePass(passId: string, remark?: string) {
  try {
    const pass = await prisma.gatePass.update({
      where: { id: passId },
      data: {
        status: "REJECTED",
        wardenRemark: remark || "Rejected by Warden Office: Incomplete reason or disciplinary flag",
      },
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/timings");
    revalidatePath("/dashboard/warden");
    revalidatePath("/dashboard/security-gate");
    return { success: true, pass };
  } catch (error) {
    console.error("Reject gate pass error:", error);
    return { error: "Failed to reject gate pass" };
  }
}

export async function getGatePassByNumber(passCode: string) {
  try {
    const cleanPass = passCode.trim().toUpperCase();
    const pass = await prisma.gatePass.findFirst({
      where: { passCode: cleanPass },
      include: {
        user: {
          include: {
            studentProfile: { include: { hostel: true } },
          },
        },
      },
    });
    return pass;
  } catch (error) {
    console.error("Get gate pass error:", error);
    return null;
  }
}

export async function securityPunchPass(passCode: string, punchType: "OUT" | "IN") {
  try {
    const cleanPass = passCode.trim().toUpperCase();
    const pass = await prisma.gatePass.findFirst({
      where: { passCode: cleanPass },
      include: { user: true },
    });

    if (!pass) return { error: `Pass ${passCode} not found in database` };

    const newBiometricStatus = punchType === "OUT" ? "OUTSIDE_CAMPUS" : "IN_HOSTEL";
    const newPassStatus = punchType === "OUT" ? "ACTIVE" : "COMPLETED";
    const gateAction = punchType === "OUT" ? "PUNCH_OUT" : "PUNCH_IN";

    // ATOMIC TRANSACTION: User Biometric + GatePass Status + GateLog Audit
    const [updatedUser, updatedPass, gateLog] = await prisma.$transaction([
      prisma.user.update({
        where: { id: pass.userId },
        data: { biometricStatus: newBiometricStatus },
      }),
      prisma.gatePass.update({
        where: { id: pass.id },
        data: { status: newPassStatus },
        include: {
          user: {
            include: { studentProfile: { include: { hostel: true } } },
          },
        },
      }),
      prisma.gateLog.create({
        data: {
          userId: pass.userId,
          passId: pass.id,
          action: gateAction,
        },
      }),
    ]);

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/timings");
    revalidatePath("/dashboard/security-gate");
    revalidatePath("/dashboard/warden");

    return {
      success: true,
      pass: updatedPass,
      action: punchType,
      newBiometricStatus,
      gateLog,
      message:
        punchType === "OUT"
          ? `Punch OUT recorded! Student ${pass.user?.name} is now marked OUTSIDE CAMPUS.`
          : `Punch IN recorded! Student ${pass.user?.name} has returned and is marked IN HOSTEL.`,
    };
  } catch (error) {
    console.error("Security punch transaction error:", error);
    return { error: "Failed to record security gate punch transaction" };
  }
}

export async function getRecentGateLogs() {
  try {
    const logs = await prisma.gateLog.findMany({
      take: 10,
      orderBy: { timestamp: "desc" },
      include: {
        user: {
          include: { studentProfile: true },
        },
        pass: true,
      },
    });
    return logs;
  } catch (error) {
    console.error("Get gate logs error:", error);
    return [];
  }
}

export async function getCurfewInfo() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const totalMins = hours * 60 + minutes;

  const isGateOpen = totalMins >= 360 && totalMins <= 1230;
  const isLateWindow = totalMins > 1230 && totalMins <= 1290;
  const isNightCurfew = totalMins > 1290 || totalMins < 360;

  let status = "OPEN";
  let statusMessage = "Hostel Gates Open — Normal In/Out with Biometric ID";
  let badgeColor = "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";

  if (isLateWindow) {
    status = "WARNING";
    statusMessage = "Curfew Warning: In-time 08:30 PM passed. Gate pass required at checkpoint.";
    badgeColor = "bg-amber-500/10 text-amber-400 border-amber-500/20";
  } else if (isNightCurfew) {
    status = "CURFEW";
    statusMessage = "Hostel Gates Locked — Night Curfew Active. Only Emergency exit permitted.";
    badgeColor = "bg-rose-500/10 text-rose-400 border-rose-500/20";
  }

  let minsRemaining = 1230 - totalMins;
  if (minsRemaining < 0) minsRemaining += 24 * 60;
  const remainingHours = Math.floor(minsRemaining / 60);
  const remainingMinutes = minsRemaining % 60;

  return {
    status,
    statusMessage,
    badgeColor,
    curfewDeadline: "08:30 PM",
    morningOpening: "06:00 AM",
    countdownText: `${remainingHours}h ${remainingMinutes}m until curfew`,
    rules: [
      "Mandatory biometric punch at King's Palace main gate before 08:30 PM.",
      "Outing beyond Campus 12 after 08:30 PM requires digital gate pass signed by Hostel Superintendent.",
      "Students returning between 08:30 PM - 09:30 PM must produce KIIT Student ID card and Outing Pass.",
      "Night Out leaves require parent confirmation via ERP/SMS approval.",
    ],
  };
}
