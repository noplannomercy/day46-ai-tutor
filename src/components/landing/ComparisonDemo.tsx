import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { COMPARISON_QUESTION, COMPARISON_RESPONSES } from '@/lib/constants';

export function ComparisonDemo() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          개인화 비교 데모
        </h2>
        <p className="mb-8 text-center text-lg text-gray-600">
          같은 질문에 학생 수준별로 다른 설명을 제공합니다
        </p>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">질문</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg font-medium">{COMPARISON_QUESTION}</p>
          </CardContent>
        </Card>

        <Tabs defaultValue="상위" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="상위">상위권 학생 (90+)</TabsTrigger>
            <TabsTrigger value="기초">기초 학생 (~40)</TabsTrigger>
          </TabsList>

          <TabsContent value="상위" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI 튜터 응답 (상위권)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-gray-700">
                  {COMPARISON_RESPONSES.상위}
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="기초" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">AI 튜터 응답 (기초)</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="whitespace-pre-wrap text-gray-700">
                  {COMPARISON_RESPONSES.기초}
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}
