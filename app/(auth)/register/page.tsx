"use client";

import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { GraduationCap, ArrowRight, Loader2, Mail, Lock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { signup, loginWithGoogle } from "../actions";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await signup(formData);
    setIsLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else if (result?.success) {
      toast.success(result.message);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    const result = await loginWithGoogle();
    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="fixed top-6 right-6 z-50">
      <ThemeToggle />
    </div>
    <div className="relative min-h-screen flex items-center justify-center bg-[#FAFAFB] dark:bg-zinc-950 px-6 py-12 font-sans selection:bg-blue-100 transition-colors duration-300">
      {/* Subtle Background Elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-5%] h-[40%] w-[40%] rounded-full bg-blue-100/40 dark:bg-blue-900/10 blur-[100px]"></div>
        <div className="absolute bottom-[-10%] right-[-5%] h-[40%] w-[40%] rounded-full bg-indigo-100/30 dark:bg-indigo-900/10 blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[460px]"
      >
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <Link href="/" className="group flex flex-col items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-blue-600 shadow-xl shadow-blue-200 dark:shadow-blue-900/20 transition-transform group-hover:scale-110">
              <GraduationCap className="h-8 w-8 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
              IELTS<span className="text-blue-600">Mastery</span>
            </span>
          </Link>
        </div>

        <div className="rounded-[40px] border border-white dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] backdrop-blur-xl sm:p-12">
          <div className="mb-10 text-center">
            <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-zinc-50 mb-3">Tạo tài khoản</h1>
            <p className="text-[15px] font-medium text-zinc-500 dark:text-zinc-400">
              Bắt đầu hành trình chinh phục IELTS 8.0 ngay hôm nay.
            </p>
          </div>

          <div className="space-y-6">
            <Button
              variant="outline"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              className="h-14 w-full rounded-2xl border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-[15px] font-bold text-zinc-700 dark:text-zinc-300 shadow-sm transition-all hover:bg-zinc-50 dark:hover:bg-zinc-800 active:scale-95 flex items-center justify-center gap-3"
            >
              <Icons.google className="h-5 w-5" />
              Tiếp tục với Google
            </Button>

            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-100 dark:border-zinc-800" />
              </div>
              <span className="relative bg-[#FAFAFB] dark:bg-zinc-950 px-4 text-[13px] font-bold uppercase tracking-widest text-zinc-400">
                Hoặc
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-[14px] font-bold text-zinc-700 dark:text-zinc-300 ml-1">Họ và tên</Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nguyễn Văn A"
                    required
                    disabled={isLoading}
                    className="h-14 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 pl-12 text-[15px] focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 transition-all text-zinc-900 dark:text-zinc-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-[14px] font-bold text-zinc-700 dark:text-zinc-300 ml-1">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    required
                    disabled={isLoading}
                    className="h-14 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 pl-12 text-[15px] focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 transition-all text-zinc-900 dark:text-zinc-50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-[14px] font-bold text-zinc-700 dark:text-zinc-300 ml-1">Mật khẩu</Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    className="h-14 rounded-2xl border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-950/50 pl-12 text-[15px] focus:bg-white dark:focus:bg-zinc-900 focus:ring-2 focus:ring-blue-500/20 transition-all text-zinc-900 dark:text-zinc-50"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="h-14 w-full rounded-2xl bg-blue-600 text-[16px] font-black text-white shadow-xl shadow-blue-200 hover:bg-blue-700 transition-all active:scale-95" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Tạo tài khoản <ArrowRight className="h-5 w-5" />
                  </span>
                )}
              </Button>
            </form>
          </div>

          <div className="mt-10 text-center">
            <p className="text-[15px] font-medium text-zinc-500 dark:text-zinc-400">
              Đã có tài khoản?{" "}
              <Link
                href="/login"
                className="font-black text-blue-600 hover:text-blue-700 transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <p className="mt-10 text-center text-[13px] font-medium text-zinc-400">
          Bằng cách đăng ký, bạn đồng ý với <a href="#" className="underline">Điều khoản dịch vụ</a> và <a href="#" className="underline">Chính sách bảo mật</a> của chúng tôi.
        </p>
      </motion.div>
    </div>
    </>
  );
}
