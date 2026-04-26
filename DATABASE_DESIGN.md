# IELTS Platform - Database Design Documentation

## 📊 Tổng quan Database

Database được thiết kế với **PostgreSQL** sử dụng **Prisma ORM** để quản lý schema và migrations.

**Tổng số tables:** 26 tables chính
**Số quan hệ (relations):** 50+ relationships
**Kiến trúc:** Normalized, optimized for queries với indexes

---

## 🏗️ Kiến trúc Database - Các Module chính

### 1. **Authentication & User Management** (5 tables)
- `User` - Core user data
- `Account` - OAuth accounts (Google, Facebook)
- `Session` - Active sessions
- `VerificationToken` - Email verification
- `SubscriptionTier` - Enum cho Free/Pro/Premium

### 2. **Listening Module** (3 tables)
- `ListeningTest` - Full test metadata
- `ListeningPart` - 4 parts per test
- `ListeningQuestion` - Individual questions (40 per test)

### 3. **Reading Module** (3 tables)
- `ReadingTest` - Full test metadata
- `ReadingPassage` - 3 passages per test
- `ReadingQuestion` - 40 questions total

### 4. **Writing Module** (4 tables)
- `WritingPrompt` - Task 1 & Task 2 prompts
- `WritingSample` - Model answers (Band 6.5-9.0)
- `WritingSubmission` - User essays
- `WritingFeedback` - AI-generated feedback

### 5. **Speaking Module** (4 tables)
- `SpeakingTopic` - Part 1/2/3 topics
- `SpeakingSample` - Model recordings
- `SpeakingSubmission` - User recordings
- `SpeakingFeedback` - AI analysis

### 6. **Test Sessions & Answers** (2 tables)
- `TestSession` - Unified session tracking (all test types)
- `UserAnswer` - Individual answers for L&R

### 7. **Learning & Progress** (3 tables)
- `LearningPath` - Personalized study plan
- `ProgressLog` - Daily activity tracking
- `Difficulty` - Enum for test levels

### 8. **Vocabulary** (2 tables)
- `VocabularyWord` - Word bank
- `VocabularyProgress` - Spaced repetition tracking

### 9. **Gamification** (2 tables)
- `Achievement` - Badge definitions
- `UserAchievement` - User unlocks

### 10. **Community** (2 tables - Optional Phase 2)
- `StudyGroup` - Study groups
- `StudyGroupMember` - Membership

---

## 📐 Chi tiết Schema - Table by Table

### 🔐 User Table (Core)

```prisma
model User {
  id                String    @id @default(uuid())
  email             String    @unique
  name              String?
  password          String?   // Hashed with bcrypt
  
  // Learning profile
  targetScore       Float     @default(7.5)
  currentLevel      Json      // {listening: 6.5, reading: 7.0, ...}
  studyGoal         String?   // "study_abroad", "immigration"
  timeframe         Int?      // Days (e.g., 90 for 3 months)
  
  // Subscription
  subscriptionTier  SubscriptionTier @default(FREE)
  subscriptionEnd   DateTime?
  
  // Engagement stats
  totalTestsTaken   Int       @default(0)
  currentStreak     Int       @default(0)
  longestStreak     Int       @default(0)
}
```

**Key design decisions:**
- ✅ `currentLevel` as **JSON** để flexible (có thể thêm mini-test scores sau)
- ✅ `subscriptionTier` enum cho clear business logic
- ✅ Streak tracking ngay trong User table (frequently accessed)

**Queries sẽ chạy:**
```sql
-- Get user with subscription
SELECT * FROM "User" WHERE email = 'user@example.com';

-- Leaderboard query
SELECT name, "currentStreak" FROM "User" 
ORDER BY "currentStreak" DESC LIMIT 10;
```

---

### 🎧 Listening Module

#### ListeningTest
```prisma
model ListeningTest {
  id            String   @id @default(uuid())
  title         String
  difficulty    Difficulty
  audioUrl      String   // "https://r2.cloudflare.com/audio/test-1.mp3"
  audioDuration Int      // 1800 (30 min)
  transcript    String   @db.Text
  
  topic         String[] // ["education", "environment"]
  isOfficial    Boolean  @default(false)
  examDate      DateTime? // 2024-03-15 (if official)
}
```

