'use client';

import { useRouter } from 'next/navigation';

export default function MainPage() {
  const router = useRouter();

  const services = [
    {
      id: 'it',
      title: '전산 업무 요청',
      description: 'PC, S/W, 네트워크 등 전산 인프라 장애\n빠른 조치를 위해 성함과 내선번호를 꼭 남겨주세요.',
      icon: '🖥️',
      gradient: 'from-blue-600 to-indigo-700', // 더 깊이감 있는 블루
      path: '/it',
      // label: 'IT SUPPORT'
    },
    {
      id: 'facility',
      title: '시설 업무 요청',
      description: '전등 교체, 수도, 냉난방기 등 병원 내 시설물 유지보수\n빠른 조치를 위해 성함과 내선번호를 꼭 남겨주세요',
      icon: '🛠️',
      gradient: 'from-orange-500 to-red-600', // 따뜻하고 안정적인 오렌지
      path: '/facility',
      // label: 'FACILITY CARE'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-900">
      {/* 상단 헤더 섹션: 너비와 여백 축소 */}
      <div className="max-w-2xl w-full text-center mb-12"> 
        <div className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-blue-600 bg-blue-50 rounded-full">

        </div>
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
          무엇을 도와드릴까요?
        </h1>
        {/* <p className="text-slate-500 text-lg">해당되는 업무 카테고리를 선택해 주세요.</p>  */}
      </div>

      {/* 카드 그리드: 전체 최대 너비 축소 (4xl -> 3xl) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
        {services.map((service) => (
          <div
            key={service.id}
            onClick={() => router.push(service.path)}
            className="group relative bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
          >
            {/* 카드 상단 영역: 패딩 축소 (p-12 -> p-10) 및 아이콘 크기 축소 (text-8xl -> text-7xl) */}
            <div className={`bg-gradient-to-br ${service.gradient} p-10 flex justify-center items-center relative overflow-hidden`}>
              <div className="absolute w-32 h-32 bg-white/10 rounded-full -top-10 -right-10 group-hover:scale-150 transition-transform duration-700"></div>

              <span className="text-7xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 z-10 drop-shadow-2xl">
                {service.icon}
              </span>
            </div>

            {/* 카드 하단 정보 영역: 패딩 축소 (p-10 -> p-8) 및 텍스트 크기 미세 조정 */}
            <div className="p-8">
               {/* <div className="text-[10px] font-black tracking-[0.2em] text-slate-400 mb-2 uppercase"> 
                {service.label}
              </div> */}
              <h2 className="text-xl font-extrabold text-slate-800 mb-3 group-hover:text-blue-600 transition-colors">
                {service.title}
              </h2>
              <p className="text-slate-500 leading-relaxed text-xs mb-6 antialiased whitespace-pre-line">
                {service.description}
              </p>

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

      {/* 푸터 텍스트 크기 조정: 20px -> 10px */}
      <footer className="mt-16 text-slate-400 text-[20px] font-bold tracking-[0.3em] uppercase opacity-50">
        © 2026
      </footer>
    </div>
  );
}