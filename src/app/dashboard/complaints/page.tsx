import ComplaintsClient from "./client";
import { getComplaints } from "@/app/actions/complaints";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ComplaintsPage() {
  const { userId } = await auth();
  let role = "STUDENT";
  
  if (userId) {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (dbUser?.role) role = dbUser.role;
  }
  
  const complaints = await getComplaints();
  
  return <ComplaintsClient complaints={complaints} role={role} />;
}
