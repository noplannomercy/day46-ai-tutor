'use client';

import { StudentProfile } from '@/lib/types';
import { StudentInfo } from './StudentInfo';
import { LearningStatus } from './LearningStatus';
import { QuickActions } from './QuickActions';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { LogOut } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

interface SidebarProps {
  profile: StudentProfile;
}

export function Sidebar({ profile }: SidebarProps) {
  const { signOut } = useAuth();

  return (
    <div className="flex h-full w-full flex-col gap-4 overflow-y-auto bg-gray-50 p-4">
      <StudentInfo profile={profile} />
      <LearningStatus userId={profile.user_id} />
      <QuickActions />

      <Separator />

      <Button
        variant="outline"
        className="w-full"
        onClick={signOut}
      >
        <LogOut className="mr-2 h-4 w-4" />
        로그아웃
      </Button>
    </div>
  );
}
