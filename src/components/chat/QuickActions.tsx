'use client';

import { useChat } from '@/hooks/useChat';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { QUICK_ACTIONS } from '@/lib/constants';

export function QuickActions() {
  const { sendMessage, loading } = useChat();

  const handleQuickAction = (question: string) => {
    if (!loading) {
      sendMessage(question);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">빠른 질문</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {QUICK_ACTIONS.map((action, index) => (
          <Button
            key={index}
            variant="outline"
            className="w-full justify-start text-left text-sm"
            onClick={() => handleQuickAction(action)}
            disabled={loading}
          >
            {action}
          </Button>
        ))}
      </CardContent>
    </Card>
  );
}
