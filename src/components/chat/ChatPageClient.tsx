'use client';

import { useState, useEffect } from 'react';
import { StudentProfile } from '@/lib/types';
import { Sidebar } from './Sidebar';
import { ChatArea } from './ChatArea';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface ChatPageClientProps {
  profile: StudentProfile;
}

export function ChatPageClient({ profile }: ChatPageClientProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Scroll to top when component mounts
    window.scrollTo(0, 0);

    // Disable body scroll for chat page only
    document.body.style.overflow = 'hidden';

    return () => {
      // Re-enable body scroll when leaving chat page
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <div className="flex h-full overflow-hidden">
      {/* Desktop Sidebar */}
      <div className="hidden w-80 shrink-0 md:block">
        <Sidebar profile={profile} />
      </div>

      {/* Mobile Sidebar (Sheet) - Only render after mount to avoid hydration mismatch */}
      {mounted && (
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="fixed left-4 top-4 z-50"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-80 p-0">
              <Sidebar profile={profile} />
            </SheetContent>
          </Sheet>
        </div>
      )}

      {/* Chat Area */}
      <div className="flex-1">
        <ChatArea studentName={profile.display_name} />
      </div>
    </div>
  );
}
