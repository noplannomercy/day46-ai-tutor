ai-tutor-poc 프로젝트에 과제 모드 기능 추가해줘.

## 배경
교사가 AI Teacher에서 시험 출제 후 [과제로 전달]하면 학생에게 과제가 할당됨.
학생이 AI Tutor 접속 시:
1. 미완료 과제가 있으면 채팅 상단에 알림 배너 표시
2. 채팅은 이미 힌트 모드로 동작 (n8n이 자동 처리, 프론트 수정 불필요)
3. 학생이 충분히 공부 후 [과제 제출] 클릭 → 답안 입력 → 자동 채점 → 완료

핵심: 채팅 자체는 건드리지 않음. 배너 + 제출 버튼 + 답안 폼 + 채점만 추가.

## 테이블 정보 (이미 Supabase에 존재)

### 과제 테이블
```sql
teacher_assignments (
  id serial PRIMARY KEY,
  teacher_id text NOT NULL,
  exam_id integer REFERENCES teacher_exams(id),
  exam_content text NOT NULL,    -- 시험 전체 텍스트 (마크다운: 시험지+정답지+채점기준)
  student_ids text[] NOT NULL,   -- 할당된 학생 uid 배열
  status text DEFAULT 'active',  -- active / closed
  due_date timestamp,
  created_at timestamp DEFAULT now()
)
```

### 학생 제출 테이블
```sql
student_submissions (
  id serial PRIMARY KEY,
  assignment_id integer REFERENCES teacher_assignments(id),
  student_id text NOT NULL,
  answers jsonb NOT NULL DEFAULT '[]'::jsonb,  -- [{problem_num: 1, answer: "x=2, x=-5"}, ...]
  score integer,
  grading_result text,           -- 채점 결과 마크다운
  status text DEFAULT 'pending', -- pending / submitted / graded
  submitted_at timestamp,
  graded_at timestamp,
  created_at timestamp DEFAULT now()
)
```

### 기존 테이블 참고
```sql
student_profiles (user_id, display_name, level, score_range, avatar_emoji, created_at)
teacher_exams (id, teacher_id, topic, difficulty, exam_content, student_id, created_at)
```

## 환경변수 추가
.env.local에 추가:
```
NEXT_PUBLIC_N8N_GRADING_URL=https://n8n.srv812064.hstgr.cloud/webhook-test/a9301e60-32a3-4d8b-b7c7-cb1ac5a631ef
```

## 구현 내용

### 1. 과제 확인 로직 (/chat 페이지)
학생 로그인 후 /chat 진입 시 pending 과제 확인:

```typescript
const { data: pendingSubmission } = await supabase
  .from('student_submissions')
  .select(`
    id, 
    assignment_id, 
    status,
    teacher_assignments (
      id, 
      exam_content, 
      created_at
    )
  `)
  .eq('student_id', userId)
  .eq('status', 'pending')
  .order('created_at', { ascending: false })
  .limit(1)
  .single()
```

### 2. 과제 알림 배너
pending 과제 있으면 채팅 영역 상단에 배너 표시:

```
┌─────────────────────────────────────────────┐
│ 📋 선생님이 내준 과제가 있어요!               │
│    AI와 대화하며 공부한 후 과제를 제출하세요.   │
│                          [과제 제출하기 📝]   │
└─────────────────────────────────────────────┘
```

- 배경: 파란색 계열 (info 스타일)
- [과제 제출하기] 버튼 클릭 → 답안 입력 모달/패널 열기
- pending 과제 없으면 배너 숨김

### 3. 답안 입력 폼 (모달 또는 슬라이드 패널)
[과제 제출하기] 클릭 시 열리는 UI:

a. 상단: "📋 과제 제출" 타이틀

b. 시험 문제 표시:
   - exam_content에서 시험지 부분을 마크다운+KaTeX로 렌더링
   - 문제 구분이 어려우면 exam_content 전체를 그대로 표시해도 OK

c. 답안 입력:
   - 문제 수를 입력하는 필드 (기본값 5)
   - 문제 수만큼 답안 textarea 동적 생성
   - "문제 1 답:", "문제 2 답:", ... 형태
   - 각 textarea는 1~2줄 높이

d. 하단: [제출] 버튼 + [취소] 버튼

### 4. 제출 처리 로직
[제출] 클릭 시:

a. 답안 데이터 구성:
```typescript
const answers = inputValues.map((answer, i) => ({
  problem_num: i + 1,
  answer: answer
}))
```

b. student_submissions UPDATE (status: submitted):
```typescript
await supabase
  .from('student_submissions')
  .update({
    answers: answers,
    status: 'submitted',
    submitted_at: new Date().toISOString()
  })
  .eq('id', submissionId)
```

c. 자동 채점 webhook 호출:
```typescript
// exam_content에서 문제+정답 추출이 어려우므로
// 전체 exam_content + 학생 답안을 채점 webhook에 전달
const response = await fetch(process.env.NEXT_PUBLIC_N8N_GRADING_URL!, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    teacher_id: 'auto-grading',
    student_id: userId,
    problems: answers.map((a, i) => ({
      id: `Q-${i + 1}`,
      question: `과제 문제 ${i + 1}`,
      correct_answer: '시험지 정답 참조',
      student_answer: a.answer
    }))
  })
})
const data = await response.json()
const gradingResult = data[0]?.output || ''
```

⚠️ 참고: 현재 채점 webhook은 문제+정답+학생답을 받아서 채점함.
exam_content에 정답지가 포함되어 있으므로, 
더 정확한 채점을 위해 problems 배열 대신 exam_content 전체를 보내는 방식도 고려.

대안 방식 (exam_content 통째로 전달):
```typescript
body: JSON.stringify({
  teacher_id: 'auto-grading',
  student_id: userId,
  exam_content: assignment.exam_content,
  student_answers: answers
})
```
→ 이 경우 n8n 채점 워크플로우 수정 필요할 수 있음.
→ 우선은 기존 problems 형태로 보내고, 정확도 이슈 있으면 나중에 개선.

d. 채점 결과로 submission 최종 UPDATE:
```typescript
await supabase
  .from('student_submissions')
  .update({
    grading_result: gradingResult,
    status: 'graded',
    graded_at: new Date().toISOString()
  })
  .eq('id', submissionId)
```

### 5. 채점 결과 표시
제출 완료 후:
- 모달 내용을 채점 결과로 교체
- 채점 결과 마크다운+KaTeX 렌더링
- "✅ 과제 제출 완료! 수고했어요 👏"
- [닫기] 버튼 → 모달 닫힘 → 배너 사라짐 → 자유 채팅 모드

### 6. 상태별 UI 정리

```
과제 없음 (pending 0개):
  → 배너 없음, 기존 채팅 그대로

과제 있음 (pending 1개):
  → 상단 배너 표시 + [과제 제출하기] 버튼
  → 채팅은 힌트 모드로 자동 동작 (n8n 처리)

과제 제출 중:
  → 모달 열림 → 시험 문제 + 답안 입력

제출 완료:
  → "채점 중..." 로딩
  → 채점 결과 표시
  → [닫기] → 배너 사라짐 → 자유 모드

이미 완료된 과제 (graded):
  → 배너 표시하지 않음
```

### 7. 추가 Supabase 쿼리 함수 (lib/api.ts 또는 새 파일)
```typescript
// 과제 확인
export async function getPendingAssignment(supabase, userId: string) {
  return supabase
    .from('student_submissions')
    .select('id, assignment_id, status, teacher_assignments(id, exam_content, created_at)')
    .eq('student_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()
}

// 답안 제출
export async function submitAnswers(supabase, submissionId: number, answers: any[]) {
  return supabase
    .from('student_submissions')
    .update({
      answers,
      status: 'submitted',
      submitted_at: new Date().toISOString()
    })
    .eq('id', submissionId)
}

// 채점 결과 저장
export async function saveGradingResult(supabase, submissionId: number, result: string) {
  return supabase
    .from('student_submissions')
    .update({
      grading_result: result,
      status: 'graded',
      graded_at: new Date().toISOString()
    })
    .eq('id', submissionId)
}
```

## 주의사항
- 기존 채팅 기능 절대 건드리지 말 것. 배너와 모달만 추가.
- n8n 채팅 webhook은 수정 불필요. 이미 과제 감지 + 힌트 모드 동작 중.
- KaTeX 렌더링은 기존 프로젝트에 이미 설정되어 있음.
- shadcn/ui Dialog 또는 Sheet 컴포넌트 활용.

완료 후 npm run build 통과 확인.