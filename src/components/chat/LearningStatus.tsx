'use client';

import { useEffect, useState } from 'react';
import { Mem0Memory } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';

interface LearningStatusProps {
  userId: string;
}

export function LearningStatus({ userId }: LearningStatusProps) {
  const [memories, setMemories] = useState<Mem0Memory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    loadLearningStatus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const loadLearningStatus = async () => {
    console.log('[LearningStatus] Loading for userId:', userId);
    setLoading(true);
    setError(false);

    try {
      // Use Next.js API route instead of direct call to avoid CORS
      const response = await fetch('/api/mem0', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      console.log('[LearningStatus] Response status:', response.status);

      if (!response.ok) {
        throw new Error('Failed to fetch learning status');
      }

      const data = await response.json();
      console.log('[LearningStatus] Data received:', data);
      const memories = data.results || [];
      console.log('[LearningStatus] Memories count:', memories.length);
      setMemories(memories);

      if (memories.length === 0) {
        setError(true);
      }
    } catch (err) {
      console.error('[LearningStatus] Error:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">학습 상태</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">학습 상태</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <AlertCircle className="h-4 w-4" />
            <span>학습 상태를 불러올 수 없습니다</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">학습 상태</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {memories.slice(0, 5).map((memory, index) => (
            <li key={index} className="text-sm text-gray-700">
              <span className="mr-2 text-gray-400">•</span>
              {memory.memory}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
