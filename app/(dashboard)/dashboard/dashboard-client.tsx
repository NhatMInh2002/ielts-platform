"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Zap, 
  Target, 
  Flame, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic2, 
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Trophy
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DashboardClientProps {
  profile: any;
  recentSubmissions: any[];
  modulesProgress: any;
}

export default function DashboardClient({ profile, recentSubmissions, modulesProgress }: DashboardClientProps) {
  // Biến thể hoạt ảnh
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const modules = [
    { id: "listening", name: "Listening", icon: Headphones, color: "text-blue-500", bg: "bg-blue-500/10", progress: modulesProgress.listening },
    { id: "reading", name: "Reading", icon: BookOpen, color: "text-emerald-500", bg: "bg-emerald-500/10", progress: modulesProgress.reading },
    { id: "writing", name: "Writing", icon: PenTool, color: "text-amber-500", bg: "bg-amber-500/10", progress: modulesProgress.writing },
    { id: "speaking", name: "Speaking", icon: Mic2, color: "text-rose-500", bg: "bg-rose-500/10", progress: modulesProgress.speaking },
  ];

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8 pb-12"
    >
      {/* Header Chào mừng */}
      <motion.div variants={item} className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-zinc-900 dark:text-white tracking-tight">
            Chào mừng trở lại, {profile?.full_name?.split(' ')[0] || "Học viên"}! 👋
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2 font-medium">
            Hôm nay là một ngày tuyệt vời để nâng band điểm của bạn.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-zinc-900 p-2 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Flame className="h-5 w-5 text-amber-500 fill-current" />
          </div>
          <div className="pr-4">
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Streak hiện tại</p>
            <p className="text-sm font-black text-zinc-900 dark:text-white">7 Ngày liên tiếp</p>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div variants={item}>
          <Card className="border-none bg-gradient-to-br from-indigo-600 to-violet-700 shadow-xl shadow-indigo-500/20 text-white overflow-hidden relative group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Zap className="h-24 w-24 fill-current" />
            </div>
            <CardContent className="p-6 relative z-10">
              <p className="text-indigo-100 font-bold text-xs uppercase tracking-widest mb-1">AI Tokens</p>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-black">{profile?.ai_tokens || 0}</span>
                <Zap className="h-5 w-5 text-amber-300 fill-current" />
              </div>
              <p className="mt-4 text-sm font-medium text-indigo-100 leading-relaxed">
                Bạn có đủ token để chấm 12 bài Writing chi tiết.
              </p>
              <Button className="mt-6 w-full bg-white/20 hover:bg-white/30 text-white border-none rounded-xl font-bold backdrop-blur-md">
                Nạp thêm Tokens
              </Button>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <Target className="h-5 w-5 text-emerald-500" />
                </div>
                <Badge className="bg-emerald-500/10 text-emerald-600 border-none">On Track</Badge>
              </div>
              <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-1">Mục tiêu hiện tại</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-zinc-900 dark:text-white">Band {profile?.target_score || "7.5"}</span>
                <span className="text-zinc-400 font-bold text-xs">/ 9.0</span>
              </div>
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xs font-bold text-zinc-500">Tiến độ tổng thể</p>
                  <p className="text-xs font-black text-emerald-600">65%</p>
                </div>
                <div className="h-2 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: "65%" }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="h-full bg-emerald-500 rounded-full" 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border-none bg-white dark:bg-zinc-900 shadow-lg shadow-zinc-200/50 dark:shadow-none border border-zinc-100 dark:border-zinc-800">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-indigo-500" />
                </div>
              </div>
              <p className="text-zinc-400 font-bold text-xs uppercase tracking-widest mb-1">Xếp hạng tuần</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-zinc-900 dark:text-white">Top 5%</span>
              </div>
              <p className="mt-4 text-sm font-medium text-zinc-500 leading-relaxed">
                Bạn đã vượt qua 856 học viên khác trong tuần này!
              </p>
              <Button variant="outline" className="mt-6 w-full border-zinc-200 dark:border-zinc-800 rounded-xl font-bold">
                Xem Bảng xếp hạng
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Module Progress Section */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div variants={item} className="flex items-center justify-between">
            <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Kỹ năng mục tiêu</h3>
            <Button variant="link" className="text-indigo-600 dark:text-indigo-400 font-bold h-auto p-0">Xem lộ trình</Button>
          </motion.div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {modules.map((mod) => (
              <motion.div key={mod.id} variants={item}>
                <Card className="border-none bg-white dark:bg-zinc-900 shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`h-12 w-12 rounded-2xl ${mod.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <mod.icon className={`h-6 w-6 ${mod.color}`} />
                      </div>
                      <ArrowUpRight className="h-5 w-5 text-zinc-300 group-hover:text-indigo-500 transition-colors" />
                    </div>
                    <h4 className="font-black text-zinc-900 dark:text-white mb-4">{mod.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Tiến độ</p>
                        <p className={`text-[10px] font-black ${mod.color}`}>{mod.progress}%</p>
                      </div>
                      <div className="h-1.5 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${mod.progress}%` }}
                          transition={{ duration: 1, delay: 0.8 }}
                          className={`h-full ${mod.color.replace('text', 'bg')} rounded-full`} 
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lịch sử hoạt động Section */}
        <div className="space-y-6">
          <motion.div variants={item}>
            <h3 className="text-xl font-black text-zinc-900 dark:text-white tracking-tight">Hoạt động gần đây</h3>
          </motion.div>
          
          <motion.div variants={item} className="space-y-4">
            {recentSubmissions.length > 0 ? (
              recentSubmissions.map((sub, index) => (
                <div key={sub.id} className="flex gap-4 group cursor-pointer">
                  <div className="relative">
                    <div className="h-10 w-10 rounded-xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center z-10 relative">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                    </div>
                    {index !== recentSubmissions.length - 1 && (
                      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[2px] h-full bg-zinc-100 dark:bg-zinc-800" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className="text-sm font-bold text-zinc-900 dark:text-white group-hover:text-indigo-600 transition-colors">
                      {sub.tests?.title || "Luyện tập"}
                    </p>
                    <p className="text-xs text-zinc-500 font-medium mt-0.5">
                      {sub.tests?.category?.toUpperCase()} • Band {sub.score || "N/A"}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Clock className="h-3 w-3 text-zinc-400" />
                      <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                        {new Date(sub.created_at).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 px-4 bg-zinc-50 dark:bg-zinc-800/50 rounded-3xl border-2 border-dashed border-zinc-200 dark:border-zinc-800">
                <p className="text-sm font-bold text-zinc-500">Chưa có hoạt động nào.</p>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">Hãy bắt đầu luyện tập để thấy sự tiến bộ của bạn!</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
