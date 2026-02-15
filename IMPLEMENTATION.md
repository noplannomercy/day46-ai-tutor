# AI Tutor PoC Frontend - Implementation Plan

## Context

**What we're building:**
- AI Tutor PoC demo for high school math (고1 수학)
- Personalized tutoring system that gives different explanations based on student level
- Frontend-only implementation (backend already complete with n8n + Mem0 + pgvector + Wolfram)

**Why:**
- Demonstrate that the same math question gets completely different responses based on student's ability and learning history
- Prove concept for digital textbook portal integration

**Tech Stack:**
- Next.js 15 + TypeScript + App Router
- Supabase Auth (4 pre-created demo accounts)
- shadcn/ui + Tailwind CSS (already configured)
- KaTeX for LaTeX formula rendering
- External APIs: n8n webhook, Mem0, Supabase PostgreSQL

**Current State:**
- Fresh Next.js project with 10 shadcn/ui components installed
- No auth infrastructure yet
- No API integrations yet
- Default landing page needs complete replacement

## Implementation Strategy

### Architecture Decisions

1. **Auth**: Supabase SSR with middleware for route protection + client-side context for UI state
2. **API Layer**: Centralized in `lib/api/` with typed interfaces
3. **State**: React Context for auth & chat (no external state library)
4. **Components**: Server components by default, client components only when needed
5. **Types**: Single `lib/types.ts` for shared interfaces
6. **Error Handling**: shadcn/ui toast for user-facing errors

### Key Files Structure

```
src/
├── lib/
│   ├── types.ts              - All TypeScript interfaces
│   ├── constants.ts          - Demo accounts, hardcoded comparison data
│   ├── supabase/
│   │   ├── server.ts         - Server-side client (cookies)
│   │   └── client.ts         - Browser client
│   └── api/
│       ├── n8n.ts            - AI chat webhook integration
│       ├── mem0.ts           - Learning status API
│       └── supabase.ts       - Database queries
├── contexts/
│   ├── AuthContext.tsx       - Auth state provider
│   └── ChatContext.tsx       - Chat state provider
├── hooks/
│   ├── useAuth.ts            - Auth context hook
│   └── useChat.ts            - Chat context hook
├── components/
│   ├── landing/              - 6 landing page sections
│   └── chat/                 - 9 chat interface components
├── app/
│   ├── layout.tsx            - Root + AuthProvider + Toaster
│   ├── page.tsx              - Landing page
│   └── chat/
│       ├── layout.tsx        - Auth guard
│       └── page.tsx          - Two-panel chat interface
└── middleware.ts             - Route protection
```

## Implementation Plan

### Phase 1: Foundation (Infrastructure First)

**1.1 Environment & Types**
- Create `.env.local` with 4 environment variables:
  ```
  NEXT_PUBLIC_SUPABASE_URL=https://muefuihjjihdihzjpvbk.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im11ZWZ1aWhqamloZGloempwdmJrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA5NTA5NzIsImV4cCI6MjA4NjUyNjk3Mn0.K0Y4I3GbEujUIiZWRf8G4ed8htgcyl4__VIeUvrcFNM
  NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.srv812064.hstgr.cloud/webhook/6350e749-78cb-4a00-890d-cfa59faafac8
  NEXT_PUBLIC_MEM0_API_URL=http://193.168.195.222:8888
  ```
- Create `src/lib/types.ts`:
  - `StudentProfile` interface (user_id, display_name, level, score_range, avatar_emoji)
  - `StudentLevel` type ('상위' | '중위' | '하위' | '기초')
  - `ChatMessage` interface (id, type: 'human' | 'ai', content, timestamp)
  - `Mem0Memory` interface (memory, score, metadata)
  - `N8nResponse` type (`[{ output: string }]`)

**1.2 Constants**
- Create `src/lib/constants.ts`:
  - 4 demo accounts with UIDs
  - Hardcoded comparison responses (상위권 vs 하위권)
  - 5 quick action questions
  - 7 test scenarios

**1.3 Install Additional Components**
```bash
npx shadcn@latest add toast
```

### Phase 2: Supabase Setup