**Tại sao thiết kế này:**
- ✅ `audioUrl` separate từ database (storage in R2/S3)
- ✅ `transcript` lưu full text cho search/analysis
- ✅ `topic` array cho multi-tag filtering
- ✅ `isOfficial` để highlight Cambridge tests

#### ListeningPart (1-to-Many with ListeningTest)
```prisma
model ListeningPart {
  id         String @id @default(uuid())
  testId     String
  partNumber Int    // 1, 2, 3, 4
  audioStart Int    // 0 (seconds)
  audioEnd   Int    // 300 (5 min)
  
  test       ListeningTest @relation(fields: [testId], references: [id])
  questions  ListeningQuestion[]
}
```

**Tại sao cần table riêng:**
- ✅ Mỗi part có audio timestamp khác nhau
- ✅ User có thể practice từng part riêng lẻ
- ✅ Analytics per-part performance

#### ListeningQuestion
```prisma
model ListeningQuestion {
  id             String @id @default(uuid())
  partId         String
  questionNumber Int    // 1-40
  questionType   ListeningQuestionType // MULTIPLE_CHOICE, FORM_COMPLETION, etc.
  
  questionText   String @db.Text
  options        Json?  // ["A) London", "B) Paris", "C) Berlin"]
  correctAnswer  String // "A" or "accommodation"
  acceptableAnswers String[] // ["accommodation", "accomodation"] (typos)
  
  keywords       String[] // ["housing", "rent", "landlord"]
  audioTimestamp Int?     // 145 (answer at 2:25)
}
```

**Quan trọng:**
- ✅ `acceptableAnswers` array cho spelling variations (IELTS accepts minor spelling mistakes)
- ✅ `audioTimestamp` để highlight trong transcript
- ✅ `keywords` cho analytics (which topics user struggles with)

**Example query:**
```typescript
// Get full test with questions
const test = await prisma.listeningTest.findUnique({
  where: { id: testId },
  include: {
    parts: {
      include: {
        questions: true
      },
      orderBy: { partNumber: 'asc' }
    }
  }
});
```

---

### 📖 Reading Module

Thiết kế tương tự Listening:

```
ReadingTest (1)
  └── ReadingPassage (3)
        └── ReadingQuestion (13-14 per passage)
```

**Key difference với Listening:**
- ✅ `ReadingPassage` lưu **full text content** (không phải audio)
- ✅ `answerLocation` field để highlight đáp án trong passage
- ✅ Question types khác: TRUE_FALSE_NOT_GIVEN, YES_NO_NOT_GIVEN, MATCHING_HEADINGS

**Performance optimization:**
```prisma
model ReadingPassage {
  content   String @db.Text // Full passage
  wordCount Int            // Pre-calculated for display
}
```

Tại sao pre-calculate `wordCount`:
- Không cần count mỗi lần query
- Display ngay trong UI

---

### ✍️ Writing Module - Quan trọng nhất (AI-powered)

#### WritingPrompt
```prisma
model WritingPrompt {
  taskType    WritingTaskType // TASK_1_ACADEMIC, TASK_2
  chartType   ChartType?      // LINE_GRAPH, BAR_CHART (for Task 1)
  chartImageUrl String?
  promptText  String @db.Text
  
  sampleAnswers WritingSample[] // Model answers
  submissions   WritingSubmission[]
}
```

**Design rationale:**
- ✅ Separate `chartImageUrl` (Cloudflare R2)
- ✅ Support both Academic & General Training
- ✅ Store prompt text separately từ chart

#### WritingSubmission → WritingFeedback (1-to-1)
```prisma
model WritingSubmission {
  id        String @id
  userId    String
  promptId  String
  content   String @db.Text
  wordCount Int
  
  aiFeedback WritingFeedback? // Optional (generated async)
}

model WritingFeedback {
  submissionId String @unique
  
  overallBand  Float  // 7.5
  
  // 4 criteria
  taskAchievement              Float // 8.0
  coherenceCohesion            Float // 7.5
  lexicalResource              Float // 7.0
  grammaticalRangeAccuracy     Float // 7.5
  
  strengths    Json  // Structured feedback
  improvements Json
  
  vocabularySuggestions Json // [{original: "important", alternatives: [...]}]
  grammarErrors        Json // [{line: 8, error: "...", correction: "..."}]
  
  modelUsed    String @default("gemini-1.5-flash")
  tokensUsed   Int
}
```

