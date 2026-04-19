import { getUserFees } from "@/app/actions/fees";
import { syncUser } from "@/app/actions/user";
import FeesClient from "./client";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function FeesPage() {
  const user = await syncUser();
  if (!user) redirect("/login");

  const fees = await getUserFees();

  return <FeesClient fees={fees} role={user.role} />;
}
