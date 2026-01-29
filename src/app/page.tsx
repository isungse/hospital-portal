'use client';

import { useRouter } from 'next/navigation';

export default function MainPage() {
  const router = useRouter();

  const services = [
    {
      id: 'it',
      title: '전산 업무 요청',
      icon: '🖥️',
      gradient: 'from-blue-600 to-indigo-700',
      path: '/it',
    },
    {
      id: 'facility',
      title: '시설 업무 요청',
      icon: '🛠️',
      gradient: 'from-orange-500 to-red-600',
      path: '/facility',
    },
    {
      id: 'medical', // 의료기기 부서 추가
      title: '의료기기 업무 요청',
      icon: '🏥',
      gradient: 'from-emerald-500 to-teal-700',
      path: '/medical',
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-900">

      {/* 상단 헤더 섹션 */}
      <div className="max-w-2xl w-full text-center mb-12">
        <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-600 bg-blue-50 rounded-full">
          {/* 비어있던 텍스트 영역 유지 */}
        </div>
      </div>

      {/* 카드 그리드: 3개 배치를 위해 md:grid-cols-3 적용 및 max-w 조정 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-[850px]">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => router.push(service.path)}
            className="group relative bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            {/* 카드 상단 영역 */}
            <div className={`bg-gradient-to-br ${service.gradient} p-10 flex justify-center items-center relative overflow-hidden`}>
              <div className="absolute w-32 h-32 bg-white/10 rounded-full -top-10 -right-10 group-hover:scale-150 transition-transform duration-700"></div>

              <span className="text-7xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 z-10 drop-shadow-2xl">
                {service.icon}
              </span>
            </div>

            {/* 카드 하단 정보 영역: description 삭제 및 디자인 유지 */}
            <div className="p-8">
              <h2 className="text-lg font-extrabold text-slate-800 mb-6 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h2>

              <div className="flex items-center text-sm font-bold text-slate-800 group-hover:text-blue-600 transition-all">
                <span className="relative">
                  게시판 입장하기
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
                </span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-16 text-slate-400 text-[20px] font-bold tracking-[0.3em] uppercase opacity-50">
        © 2026
      </footer>
    </div>
  );
}