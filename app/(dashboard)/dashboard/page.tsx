import { getDashboardData } from "@/lib/actions/dashboard-actions";
import DashboardClient from "./dashboard-client";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const data = await getDashboardData();

  // Nếu không có session, bắt đăng nhập lại
  if (!data) {
    redirect("/login");
  }

  return (
    <DashboardClient 
      profile={data.profile} 
      recentSubmissions={data.recentSubmissions} 
      modulesProgress={data.modulesProgress} 
    />
  );
}