**2.1 Supabase Clients**
- Create `src/lib/supabase/server.ts`:
  - `createClient()` function using `@supabase/ssr` with cookies
  - For Server Components and Server Actions
- Create `src/lib/supabase/client.ts`:
  - `createClient()` function for browser
  - For Client Components

**2.2 Middleware**
- Create `src/middleware.ts`:
  - Protect `/chat` route (redirect to `/` if not authenticated)
  - Refresh auth session on every request
  - Use Supabase SSR helper

**2.3 Auth Context**
- Create `src/contexts/AuthContext.tsx`:
  - Provide current user state
  - `signIn(email, password)` method
  - `signOut()` method
  - `loading` state
- Create `src/hooks/useAuth.ts`:
  - Custom hook to consume AuthContext

**2.4 Layout Updates**
- Modify `src/app/layout.tsx`:
  - Wrap children with `<AuthProvider>`
  - Add `<Toaster />` component
  - Import KaTeX CSS: `import 'katex/dist/katex.min.css'`
  - Update metadata (title, description)

### Phase 3: API Integration Layer

**3.1 n8n Webhook**
- Create `src/lib/api/n8n.ts`:
  - `sendMessage(userId: string, message: string): Promise<string>`
  - POST to n8n webhook
  - Extract output from array response: `data[0].output`
  - 30-second timeout
  - Error handling with toast

**3.2 Mem0 API**
- Create `src/lib/api/mem0.ts`:
  - `fetchLearningStatus(userId: string): Promise<Mem0Memory[]>`
  - POST to `/search` endpoint
  - Return results array
  - Graceful error handling (return empty array on failure)

**3.3 Supabase Queries**
- Create `src/lib/api/supabase.ts`:
  - `getChatHistory(userId: string): Promise<ChatMessage[]>`
    - Query `n8n_chat_histories` table
    - Filter by `session_id = userId`
    - Parse JSONB `message` column
  - `getStudentProfile(userId: string): Promise<StudentProfile>`
    - Query `student_profiles` table
    - Return single row

### Phase 4: Landing Page

**4.1 Landing Components**
- Create `src/components/landing/HeroSection.tsx`:
  - Title: "AI Tutor — 학생 맞춤형 수학 튜터링"
  - Subtitle: "같은 문제, 학생마다 다른 설명"
  - Target: "고1 수학 — 방정식·함수 단원"
- Create `src/components/landing/ComparisonDemo.tsx`:
  - Use shadcn/ui Tabs component
  - Show hardcoded 상위권 vs 하위권 responses side-by-side
  - Question: "x² + 3x - 10 = 0 풀어줘"
- Create `src/components/landing/ArchitectureDiagram.tsx`:
  - React component with simple boxes/arrows (not image)
  - Show: Frontend → Supabase Auth, Frontend → n8n → Mem0/pgvector/Wolfram/OpenAI
- Create `src/components/landing/DemoAccountCards.tsx` (client component):
  - 4 cards with student info
  - Login button on each card
  - Click → `signIn()` → redirect to `/chat`
- Create `src/components/landing/TestScenarios.tsx`:
  - List of 7 recommended test scenarios
- Create `src/components/landing/ProductionVision.tsx`:
  - Brief roadmap section

**4.2 Assemble Landing Page**
- Modify `src/app/page.tsx`:
  - Compose all 6 landing sections
  - Add scroll navigation

### Phase 5: Chat Page Structure

**5.1 Chat Context**
- Create `src/contexts/ChatContext.tsx`:
  - `messages: ChatMessage[]` state
  - `loading: boolean` state
  - `sendMessage(content: string): Promise<void>` method
    - Optimistic update (add user message immediately)
    - Call n8n API
    - Add AI response to messages
    - Handle errors (remove optimistic message, show toast)
  - Load chat history on mount
- Create `src/hooks/useChat.ts`:
  - Custom hook to consume ChatContext

**5.2 Auth Guard & Layout**
- Create `src/app/chat/layout.tsx`:
  - Check auth session (server-side)
  - Redirect to `/` if not authenticated
  - Wrap children with `<ChatProvider>`
