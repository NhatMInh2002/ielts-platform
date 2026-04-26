# Project Guidelines: IELTS 7.5 Learning Platform

## 🎯 Project Vision
A data-driven, AI-powered IELTS learning platform to help students reach 7.5+ through personalized roadmaps, deep practice, and real-time AI feedback.

## 🛠 Tech Stack & Rules
- **Frontend:** Next.js 16 (App Router), React 19, Tailwind CSS v4, Shadcn/ui.
- **State Management:** Zustand (client state), React Query (server state/caching).
- **Backend/API:** Next.js API Routes (within `app/api/`).
- **Database & Auth:** Prisma ORM, PostgreSQL (via Supabase), NextAuth.js.
- **AI Integrations:** Anthropic Claude API (Writing/Speaking feedback), OpenAI Whisper (Speech-to-text).

## 💻 Common Commands
- **Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint`
- **Database sync:** `npx prisma db push` (or `npx prisma migrate dev`)
- **Prisma Client:** `npx prisma generate`

## 🏗 Architecture & Code Conventions
1. **Next.js App Router:** Use App Router conventions strictly (`page.tsx`, `layout.tsx`, `route.ts`).
2. **Component Rendering:** Default to Server Components. Only use `"use client"` directive when interactivity, React hooks (useState, useEffect), or browser APIs are required.
3. **Directory Structure:** 
   - Route groups like `(auth)` and `(dashboard)` for layout management.
   - `components/ui/` for Shadcn, `components/shared/` for common elements.
   - Separate feature components into `components/listening/`, `components/reading/`, etc.
4. **Database Workflow:** `prisma/schema.prisma` is the source of truth. Any DB changes must be updated here first.
5. **AI Feedback:** All AI prompts for evaluating Writing and Speaking must strictly adhere to the 4 official IELTS criteria: Task Achievement/Response, Coherence & Cohesion, Lexical Resource, Grammatical Range & Accuracy.
6. **Typing:** Use strict TypeScript. Avoid `any`. Interfaces/types go to `types/`.

## 🚀 Current Target: Phase 1 MVP
- **Priority 1:** Database Schema setup and Authentication (NextAuth + Supabase).
- **Priority 2:** Listening & Reading UI interface and basic scoring.
- **Priority 3:** Writing module with Claude AI feedback integration.
- **Priority 4:** Speaking module with Whisper + Claude.
