1. 채점 webhook → 방식 A. 기존 n8n 형식 그대로. 수정 없음.
   problems 배열에 exam_content에서 파싱한 문제+정답 넣어서 보냄:
   {
     teacher_id: 'auto-grading',
     student_id: userId,
     problems: [
       { id: "Q-1", question: "2x²+5x-3=0의 두 근을 구하시오", correct_answer: "x₁=1/2, x₂=-3", student_answer: "학생답" },
       ...
     ]
   }

2. exam_content 구조 확인됨:
   ### 시험지  → 학생에게 보여줄 부분
   ### 정답지  → 숨김 (채점 webhook에만 전달)
   ### 채점 기준 → 숨김

3. 파싱 로직:
   - "### 시험지"와 "### 정답지" 사이 텍스트 → 학생에게 표시
   - "### 정답지"와 "### 채점 기준" 사이 → 채점 시 correct_answer로 사용
   - 문제 구분: "1.", "2.", "3." 등 숫자+점으로 split
   - 문제 수: 자동 파싱 (split 결과 count). 수동 입력 불필요.

4. 문제 수 → exam_content에서 시험지 파트의 "1.", "2." 카운트로 자동 결정. 학생 입력 X.

5. 제출 후 수정 불가. 확인 다이얼로그: "정말 제출하시겠습니까? 제출 후 수정 불가."

6. 마감일 → PoC 무시. 표시도 안 함.

7. 채점 결과 다시 보기 → PoC 범위 외. 한 번 보고 끝.

8. UI → Dialog (모달)

9. score → null. grading_result 마크다운만 저장.

10. 과제 여러 개 → 최신 1개만.

11. API 라우트 → 클라이언트 직접 호출. 기존 패턴 동일.

12. 에러 처리:
    - 채점 중: "채점 중입니다... ⏳" (타임아웃 30초)
    - 실패 시: status를 submitted 유지 + 토스트 에러 + 재시도 가능