**Tại sao thiết kế này:**
- ✅ **Async feedback generation**: User submit → save submission → generate feedback sau
- ✅ **JSON fields** cho flexible feedback structure (dễ extend thêm fields)
- ✅ **Track tokens** để monitor API costs
- ✅ **1-to-1 relationship** (mỗi submission chỉ có 1 feedback)

**Workflow:**
```typescript
// 1. User submits essay
const submission = await prisma.writingSubmission.create({
  data: {
    userId: user.id,
    promptId: prompt.id,
    content: essayText,
    wordCount: essayText.split(' ').length
  }
});

// 2. Generate AI feedback (async)
const feedback = await generateWritingFeedback(submission.content);

// 3. Save feedback
await prisma.writingFeedback.create({
  data: {
    submissionId: submission.id,
    overallBand: feedback.overallBand,
    // ... other fields
    tokensUsed: feedback.usage.total_tokens
  }
});
```

---

### 🎤 Speaking Module

Similar structure to Writing, nhưng có thêm:

```prisma
model SpeakingSubmission {
  audioUrl    String  // "https://r2.cloudflare.com/recordings/user-123.mp3"
  duration    Int     // 120 seconds
  transcript  String? @db.Text // From Whisper API
  
  aiFeedback  SpeakingFeedback?
}

model SpeakingFeedback {
  // Criteria
  fluencyCohesion           Float
  lexicalResource           Float
  grammaticalRangeAccuracy  Float
  pronunciation             Float
  
  // Metrics
  wordsPerMinute   Int   // 140
  pauseCount       Int   // 12
  fillerWordsCount Int   // 8 ("um", "uh")
  
  pronunciationErrors Json // [{word: "three", error: "tree"}]
}
```

**Key additions:**
- ✅ `transcript` from Whisper API (speech-to-text)
- ✅ Speech metrics: WPM, pauses, fillers
- ✅ Pronunciation errors với specific tips

**Workflow:**
```typescript
// 1. User records → upload to R2
const audioUrl = await uploadToR2(audioBlob);

// 2. Transcribe with Whisper
const transcript = await whisperAPI.transcribe(audioUrl);

// 3. Generate feedback with Gemini
const feedback = await generateSpeakingFeedback(transcript, audioUrl);
```

---

### 🎯 TestSession - Unified tracking

**Tại sao cần table này:**
- ✅ Track ALL test types trong 1 table
- ✅ Dễ query "all tests taken by user"
- ✅ Calculate overall progress

```prisma
model TestSession {
  id        String @id
  userId    String
  testType  String // "listening", "reading", "writing", "speaking", "full_mock"
  
  // Polymorphic references (only one will be set)
  listeningTestId String?
  readingTestId   String?
  writingPromptId String?
  speakingTopicId String?
  
  status      SessionStatus // IN_PROGRESS, COMPLETED, ABANDONED
  startedAt   DateTime
  submittedAt DateTime?
  
  score       Float?  // Band score
  timeSpent   Int     // Seconds
  
  userAnswers UserAnswer[] // For L&R
}
```

**Query examples:**
```typescript
// Get user's test history
const sessions = await prisma.testSession.findMany({
  where: { userId: user.id },
  orderBy: { submittedAt: 'desc' },
  take: 10
});

// Calculate average score by skill
const avgListening = await prisma.testSession.aggregate({
  where: { userId: user.id, testType: 'listening' },
  _avg: { score: true }
});
```

---

### 📈 Progress Tracking

#### LearningPath (Personalized roadmap)
```prisma
model LearningPath {
  userId        String @unique
  currentPhase  LearningPhase // DIAGNOSTIC, FOUNDATION, INTERMEDIATE, ADVANCED
  currentWeek   Int @default(1)
  
  // JSON structures
  dailyPlan     Json // {listening: 20, reading: 30, writing: 60, speaking: 30}
  weeklyGoals   Json // {week1: {listening: 7.0, reading: 7.0}, week2: {...}}
  milestones    Json
  
  weakSkills    String[] // ["writing", "speaking"]
  weakQuestionTypes String[] // ["true_false_not_given"]
}
```

**Tại sao dùng JSON:**
- ✅ Flexible structure (mỗi user có plan khác nhau)
- ✅ Easy to update without migrations
- ✅ Can store complex nested data

