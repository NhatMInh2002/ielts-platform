"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  Clock, 
  Send, 
  ChevronLeft, 
  Settings, 
  Monitor,
  BookOpen,
  Info,
  CheckCircle2,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import { submitWritingTest } from "@/lib/actions/writing-actions";

interface WritingTestClientProps {
  test: any;
}

export default function WritingTestClient({ test }: WritingTestClientProps) {
  const router = useRouter();
  const [content, setContent] = useState("");
  const [timeLeft, setTimeLeft] = useState(test.time_limit * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);
  const [submissionId, setSubmissionId] = useState("");

  // Tính số lượng từ
  useEffect(() => {
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    setWordCount(words);
  }, [content]);

  // Bộ đếm ngược thời gian
  useEffect(() => {
    if (timeLeft <= 0 || isFinished) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isFinished]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async () => {
    if (wordCount < 100) {
      alert("Bài viết quá ngắn. Bạn cần viết ít nhất 100 từ để được chấm điểm IELTS chính xác.");
      return;
    }

    if (!confirm("Bạn có chắc chắn muốn nộp bài? 1 AI Token sẽ được trừ vào tài khoản của bạn.")) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await submitWritingTest(test.id, content);
      if (response.success) {
        setAiResult(response.result);
        setSubmissionId(response.submissionId);
        setIsFinished(true);
      }
    } catch (error: any) {
      alert(error.message || "Đã xảy ra lỗi khi chấm điểm. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#F8F9FB] dark:bg-zinc-950 overflow-hidden font-sans">
      {/* Test Header */}
      <header className="h-16 border-b bg-white dark:bg-zinc-900 px-6 flex items-center justify-between z-20 shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => router.back()}
            className="rounded-xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-black text-sm md:text-base text-zinc-900 dark:text-white truncate max-w-[200px] md:max-w-md">
              {test.title}
            </h1>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none">
              {test.type} • Writing Section
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 md:gap-6">
          <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${timeLeft < 300 ? 'bg-rose-50 border-rose-200 text-rose-600 animate-pulse' : 'bg-zinc-50 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300'}`}>
            <Clock className="h-4 w-4" />
            <span className="font-black tabular-nums">{formatTime(timeLeft)}</span>
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting || isFinished}
            className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 rounded-xl px-6 font-black hover:scale-105 transition-transform"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4 mr-2" /> Nộp bài</>}
          </Button>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Question Area */}
        <div className="w-1/2 border-r bg-white dark:bg-zinc-900/50 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-2xl mx-auto">
            <div className="flex items-center gap-2 mb-6">
              <div className="h-8 w-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
                <BookOpen className="h-4 w-4" />
              </div>
              <h2 className="font-black text-lg text-zinc-900 dark:text-white">Đề bài</h2>
            </div>
            
            <div className="prose dark:prose-invert max-w-none">
              <div className="bg-zinc-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-zinc-100 dark:border-zinc-800 leading-relaxed text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap font-medium">
                {test.content}
              </div>
            </div>

            <div className="mt-8 p-6 rounded-2xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20">
              <div className="flex gap-3">
                <Info className="h-5 w-5 text-amber-600 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-amber-800 dark:text-amber-500 text-sm mb-1">Hướng dẫn làm bài</h4>
                  <p className="text-xs text-amber-700/80 dark:text-amber-400/80 leading-relaxed font-medium">
                    Hãy đảm bảo bạn viết đúng yêu cầu đề bài. Với Task 2, bạn nên dành ít nhất 40 phút và viết khoảng 250 từ. Hệ thống sẽ tự động lưu bài mỗi 30 giây.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Editor Area */}
        <div className="w-1/2 flex flex-col bg-white dark:bg-zinc-900">
          <div className="h-12 border-b px-6 flex items-center justify-between text-zinc-400 text-xs font-bold bg-zinc-50/50 dark:bg-zinc-800/50">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5"><Monitor className="h-3.5 w-3.5" /> Chế độ thi máy</span>
              <span className="flex items-center gap-1.5"><PenTool className="h-3.5 w-3.5" /> Writing Editor v1.0</span>
            </div>
            <div className="flex items-center gap-2">
              <span className={wordCount < 250 ? 'text-amber-500' : 'text-emerald-500'}>
                Số từ: <span className="font-black">{wordCount}</span>
              </span>
            </div>
          </div>
          
          <div className="flex-1 p-8 relative">
            <Textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Bắt đầu viết bài của bạn tại đây..."
              className="w-full h-full resize-none border-none focus-visible:ring-0 text-lg leading-loose font-medium text-zinc-700 dark:text-zinc-200 bg-transparent p-0 placeholder:text-zinc-300 dark:placeholder:text-zinc-700"
              spellCheck={false}
              disabled={isFinished}
            />
            
            <AnimatePresence>
              {isSubmitting && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="relative mb-8">
                    <Loader2 className="h-16 w-16 text-indigo-600 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-indigo-400" />
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">AI đang chấm bài của bạn...</h2>
                  <p className="text-zinc-500 font-medium max-w-sm">
                    Chúng tôi đang phân tích ngữ pháp, từ vựng và sự mạch lạc của bài viết. Quá trình này thường mất khoảng 10-15 giây.
                  </p>
                </motion.div>
              )}

              {isFinished && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 bg-white dark:bg-zinc-950 z-40 flex flex-col items-center justify-center text-center p-12"
                >
                  <div className="h-20 w-20 rounded-3xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-8">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <h2 className="text-3xl font-black text-zinc-900 dark:text-white mb-2">Nộp bài thành công!</h2>
                  <div className="bg-indigo-600 text-white px-4 py-1 rounded-full text-sm font-black mb-4">
                    Band điểm dự kiến: {aiResult?.overall_band || "N/A"}
                  </div>
                  <p className="text-zinc-500 font-medium max-w-sm mb-8">
                    AI đã chấm bài xong. Bạn có muốn xem lại nhận xét chi tiết về Ngữ pháp, Từ vựng và mạch lạc ngay bây giờ?
                  </p>
                  <div className="flex gap-4">
                    <Button 
                      onClick={() => router.push(`/writing/results/${submissionId}`)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-8 font-black h-12 shadow-lg shadow-indigo-500/20"
                    >
                      Xem kết quả AI
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => router.push('/dashboard')}
                      className="border-zinc-200 dark:border-zinc-800 rounded-xl px-8 font-black h-12"
                    >
                      Về Dashboard
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
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
    </div>
  );
}
