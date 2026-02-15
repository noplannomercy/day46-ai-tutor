import { DemoAccount } from './types';

// Demo accounts with actual UIDs from Supabase
export const DEMO_ACCOUNTS: DemoAccount[] = [
  {
    name: '김상위',
    email: 'kim-sangwi@demo.com',
    password: 'demo1234',
    uid: '3a0d951f-6fe7-49cf-96e9-d9194fc723fc',
    level: '상위',
    scoreRange: '90+',
    description: '인수분해 능숙, 심화 문제 선호',
    emoji: '🎯',
  },
  {
    name: '이중위',
    email: 'lee-jungwi@demo.com',
    password: 'demo1234',
    uid: 'f273885e-dcb3-4ae5-8155-292445b9f4ca',
    level: '중위',
    scoreRange: '60~80',
    description: '판별식 부호 실수 반복, 근의 공식 선호',
    emoji: '📚',
  },
  {
    name: '박하위',
    email: 'park-hawi@demo.com',
    password: 'demo1234',
    uid: '066a45cd-9db3-4bd2-bd53-ac89c04cb29b',
    level: '하위',
    scoreRange: '40~60',
    description: '이차/일차 개념 혼동, 부호 계산 취약',
    emoji: '📝',
  },
  {
    name: '최기초',
    email: 'choi-gicho@demo.com',
    password: 'demo1234',
    uid: 'a1fac652-00f1-461f-b8f5-b740434614ae',
    level: '기초',
    scoreRange: '~40',
    description: '분배법칙 불안정, 분수 계산 어려움',
    emoji: '🌱',
  },
];

// Hardcoded comparison demo data for landing page
export const COMPARISON_QUESTION = 'x² + 3x - 10 = 0 풀어줘';

export const COMPARISON_RESPONSES = {
  상위: '인수분해로 빠르게 풀 수 있습니다. x²+3x-10 = (x+5)(x-2) = 0이므로 x=-5 또는 x=2입니다. 심화: 근과 계수의 관계도 확인해볼까요?',
  기초: '먼저 이차방정식이 뭔지부터 확인하자. x²이 있으면 이차방정식이야. x²+3x-10=0에서 x에 숫자를 하나씩 넣어보면서 이해해보자. x=2를 넣으면 4+6-10=0 맞지? 이렇게 답을 찾을 수 있어.',
};

// Quick action questions for chat sidebar
export const QUICK_ACTIONS = [
  'x² + 3x - 10 = 0 풀어줘',
  '판별식이 뭐야?',
  '나 어디가 약해?',
  '연습문제 추천해줘',
  '이차방정식 요약해줘',
];

// Test scenarios for landing page
export const TEST_SCENARIOS = [
  {
    title: '시나리오 1: 개인화 비교',
    description: '같은 문제를 다른 학생으로 로그인해서 비교해보세요',
  },
  {
    title: '시나리오 2: 약점 확인',
    description: '"나 어디가 약해?" 물어보기',
  },
  {
    title: '시나리오 3: 연습문제 추천',
    description: '"연습문제 추천해줘" 요청하기',
  },
  {
    title: '시나리오 4: 대화 기억',
    description: '대화 후 로그아웃 → 재로그인 → AI가 기억하는지 확인',
  },
  {
    title: '시나리오 5: 단원 요약',
    description: '"이차방정식 요약해줘" 요청하기',
  },
  {
    title: '시나리오 6: 개념 질문',
    description: '"판별식이 뭐야?" 개념 질문하기',
  },
  {
    title: '시나리오 7: 멀티턴 대화',
    description: '문제 풀이 후 "아까 그거 인수분해로는?" 후속 질문하기',
  },
];

// Production vision items
export const PRODUCTION_FEATURES = [
  {
    title: 'NEIS 연동',
    description: '교과/비교과 평가 데이터 자동 연동으로 학생 프로필 자동 생성',
  },
  {
    title: '교사 플랫폼',
    description: '교안 관리, 시험 출제, 학생 관리 통합 시스템',
  },
  {
    title: 'Multi-Agent',
    description: '출제, 채점, Q&A Agent 분리 오케스트레이션',
  },
  {
    title: 'AI 주도 학습',
    description: '푸시 알림, 약점 알림, 성장 피드백 자동 제공',
  },
];

// Architecture components for diagram
export const ARCHITECTURE_COMPONENTS = {
  frontend: {
    title: 'Frontend',
    tech: 'Next.js + Supabase Auth + KaTeX',
    items: ['랜딩 페이지', 'AI Tutor 채팅'],
  },
  backend: {
    title: 'Backend',
    tech: 'n8n Workflow',
    items: ['Mem0 (학습 프로필)', 'pgvector (문제은행)', 'Wolfram (계산 검증)', 'OpenAI GPT-4o'],
  },
};