**Generate learning path algorithm:**
```typescript
async function generateLearningPath(userId: string) {
  // 1. Get diagnostic test results
  const diagnostic = await getLatestDiagnosticTest(userId);
  
  // 2. Calculate gaps
  const gaps = {
    listening: 7.5 - diagnostic.listening,
    reading: 7.5 - diagnostic.reading,
    writing: 7.5 - diagnostic.writing,
    speaking: 7.5 - diagnostic.speaking
  };
  
  // 3. Prioritize weakest skills
  const weakSkills = Object.entries(gaps)
    .filter(([_, gap]) => gap > 0.5)
    .map(([skill]) => skill);
  
  // 4. Create daily plan (more time on weak skills)
  const dailyPlan = {
    writing: gaps.writing > 1 ? 60 : 30,  // Most time if weakest
    speaking: gaps.speaking > 1 ? 45 : 20,
    listening: 20,
    reading: 20,
    vocabulary: 15,
    grammar: 15
  };
  
  // 5. Save to database
  await prisma.learningPath.create({
    data: {
      userId,
      currentPhase: 'FOUNDATION',
      dailyPlan,
      weeklyGoals: generateWeeklyGoals(gaps),
      weakSkills
    }
  });
}
```

#### ProgressLog (Daily tracking)
```prisma
model ProgressLog {
  userId    String
  date      Date @unique // 2024-03-15
  
  skillsPracticed Json // {listening: 25, reading: 30} in minutes
  testsCompleted  Int
  
  listeningScore Float?
  readingScore   Float?
  writingScore   Float?
  speakingScore  Float?
  
  isActiveDay Boolean // For streak calculation
  streakDay   Int     // 7 (if 7-day streak)
}
```

**Streak calculation:**
```typescript
async function updateStreak(userId: string) {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Check yesterday's log
  const yesterdayLog = await prisma.progressLog.findUnique({
    where: { userId_date: { userId, date: yesterday } }
  });
  
  // Create today's log
  const currentStreak = yesterdayLog?.isActiveDay 
    ? yesterdayLog.streakDay + 1 
    : 1;
  
  await prisma.progressLog.create({
    data: {
      userId,
      date: today,
      isActiveDay: true,
      streakDay: currentStreak
    }
  });
  
  // Update user's streak
  await prisma.user.update({
    where: { id: userId },
    data: {
      currentStreak: currentStreak,
      longestStreak: Math.max(user.longestStreak, currentStreak)
    }
  });
}
```

---

### 📚 Vocabulary System (Spaced Repetition)

```prisma
model VocabularyWord {
  word          String @unique
  definition    String
  pronunciation String?  // IPA: /əˈkɒmədeɪʃn/
  audioUrl      String?
  
  exampleSentences String[] // 3 examples
  synonyms         String[] // ["lodging", "housing"]
  collocations     String[] // ["book accommodation", "provide accommodation"]
  
  difficulty  Difficulty
  isAWL       Boolean // Academic Word List
}

model VocabularyProgress {
  userId      String
  wordId      String
  
  stage       Int @default(0) // 0-7 (Leitner system)
  nextReview  DateTime
  
  correctCount   Int
  incorrectCount Int
  isMastered     Boolean
}
```

**Spaced Repetition Algorithm (Leitner):**
```typescript
async function reviewWord(userId: string, wordId: string, isCorrect: boolean) {
  const progress = await prisma.vocabularyProgress.findUnique({
    where: { userId_wordId: { userId, wordId } }
  });
  
  // Calculate next review interval
  const intervals = [1, 2, 4, 7, 14, 30, 60]; // days
  const newStage = isCorrect 
    ? Math.min(progress.stage + 1, 7) 
    : Math.max(progress.stage - 1, 0);
  
  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + intervals[newStage]);
  
  // Update progress
  await prisma.vocabularyProgress.update({
    where: { id: progress.id },
    data: {
      stage: newStage,
      nextReview,
      correctCount: isCorrect ? progress.correctCount + 1 : progress.correctCount,
      incorrectCount: !isCorrect ? progress.incorrectCount + 1 : progress.incorrectCount,
      isMastered: newStage === 7
    }
  });
}
```

---

## 🔍 Indexes Strategy

### Tại sao cần indexes:

**Without index:**
```sql
-- Scan toàn bộ table (SLOW for 100k+ rows)
SELECT * FROM "User" WHERE email = 'user@example.com';
-- Time: ~500ms
```

