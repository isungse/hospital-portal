'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function MainPage() {
  const router = useRouter();

  const [counts, setCounts] = useState({
    pending: 0,
    processing: 0,
    completed: 0
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "requests"));
        const data = querySnapshot.docs.map(doc => doc.data());

        setCounts({
          pending: data.filter(item => item.status === '대기중').length,
          processing: data.filter(item => item.status === '확인').length,
          completed: data.filter(item => item.status === '완료').length
        });
      } catch (error) {
        console.error("데이터 카운팅 로드 실패:", error);
      }
    };

    fetchCounts();
  }, []);

  const services = [
    {
      id: 'it',
      title: '전산팀 업무 요청',
      icon: '🖥️',
      path: '/it',
      colorClass: 'bg-blue-50 text-blue-600 group-hover:bg-blue-600'
    },
    {
      id: 'facility',
      title: '시설팀 업무 요청',
      icon: '🛠️',
      path: '/facility',
      colorClass: 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600'
    },
    {
      id: 'medical',
      title: '의료기기 업무 요청',
      icon: '🏥',
      path: '/medical',
      colorClass: 'bg-rose-50 text-rose-600 group-hover:bg-rose-600'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {/* 비어있는 헤더 유지 */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <section className="py-12 md:py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
              무엇을 도와드릴까요?
            </h1>
            <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">
              사내 인프라 및 기술 지원이 필요하시면<br />
              카테고리를 선택 해 주세요. 담당 팀에서 확인 후 신속하게 처리해 드리겠습니다.
            </p>
          </div>
        </section>

        {/* Hub Cards Section - 너비를 5xl로 줄여 크기 조정 */}
        <section className="max-w-5xl mx-auto px-6 lg:px-8 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service) => (
              <button
                key={service.id}
                onClick={() => router.push(service.path)}
                // min-h와 padding을 줄여 카드 크기 축소
                className="group bg-white rounded-[1.5rem] border border-slate-200 p-8 text-center flex flex-col items-center transition-all duration-300 hover:-translate-y-2 hover:shadow-xl active:scale-[0.97] min-h-[220px] justify-center"
              >
                {/* 아이콘 크기 축소 */}
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 group-hover:text-white ${service.colorClass}`}>
                  <span className="text-3xl">{service.icon}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight">{service.title}</h2>
              </button>
            ))}
          </div>

          {/* Summary Status */}
          <div className="mt-16 pt-8 border-t border-slate-200 flex flex-col md:flex-row justify-center items-center gap-8 text-center">
            <div className="flex items-center gap-8">
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 mb-1">대기중</span>
                <span className="text-xl font-bold text-slate-900">
                  {counts.pending.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 mb-1">진행중</span>
                <span className="text-xl font-bold text-slate-900">
                  {counts.processing.toString().padStart(2, '0')}
                </span>
              </div>
              <div className="w-px h-6 bg-slate-200"></div>
              <div className="flex flex-col">
                <span className="text-xs font-semibold text-slate-400 mb-1">완료</span>
                <span className="text-xl font-bold text-blue-600">
                  {counts.completed.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-10 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <span className="text-slate-400 text-sm font-medium">© 2026 의료정보팀</span>
          </div>
        </div>
      </footer>
    </div>
  );
}