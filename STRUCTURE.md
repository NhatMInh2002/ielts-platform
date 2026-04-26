ielts-platform/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Auth routes group
│   │   ├── login/
│   │   └── register/
│   ├── (dashboard)/              # Protected routes group
│   │   ├── dashboard/
│   │   ├── listening/
│   │   ├── reading/
│   │   ├── writing/
│   │   ├── speaking/
│   │   └── progress/
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── tests/
│   │   │   ├── listening/
│   │   │   ├── reading/
│   │   │   ├── writing/
│   │   │   └── speaking/
│   │   └── feedback/
│   ├── layout.tsx
│   └── page.tsx                  # Landing page
├── components/                   # React components
│   ├── ui/                       # Shadcn components
│   ├── listening/
│   ├── reading/
│   ├── writing/
│   ├── speaking/
│   ├── shared/                   # Shared components
│   └── layout/
├── lib/                          # Utilities
│   ├── supabase.ts
│   ├── gemini.ts
│   ├── prisma.ts
│   └── utils.ts
├── hooks/                        # Custom React hooks
│   ├── useAuth.ts
│   ├── useTest.ts
│   └── useProgress.ts
├── types/                        # TypeScript types
│   ├── test.ts
│   ├── user.ts
│   └── feedback.ts
├── store/                        # Zustand stores
│   ├── authStore.ts
│   └── testStore.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
├── public/                       # Static files
│   ├── audio/                    # Listening test audio
│   └── images/
├── .env.local                    # Environment variables
├── next.config.js
├── tailwind.config.js
├── tsconfig.json
└── package.json