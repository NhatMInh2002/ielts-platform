import { protectAdmin } from "@/lib/auth-utils";
import AdminTestsClient from "./tests-client";

export default async function AdminTestsPage() {
  // Kiểm tra quyền Admin ngay tại Server
  await protectAdmin();

  return <AdminTestsClient />;
}
