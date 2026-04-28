"use client";

import React, { useState } from "react";
import { 
  Search, 
  Filter, 
  Plus, 
  Headphones, 
  BookOpen, 
  PenTool, 
  Mic2, 
  MoreVertical,
  Eye,
  Trash2,
  Clock
} from "lucide-react";
import { 
  Card, 
  CardContent, 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";

import { createTestFromAI, scrapeTestFromUrl } from "@/lib/actions/admin-actions";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tests = [
  { id: "1", title: "Cambridge IELTS 18 - Test 1", type: "listening", difficulty: "medium", submissions: 1240, created: "22/04/2026", status: "published" },
  { id: "2", title: "Academic Reading Practice - Environment", type: "reading", difficulty: "hard", submissions: 856, created: "20/04/2026", status: "published" },
  { id: "3", title: "Writing Task 2: Artificial Intelligence", type: "writing", difficulty: "medium", submissions: 2105, created: "18/04/2026", status: "published" },
  { id: "4", title: "Speaking Mock Test - Part 1 & 2", type: "speaking", difficulty: "easy", submissions: 542, created: "15/04/2026", status: "draft" },
];

const typeIcons: Record<string, any> = {
  listening: Headphones,
  reading: BookOpen,
  writing: PenTool,
  speaking: Mic2,
};

export default function AdminTestsClient() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState("");
  const [url, setUrl] = useState("");

  const handleGenerate = async (type: "reading" | "writing") => {
    if (!topic) return alert("Vui lòng nhập chủ đề!");
    setIsGenerating(true);
    try {
      const res = await createTestFromAI(type, topic);
      if (res.success) {
        alert("Đã tạo đề thi thành công!");
        setTopic("");
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleScrape = async (type: "reading" | "writing") => {
    if (!url) return alert("Vui lòng dán URL!");
    setIsGenerating(true);
    try {
      const res = await scrapeTestFromUrl(type, url);
      if (res.success) {
        alert("Đã bóc tách đề thi thành công!");
        setUrl("");
      }
    } catch (err: any) {
      alert("Lỗi: " + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-zinc-900 dark:text-white tracking-tight">Quản lý Kho đề thi</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mt-1 font-medium">Tạo mới và quản lý các bài test Listening, Reading, Writing, Speaking.</p>
        </div>
        
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="rounded-xl border-indigo-500 text-indigo-600 font-bold hover:bg-indigo-50">
                <Plus className="mr-2 h-4 w-4" /> Smart Ingestion
              </Button>
            </DialogTrigger>
            <DialogContent className="rounded-3xl border-none shadow-2xl max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">⚡ Smart Content Ingestion</DialogTitle>
              </DialogHeader>
              
              <Tabs defaultValue="ai" className="w-full">
                <TabsList className="grid w-full grid-cols-2 rounded-xl h-12 bg-zinc-100 p-1">
                  <TabsTrigger value="ai" className="rounded-lg font-bold">AI Generate</TabsTrigger>
                  <TabsTrigger value="scrape" className="rounded-lg font-bold">Scrape URL</TabsTrigger>
                </TabsList>

                <TabsContent value="ai" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Chủ đề đề thi</p>
                    <Input 
                      placeholder="Ví dụ: Climate Change, Space Exploration..." 
                      className="h-12 rounded-xl"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      disabled={isGenerating}
                      onClick={() => handleGenerate("reading")}
                      className="rounded-xl bg-indigo-600 font-bold h-12"
                    >
                      Tạo Reading
                    </Button>
                    <Button 
                      disabled={isGenerating}
                      onClick={() => handleGenerate("writing")}
                      className="rounded-xl bg-amber-600 font-bold h-12"
                    >
                      Tạo Writing
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="scrape" className="space-y-4 py-4">
                  <div className="space-y-2">
                    <p className="text-sm font-bold text-zinc-500 uppercase tracking-widest">URL Đề thi</p>
                    <Input 
                      placeholder="https://example-ielts.com/test-1" 
                      className="h-12 rounded-xl"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <Button 
                      disabled={isGenerating}
                      onClick={() => handleScrape("reading")}
                      className="rounded-xl bg-indigo-600 font-bold h-12"
                    >
                      Scrape Reading
                    </Button>
                    <Button 
                      disabled={isGenerating}
                      onClick={() => handleScrape("writing")}
                      className="rounded-xl bg-amber-600 font-bold h-12"
                    >
                      Scrape Writing
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              {isGenerating && (
                <p className="text-center text-xs font-bold text-indigo-500 animate-pulse pb-4">
                  Hệ thống đang xử lý dữ liệu... (Vui lòng đợi giây lát)
                </p>
              )}
            </DialogContent>
          </Dialog>

          <Button className="rounded-xl bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold">
            Thêm đề thi mới
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(typeIcons).map(([type, Icon]) => (
          <Card key={type} className="border-none shadow-md shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900 hover:ring-2 ring-indigo-500/20 transition-all cursor-pointer">
            <CardContent className="pt-6 text-center">
              <div className="h-12 w-12 rounded-2xl bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mx-auto mb-3">
                <Icon className="h-6 w-6 text-zinc-600 dark:text-zinc-300" />
              </div>
              <p className="font-black text-zinc-900 dark:text-zinc-100 capitalize">{type}</p>
              <p className="text-xs text-zinc-500 font-bold">128 bài test</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tests.map((test) => {
          const Icon = typeIcons[test.type];
          return (
            <Card key={test.id} className="border-none shadow-xl shadow-zinc-200/50 dark:shadow-none bg-white dark:bg-zinc-900 overflow-hidden group">
              <CardContent className="p-0">
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <div>
                        <Badge variant="outline" className="mb-1 text-[10px] font-black uppercase tracking-widest border-zinc-200 dark:border-zinc-800 text-zinc-500">{test.type}</Badge>
                        <h4 className="font-black text-lg text-zinc-900 dark:text-white leading-tight">{test.title}</h4>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Độ khó</p>
                      <p className="text-xs font-black text-zinc-900 dark:text-zinc-100 capitalize">{test.difficulty}</p>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Lượt thi</p>
                      <p className="text-xs font-black text-zinc-900 dark:text-zinc-100">{test.submissions}</p>
                    </div>
                    <div className="text-center p-3 rounded-2xl bg-zinc-50 dark:bg-zinc-800/50">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">Trạng thái</p>
                      <Badge className={test.status === "published" ? "bg-emerald-500/10 text-emerald-600 border-none h-5" : "bg-zinc-500/10 text-zinc-500 border-none h-5"}>{test.status}</Badge>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-bold"><Clock className="h-3.5 w-3.5" /> Ngày tạo: {test.created}</div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="h-9 rounded-xl font-bold border-zinc-200 dark:border-zinc-800"><Eye className="h-4 w-4 mr-2" /> Xem đề</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
