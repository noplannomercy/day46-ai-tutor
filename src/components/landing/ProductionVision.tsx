import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PRODUCTION_FEATURES } from '@/lib/constants';
import { Sparkles } from 'lucide-react';

export function ProductionVision() {
  return (
    <section className="bg-white px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-blue-500" />
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Production 로드맵
          </h2>
          <p className="text-lg text-gray-600">
            이 PoC를 넘어 실제 서비스로 발전시킬 계획입니다
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {PRODUCTION_FEATURES.map((feature, index) => (
            <Card key={index} className="border-2 border-blue-100">
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
