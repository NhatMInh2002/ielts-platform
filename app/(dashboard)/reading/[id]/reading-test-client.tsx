"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Timer, Send, BookOpen, HelpCircle, ChevronRight, ChevronLeft } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { submitReadingTest } from "@/lib/actions/reading-actions";

interface ReadingTestClientProps {
  test: any;
}

export default function ReadingTestClient({ test }: ReadingTestClientProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(3600); // 60 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  const questions = test.metadata?.questions || [];

  // Đếm ngược thời gian
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(); // Tự động nộp bài khi hết giờ
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (qId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    
    const confirmSubmit = timeLeft > 0 ? confirm("Bạn có chắc chắn muốn nộp bài?") : true;
    if (!confirmSubmit) return;

    setIsSubmitting(true);
    try {
      await submitReadingTest(test.id, answers);
    } catch (err: any) {
      alert("Lỗi khi nộp bài: " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b bg-white dark:bg-zinc-900 flex items-center justify-between px-6 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <BookOpen className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight">{test.title}</h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">IELTS Reading Practice</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl font-mono font-bold text-lg border-2",
            timeLeft < 300 ? "border-red-500 text-red-500 animate-pulse" : "border-zinc-100 dark:border-zinc-800"
          )}>
            <Timer className="h-5 w-5" />
            {formatTime(timeLeft)}
          </div>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold px-6 h-11"
          >
            <Send className="mr-2 h-4 w-4" /> Nộp bài
          </Button>
        </div>
      </header>

      {/* Main Content: Split Screen */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left: Passage Content */}
        <section className="w-1/2 overflow-y-auto p-8 border-r bg-white dark:bg-zinc-900 scroll-smooth">
          <div className="max-w-2xl mx-auto">
            <div className="prose prose-zinc dark:prose-invert lg:prose-lg max-w-none">
              <div 
                className="reading-passage text-zinc-800 dark:text-zinc-200 leading-relaxed space-y-6"
                dangerouslySetInnerHTML={{ __html: test.content }}
              />
            </div>
          </div>
        </section>

        {/* Right: Questions */}
        <section className="w-1/2 overflow-y-auto p-8 bg-zinc-50 dark:bg-zinc-950">
          <div className="max-w-xl mx-auto space-y-8">
            <div className="flex items-center gap-2 mb-6">
              <HelpCircle className="text-indigo-600 h-6 w-6" />
              <h2 className="text-xl font-black">Questions & Answers</h2>
            </div>

            {questions.map((q: any, index: number) => (
              <Card key={q.id} className="p-6 rounded-3xl border-none shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 flex items-center justify-center font-black text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-6">
                    <p className="text-lg font-bold leading-snug">{q.text}</p>
                    
                    {q.type === "multiple_choice" && q.options && (
                      <RadioGroup 
                        onValueChange={(val) => handleAnswerChange(q.id, val)}
                        className="grid grid-cols-1 gap-3"
                      >
                        {q.options.map((option: string) => (
                          <div key={option} className="flex items-center">
                            <RadioGroupItem value={option} id={`q-${q.id}-${option}`} className="sr-only" />
                            <Label 
                              htmlFor={`q-${q.id}-${option}`}
                              className={cn(
                                "flex-1 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all font-medium",
                                answers[q.id] === option 
                                  ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400" 
                                  : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600"
                              )}
                            >
                              <span className="mr-3 font-black opacity-50">{option.split(".")[0]}</span>
                              {option}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}

                    {q.type === "true_false" && (
                      <RadioGroup 
                        onValueChange={(val) => handleAnswerChange(q.id, val)}
                        className="flex gap-3"
                      >
                        {["TRUE", "FALSE", "NOT GIVEN"].map((val) => (
                          <div key={val} className="flex-1">
                            <RadioGroupItem value={val} id={`q-${q.id}-${val}`} className="sr-only" />
                            <Label 
                              htmlFor={`q-${q.id}-${val}`}
                              className={cn(
                                "flex justify-center px-4 py-3 rounded-xl border-2 cursor-pointer transition-all font-bold text-sm",
                                answers[q.id] === val 
                                  ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-950/30 text-indigo-700 dark:text-indigo-400" 
                                  : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200"
                              )}
                            >
                              {val}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            <div className="pt-8 flex justify-between items-center">
              <p className="text-sm font-bold text-zinc-500">
                Đã hoàn thành {Object.keys(answers).length}/{questions.length} câu hỏi
              </p>
              <Button 
                onClick={handleSubmit}
                className="rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold h-12 px-8"
              >
                Kết thúc & Nộp bài
              </Button>
            </div>
          </div>
        </section>
      </main>

    </div>
  );
}
