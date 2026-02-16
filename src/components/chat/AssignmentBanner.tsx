'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface AssignmentBannerProps {
  onSubmit: () => void;
}

export function AssignmentBanner({ onSubmit }: AssignmentBannerProps) {
  return (
    <Card className="mb-4 border-blue-200 bg-blue-50 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-blue-900">
            <span className="text-xl">📋</span>
            <span className="font-semibold">선생님이 내준 과제가 있어요!</span>
          </div>
          <p className="mt-1 text-sm text-blue-700">
            AI와 대화하며 공부한 후 과제를 제출하세요.
          </p>
        </div>
        <Button
          onClick={onSubmit}
          variant="default"
          className="bg-blue-600 hover:bg-blue-700"
        >
          과제 제출하기 📝
        </Button>
      </div>
    </Card>
  );
}
