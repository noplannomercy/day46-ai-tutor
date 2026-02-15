import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TEST_SCENARIOS } from '@/lib/constants';
import { CheckCircle2 } from 'lucide-react';

export function TestScenarios() {
  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          추천 테스트 시나리오
        </h2>
        <p className="mb-12 text-center text-lg text-gray-600">
          다음 시나리오를 통해 AI 튜터의 개인화 기능을 확인해보세요
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {TEST_SCENARIOS.map((scenario, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="mt-1 h-5 w-5 text-green-500" />
                  <div>
                    <CardTitle className="text-lg">{scenario.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{scenario.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
