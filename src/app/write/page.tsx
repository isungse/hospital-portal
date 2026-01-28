'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { db } from '../firebase'; 
import { collection, addDoc } from 'firebase/firestore'; 

function WriteForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // URL에서 타입을 읽어오되, 없으면 기본값 it (it 또는 facility)
  const category = searchParams.get('type') === 'facility' ? 'facility' : 'it';

  const [formData, setFormData] = useState({ 
    title: '', 
    dept: '', 
    author: '', 
    ext: '', 
    content: '' 
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => { 
    e.preventDefault();

    // 안전장치: 공백 입력 방지
    if (!formData.title.trim() || !formData.dept.trim() || !formData.author.trim() || !formData.ext.trim()) {
      return alert("필수 항목(제목, 부서, 작성자, 내선번호)이 비어있습니다!");
    }

    try {
      // 🔥 [핵심수정] hour12: false를 추가하여 '오전/오후'를 제거하고 24시간제로 통일합니다.
      // 하이픈(-) 포맷으로 변경하여 문자열 정렬이 완벽하게 작동하도록 만듭니다.
      const now = new Date();
      const today = now.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 오전/오후 제거
      }).replace(/\. /g, '-').replace('.', ''); 

      // DB 저장 시 category 필드 추가
      await addDoc(collection(db, "requests"), {
        ...formData,
        category: category, 
        date: today, // 이제 '2026-01-28 14:30' 형식으로 저장됨
        status: '대기중'
      });
      
      alert(`✅ ${category === 'it' ? '전산' : '시설'} 업무 요청이 등록되었습니다.`);
      router.push(`/${category}`); 

    } catch (error) {
      console.error("등록 에러:", error);
      alert("등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center py-10 px-4 font-sans text-slate-900">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-400">
        
        {/* 상단바: 카테고리에 따라 색상 변경 (전산: slate-800, 시설: orange-600) */}
        <div className={`${category === 'it' ? 'bg-slate-800' : 'bg-orange-600'} text-white px-5 py-3 flex items-center justify-between select-none transition-colors`}>
          <div className="flex items-center gap-3">
             <div className="flex gap-2 mr-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
             <span className="font-bold tracking-wide text-sm">
               {category === 'it' ? '전산업무요청' : '시설업무요청'} - 글쓰기
             </span>
          </div>
          <button onClick={() => router.back()} className="text-xs bg-black/20 hover:bg-black/40 px-3 py-1 rounded transition text-white">
            ↩ 취소/뒤로
          </button>
        </div>

        {/* 입력 폼 */}
        <div className="p-10 bg-slate-50 flex justify-center">
          <div className="w-full bg-white border border-slate-300 rounded-lg p-8 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-8 pb-4 border-b border-slate-100 flex items-center gap-2">
              📝 {category === 'it' ? '전산' : '시설'} 업무 요청 작성
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* 제목 */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-2">
                  제목 <span className="text-red-500">*</span>
                </label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required 
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition" 
                  placeholder="요청 제목" />
              </div>

              {/* 부서/작성자/내선 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-2">
                    부서 <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="dept" value={formData.dept} onChange={handleChange} required
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition" 
                    placeholder="부서명" />
                </div>
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-2">
                    작성자 <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="author" value={formData.author} onChange={handleChange} required
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition" 
                    placeholder="성명" />
                </div>
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-2">
                    내선번호 <span className="text-red-500">*</span>
                  </label>
                  <input type="text" name="ext" value={formData.ext} onChange={handleChange} required
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition" 
                    placeholder="번호" />
                </div>
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-base font-bold text-slate-700 mb-2">
                  상세 내용
                </label>
                <textarea name="content" value={formData.content} onChange={handleChange} rows={8} 
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 resize-none transition" 
                  placeholder="내용을 입력하세요 (선택)"></textarea>
              </div>

              {/* 등록 버튼 */}
              <button type="submit" 
                className={`w-full text-white font-bold py-4 rounded-md transition shadow-md text-lg mt-4 active:scale-[0.99]
                ${category === 'it' ? 'bg-slate-800 hover:bg-slate-700' : 'bg-orange-600 hover:bg-orange-500'}`}>
                SAVE
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function WritePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">로딩 중...</div>}>
      <WriteForm />
    </Suspense>
  );
}