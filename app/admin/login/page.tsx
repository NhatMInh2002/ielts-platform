"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, Mail, ArrowRight, Zap, Loader2 } from "lucide-react";
import { login } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/theme-toggle";

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center justify-center p-6 transition-colors duration-300 relative overflow-hidden">
      {/* Background Ornaments */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/20 rounded-full blur-[120px]" />
      </div>

      <div className="fixed top-8 right-8">
        <ThemeToggle />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[440px] relative z-10"
      >
        <div className="flex flex-col items-center mb-10">
          <div className="h-16 w-16 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-6 group transition-transform hover:scale-110">
            <ShieldCheck className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tighter text-center">
            IELTS MASTER <span className="text-indigo-600">ADMIN</span>
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Truy cập hệ thống quản trị nội dung và học viên
          </p>
        </div>

        <Card className="border-none shadow-2xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900 rounded-[32px] overflow-hidden">
          <CardHeader className="pt-10 px-10 pb-2">
            <CardTitle className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">Đăng nhập Quản trị</CardTitle>
            <CardDescription className="text-zinc-500 dark:text-zinc-400 font-medium">
              Vui lòng nhập tài khoản admin để tiếp tục
            </CardDescription>
          </CardHeader>
          <CardContent className="p-10">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-bold text-zinc-400 uppercase tracking-widest ml-1">Email Quản trị</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    placeholder="admin@ieltsmaster.com" 
                    required 
                    className="h-14 pl-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-all font-medium"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <Label htmlFor="password" className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Mật khẩu</Label>
                  <a href="#" className="text-[11px] font-bold text-indigo-600 hover:underline">Quên mật khẩu?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input 
                    id="password" 
                    name="password" 
                    type="password" 
                    required 
                    className="h-14 pl-12 rounded-2xl bg-zinc-50 dark:bg-zinc-800 border-none focus-visible:ring-2 focus-visible:ring-indigo-600 transition-all font-medium"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg shadow-xl shadow-indigo-500/20 transition-all group"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <>
                    VÀO HỆ THỐNG
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </Button>
            </form>

            <div className="mt-10 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center">
              <p className="text-zinc-400 dark:text-zinc-500 text-sm font-medium">
                Bạn là học viên? 
                <a href="/login" className="text-indigo-600 font-bold ml-1 hover:underline">Về trang đăng nhập học viên</a>
              </p>
            </div>
          </CardContent>
        </Card>

        <p className="mt-8 text-center text-zinc-400 dark:text-zinc-600 text-xs font-bold tracking-widest uppercase">
          &copy; 2026 IELTS MASTER PLATFORM • SECURED ACCESS
        </p>
      </motion.div>
    </div>
  );
}
