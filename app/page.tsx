"use client";

import { motion } from "framer-motion";
import { BookOpen, GraduationCap, LineChart, MessageSquare, PenTool, ArrowRight, Stars, ShieldCheck, Zap } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const features = [
  {
    title: "AI Writing Correction",
    description: "Nhận phản hồi ngay lập tức cho bài viết của bạn với công nghệ AI tiên tiến, giúp sửa lỗi ngữ pháp và nâng cấp từ vựng.",
    icon: PenTool,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    title: "Adaptive Reading",
    description: "Luyện tập với các bài đọc được thiết kế riêng cho trình độ của bạn, giúp cải thiện kỹ năng đọc hiểu nhanh chóng.",
    icon: BookOpen,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
  },
  {
    title: "Speaking Analysis",
    description: "Công nghệ phân tích giọng nói giúp bạn cải thiện phát âm và độ trôi chảy như người bản xứ.",
    icon: MessageSquare,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
  },
  {
    title: "Progress Tracking",
    description: "Theo dõi lộ trình học tập và dự đoán band điểm thực tế thông qua các bài kiểm tra định kỳ.",
    icon: LineChart,
    color: "text-sky-600",
    bgColor: "bg-sky-50",
  },
];

const stats = [
  { label: "Học viên tin dùng", value: "10,000+" },
  { label: "Tỉ lệ đạt mục tiêu", value: "94%" },
  { label: "Bài học AI", value: "500+" },
];