**With index:**
```sql
-- Direct lookup (FAST)
SELECT * FROM "User" WHERE email = 'user@example.com';
-- Time: ~5ms
```

### Các indexes quan trọng:

```prisma
model User {
  email String @unique  // Auto-creates index
  
  @@index([subscriptionTier])  // Filter by subscription
  @@index([currentStreak])     // Leaderboard queries
}

model TestSession {
  @@index([userId])           // Get user's tests
  @@index([testType])         // Filter by type
  @@index([submittedAt])      // Sort by date
}

model ListeningQuestion {
  @@index([partId])           // Get all questions for a part
  @@index([questionType])     // Analytics by type
}

model VocabularyProgress {
  @@index([nextReview])       // Find words due for review
}
```

**Trade-off:**
- ✅ Faster reads (queries)
- ⚠️ Slower writes (inserts/updates)
- ⚠️ More storage space

**Rule of thumb:** Index columns you frequently query/filter/sort by.

---

## 🚀 Migration Strategy

### Initial migration:
```bash
npx prisma migrate dev --name init
```

### Adding new features:
```bash
# Example: Add "notes" field to User
# 1. Edit schema.prisma
# 2. Run migration
npx prisma migrate dev --name add_user_notes
```

### Seeding database:
```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample listening test
  const test = await prisma.listeningTest.create({
    data: {
      title: 'Cambridge IELTS 18 - Test 1',
      difficulty: 'BAND_7_5_8',
      audioUrl: 'https://r2.example.com/test-1.mp3',
      audioDuration: 1800,
      transcript: '...',
      topic: ['education', 'university'],
      isOfficial: true,
      parts: {
        create: [
          {
            partNumber: 1,
            title: 'Conversation about accommodation',
            context: 'Two students discussing...',
            audioStart: 0,
            audioEnd: 300,
            questions: {
              create: [
                {
                  questionNumber: 1,
                  questionType: 'FORM_COMPLETION',
                  questionText: 'Name: Sarah ___',
                  correctAnswer: 'Thompson',
                  acceptableAnswers: ['Thompson', 'thomson'],
                  keywords: ['name', 'surname']
                }
                // ... 9 more questions
              ]
            }
          }
          // ... parts 2, 3, 4
        ]
      }
    }
  });
  
  console.log('Seeded test:', test.id);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

Run seed:
```bash
npx prisma db seed
```

---

## 📊 Sample Queries - Real-world Usage

### 1. Get user dashboard data:
```typescript
async function getUserDashboard(userId: string) {
  const [user, recentTests, todayProgress] = await Promise.all([
    // User info
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        targetScore: true,
        currentLevel: true,
        currentStreak: true,
        subscriptionTier: true
      }
    }),
    
    // Recent 5 tests
    prisma.testSession.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
      take: 5,
      select: {
        testType: true,
        score: true,
        submittedAt: true
      }
    }),
    
    // Today's activity
    prisma.progressLog.findUnique({
      where: { 
        userId_date: { 
          userId, 
          date: new Date() 
        } 
      }
    })
  ]);
  
  return { user, recentTests, todayProgress };
}
```

### 2. Get test with all questions:
```typescript
async function getListeningTest(testId: string) {
  return prisma.listeningTest.findUnique({
    where: { id: testId },
    include: {
      parts: {
        include: {
          questions: {
            orderBy: { questionNumber: 'asc' }
          }
        },
        orderBy: { partNumber: 'asc' }
      }
    }
  });
}
```

### 3. Submit test and calculate score:
```typescript
async function submitListeningTest(
  userId: string, 
  testId: string, 
  answers: Record<string, string>
) {
  // 1. Create session
  const session = await prisma.testSession.create({
    data: {
      userId,
      testType: 'listening',
      listeningTestId: testId,
      status: 'COMPLETED',
      submittedAt: new Date()
    }
  });
  
  // 2. Get all questions
  const test = await getListeningTest(testId);
  const allQuestions = test.parts.flatMap(p => p.questions);
  
  // 3. Save answers and check correctness
  let correctCount = 0;
  
  for (const question of allQuestions) {
    const userAnswer = answers[question.id];
    const isCorrect = checkAnswer(userAnswer, question);
    
    if (isCorrect) correctCount++;
    
    await prisma.userAnswer.create({
      data: {
        sessionId: session.id,
        listeningQuestionId: question.id,
        userAnswer,
        isCorrect
      }
    });
  }
  
  // 4. Calculate band score
  const bandScore = calculateBandScore(correctCount, 40);
  
  // 5. Update session
  await prisma.testSession.update({
    where: { id: session.id },
    data: {
      score: bandScore,
      correctAnswers: correctCount,
      totalQuestions: 40
    }
  });
  
  return { score: bandScore, correctCount };
}

