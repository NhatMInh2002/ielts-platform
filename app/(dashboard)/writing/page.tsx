"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  PenTool, 
  Search, 
  Filter, 
  Clock, 
  Users, 
  ChevronRight,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const writingTests = [
  { id: "1", title: "Task 2: Impact of Social Media", type: "Task 2", difficulty: "Medium", time: "40 mins", submissions: 1240, hot: true },
  { id: "2", title: "Task 1: Line Graph - Energy Consumption", type: "Task 1", difficulty: "Hard", time: "20 mins", submissions: 856, hot: false },
  { id: "3", title: "Task 2: Remote Work vs Office Work", type: "Task 2", difficulty: "Easy", time: "40 mins", submissions: 2105, hot: true },
  { id: "4", title: "Task 1: Map - City Development", type: "Task 1", difficulty: "Medium", time: "20 mins", submissions: 542, hot: false },
];

export default function WritingListPage() {
  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Badge className="mb-4 bg-indigo-500/10 text-indigo-600 border-none px-3 py-1 rounded-full font-bold">
            <PenTool className="h-3 w-3 mr-2" /> IELTS Writing
          </Badge>
          <h2 className="text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-none mb-4">
            Luyện tập Viết cùng AI
          </h2>
          <p className="text-zinc-500 dark:text-zinc-400 font-medium text-lg leading-relaxed">
            Chọn một chủ đề và bắt đầu viết bài. Hệ thống AI của chúng tôi sẽ chấm điểm và nhận xét chi tiết từng câu cho bạn.
          </p>
        </div>
        
        <div className="flex gap-3">
          <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-amber-500 fill-current" />
            <div>
              <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">Tính năng Premium</p>
              <p className="text-sm font-black text-zinc-900 dark:text-white">AI Feedback Chi Tiết</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
          <Input 
            placeholder="Tìm kiếm chủ đề bài viết..." 
            className="pl-12 h-14 rounded-2xl bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 shadow-sm text-base font-medium"
          />
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-14 px-6 rounded-2xl border-zinc-200 dark:border-zinc-800 font-bold gap-2">
            <Filter className="h-5 w-5" /> Lọc
          </Button>
          <Button className="h-14 px-8 rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-black hover:scale-105 transition-transform">
            Bắt đầu bài ngẫu nhiên
          </Button>
        </div>
      </div>

      {/* Test Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {writingTests.map((test) => (
          <Link href={`/writing/${test.id}`} key={test.id}>
            <Card className="border-none bg-white dark:bg-zinc-900 shadow-lg hover:shadow-2xl transition-all duration-500 group overflow-hidden border border-transparent hover:border-indigo-500/20 cursor-pointer">
              <CardContent className="p-0">
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <Badge variant="secondary" className="bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 border-none px-3 py-1 rounded-lg font-bold">
                      {test.type}
                    </Badge>
                    {test.hot && (
                      <div className="flex items-center gap-1 text-rose-500 font-black text-[10px] uppercase tracking-widest animate-pulse">
                        <FlameIcon className="h-3 w-3 fill-current" /> Hot Topic
                      </div>
                    )}
                  </div>
                  
                  <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-6 group-hover:text-indigo-600 transition-colors">
                    {test.title}
                  </h3>

                  <div className="grid grid-cols-3 gap-4 mb-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Độ khó</p>
                      <p className="text-sm font-black text-zinc-700 dark:text-zinc-200">{test.difficulty}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Thời gian</p>
                      <p className="text-sm font-black text-zinc-700 dark:text-zinc-200">{test.time}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Đã làm</p>
                      <p className="text-sm font-black text-zinc-700 dark:text-zinc-200">{test.submissions}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-6">
                    <div className="flex items-center gap-2 text-zinc-400 group-hover:text-indigo-500 transition-colors">
                      <Clock className="h-4 w-4" />
                      <span className="text-xs font-bold">Cập nhật 2 ngày trước</span>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-zinc-900 dark:bg-white flex items-center justify-center group-hover:bg-indigo-600 group-hover:scale-110 transition-all duration-300 shadow-xl">
                      <ChevronRight className="h-5 w-5 text-white dark:text-zinc-900 group-hover:text-white" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

function FlameIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
    </svg>
  );
}
