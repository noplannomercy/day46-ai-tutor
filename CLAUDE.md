# AI Tutor PoC - Project Guide

## Project Overview

This is an **AI Tutor Proof of Concept** for a digital textbook portal. The app demonstrates personalized math tutoring for high school students (고1 수학 - 방정식·함수 단원).

**Core Concept:**
> "Same question, different explanation for each student based on their ability and learning history."

**Scope:**
- Frontend-only implementation (backend already complete)
- 2 pages: Landing (/) + Chat (/chat)
- 4 demo student accounts with different math proficiency levels
- Real-time AI tutoring with LaTeX formula rendering

## Tech Stack

- **Framework:** Next.js 15 + TypeScript + App Router
- **UI:** shadcn/ui (new-york style) + Tailwind CSS 4
- **Auth:** Supabase Auth (SSR mode)
- **Math Rendering:** KaTeX (react-katex)
- **Backend APIs:**
  - n8n webhook (AI chat responses)
  - Mem0 (student learning profiles)
  - Supabase PostgreSQL (chat history, student profiles)

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout (AuthProvider, Toaster, KaTeX CSS)
│   ├── page.tsx           # Landing page
│   └── chat/              # Chat page (protected route)
├── components/
│   ├── landing/           # Landing page sections (6 components)
│   ├── chat/              # Chat interface (9 components)
│   └── ui/                # shadcn/ui components (10 installed)
├── contexts/              # React contexts
│   ├── AuthContext.tsx    # Supabase auth state
│   └── ChatContext.tsx    # Chat messages & send logic
├── hooks/                 # Custom hooks
│   ├── useAuth.ts
│   └── useChat.ts
├── lib/
│   ├── types.ts           # All TypeScript interfaces
│   ├── constants.ts       # Demo accounts, hardcoded data
│   ├── utils.ts           # cn() utility
│   ├── supabase/          # Supabase clients (server & browser)
│   └── api/               # External API integrations
│       ├── n8n.ts         # AI chat webhook
│       ├── mem0.ts        # Learning status API
│       └── supabase.ts    # Database queries
└── middleware.ts          # Auth route protection
```

## Code Conventions

### Component Architecture

**Default to Server Components:**
```typescript
// ✅ Good - Server Component (default)
export default async function LandingPage() {
  const data = await fetchData();
  return <div>{data}</div>;
}

// ✅ Good - Client Component (when needed)
'use client';
export function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}

// ❌ Bad - Unnecessary 'use client'
'use client';
export function StaticCard({ title }: { title: string }) {
  return <div>{title}</div>; // No hooks, no interactivity
}
```

**Use 'use client' only when:**
- Using React hooks (useState, useEffect, useContext, etc.)
- Using browser APIs (localStorage, window, document)
- Adding event handlers (onClick, onChange, etc.)
- Using third-party libraries that require client-side rendering

### TypeScript Standards

**Strict mode enabled - no `any` types:**
```typescript
// ✅ Good - Proper typing
interface StudentProfile {
  user_id: string;
  display_name: string;
  level: StudentLevel;
  score_range: string;
}

async function getProfile(userId: string): Promise<StudentProfile> {
  // ...
}

// ❌ Bad - Using 'any'
async function getProfile(userId: string): Promise<any> {
  // ...
}
```

**Use discriminated unions for message types:**
```typescript
type ChatMessage =
  | { type: 'human'; content: string; timestamp: string }
  | { type: 'ai'; content: string; timestamp: string };
```

### File Naming

- **Components:** PascalCase (e.g., `MessageBubble.tsx`, `DemoAccountCards.tsx`)
- **Utilities:** camelCase (e.g., `utils.ts`, `constants.ts`)
- **Contexts:** PascalCase with "Context" suffix (e.g., `AuthContext.tsx`)
- **Hooks:** camelCase with "use" prefix (e.g., `useAuth.ts`, `useChat.ts`)

### Import Order

```typescript
// 1. External dependencies
import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 2. Internal utilities and types
import { StudentProfile } from '@/lib/types';
import { cn } from '@/lib/utils';

// 3. Components
import { Button } from '@/components/ui/button';
import { MessageBubble } from '@/components/chat/MessageBubble';

// 4. Styles (if any)
import 'katex/dist/katex.min.css';
```

## API Integration Patterns

### n8n Webhook

```typescript
// Request
POST https://n8n.srv812064.hstgr.cloud/webhook/6350e749-78cb-4a00-890d-cfa59faafac8
Body: { "user_id": "<supabase-uid>", "message": "질문 내용" }

