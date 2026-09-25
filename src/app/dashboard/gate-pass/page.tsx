import { redirect } from "next/navigation";

export default function GatePassRedirect() {
  redirect("/dashboard/timings");
}
