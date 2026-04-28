import { protectAdmin } from "@/lib/auth-utils";
import AdminUsersClient from "./users-client";

export default async function AdminUsersPage() {
  // Kiểm tra quyền Admin ngay tại Server
  await protectAdmin();

  return <AdminUsersClient />;
}
