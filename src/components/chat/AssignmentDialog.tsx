'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { PendingAssignment, StudentAnswer, GradingProblem } from '@/lib/types';
import { parseExamContent, formatProblemNumber } from '@/lib/utils/examParser';
import {
  submitAnswersClient,
  saveGradingResultClient,
} from '@/lib/api/supabaseClient';
import { submitForGrading } from '@/lib/api/grading';
import { KaTeXRenderer } from './KaTeXRenderer';

interface AssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: PendingAssignment;
  studentId: string;
  onComplete: () => void;
}

type DialogState = 'input' | 'confirm' | 'grading' | 'result';

export function AssignmentDialog({
  open,
  onOpenChange,
  assignment,
  studentId,
  onComplete,
}: AssignmentDialogProps) {
  const [dialogState, setDialogState] = useState<DialogState>('input');
  const [answers, setAnswers] = useState<string[]>([]);
  const [gradingResult, setGradingResult] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);

  // Parse exam content
  const examContent = assignment.teacher_assignments.exam_content;
  const parsedExam = parseExamContent(examContent);
  const { problems, answers: correctAnswers, problemCount } = parsedExam;

  // Initialize answers array when dialog opens
  if (answers.length === 0 && problemCount > 0) {
    setAnswers(new Array(problemCount).fill(''));
  }

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleSubmitClick = () => {
    // Validate answers
    const hasEmptyAnswers = answers.some(answer => answer.trim() === '');
    if (hasEmptyAnswers) {
      toast.error('모든 문제에 답을 입력해주세요.');
      return;
    }

    // Show confirmation dialog
    setShowConfirm(true);
  };

  const handleConfirmSubmit = async () => {
    setShowConfirm(false);
    setDialogState('grading');

    try {
      // 1. Prepare student answers
      const studentAnswers: StudentAnswer[] = answers.map((answer, i) => ({
        problem_num: i + 1,
        answer: answer.trim(),
      }));

      // 2. Submit answers to database
      const submitSuccess = await submitAnswersClient(
        assignment.id,
        studentAnswers
      );
      if (!submitSuccess) {
        throw new Error('답안 제출에 실패했습니다');
      }

      // 3. Prepare grading request
      const gradingProblems: GradingProblem[] = problems.map((question, i) => ({
        id: `Q-${i + 1}`,
        question,
        correct_answer: correctAnswers[i] || '정답 없음',
        student_answer: answers[i].trim(),
      }));

      // 4. Call grading webhook
      const result = await submitForGrading({
        teacher_id: 'auto-grading',
        student_id: studentId,
        problems: gradingProblems,
      });

      // 5. Save grading result
      const saveSuccess = await saveGradingResultClient(assignment.id, result);
      if (!saveSuccess) {
        throw new Error('채점 결과 저장에 실패했습니다');
      }

      // 6. Show result
      setGradingResult(result);
      setDialogState('result');
    } catch (error) {
      console.error('Grading error:', error);

      // Keep status as 'submitted' so student can retry
      await saveGradingResultClient(
        assignment.id,
        '채점에 실패했습니다. 잠시 후 다시 시도해주세요.',
        'submitted'
      );

      toast.error('채점에 실패했습니다', {
        description: '다시 시도해주세요.',
      });

      setDialogState('input');
    }
  };

  const handleClose = () => {
    if (dialogState === 'result') {
      // Completed - refresh page to hide banner
      onComplete();
    }
    onOpenChange(false);
    // Reset state
    setDialogState('input');
    setAnswers([]);
    setGradingResult('');
  };

  const handleCancel = () => {
    onOpenChange(false);
    // Reset state
    setDialogState('input');
    setAnswers([]);
    setGradingResult('');
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span>📋</span>
              {dialogState === 'result' ? '채점 결과' : '과제 제출'}
            </DialogTitle>
            <DialogDescription>
              {dialogState === 'input' &&
                '시험 문제를 확인하고 답안을 입력하세요.'}
              {dialogState === 'grading' && '채점 중입니다. 잠시만 기다려주세요...'}
              {dialogState === 'result' && '과제가 채점되었습니다.'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Input State - Show problems and answer inputs */}
            {dialogState === 'input' && (
              <>
                {/* Problem Display */}
                <div className="rounded-lg border bg-gray-50 p-4">
                  <h3 className="mb-3 font-semibold text-gray-900">시험 문제</h3>
                  <div className="space-y-4">
                    {problems.map((problem, i) => (
                      <div key={i} className="text-sm">
                        <div className="font-medium text-gray-700">
                          {i + 1}. <KaTeXRenderer content={problem} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Answer Inputs */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-gray-900">답안 입력</h3>
                  {problems.map((_, i) => (
                    <div key={i} className="space-y-2">
                      <label className="text-sm font-medium text-gray-700">
                        {formatProblemNumber(i + 1)} 답:
                      </label>
                      <Textarea
                        value={answers[i] || ''}
                        onChange={e => handleAnswerChange(i, e.target.value)}
                        placeholder="답안을 입력하세요"
                        className="min-h-[60px]"
                      />
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* Grading State */}
            {dialogState === 'grading' && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="mb-4 text-6xl">⏳</div>
                <p className="text-lg font-medium text-gray-700">채점 중입니다...</p>
                <p className="mt-2 text-sm text-gray-500">
                  잠시만 기다려주세요.
                </p>
              </div>
            )}

            {/* Result State */}
            {dialogState === 'result' && (
              <div className="space-y-4">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <div className="flex items-center gap-2 text-green-900">
                    <span className="text-xl">✅</span>
                    <span className="font-semibold">
                      과제 제출 완료! 수고했어요 👏
                    </span>
                  </div>
                </div>

                <div className="rounded-lg border bg-white p-4">
                  <h3 className="mb-3 font-semibold text-gray-900">채점 결과</h3>
                  <div className="prose prose-sm max-w-none">
                    <KaTeXRenderer content={gradingResult} />
                  </div>
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            {dialogState === 'input' && (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  취소
                </Button>
                <Button onClick={handleSubmitClick}>제출</Button>
              </>
            )}
            {dialogState === 'result' && (
              <Button onClick={handleClose}>닫기</Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>정말 제출하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              제출 후에는 답안을 수정할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmSubmit}>
              제출하기
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
