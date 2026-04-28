"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Trophy, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ArrowRight,
  MessageSquare,
  BookOpen,
  History,
  FileText
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

interface WritingResultClientProps {
  submission: any;
}

export default function WritingResultClient({ submission }: WritingResultClientProps) {
  const router = useRouter();
  const result = submission.feedback; // Dữ liệu JSON từ Gemini

  const criteriaMap: Record<string, string> = {
    TR: "Task Response",
    CC: "Coherence & Cohesion",
    LR: "Lexical Resource",
    GRA: "Grammar Range & Accuracy"
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return "text-emerald-500 bg-emerald-500/10";
    if (score >= 6) return "text-indigo-500 bg-indigo-500/10";
    if (score >= 5) return "text-amber-500 bg-amber-500/10";
    return "text-rose-500 bg-rose-500/10";
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/writing')}
          className="rounded-xl font-bold gap-2 text-zinc-500"
        >
          <ChevronLeft className="h-4 w-4" /> Quay lại danh sách
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-xl border-zinc-200 dark:border-zinc-800 font-bold">
            <History className="h-4 w-4 mr-2" /> Lịch sử
          </Button>
          <Button className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl font-black">
            Làm bài mới
          </Button>
        </div>
      </div>

      {/* Hero Section: Overall Score */}
      <motion.div variants={item} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-1 border-none bg-indigo-600 shadow-2xl shadow-indigo-500/20 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Trophy className="h-40 w-40" />
          </div>
          <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
            <Badge className="bg-white/20 text-white border-none mb-6 px-4 py-1 rounded-full font-bold">
              KẾT QUẢ TỔNG QUAN
            </Badge>
            <div className="relative mb-6">
              <div className="h-32 w-32 rounded-full border-4 border-white/20 flex items-center justify-center">
                <span className="text-6xl font-black">{submission.score || "N/A"}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 h-10 w-10 bg-amber-400 rounded-full flex items-center justify-center shadow-lg">
                <Trophy className="h-5 w-5 text-amber-900 fill-current" />
              </div>
            </div>
            <h3 className="text-xl font-black mb-2">Tuyệt vời!</h3>
            <p className="text-indigo-100 text-sm font-medium leading-relaxed">
              Bạn đang tiến gần hơn tới mục tiêu Band {submission.tests?.target_score || "7.5"}. Hãy xem chi tiết các tiêu chí bên dưới.
            </p>
          </CardContent>
        </Card>

        {/* Criteria Breakdown */}
        <Card className="lg:col-span-2 border-none bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none p-8">
          <CardHeader className="p-0 mb-6">
            <CardTitle className="text-xl font-black text-zinc-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              Phân tích tiêu chí chấm điểm
            </CardTitle>
          </CardHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {Object.entries(result.criteria).map(([key, data]: [string, any]) => (
              <div key={key} className="space-y-3">
                <div className="flex justify-between items-end">
                  <p className="text-sm font-black text-zinc-600 dark:text-zinc-400">{criteriaMap[key]}</p>
                  <span className={`text-xs font-black px-2 py-0.5 rounded-md ${getScoreColor(data.score)}`}>
                    Band {data.score}
                  </span>
                </div>
                <Progress value={data.score * 11.11} className="h-2 bg-zinc-100 dark:bg-zinc-800" />
                <p className="text-xs text-zinc-500 leading-relaxed font-medium italic">
                  "{data.feedback}"
                </p>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Detailed Feedback & Corrections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* General Comments */}
          <motion.div variants={item}>
            <Card className="border-none bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none">
              <CardHeader>
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-indigo-500" /> Nhận xét tổng quát
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="p-6 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 leading-loose text-zinc-700 dark:text-zinc-300 font-medium">
                  {result.general_comment}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Corrections List */}
          <motion.div variants={item}>
            <Card className="border-none bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none overflow-hidden">
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-800/50">
                <CardTitle className="text-xl font-black flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-rose-500" /> Phân tích lỗi sai & Gợi ý sửa bài
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {result.detailed_feedback.map((error: any, idx: number) => (
                    <div key={idx} className="p-6 hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors">
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="outline" className="bg-rose-500/5 text-rose-500 border-rose-500/20 font-bold uppercase text-[10px]">
                          {error.type}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Bản gốc</p>
                          <p className="text-sm line-through text-zinc-400 italic bg-zinc-50 dark:bg-zinc-800 p-3 rounded-xl border border-zinc-100 dark:border-zinc-700">
                            "{error.original_text}"
                          </p>
                        </div>
                        <div className="space-y-2">
                          <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">AI Gợi ý</p>
                          <p className="text-sm font-bold text-zinc-900 dark:text-white bg-emerald-500/5 p-3 rounded-xl border border-emerald-500/20">
                            "{error.correction}"
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-start gap-2 bg-indigo-50/50 dark:bg-indigo-500/5 p-3 rounded-xl">
                        <BookOpen className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed font-medium">
                          {error.explanation}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Original Essay Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div variants={item}>
            <Card className="border-none bg-white dark:bg-zinc-900 shadow-xl shadow-zinc-200/50 dark:shadow-none sticky top-24">
              <CardHeader className="border-b border-zinc-100 dark:border-zinc-800">
                <CardTitle className="text-lg font-black flex items-center gap-2">
                  <FileText className="h-5 w-5 text-zinc-400" /> Bài làm của bạn
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="text-xs text-zinc-500 mb-4 font-bold flex justify-between">
                  <span>Số lượng từ: {result.estimated_word_count} words</span>
                  <span>{new Date(submission.created_at).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="prose prose-sm dark:prose-invert max-w-none text-zinc-600 dark:text-zinc-400 leading-loose whitespace-pre-wrap font-medium h-[400px] overflow-y-auto pr-4 custom-scrollbar">
                  {submission.content}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #E4E4E7;
          border-radius: 10px;
        }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #27272A;
        }
      `}</style>
    </motion.div>
  );
}
