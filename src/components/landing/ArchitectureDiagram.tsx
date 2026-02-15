import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ARCHITECTURE_COMPONENTS } from '@/lib/constants';
import { ArrowRight } from 'lucide-react';

export function ArchitectureDiagram() {
  return (
    <section className="bg-gray-50 px-4 py-16">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">
          시스템 아키텍처
        </h2>

        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-center">
          {/* Frontend */}
          <Card className="w-full md:w-80">
            <CardHeader className="bg-blue-100">
              <CardTitle className="text-center text-xl">
                {ARCHITECTURE_COMPONENTS.frontend.title}
              </CardTitle>
              <p className="text-center text-sm text-gray-600">
                {ARCHITECTURE_COMPONENTS.frontend.tech}
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {ARCHITECTURE_COMPONENTS.frontend.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Arrow */}
          <ArrowRight className="hidden h-8 w-8 text-gray-400 md:block" />
          <div className="block h-8 w-8 rotate-90 text-gray-400 md:hidden">
            <ArrowRight className="h-8 w-8" />
          </div>

          {/* Backend */}
          <Card className="w-full md:w-80">
            <CardHeader className="bg-green-100">
              <CardTitle className="text-center text-xl">
                {ARCHITECTURE_COMPONENTS.backend.title}
              </CardTitle>
              <p className="text-center text-sm text-gray-600">
                {ARCHITECTURE_COMPONENTS.backend.tech}
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <ul className="space-y-2">
                {ARCHITECTURE_COMPONENTS.backend.items.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="text-sm">{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
