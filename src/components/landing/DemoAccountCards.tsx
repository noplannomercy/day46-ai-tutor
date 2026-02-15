'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DEMO_ACCOUNTS } from '@/lib/constants';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export function DemoAccountCards() {
  const { signIn } = useAuth();
  const [loadingAccount, setLoadingAccount] = useState<string | null>(null);

  const handleLogin = async (email: string, password: string) => {
    setLoadingAccount(email);
    try {
      await signIn(email, password);
    } catch (error) {
      // Error is already handled in AuthContext with toast
    } finally {
      setLoadingAccount(null);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case '상위':
        return 'bg-blue-100 text-blue-800';
      case '중위':
        return 'bg-green-100 text-green-800';
      case '하위':
        return 'bg-yellow-100 text-yellow-800';
      case '기초':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
          데모 계정으로 체험하기
        </h2>
        <p className="mb-12 text-center text-lg text-gray-600">
          다양한 수준의 학생 계정으로 AI 튜터를 체험해보세요
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {DEMO_ACCOUNTS.map((account) => (
            <Card key={account.uid} className="flex flex-col">
              <CardHeader>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-4xl">{account.emoji}</span>
                  <Badge className={getLevelColor(account.level)}>
                    {account.level}권
                  </Badge>
                </div>
                <CardTitle className="text-xl">{account.name}</CardTitle>
                <CardDescription className="text-sm">
                  성적: {account.scoreRange}점
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col">
                <p className="mb-4 flex-1 text-sm text-gray-600">
                  {account.description}
                </p>
                <Button
                  onClick={() => handleLogin(account.email, account.password)}
                  disabled={loadingAccount !== null}
                  className="w-full"
                >
                  {loadingAccount === account.email
                    ? '로그인 중...'
                    : '로그인하기'}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-gray-500">
          모든 계정의 비밀번호: demo1234
        </p>
      </div>
    </section>
  );
}