import { ThemeToggle } from "@/components/theme-toggle";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen bg-[#FAFAFB] dark:bg-zinc-950 font-sans selection:bg-blue-100 selection:text-blue-900 transition-colors duration-300">
      {/* Background Decor - Softer and more subtle */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] h-[40%] w-[40%] rounded-full bg-blue-100/30 dark:bg-blue-900/10 blur-[120px]"></div>
        <div className="absolute top-[10%] -right-[10%] h-[40%] w-[40%] rounded-full bg-indigo-100/20 dark:bg-indigo-900/10 blur-[120px]"></div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-zinc-100 dark:border-zinc-800">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              IELTS<span className="text-blue-600">Mastery</span>
            </span>
          </div>
          <nav className="hidden items-center gap-10 md:flex">
            {["Tính năng", "Lộ trình", "Học phí", "Cộng đồng"].map((item) => (
              <a key={item} href="#" className="text-[15px] font-semibold text-zinc-500 transition-colors hover:text-blue-600 dark:text-zinc-400 dark:hover:text-zinc-50">
                {item}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <Link href="/login" className="hidden text-[15px] font-bold text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-zinc-50 sm:block px-4">
              Đăng nhập
            </Link>
            <Link href="/register">
              <Button className="h-12 rounded-2xl bg-zinc-900 dark:bg-zinc-50 px-8 text-[15px] font-bold text-white dark:text-zinc-900 shadow-xl shadow-zinc-200 dark:shadow-none hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-95">
                Bắt đầu học ngay
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* Hero Section - Cleaner & Friendlier */}
        <section className="pt-40 pb-20 lg:pt-56 lg:pb-32">
          <div className="mx-auto max-w-7xl px-6">
            <div className="grid lg:grid-cols-2 gap-20 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 dark:bg-blue-900/20 px-4 py-2 text-[13px] font-bold text-blue-700 dark:text-blue-400 mb-8 border border-blue-100 dark:border-blue-800/30">
                  <Stars className="h-4 w-4" />
                  Học IELTS thông minh hơn với Trí tuệ nhân tạo
                </div>
                <h1 className="text-[44px] sm:text-[64px] font-[900] leading-[1.1] tracking-tight text-zinc-900 dark:text-zinc-50 mb-8">
                  Nâng tầm kỹ năng <br /> 
                  <span className="text-blue-600">IELTS</span> mỗi ngày.
                </h1>
                <p className="text-[18px] sm:text-[20px] leading-[1.6] text-zinc-500 dark:text-zinc-400 mb-12 max-w-xl">
                  Trải nghiệm nền tảng học IELTS thế hệ mới. Chúng tôi giúp bạn học tập trung hơn, sửa lỗi chi tiết hơn và đạt mục tiêu nhanh hơn.
                </p>
                <div className="flex flex-col sm:flex-row gap-5">
                  <Link href="/register">
                    <Button size="lg" className="h-16 rounded-[22px] bg-blue-600 px-10 text-[17px] font-bold text-white shadow-2xl shadow-blue-200 dark:shadow-blue-900/20 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95 group">
                      Bắt đầu miễn phí
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="lg" className="h-16 rounded-[22px] border-2 border-zinc-200 dark:border-zinc-800 px-10 text-[17px] font-bold text-zinc-700 dark:text-zinc-300 hover:bg-white dark:hover:bg-zinc-900 hover:border-zinc-300 dark:hover:border-zinc-700 transition-all active:scale-95">
                    Tìm hiểu lộ trình
                  </Button>
                </div>
                
                <div className="mt-16 grid grid-cols-3 gap-8 border-t border-zinc-100 dark:border-zinc-800 pt-10">
                  {stats.map((stat) => (
                    <div key={stat.label}>
                      <p className="text-2xl font-black text-zinc-900 dark:text-zinc-50">{stat.value}</p>
                      <p className="text-[14px] font-medium text-zinc-400 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                className="relative"
              >
                <div className="relative z-10 overflow-hidden rounded-[40px] border-[12px] border-white dark:border-zinc-900 bg-white dark:bg-zinc-900 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.1)] dark:shadow-none">
                  <Image
                    src="/hero.png"
                    alt="IELTS Platform Preview"
                    width={1200}
                    height={800}
                    className="w-full object-cover"
                    priority
                  />
                </div>
                {/* Decorative floating cards */}
                <motion.div 
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -top-10 -right-6 z-20 rounded-3xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl p-6 shadow-2xl border border-white/50 dark:border-zinc-700/50 hidden sm:block"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
                      <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-zinc-400">Đánh giá kỹ năng</p>
                      <p className="text-[17px] font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Writing: 7.5 Band</p>
                    </div>
                  </div>
                </motion.div>
                <motion.div 
                  animate={{ y: [0, 12, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                  className="absolute -bottom-10 -left-6 z-20 rounded-3xl bg-white/90 dark:bg-zinc-800/90 backdrop-blur-xl p-6 shadow-2xl border border-white/50 dark:border-zinc-700/50 hidden sm:block"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                      <Zap className="h-6 w-6 text-amber-600" />
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-zinc-400">Mục tiêu hôm nay</p>
                      <p className="text-[17px] font-black text-zinc-900 dark:text-zinc-50 tracking-tight">Hoàn thành 3 bài test</p>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Features - More Minimal & Clean */}
        <section className="py-32 bg-white dark:bg-zinc-950">
          <div className="mx-auto max-w-7xl px-6">
            <div className="max-w-3xl mb-24">
              <h2 className="text-blue-600 font-black text-[15px] uppercase tracking-widest mb-4">Tính năng học tập</h2>
              <p className="text-[36px] sm:text-[48px] font-[900] leading-tight text-zinc-900 dark:text-zinc-50 tracking-tight">
                Thiết kế riêng cho trải nghiệm <br /> học tập tập trung nhất.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -8 }}
                  className="group relative rounded-[32px] border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-10 transition-all hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.08)] dark:hover:shadow-none hover:border-blue-100 dark:hover:border-blue-900/30"
                >
                  <div className={`mb-8 flex h-16 w-16 items-center justify-center rounded-[24px] ${feature.bgColor} dark:bg-zinc-800 transition-transform group-hover:scale-110`}>
                    <feature.icon className={`h-8 w-8 ${feature.color} dark:text-blue-400`} />
                  </div>
                  <h3 className="text-[20px] font-black text-zinc-900 dark:text-zinc-50 mb-4">{feature.title}</h3>
                  <p className="text-[15px] leading-[1.6] text-zinc-500 dark:text-zinc-400 font-medium">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Warm and inviting */}
        <section className="py-20">
          <div className="mx-auto max-w-7xl px-6">
            <div className="relative rounded-[48px] bg-zinc-950 p-12 sm:p-24 overflow-hidden text-center">
              <div className="absolute top-0 right-0 h-full w-1/2 bg-blue-600/10 blur-[100px]"></div>
              <div className="relative z-10">
                <h2 className="text-[32px] sm:text-[54px] font-black leading-tight text-white mb-8 tracking-tight">
                  Sẵn sàng nâng band <br /> IELTS cùng Mastery?
                </h2>
                <p className="text-[18px] text-zinc-400 mb-12 max-w-2xl mx-auto font-medium">
                  Hơn 10,000 học viên đã bắt đầu. Đừng bỏ lỡ cơ hội đạt điểm số mơ ước với phương pháp học hiện đại nhất.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center">
                  <Link href="/register">
                    <Button size="lg" className="h-16 rounded-2xl bg-blue-600 px-12 text-[17px] font-bold text-white hover:bg-blue-700 transition-all">
                      Đăng ký ngay
                    </Button>
                  </Link>
                  <Link href="/login">
                    <Button variant="outline" size="lg" className="h-16 rounded-2xl border-2 border-zinc-800 px-12 text-[17px] font-bold text-white hover:bg-zinc-900 transition-all">
                      Đăng nhập
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer - Minimal */}
      <footer className="bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-800 py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-10">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                <GraduationCap className="h-5 w-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-zinc-900 dark:text-zinc-50">
                IELTS Mastery
              </span>
            </div>
            <nav className="flex gap-10 text-[14px] font-bold text-zinc-400 dark:text-zinc-500">
              <a href="#" className="hover:text-blue-600 dark:hover:text-zinc-300 transition-colors">Điều khoản</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-zinc-300 transition-colors">Bảo mật</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-zinc-300 transition-colors">Liên hệ</a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-zinc-300 transition-colors">Blog</a>
            </nav>
            <p className="text-[14px] font-medium text-zinc-400 dark:text-zinc-500">
              © 2026 IELTS Mastery Platform.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