// Response (ARRAY format!)
[{ "output": "AI response with \\( LaTeX \\) formulas..." }]

// Extract output
const data = await response.json();
const aiMessage = data[0].output;
```

### Mem0 API

```typescript
// Request
POST http://193.168.195.222:8888/search
Body: { "query": "학생 학습 상태", "user_id": "<uid>", "limit": 10 }

// Response
{
  "results": [
    { "memory": "약점 설명...", "score": 0.95, ... },
    ...
  ]
}
```

### Supabase Database

**Tables:**
- `n8n_chat_histories`: Chat message history (session_id = user_id, message: JSONB)
- `student_profiles`: Student metadata (user_id, display_name, level, score_range)

**Message format in JSONB:**
```json
// Human message
{ "type": "human", "data": { "content": "x² + 3x - 10 = 0 풀어줘" } }

// AI message
{ "type": "ai", "data": { "content": "풀이 내용..." } }
```

## Demo Accounts

**All accounts use password:** `demo1234`

```typescript
김상위 (상위권 90+)
- Email: kim-sangwi@demo.com
- UID: 3a0d951f-6fe7-49cf-96e9-d9194fc723fc
- 특징: 인수분해 능숙, 심화 문제 선호

이중위 (중위권 60~80)
- Email: lee-jungwi@demo.com
- UID: f273885e-dcb3-4ae5-8155-292445b9f4ca
- 특징: 판별식 부호 실수 반복, 근의 공식 선호

박하위 (하위권 40~60)
- Email: park-hawi@demo.com
- UID: 066a45cd-9db3-4bd2-bd53-ac89c04cb29b
- 특징: 이차/일차 개념 혼동, 부호 계산 취약

최기초 (기초부족 ~40)
- Email: choi-gicho@demo.com
- UID: a1fac652-00f1-461f-b8f5-b740434614ae
- 특징: 분배법칙 불안정, 분수 계산 어려움
```

## Error Handling

### Patterns to Follow

```typescript
// ✅ Good - Proper error handling with user feedback
async function sendMessage(userId: string, message: string) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId, message }),
      signal: AbortSignal.timeout(30000), // 30s timeout
    });

    if (!response.ok) {
      throw new Error('n8n webhook failed');
    }

    return await response.json();
  } catch (error) {
    toast({
      title: "오류",
      description: "AI 튜터 응답에 실패했습니다. 다시 시도해주세요.",
      variant: "destructive"
    });
    throw error;
  }
}

// ❌ Bad - Silent failure
async function sendMessage(userId: string, message: string) {
  try {
    const response = await fetch(url, { ... });
    return await response.json();
  } catch (error) {
    console.log(error); // User has no feedback!
  }
}
```

### Error Messages

- **n8n failure:** "AI 튜터 응답에 실패했습니다. 다시 시도해주세요."
- **Mem0 failure:** "학습 상태를 불러올 수 없습니다" (show in sidebar, chat still works)
- **Auth failure:** Redirect to landing page
- **Timeout:** 30 seconds for all API calls

## KaTeX Rendering

**LaTeX patterns in n8n responses:**
- Inline: `\\( formula \\)` → rendered inline
- Block: `\\[ formula \\]` → rendered as display block

**Example:**
```
Input: "x² + 3x - 10 = 0을 풀면 \\( x = 2 \\) 또는 \\( x = -5 \\)입니다."
Output: "x² + 3x - 10 = 0을 풀면 x = 2 또는 x = -5 입니다." (with rendered formulas)
```

**Implementation:**
```typescript
import { InlineMath, BlockMath } from 'react-katex';
import 'katex/dist/katex.min.css';

