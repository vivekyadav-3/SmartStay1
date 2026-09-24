import VisitorPassClient from "./client";
import { getVisitorPasses } from "@/app/actions/visitor";
import { syncUser } from "@/app/actions/user";

export const dynamic = "force-dynamic";

export default async function VisitorPassPage() {
  const user = await syncUser();
  const role = user?.role || "STUDENT";
  const passes = await getVisitorPasses();

  return <VisitorPassClient passes={passes} role={role} />;
}
