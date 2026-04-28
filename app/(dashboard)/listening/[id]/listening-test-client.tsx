"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Timer, Send, Headphones, Play, Pause, Volume2, HelpCircle } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { submitReadingTest } from "@/lib/actions/reading-actions"; // Tái sử dụng logic chấm điểm tự động

interface ListeningTestClientProps {
  test: any;
}

export default function ListeningTestClient({ test }: ListeningTestClientProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes for listening
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const questions = test.metadata?.questions || [];
  const audioUrl = test.metadata?.audio_url || "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit();
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  // Điều khiển âm thanh
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    
    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateDuration);
    
    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateDuration);
    };
  }, []);

  const togglePlay = () => {
    if (isPlaying) audioRef.current?.pause();
    else audioRef.current?.play();
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAnswerChange = (qId: number, value: string) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const handleSubmit = async () => {
    if (isSubmitting) return;
    const confirmSubmit = timeLeft > 0 ? confirm("Bạn có chắc chắn muốn nộp bài Listening?") : true;
    if (!confirmSubmit) return;

    setIsSubmitting(true);
    try {
      await submitReadingTest(test.id, answers); // Reading và Listening dùng chung logic chấm điểm đáp án
    } catch (err: any) {
      alert("Lỗi khi nộp bài: " + err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Top Header */}
      <header className="h-16 border-b bg-white dark:bg-zinc-900 flex items-center justify-between px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Headphones className="text-white h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-tight">{test.title}</h1>
            <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">IELTS Listening Practice</p>
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
            className="rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold px-6 h-11"
          >
            <Send className="mr-2 h-4 w-4" /> Nộp bài
          </Button>
        </div>
      </header>

      {/* Audio Player Bar */}
      <div className="h-20 bg-white dark:bg-zinc-900 border-b flex items-center px-8 gap-6 shrink-0 shadow-sm z-10">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={togglePlay}
          className="h-12 w-12 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 hover:scale-105 transition-transform shrink-0"
        >
          {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 fill-current ml-1" />}
        </Button>

        <div className="flex-1 space-y-1">
          <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-widest">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
          <Slider 
            value={[currentTime]} 
            max={duration || 100} 
            step={0.1}
            onValueChange={handleSeek}
            className="cursor-pointer"
          />
        </div>

        <div className="flex items-center gap-3 w-32">
          <Volume2 className="h-5 w-5 text-zinc-400" />
          <Slider defaultValue={[80]} max={100} step={1} />
        </div>

        <audio ref={audioRef} src={audioUrl} onEnded={() => setIsPlaying(false)} />
      </div>

      {/* Main Content: Questions Only */}
      <main className="flex-1 overflow-y-auto p-8 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-3xl mx-auto space-y-10">
          <div className="flex items-center gap-2 mb-2">
            <HelpCircle className="text-amber-500 h-6 w-6" />
            <h2 className="text-2xl font-black">Examination Questions</h2>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {questions.map((q: any, index: number) => (
              <Card key={q.id} className="p-8 rounded-3xl border-none shadow-sm hover:shadow-md transition-all">
                <div className="flex gap-6">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center font-black text-xl text-zinc-900 dark:text-white">
                    {index + 1}
                  </div>
                  <div className="flex-1 space-y-6">
                    <p className="text-xl font-bold leading-tight">{q.text}</p>
                    
                    <RadioGroup 
                      onValueChange={(val) => handleAnswerChange(q.id, val)}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {q.options?.map((option: string) => (
                        <div key={option} className="flex items-center">
                          <RadioGroupItem value={option} id={`q-${q.id}-${option}`} className="sr-only" />
                          <Label 
                            htmlFor={`q-${q.id}-${option}`}
                            className={cn(
                              "flex-1 px-5 py-4 rounded-2xl border-2 cursor-pointer transition-all font-semibold text-base",
                              answers[q.id] === option 
                                ? "border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400" 
                                : "border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700"
                            )}
                          >
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="py-12 border-t flex flex-col items-center gap-4">
            <p className="text-zinc-500 font-bold">Bạn đã trả lời {Object.keys(answers).length}/{questions.length} câu hỏi</p>
            <Button 
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black h-14 px-12 text-lg shadow-xl shadow-amber-500/20"
            >
              Kết thúc bài thi Nghe
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
