# AI Tutor PoC — 학생 맞춤형 수학 튜터링 시스템

> **같은 수학 문제를 물어도, 학생의 실력에 따라 AI가 완전히 다르게 가르칩니다.**

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth-green?logo=supabase)](https://supabase.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 📌 프로젝트 개요

디지털 교과서 포털에서 AI 기반 **개인화 수학 튜터링 시스템**의 실현 가능성을 증명하는 PoC(Proof of Concept)입니다.

### 핵심 컨셉

**"같은 문제를 질문해도, 학생의 수학 능력과 학습 이력에 따라 완전히 다른 설명과 연습문제를 제공한다."**

- **상위권 학생** → 인수분해로 빠르게 풀이, 심화 문제 유도
- **하위권 학생** → 기초 개념부터 단계별 설명, 예시 중심

### PoC 범위

- **대상 과목**: 고등학교 1학년 수학
- **대상 단원**: 방정식·함수 (이차방정식, 이차함수, 이차부등식, 연립방정식, 일차함수)
- **문제은행**: 30문제 (pgvector 55청크 저장)
- **데모 학생**: 4명 (성적 분포별 페르소나)

---

## ✨ 주요 기능

### 1. 학생 맞춤 설명

같은 문제 **"x² + 3x - 10 = 0 풀어줘"** 를 물었을 때:

**🏆 상위권 학생에게는:**
> 인수분해로 빠르게 풀 수 있습니다. (x+5)(x-2)=0이므로 x=-5 또는 x=2.
> 심화: 근과 계수의 관계도 확인해볼까요?

**🌱 기초 부족 학생에게는:**
> 먼저 이차방정식이 뭔지부터 확인하자.
> x에 숫자를 넣어보자. x=2를 넣으면 4+6-10=0 맞지?
> 이렇게 답을 찾을 수 있어.

### 2. 실수 패턴 기억 (Mem0)

AI가 학생과 대화하면서 약점을 자동으로 파악하고 **영구적으로 기억**합니다.

\`\`\`
📚 이중위 학생 - AI가 기억하고 있는 정보:
• 판별식에서 c가 음수일 때 부호를 자주 틀림
• 근의 공식 대입 후 부호 처리 오류 반복
• 검산을 거의 하지 않음
\`\`\`

→ 다음 대화에서 **"판별식 부호 주의!"** 자동 경고

### 3. 맞춤 연습문제 추천 (RAG)

30문제 검증된 문제은행에서 학생 약점에 맞는 문제를 자동 선택합니다.

- **상위권** → 응용·심화 문제 추천
- **하위권** → 기초·개념 문제 추천

---

## 🎯 데모 체험

### 데모 계정 (비밀번호: \`demo1234\`)

| 학생 | 이메일 | 실력 | 특징 |
|------|--------|------|------|
| 🏆 김상위 | kim-sangwi@demo.com | 90점 이상 | 인수분해 능숙, 심화 문제 선호 |
| 📚 이중위 | lee-jungwi@demo.com | 60~80점 | 판별식 부호 실수 반복 |
| ✏️ 박하위 | park-hawi@demo.com | 40~60점 | 이차/일차 개념 혼동 |
| 🌱 최기초 | choi-gicho@demo.com | 40점 미만 | 분배법칙 불안정, 기초부터 필요 |

### 추천 체험 시나리오

#### 시나리오 1: 개인화 비교 (2분)
1. **김상위**로 로그인
2. "x² + 3x - 10 = 0 풀어줘" 입력
3. 응답 확인 후 로그아웃
4. **최기초**로 로그인
5. 같은 질문 입력 → **완전히 다른 응답** 확인

#### 시나리오 2: 약점 확인 (1분)
1. 아무 학생으로 로그인
2. "나 어디가 약해?" 입력
3. AI가 학생의 약점을 정리해서 알려줌

#### 시나리오 3: 대화 기억 (2분)
1. 이중위로 로그인
2. 문제 풀이 요청 → 응답 확인
3. "아까 그거 인수분해로는?" → **이전 대화를 기억**하고 응답
4. 로그아웃 후 재로그인 → 대화 기록 유지

#### 시나리오 4: 연습문제 추천 (1분)
1. "연습문제 추천해줘" 입력
2. 학생 약점에 맞는 문제가 자동 추천됨

---

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 15 + TypeScript (App Router)
- **UI**: shadcn/ui (new-york) + Tailwind CSS 4
- **Auth**: Supabase Auth (SSR mode)
- **Math Rendering**: KaTeX (react-katex)
- **Deployment**: Vercel

### Backend (이미 구축 완료)
- **Workflow**: n8n (Self-hosted)
- **LLM**: OpenAI GPT-4o
- **Long-term Memory**: Mem0 (Self-hosted)
- **Short-term Memory**: Postgres Chat Memory
- **Vector DB**: Supabase pgvector (문제은행 RAG)
- **Database**: Supabase PostgreSQL
- **Math Verification**: Wolfram Alpha API

---

## 🏗 시스템 아키텍처

### 이중 메모리 시스템

| | Mem0 (장기 기억) | Postgres Chat Memory (단기 기억) |
|---|---|---|
| **저장 대상** | 수학 능력, 약점, 학습 패턴 | 대화 원문 (질문+응답) |
| **지속성** | 영구 | 세션 단위 |
| **용도** | "이 학생은 부호 실수가 많다" | "방금 이차방정식 풀었다" |
| **비유** | 학생 생활기록부 | 오늘 수업 노트 |

### 데이터 흐름

\`\`\`
학생 질문
  → AI가 학생의 약점/패턴 확인 (Mem0)
  → 문제은행에서 관련 내용 검색 (pgvector RAG)
  → 학생 수준에 맞는 설명 생성 (GPT-4o)
  → 수학 계산 검증 (Wolfram Alpha)
  → 연습문제 추천
  → 새로운 약점 발견 시 기억에 저장 (Mem0)
\`\`\`

---

## 🚀 시작하기

### 1. 필수 요구사항

- Node.js 20+
- npm 또는 pnpm

### 2. 설치

\`\`\`bash
# 저장소 클론
git clone <repository-url>
cd day46-ai-tutor

# 의존성 설치
npm install
\`\`\`

### 3. 환경 변수 설정

\`.env.local\` 파일 생성:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=https://muefuihjjihdihzjpvbk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_N8N_WEBHOOK_URL=https://n8n.srv812064.hstgr.cloud/webhook/6350e749-78cb-4a00-890d-cfa59faafac8
NEXT_PUBLIC_MEM0_API_URL=http://193.168.195.222:8888
\`\`\`

### 4. 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

http://localhost:3000 에서 확인

### 5. 프로덕션 빌드

\`\`\`bash
npm run build
npm start
\`\`\`

---

## 📦 배포 (Vercel)

### 자동 배포

1. GitHub 저장소와 Vercel 연결
2. Vercel 대시보드에서 환경 변수 설정
3. 자동 빌드 및 배포

### 환경 변수 설정

Vercel 대시보드 → Settings → Environment Variables에서 다음 변수 추가:

- \`NEXT_PUBLIC_SUPABASE_URL\`
- \`NEXT_PUBLIC_SUPABASE_ANON_KEY\`
- \`NEXT_PUBLIC_N8N_WEBHOOK_URL\`
- \`NEXT_PUBLIC_MEM0_API_URL\`

---

## 📚 문서

프로젝트의 상세 문서는 \`/docs\` 폴더 또는 랜딩 페이지 하단에서 다운로드할 수 있습니다:

- **📄 기술소개서** (\`AI_Tutor_PoC_기술소개서.md\`) - 기술 스택, 아키텍처, 구현 상세
- **📖 데모가이드** (\`AI_Tutor_PoC_데모가이드.md\`) - 시연 시나리오 및 테스트 방법
- **💾 문제 데이터** (\`math_problems_g1.md\`) - 고1 수학 방정식·함수 단원 문제은행

추가 문서:
- \`CLAUDE.md\` - 프로젝트 가이드 및 코딩 컨벤션
- \`IMPLEMENTATION.md\` - 단계별 구현 계획

---

## 🎓 주요 컴포넌트

### 페이지 구조

\`\`\`
src/
├── app/
│   ├── page.tsx              # 랜딩 페이지 (6개 섹션)
│   └── chat/
│       ├── layout.tsx        # Auth guard + ChatProvider
│       └── page.tsx          # 채팅 인터페이스
├── components/
│   ├── landing/              # 랜딩 페이지 섹션 (6개)
│   ├── chat/                 # 채팅 컴포넌트 (10개)
│   └── ui/                   # shadcn/ui 컴포넌트
├── contexts/
│   ├── AuthContext.tsx       # Supabase 인증 상태
│   └── ChatContext.tsx       # 채팅 메시지 관리
└── lib/
    ├── api/                  # API 통합 (n8n, mem0, supabase)
    ├── supabase/             # Supabase 클라이언트 (server, client)
    ├── types.ts              # TypeScript 타입 정의
    └── constants.ts          # 데모 계정, 하드코딩 데이터
\`\`\`

### 주요 기능

- ✅ **Supabase SSR 인증** - 미들웨어 기반 라우트 보호
- ✅ **n8n 웹훅 통합** - AI 튜터 응답 생성
- ✅ **Mem0 학습 상태** - 학생별 약점 표시
- ✅ **KaTeX 수식 렌더링** - LaTeX 수식 실시간 표시
- ✅ **채팅 히스토리** - 세션 간 대화 기록 유지
- ✅ **반응형 디자인** - 데스크톱/모바일 최적화

---

## 🚧 프로덕션 로드맵

| | PoC (현재) | 프로덕션 (향후) |
|---|---|---|
| 학생 데이터 | 4명 데모 계정 | **NEIS 평가 데이터 자동 연동** |
| 과목 범위 | 고1 방정식·함수 | 전 학년 전 단원 |
| 문제은행 | 30문제 | 수천 문제 + 기출문제 |
| AI 기능 | 설명 + 추천 | **출제 + 채점 + 약점 알림** |
| 교사 기능 | 없음 | **교안 관리, 학생 관리, 리포트** |
| 학습 추천 | 질문 시에만 | **AI가 먼저 약점 알림 + 추천** |

### 향후 확장 단계

- **Phase 5**: AI가 문제를 출제하고 채점하는 기능
- **Phase 6**: NEIS 성적 데이터 자동 연동
- **Phase 7**: 교사용 관리 플랫폼
- **Phase 8**: AI가 먼저 학습을 추천하는 능동형 튜터링

---

## 🎯 기대 효과

1. **학습 격차 해소** — 기초 부족 학생도 수준에 맞는 설명을 받을 수 있음
2. **교사 업무 경감** — 개별 학생 맞춤 지도의 AI 자동화
3. **실시간 약점 파악** — 시험 전에 학생의 약점을 파악하고 보강
4. **자기주도 학습** — 학생이 스스로 질문하고, AI가 수준에 맞게 응답

---

## 📝 라이선스

이 프로젝트는 PoC(Proof of Concept) 용도로 개발되었습니다.

---

## 🙋 문의

프로젝트 관련 문의사항은 이슈를 등록하거나 문서를 참조해주세요.

**Last Updated**: 2026-02-15  
**Project Status**: ✅ PoC Complete
