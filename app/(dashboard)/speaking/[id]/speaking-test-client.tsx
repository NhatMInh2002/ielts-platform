"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic2, Square, Play, RefreshCw, Send, Loader2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpeakingTestClientProps {
  test: any;
}

export default function SpeakingTestClient({ test }: SpeakingTestClientProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timer, setTimer] = useState(0);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Quản lý đồng hồ ghi âm
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => setTimer((prev) => prev + 1), 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isRecording]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        setAudioBlob(blob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setTimer(0);
    } catch (err) {
      alert("Không thể truy cập Microphone. Vui lòng kiểm tra quyền trình duyệt.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Dừng các track để tắt đèn báo mic của trình duyệt
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSubmit = async () => {
    if (!audioBlob) return;
    setIsSubmitting(true);
    // Logic gửi file âm thanh lên AI sẽ được triển khai ở bước sau
    setTimeout(() => {
      alert("AI đang phân tích giọng nói của bạn...");
      setIsSubmitting(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex flex-col items-center py-20 px-6">
      <div className="max-w-3xl w-full space-y-12">
        {/* Question Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-bold text-sm uppercase tracking-widest">
            <Sparkles className="h-4 w-4" /> IELTS Speaking Task
          </div>
          <h1 className="text-4xl font-black tracking-tight text-zinc-900 dark:text-white">
            {test.title}
          </h1>
          <p className="text-xl text-zinc-500 font-medium leading-relaxed">
            "{test.content}"
          </p>
        </div>

        {/* Recording Interface */}
        <Card className="p-12 rounded-[3rem] border-none shadow-2xl bg-white dark:bg-zinc-900 flex flex-col items-center gap-10 relative overflow-hidden">
          {/* Animated Background Pulse when recording */}
          {isRecording && (
            <div className="absolute inset-0 bg-red-500/5 animate-pulse pointer-events-none" />
          )}

          <div className="relative">
            <div className={cn(
              "w-32 h-32 rounded-full flex items-center justify-center transition-all duration-500",
              isRecording 
                ? "bg-red-500 scale-110 shadow-[0_0_40px_rgba(239,68,68,0.4)]" 
                : "bg-zinc-100 dark:bg-zinc-800"
            )}>
              {isRecording ? (
                <Square className="text-white h-12 w-12 fill-current" />
              ) : (
                <Mic2 className="text-zinc-400 h-12 w-12" />
              )}
            </div>
            {isRecording && (
              <div className="absolute -inset-4 border-4 border-red-500/20 rounded-full animate-ping" />
            )}
          </div>

          <div className="text-center space-y-2">
            <h2 className="text-5xl font-mono font-black text-zinc-900 dark:text-white">
              {formatTime(timer)}
            </h2>
            <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">
              {isRecording ? "Đang ghi âm..." : "Sẵn sàng để bắt đầu"}
            </p>
          </div>

          <div className="flex gap-4">
            {!isRecording && !audioBlob && (
              <Button 
                onClick={startRecording}
                className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 h-16 px-10 text-lg font-black shadow-xl shadow-indigo-500/20"
              >
                Bắt đầu nói
              </Button>
            )}

            {isRecording && (
              <Button 
                onClick={stopRecording}
                className="rounded-2xl bg-red-600 hover:bg-red-700 h-16 px-10 text-lg font-black shadow-xl shadow-red-500/20"
              >
                Kết thúc ghi âm
              </Button>
            )}

            {audioBlob && !isRecording && (
              <>
                <Button 
                  onClick={startRecording}
                  variant="outline"
                  className="rounded-2xl h-16 px-6 font-bold border-2"
                >
                  <RefreshCw className="mr-2 h-5 w-5" /> Thử lại
                </Button>
                <Button 
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="rounded-2xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 h-16 px-10 text-lg font-black shadow-xl"
                >
                  {isSubmitting ? <Loader2 className="mr-2 h-6 w-6 animate-spin" /> : <Send className="mr-2 h-6 w-6" />}
                  Nộp bài chấm điểm
                </Button>
              </>
            )}
          </div>
        </Card>

        {/* Tips Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900">
            <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-1">💡 Tips</h4>
            <p className="text-sm text-blue-600/80 dark:text-blue-400/60 font-medium">Hãy hít thở sâu và nói thật tự nhiên như đang giao tiếp với giám khảo.</p>
          </div>
          <div className="p-6 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-100 dark:border-purple-900">
            <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-1">⏱ Timing</h4>
            <p className="text-sm text-purple-600/80 dark:text-purple-400/60 font-medium">Đối với Part 2, hãy cố gắng nói liên tục trong khoảng 1:30 đến 2 phút.</p>
          </div>
          <div className="p-6 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900">
            <h4 className="font-bold text-amber-700 dark:text-amber-400 mb-1">🎤 Audio</h4>
            <p className="text-sm text-amber-600/80 dark:text-amber-400/60 font-medium">Đảm bảo môi trường yên tĩnh để AI có thể nhận diện giọng nói chính xác nhất.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
