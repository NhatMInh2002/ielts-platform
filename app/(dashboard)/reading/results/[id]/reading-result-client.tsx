"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Info, ChevronLeft, LayoutDashboard, BookOpen } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface ReadingResultClientProps {
  submission: any;
}

export default function ReadingResultClient({ submission }: ReadingResultClientProps) {
  const { test, score, feedback } = submission;
  const { correct_count, total_questions, detailed_results } = feedback;

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pb-20">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="rounded-xl">
                <ChevronLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-black">{test.title}</h1>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Reading Result Analysis</p>
            </div>
          </div>
          <Link href="/dashboard">
            <Button className="rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold">
              <LayoutDashboard className="mr-2 h-4 w-4" /> Về Dashboard
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">
        {/* Score Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-8 rounded-3xl border-none shadow-xl bg-indigo-600 text-white flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Estimated Band</p>
            <h2 className="text-7xl font-black mb-2">{score.toFixed(1)}</h2>
            <p className="font-medium text-indigo-100">IELTS Reading Academic</p>
          </Card>

          <Card className="p-8 rounded-3xl border-none shadow-xl bg-white dark:bg-zinc-900 flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest mb-2">Accuracy</p>
            <h2 className="text-5xl font-black text-zinc-900 dark:text-white mb-2">
              {correct_count}<span className="text-zinc-300 dark:text-zinc-700 mx-2">/</span>{total_questions}
            </h2>
            <p className="text-zinc-500 font-medium">Correct Answers</p>
          </Card>

          <Card className="p-8 rounded-3xl border-none shadow-xl bg-emerald-500 text-white flex flex-col items-center justify-center text-center">
            <p className="text-sm font-bold uppercase tracking-widest opacity-80 mb-2">Completion</p>
            <h2 className="text-5xl font-black mb-2">100%</h2>
            <p className="font-medium opacity-90">Finished on time</p>
          </Card>
        </div>

        {/* Detailed Feedback */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <BookOpen className="text-indigo-600 h-6 w-6" />
            <h3 className="text-2xl font-black">Detailed Analysis</h3>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {detailed_results.map((res: any, index: number) => (
              <Card key={index} className="p-6 rounded-2xl border-none shadow-sm overflow-hidden relative">
                <div className={cn(
                  "absolute left-0 top-0 bottom-0 w-2",
                  res.is_correct ? "bg-emerald-500" : "bg-red-500"
                )} />
                
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-black",
                    res.is_correct ? "bg-emerald-500" : "bg-red-500"
                  )}>
                    {index + 1}
                  </div>
                  
                  <div className="flex-1 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className={cn(
                        "text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full",
                        res.is_correct ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
                      )}>
                        {res.is_correct ? "Correct" : "Incorrect"}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-zinc-400 uppercase">Your Answer</p>
                        <p className={cn(
                          "text-lg font-black",
                          res.is_correct ? "text-emerald-600" : "text-red-600"
                        )}>
                          {res.student_answer || "No answer"}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-zinc-400 uppercase">Correct Answer</p>
                        <p className="text-lg font-black text-zinc-900 dark:text-white">
                          {res.correct_answer}
                        </p>
                      </div>
                    </div>

                    {res.explanation && (
                      <div className="mt-4 p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2 mb-2">
                          <Info className="h-4 w-4 text-indigo-500" />
                          <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Explanation</p>
                        </div>
                        <p className="text-zinc-600 dark:text-zinc-300 text-sm leading-relaxed font-medium">
                          {res.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
