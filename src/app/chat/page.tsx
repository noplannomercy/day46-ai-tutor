import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getStudentProfile } from '@/lib/api/supabase';
import { ChatPageClient } from '@/components/chat/ChatPageClient';

export default async function ChatPage() {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect('/');
  }

  const profile = await getStudentProfile(session.user.id);

  if (!profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500">프로필을 불러올 수 없습니다.</p>
      </div>
    );
  }

  return <ChatPageClient profile={profile} />;
}