- Create `src/app/chat/page.tsx`:
  - Two-panel layout: `<Sidebar>` + `<ChatArea>`
  - Responsive: drawer on mobile, fixed sidebar on desktop

### Phase 6: Sidebar Components

**6.1 Student Info**
- Create `src/components/chat/StudentInfo.tsx`:
  - Display name
  - Level badge (Badge component with color based on level)
  - Score range

**6.2 Learning Status**
- Create `src/components/chat/LearningStatus.tsx`:
  - Fetch Mem0 data on mount
  - Display weaknesses, strengths, preferences
  - Skeleton during loading
  - Error message if fetch fails (chat still works)

**6.3 Quick Actions**
- Create `src/components/chat/QuickActions.tsx`:
  - 5 button list with predefined questions
  - Click → calls `sendMessage()` from ChatContext

**6.4 Sidebar Assembly**
- Create `src/components/chat/Sidebar.tsx`:
  - Desktop: fixed 280px width
  - Mobile: Sheet drawer with hamburger trigger
  - Contains: StudentInfo + LearningStatus + QuickActions + Logout button
  - Logout → `signOut()` → redirect to `/`

### Phase 7: Chat Interface

**7.1 KaTeX Renderer**
- Create `src/components/chat/KaTeXRenderer.tsx` (client component):
  - Parse text for LaTeX patterns: `\\(...\\)` and `\\[...\\]`
  - Render inline and block math with `react-katex`
  - Fallback to plain text on error

**7.2 Message Display**
- Create `src/components/chat/MessageBubble.tsx`:
  - Student messages: right-aligned, blue background
  - AI messages: left-aligned, gray background, with Avatar
  - Use `<KaTeXRenderer>` for content
  - Show timestamp
- Create `src/components/chat/MessageList.tsx`:
  - Use ScrollArea component
  - Map over messages array
  - Auto-scroll to bottom on new message
  - Loading spinner when AI is responding

**7.3 Message Input**
- Create `src/components/chat/MessageInput.tsx`:
  - Input component + Send button
  - Enter key to send
  - Disabled during loading
  - Clear input after send

**7.4 Chat Area Assembly**
- Create `src/components/chat/ChatArea.tsx`:
  - Header with student name
  - `<MessageList>`
  - `<MessageInput>`

### Phase 8: Polish & Testing

**8.1 Theme Customization**
- Modify `src/app/globals.css`:
  - Change primary color to blue/navy (educational theme)
  - Adjust color variables in `:root` and `.dark`

**8.2 Loading States**
- Add Skeleton components during data fetching
- Add disabled states on buttons during API calls
- Add "AI가 풀이 중..." text with spinner

**8.3 Error Handling**
- Toast for n8n failures: "AI 튜터 응답에 실패했습니다. 다시 시도해주세요."
- Panel message for Mem0 failures: "학습 상태를 불러올 수 없습니다"
- 30-second timeout on all fetch calls

## Critical Files (Build These First)

1. **`src/lib/types.ts`** - Type foundation for entire app
2. **`src/lib/constants.ts`** - All hardcoded data in one place
3. **`src/contexts/AuthContext.tsx`** - Auth state pattern for ChatContext
4. **`src/lib/api/n8n.ts`** - Core backend integration
5. **`src/components/chat/KaTeXRenderer.tsx`** - Essential for math rendering

## Data Models Reference

### Demo Accounts (Pre-created in Supabase)
```typescript
김상위: kim-sangwi@demo.com / demo1234
  uid: 3a0d951f-6fe7-49cf-96e9-d9194fc723fc
  level: 상위 (90+)

이중위: lee-jungwi@demo.com / demo1234
  uid: f273885e-dcb3-4ae5-8155-292445b9f4ca
  level: 중위 (60~80)

박하위: park-hawi@demo.com / demo1234
  uid: 066a45cd-9db3-4bd2-bd53-ac89c04cb29b
  level: 하위 (40~60)

최기초: choi-gicho@demo.com / demo1234
  uid: a1fac652-00f1-461f-b8f5-b740434614ae
  level: 기초 (~40)
```

