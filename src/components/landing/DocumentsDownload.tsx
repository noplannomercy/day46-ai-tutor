import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BookOpen, Database } from 'lucide-react';

const DOCUMENTS = [
  {
    title: '기술소개서',
    description: 'AI Tutor PoC의 기술 스택, 아키텍처, 구현 상세',
    icon: FileText,
    file: '/docs/AI_Tutor_PoC_기술소개서.md',
    size: '28 KB',
  },
  {
    title: '데모 가이드',
    description: '시연 시나리오 및 테스트 방법 안내',
    icon: BookOpen,
    file: '/docs/AI_Tutor_PoC_데모가이드.md',
    size: '5 KB',
  },
  {
    title: '문제 데이터',
    description: '고1 수학 방정식·함수 단원 문제은행',
    icon: Database,
    file: '/docs/math_problems_g1.md',
    size: '11 KB',
  },
];

export function DocumentsDownload() {
  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            문서 다운로드
          </h2>
          <p className="text-lg text-gray-600">
            PoC 관련 기술 문서 및 데이터를 다운로드하세요
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {DOCUMENTS.map((doc) => (
            <Card key={doc.file} className="flex flex-col">
              <CardHeader>
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
                  <doc.icon className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{doc.title}</CardTitle>
                <CardDescription className="text-sm">
                  {doc.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-1 flex-col justify-end">
                <div className="mb-4 text-sm text-gray-500">
                  파일 크기: {doc.size}
                </div>
                <Button asChild className="w-full">
                  <a href={doc.file} download>
                    <Download className="mr-2 h-4 w-4" />
                    다운로드
                  </a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
