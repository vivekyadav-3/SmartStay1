"use server";

import { prisma } from "@/lib/db";
import { syncUser } from "@/app/actions/user";
import { revalidatePath } from "next/cache";

export async function requestVisitorPass(formData: FormData) {
  try {
    const user = await syncUser();
    if (!user) return { error: "Unauthorized" };

    const visitorName = formData.get("visitorName")?.toString();
    const dateStr = formData.get("date")?.toString();

    if (!visitorName || !dateStr) return { error: "Required fields missing" };

    const visitDate = new Date(dateStr);
    const passCode = `VP-${Date.now().toString().slice(-4)}`;

    await prisma.gatePass.create({
      data: {
        userId: user.id,
        passCode,
        destination: `Campus Guest: ${visitorName}`,
        purpose: `Hostel Visitor Access for ${visitorName}`,
        departureTime: visitDate,
        returnTime: new Date(visitDate.getTime() + 4 * 60 * 60 * 1000),
        status: "APPROVED",
        curfewDeadline: "08:30 PM",
      },
    });

    revalidatePath("/dashboard/visitor-pass");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Failed to submit request" };
  }
}

export async function getVisitorPasses() {
  try {
    const user = await syncUser();
    if (!user) return [];

    const isAuthority = user.role === "WARDEN" || user.role === "SECURITY" || user.role === "ADMIN";

    const passes = await prisma.gatePass.findMany({
      where: {
        userId: isAuthority ? undefined : user.id,
        destination: { startsWith: "Campus Guest" },
      },
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    });

    return passes.map((p) => ({
      id: p.id,
      visitorName: p.destination.replace("Campus Guest: ", ""),
      date: p.departureTime,
      status: p.status,
      user: p.user,
    }));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateVisitorStatus(id: string, status: string) {
  try {
    await prisma.gatePass.update({
      where: { id },
      data: { status },
    });

    revalidatePath("/dashboard/visitor-pass");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { error: "Update failed" };
  }
}
