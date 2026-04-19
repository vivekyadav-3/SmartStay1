import VisitorPassClient from "./client";
import { getVisitorPasses } from "@/app/actions/visitor";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function VisitorPassPage() {
  const { userId } = await auth();
  let role = "STUDENT";
  
  if (userId) {
    const dbUser = await prisma.user.findUnique({ where: { id: userId } });
    if (dbUser?.role) role = dbUser.role;
  }
  
  const passes = await getVisitorPasses();
  
  return <VisitorPassClient passes={passes} role={role} />;
}