// Parse and render LaTeX in text
function KaTeXRenderer({ content }: { content: string }) {
  // Split by \\( ... \\) and \\[ ... \\]
  // Render math parts with InlineMath/BlockMath
  // Render text parts as plain text
}
```

## Authentication Flow

### Login Flow
1. User clicks demo account card on landing page
2. Call `signIn(email, password)` from AuthContext
3. Supabase authenticates → session stored in httpOnly cookie
4. Redirect to `/chat`
5. Middleware validates session on every request

### Route Protection
```typescript
// src/middleware.ts
export async function middleware(request: NextRequest) {
  const { supabase, response } = createServerClient(request);
  const { data: { session } } = await supabase.auth.getSession();

  // Protect /chat route
  if (request.nextUrl.pathname.startsWith('/chat')) {
    if (!session) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return response;
}
```

### Logout Flow
1. User clicks logout button in sidebar
2. Call `signOut()` from AuthContext
3. Supabase clears session
4. Redirect to `/`

## Design Guidelines

### Color Scheme
- **Primary:** Blue/Navy (educational theme)
- **Background:** White/Light gray
- **Text:** Dark gray/Black
- **Accent:** Blue for interactive elements

### Typography
- **Headings:** Bold, clear hierarchy
- **Body:** Readable font size (16px+)
- **Code/Formulas:** Monospace/KaTeX rendering

### Spacing
- **Sections:** Large spacing between landing page sections
- **Components:** Consistent padding/margin (use Tailwind spacing scale)
- **Chat messages:** Comfortable reading distance

### Responsive Design
- **Desktop (1024px+):** Two-panel layout (280px sidebar + chat area)
- **Tablet (768-1023px):** Collapsible sidebar
- **Mobile (<768px):** Sidebar becomes Sheet drawer with hamburger menu

## Testing Checklist

Before considering implementation complete:

**Landing Page:**
- [ ] All 6 sections render correctly
- [ ] Comparison demo shows different responses
- [ ] All 4 demo account cards display
- [ ] Login redirects to `/chat`

**Chat Page:**
- [ ] Auth guard works (redirect if not logged in)
- [ ] Student info displays correctly
- [ ] Mem0 learning status loads and displays
- [ ] Can send messages and receive AI responses
- [ ] KaTeX formulas render correctly
- [ ] Chat history persists across page reloads
- [ ] Quick actions work
- [ ] Logout works and redirects

**Responsive:**
- [ ] Mobile sidebar becomes drawer
- [ ] Hamburger menu toggles drawer
- [ ] Chat input doesn't overflow on mobile

**Error Handling:**
- [ ] n8n failure shows toast
- [ ] Mem0 failure shows graceful message
- [ ] Loading states display correctly

## Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://muefuihjjihdihzjpvbk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<from Supabase Dashboard>
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.srv812064.hstgr.cloud/webhook/6350e749-78cb-4a00-890d-cfa59faafac8
NEXT_PUBLIC_MEM0_API_URL=http://193.168.195.222:8888
```

**Note:** All variables use `NEXT_PUBLIC_` prefix because they're accessed from client components.

## Common Issues & Solutions

### Issue: KaTeX formulas not rendering
**Solution:** Ensure `katex/dist/katex.min.css` is imported in root layout

### Issue: Auth session not persisting
**Solution:** Check middleware is configured correctly and Supabase client uses cookies

### Issue: n8n response parsing fails
**Solution:** Remember response is an ARRAY: `data[0].output`, not `data.output`

### Issue: Mem0 API CORS error
**Solution:** Call Mem0 from server-side API route, not directly from client

### Issue: Chat history not loading
**Solution:** Verify `session_id` in database matches Supabase `user_id`

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Add shadcn/ui component
npx shadcn@latest add [component-name]
```

## Deployment

**Platform:** Vercel

**Steps:**
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

**Build Settings:**
- Framework Preset: Next.js
- Build Command: `npm run build`
- Output Directory: `.next`
- Install Command: `npm install`

## Future Enhancements (Post-PoC)

- [ ] Chat history pagination
- [ ] Message editing/deletion
- [ ] Real-time updates (WebSockets)
- [ ] Personalized quick actions based on Mem0
- [ ] Progress dashboard
- [ ] Teacher management interface
- [ ] Mobile app (React Native)
- [ ] Voice input for questions
- [ ] Image upload for problem photos

## Key Files Reference

**Must understand these 5 files:**
1. `src/lib/types.ts` - Type contracts
2. `src/contexts/AuthContext.tsx` - Auth patterns
3. `src/lib/api/n8n.ts` - Backend integration
4. `src/components/chat/MessageBubble.tsx` - KaTeX rendering
5. `src/app/chat/page.tsx` - Main app interface

## Documentation

- **SRS:** `docs/SRS.md` - Full requirements specification
- **Implementation Plan:** `IMPLEMENTATION.md` - Step-by-step build guide
- **Clarifications:** `docs/3.clarify response.md` - Q&A responses

## Contact & Support

For questions about this PoC:
- Check `docs/SRS.md` for requirements
- Check `IMPLEMENTATION.md` for build steps
- Check this `CLAUDE.md` for conventions and patterns

---

**Last Updated:** 2026-02-14
**Project Status:** Implementation Phase
