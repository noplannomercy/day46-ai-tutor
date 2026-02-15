export function HeroSection() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-4 py-16 text-center">
      <h1 className="mb-4 text-5xl font-bold tracking-tight text-gray-900 md:text-6xl">
        AI Tutor
      </h1>
      <p className="mb-2 text-2xl font-semibold text-blue-600 md:text-3xl">
        학생 맞춤형 수학 튜터링
      </p>
      <p className="mb-8 text-xl text-gray-600 md:text-2xl">
        같은 문제, 학생마다 다른 설명
      </p>
      <div className="rounded-lg bg-blue-100 px-6 py-3">
        <p className="text-lg font-medium text-blue-900">
          고1 수학 — 방정식·함수 단원
        </p>
      </div>
    </section>
  );
}
