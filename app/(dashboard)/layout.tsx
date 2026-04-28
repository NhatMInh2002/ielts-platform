"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  LayoutDashboard, 
  BookOpen, 
  PenTool, 
  Mic2, 
  Headphones, 
  TrendingUp, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  User,
  ShieldCheck,
  Zap
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
  { name: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
  { name: "Listening", href: "/listening", icon: Headphones },
  { name: "Reading", href: "/reading", icon: BookOpen },
  { name: "Writing", href: "/writing", icon: PenTool },
  { name: "Speaking", href: "/speaking", icon: Mic2 },
  { name: "Tiến độ", href: "/progress", icon: TrendingUp },
];

const adminItems = [
  { name: "Quản lý bài test", href: "/admin/tests", icon: ShieldCheck },
  { name: "Học viên", href: "/admin/users", icon: User },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Giả lập role admin để hiển thị menu admin (Sau này sẽ lấy từ Supabase)
  const isAdmin = true; 

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 flex transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:block",
          isSidebarOpen ? "w-72" : "w-20",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="h-20 flex items-center px-6 border-b border-zinc-100 dark:border-zinc-800/50">
            <Link href="/" className="flex items-center gap-3 overflow-hidden">
              <div className="h-10 w-10 shrink-0 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                <Zap className="h-6 w-6 text-white fill-current" />
              </div>
              <span className={cn(
                "font-black text-xl tracking-tighter text-zinc-900 dark:text-white transition-opacity duration-300",
                !isSidebarOpen && "opacity-0 w-0"
              )}>
                IELTS MASTER
              </span>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 py-6 px-3 space-y-8 overflow-y-auto custom-scrollbar">
            <div>
              <p className={cn(
                "px-4 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 transition-opacity",
                !isSidebarOpen && "opacity-0"
              )}>
                Học tập
              </p>
              <div className="space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                        isActive 
                          ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold" 
                          : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-indigo-600" : "group-hover:scale-110 transition-transform")} />
                      <span className={cn("text-[15px] whitespace-nowrap transition-opacity duration-300", !isSidebarOpen && "opacity-0 w-0")}>
                        {item.name}
                      </span>
                      {isActive && (
                        <motion.div 
                          layoutId="sidebar-active"
                          className="absolute left-0 w-1 h-6 bg-indigo-600 rounded-r-full"
                        />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>

            {isAdmin && (
              <div>
                <p className={cn(
                  "px-4 text-[11px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-[0.2em] mb-4 transition-opacity",
                  !isSidebarOpen && "opacity-0"
                )}>
                  Quản trị
                </p>
                <div className="space-y-1">
                  {adminItems.map((item) => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group relative",
                          isActive 
                            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold" 
                            : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/50 hover:text-zinc-900 dark:hover:text-zinc-200"
                        )}
                      >
                        <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-emerald-600" : "group-hover:scale-110 transition-transform")} />
                        <span className={cn("text-[15px] whitespace-nowrap transition-opacity duration-300", !isSidebarOpen && "opacity-0 w-0")}>
                          {item.name}
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </nav>

          {/* Bottom Profile Section */}
          <div className="p-4 border-t border-zinc-100 dark:border-zinc-800/50">
            <div className={cn(
              "bg-zinc-50 dark:bg-zinc-800/40 rounded-2xl p-4 flex items-center gap-3 overflow-hidden transition-all duration-300",
              !isSidebarOpen && "p-2 justify-center"
            )}>
              <div className="h-10 w-10 shrink-0 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
                A
              </div>
              <div className={cn("flex-1 min-w-0 transition-opacity duration-300", !isSidebarOpen && "opacity-0 w-0")}>
                <p className="text-[14px] font-bold text-zinc-900 dark:text-zinc-50 truncate">Admin User</p>
                <p className="text-[12px] text-zinc-500 dark:text-zinc-400 truncate">500 tokens</p>
              </div>
              <button className={cn("p-2 hover:bg-white dark:hover:bg-zinc-700 rounded-lg text-zinc-400 dark:text-zinc-500 hover:text-red-500 transition-colors", !isSidebarOpen && "hidden")}>
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Header */}
        <header className="h-20 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between px-6 sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden lg:flex"
            >
              <Menu className="h-5 w-5 text-zinc-500" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-5 w-5 text-zinc-500" />
            </Button>
            <h1 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 hidden sm:block">
              {sidebarItems.find(i => i.href === pathname)?.name || "Dashboard"}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-100 dark:border-indigo-500/20 mr-2">
              <Zap className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-400 fill-current" />
              <span className="text-[13px] font-bold text-indigo-700 dark:text-indigo-400">500 Tokens</span>
            </div>
            <ThemeToggle />
            <div className="h-8 w-[1px] bg-zinc-200 dark:bg-zinc-800 mx-2 hidden sm:block" />
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
              <User className="h-5 w-5 text-zinc-500" />
            </Button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
