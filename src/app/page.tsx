'use client';

import { useRouter } from 'next/navigation';

export default function MainPage() {
  const router = useRouter();

  const services = [
    {
      id: 'it',
      title: '전산 업무 요청',
      description: 'PC 수리, S/W 설치, 네트워크 등 전산 인프라 관련 요청',
      icon: '🖥️',
      color: 'bg-blue-600',
      path: '/it'
    },
    {
      id: 'facility',
      title: '시설 업무 요청',
      description: '전등 교체, 수도, 냉난방기 등 시설물 유지보수 요청',
      icon: '🛠️',
      color: 'bg-orange-500',
      path: '/facility'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-6 font-sans text-slate-900">
      <div className="max-w-4xl w-full text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4 tracking-tight">업무 요청 지원 시스템</h1>     
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        {services.map((service) => (
          <div 
            key={service.id}
            onClick={() => router.push(service.path)}
            className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden cursor-pointer hover:scale-105 transition-all duration-300 group"
          >
            <div className={`${service.color} p-10 flex justify-center items-center`}>
              <span className="text-7xl group-hover:rotate-12 transition-transform duration-300">{service.icon}</span>
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-slate-800 mb-3">{service.title}</h2>
              <p className="text-slate-500 leading-relaxed text-sm">{service.description}</p>
              <div className="mt-6 flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-2 transition-transform">
                게시판 입장 <span className="ml-2">→</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <footer className="mt-16 text-slate-400 text-xs font-bold tracking-widest uppercase">
       
      </footer>
    </div>
  );
}