import { StudentProfile } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StudentInfoProps {
  profile: StudentProfile;
}

export function StudentInfo({ profile }: StudentInfoProps) {
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
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="text-3xl">{profile.avatar_emoji}</span>
          <Badge className={getLevelColor(profile.level)}>
            {profile.level}권
          </Badge>
        </div>
        <CardTitle className="text-xl">{profile.display_name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600">성적: {profile.score_range}점</p>
      </CardContent>
    </Card>
  );
}