function calculateBandScore(correct: number, total: number): number {
  // IELTS Listening band score conversion
  const percentage = correct / total;
  if (percentage >= 0.875) return 9.0;      // 35-40
  if (percentage >= 0.825) return 8.5;      // 33-34
  if (percentage >= 0.800) return 8.0;      // 32
  if (percentage >= 0.775) return 7.5;      // 31
  if (percentage >= 0.725) return 7.0;      // 29-30
  if (percentage >= 0.650) return 6.5;      // 26-28
  // ... etc
  return 5.0;
}
```

### 4. Get vocabulary words due for review:
```typescript
async function getWordsForReview(userId: string) {
  return prisma.vocabularyProgress.findMany({
    where: {
      userId,
      nextReview: { lte: new Date() },
      isMastered: false
    },
    include: {
      word: true
    },
    take: 20 // Review 20 words per session
  });
}
```

---

## ⚡ Performance Optimization Tips

### 1. Use select để giảm data transfer:
```typescript
// ❌ Bad: Fetch everything
const users = await prisma.user.findMany();

// ✅ Good: Only fetch needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  }
});
```

### 2. Batch queries với Promise.all:
```typescript
// ❌ Bad: Sequential queries (slow)
const user = await prisma.user.findUnique({ where: { id } });
const tests = await prisma.testSession.findMany({ where: { userId: id } });
const progress = await prisma.progressLog.findMany({ where: { userId: id } });

// ✅ Good: Parallel queries (fast)
const [user, tests, progress] = await Promise.all([
  prisma.user.findUnique({ where: { id } }),
  prisma.testSession.findMany({ where: { userId: id } }),
  prisma.progressLog.findMany({ where: { userId: id } })
]);
```

### 3. Pagination cho large datasets:
```typescript
// Get page 2, 20 items per page
const tests = await prisma.listeningTest.findMany({
  skip: 20,  // (page - 1) * pageSize
  take: 20,
  orderBy: { createdAt: 'desc' }
});
```

### 4. Use transactions cho multiple writes:
```typescript
await prisma.$transaction(async (tx) => {
  // Create session
  const session = await tx.testSession.create({ data: {...} });
  
  // Create answers
  await tx.userAnswer.createMany({ data: answers });
  
  // Update user stats
  await tx.user.update({
    where: { id: userId },
    data: { totalTestsTaken: { increment: 1 } }
  });
});
```

---

## 🔒 Security Considerations

### 1. Never expose sensitive fields:
```typescript
// ❌ Bad
const user = await prisma.user.findUnique({ where: { id } });
return user; // Exposes password hash, stripe info

// ✅ Good
const user = await prisma.user.findUnique({
  where: { id },
  select: {
    id: true,
    name: true,
    email: true,
    targetScore: true
    // No password, no stripeCustomerId
  }
});
```

### 2. Validate user ownership:
```typescript
async function getTestSession(userId: string, sessionId: string) {
  const session = await prisma.testSession.findFirst({
    where: {
      id: sessionId,
      userId: userId  // ✅ Ensure user owns this session
    }
  });
  
  if (!session) throw new Error('Not found or unauthorized');
  return session;
}
```

### 3. Use Row Level Security (RLS) in Supabase:
```sql
-- Users can only read their own data
CREATE POLICY "Users can view own data" ON "User"
  FOR SELECT
  USING (auth.uid() = id);
```

---

## 📝 Summary - Key Takeaways

✅ **26 tables** covering tất cả features trong PLAN.md
✅ **Normalized design** - Minimal redundancy
✅ **JSON fields** cho flexibility (feedback, plans)
✅ **Strategic indexes** cho performance
✅ **Relationships** rõ ràng với foreign keys
✅ **Enums** cho type safety
✅ **Unique constraints** tránh duplicates
✅ **Default values** giảm boilerplate code

**Next steps:**
1. Copy `prisma-schema.prisma` → `prisma/schema.prisma`
2. Run `npx prisma migrate dev --name init`
3. Create seed file để test
4. Start building API routes! 🚀
