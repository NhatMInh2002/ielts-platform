"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  MoreVertical, 
  UserPlus, 
  Mail, 
  Calendar, 
  Zap, 
  Shield, 
  CheckCircle2,
  XCircle
} from "lucide-react";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

// Mock data học viên
const users = [
  { id: "1", name: "Nguyễn Văn A", email: "vana@gmail.com", role: "student", tokens: 450, status: "active", joined: "24/04/2026" },
  { id: "2", name: "Trần Thị B", email: "thib@gmail.com", role: "student", tokens: 120, status: "active", joined: "20/04/2026" },
  { id: "3", name: "Lê Văn C", email: "vanc@gmail.com", role: "admin", tokens: 9999, status: "active", joined: "15/04/2026" },
  { id: "4", name: "Phạm Minh D", email: "minhd@gmail.com", role: "student", tokens: 0, status: "inactive", joined: "10/04/2026" },
];

export default function AdminUsersClient() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Quản lý Học viên</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Danh sách người dùng và quản lý quyền hạn/tokens.</p>
        </div>
        <Button className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/20">
          <UserPlus className="mr-2 h-4 w-4" /> Thêm học viên
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-lg shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900">
          <CardContent className="pt-6">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Tổng học viên</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-zinc-900 dark:text-white">1,248</span>
              <span className="text-emerald-600 font-bold text-sm mb-1">+12%</span>
            </div>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900">
          <CardContent className="pt-6">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Đang hoạt động</p>
            <span className="text-3xl font-black text-zinc-900 dark:text-white">856</span>
          </CardContent>
        </Card>
        <Card className="border-none shadow-lg shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900">
          <CardContent className="pt-6">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Token đã sử dụng</p>
            <div className="flex items-end gap-2">
              <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">45,200</span>
              <Zap className="h-5 w-5 text-indigo-600 mb-1.5 fill-current" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <Input 
            placeholder="Tìm theo tên hoặc email..." 
            className="pl-10 h-12 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select defaultValue="all">
            <SelectTrigger className="w-[140px] h-12 rounded-xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 font-bold">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="h-12 w-12 rounded-xl border-zinc-200 dark:border-zinc-800"><Filter className="h-4 w-4" /></Button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-zinc-200 dark:border-zinc-800 overflow-hidden shadow-xl shadow-zinc-200/50 dark:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="px-6 py-4 text-[12px] font-bold text-zinc-400 uppercase tracking-widest">Học viên</th>
                <th className="px-6 py-4 text-[12px] font-bold text-zinc-400 uppercase tracking-widest text-center">Vai trò</th>
                <th className="px-6 py-4 text-[12px] font-bold text-zinc-400 uppercase tracking-widest text-center">Tokens</th>
                <th className="px-6 py-4 text-[12px] font-bold text-zinc-400 uppercase tracking-widest text-center">Trạng thái</th>
                <th className="px-6 py-4 text-[12px] font-bold text-zinc-400 uppercase tracking-widest">Ngày tham gia</th>
                <th className="px-6 py-4 text-[12px] font-bold text-zinc-400 uppercase tracking-widest text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-zinc-500">{user.name.charAt(0)}</div>
                      <div>
                        <p className="font-bold text-zinc-900 dark:text-zinc-100">{user.name}</p>
                        <p className="text-xs text-zinc-500 flex items-center gap-1"><Mail className="h-3 w-3" /> {user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    {user.role === "admin" ? (
                      <Badge className="bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20 rounded-lg"><Shield className="h-3 w-3 mr-1" /> Admin</Badge>
                    ) : (
                      <Badge variant="outline" className="text-zinc-500 dark:text-zinc-400 rounded-lg border-zinc-200 dark:border-zinc-800">Student</Badge>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="font-black text-zinc-900 dark:text-zinc-100">{user.tokens}</span>
                      <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 fill-current" />
                    </div>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center">
                      {user.status === "active" ? (
                        <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-xs"><CheckCircle2 className="h-4 w-4" /> Active</div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-zinc-400 font-bold text-xs"><XCircle className="h-4 w-4" /> Inactive</div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1.5 text-sm text-zinc-500 font-medium"><Calendar className="h-4 w-4 text-zinc-400" /> {user.joined}</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Button variant="ghost" size="icon" className="rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"><MoreVertical className="h-4 w-4 text-zinc-400" /></Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