### Chat Message Format in Database
```json
// Human message in n8n_chat_histories.message (JSONB)
{ "type": "human", "data": { "content": "x² + 3x - 10 = 0 풀어줘" } }

// AI message
{ "type": "ai", "data": { "content": "1) 최종답: x = 2, -5\n..." } }
```

### n8n Response Format
```json
// Response is an ARRAY with one element
[{ "output": "AI response text with \\( LaTeX \\) formulas..." }]
```

### Mem0 Response Format
```json
{
  "results": [
    { "memory": "판별식에서 c 음수일 때 부호 실수 반복", "score": 0.95, ... },
    { "memory": "근의 공식 사용 선호", "score": 0.89, ... }
  ]
}
```

## Verification Plan

### After Phase 1-3 (Infrastructure)
```bash
# Test environment variables load
npm run dev
# Check console for Supabase URL (should not be undefined)

# Test types compile
npm run build
# Should compile with no type errors
```

### After Phase 4 (Landing Page)
1. Visit `http://localhost:3000`
2. Verify all 6 sections render
3. Click on demo account card → should redirect to `/chat` after login
4. Verify comparison demo shows different responses

### After Phase 5-7 (Chat Page)
1. Log in with 김상위 account
2. Verify sidebar shows student info and Mem0 data
3. Type "x² + 3x - 10 = 0 풀어줘" and send
4. Verify AI response appears with LaTeX rendered correctly
5. Click quick action button → message sends automatically
6. Reload page → chat history persists
7. Click logout → redirects to landing page

### Final Testing Checklist
- [ ] All 4 demo accounts can log in
- [ ] Chat sends messages to n8n and displays responses
- [ ] LaTeX formulas render with KaTeX
- [ ] Mem0 learning status displays in sidebar
- [ ] Chat history persists across page reloads
- [ ] Quick actions send predefined questions
- [ ] Logout works and redirects
- [ ] Mobile responsive (sidebar becomes drawer)
- [ ] Errors show toast notifications
- [ ] Loading states display during API calls

## Expected Behavior

### Landing Page Flow
1. User sees hero with title/subtitle
2. Scrolls to comparison demo → sees how different students get different responses
3. Scrolls to demo accounts → clicks on a student card
4. Logs in automatically → redirects to `/chat`

### Chat Page Flow
1. User sees sidebar with their student info (name, level, score)
2. Sidebar shows Mem0 learning status (weaknesses, strengths)
3. User clicks quick action OR types custom question
4. Message appears on right side (student bubble)
5. Loading indicator shows "AI가 풀이 중..."
6. AI response appears on left side with KaTeX-rendered formulas
7. User can continue conversation (multi-turn supported)
8. User reloads page → previous messages still visible
9. User logs out → returns to landing page

## Constraints & Notes

**Must Follow:**
- Server Components by default (no "use client" unless needed)
- All API calls must have error handling
- All loading states must have UI feedback
- LaTeX formulas must render with KaTeX
- Mobile responsive required
- TypeScript strict mode (no `any` types)

**Good to Have (if time permits):**
- Smooth scroll animations
- Message send sound/vibration
- Practice problem code highlighting (e.g., [QE-001])
- Dark mode toggle

**Out of Scope (PoC Limitations):**
- Chat history pagination (load all)
- Message editing/deletion
- Real-time updates (no WebSockets)
- Offline support
- Multiple conversations per user
- User registration (demo accounts only)

## Estimated Timeline

- **Phase 1-3 (Infrastructure)**: 2-3 hours
- **Phase 4 (Landing Page)**: 2-3 hours
- **Phase 5-7 (Chat Page)**: 4-5 hours
- **Phase 8 (Polish & Testing)**: 1-2 hours

**Total**: 10-13 hours of focused development

## Success Criteria

✅ **Minimum Viable:**
- 4 demo accounts can log in
- Chat sends/receives messages from n8n
- LaTeX formulas render correctly
- Basic responsive design works

✅ **PoC Complete:**
- All landing page sections implemented
- Mem0 learning status displays
- Chat history persists
- Error handling works
- Mobile drawer sidebar works

✅ **Production Ready:**
- All test scenarios work
- No console errors
- Vercel deployment successful
- All 4 students show different AI responses to same question
