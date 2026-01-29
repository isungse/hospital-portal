'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db } from '../../firebase'; 
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'; 

export default function ViewPage() {
  const router = useRouter();
  const params = useParams(); 
  const [data, setData] = useState<any>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const [adminMemo, setAdminMemo] = useState('');
  const [memoSavedTime, setMemoSavedTime] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) {
        router.push('/');
        return;
      }
      try {
        const docRef = doc(db, "requests", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const res = docSnap.data();
          setData({ id: docSnap.id, ...res });
          setAdminMemo(res.adminMemo || '');
          setMemoSavedTime(res.memoSavedTime || '');
        } else {
          router.push('/');
        }
      } catch (error) {
        console.error("로딩 실패:", error);
      }
    };
    fetchData();
  }, [params.id, router]);

  const handleSaveMemo = async () => {
    if (!data || !data.id) return;
    try {
      const now = new Date().toLocaleString('ko-KR');
      const docRef = doc(db, "requests", data.id);
      
      await updateDoc(docRef, {
        adminMemo: adminMemo,
        memoSavedTime: now
      });

      setMemoSavedTime(now);
      alert("조치 내용이 저장되었습니다.");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!data || !data.id) return;
    try {
      const docRef = doc(db, "requests", data.id);
      await updateDoc(docRef, { status: newStatus }); 
      alert(`[${newStatus}] 상태로 변경되었습니다.`);
      
      // 🔥 카테고리 분기 확장: medical 추가
      const targetPath = data.category === 'facility' ? '/facility' : data.category === 'medical' ? '/medical' : '/it';
      router.push(targetPath); 
    } catch (error) {
      console.error("업데이트 실패:", error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  const handleDelete = async () => {
    if (!data || !data.id) return;
    try {
      // 🔥 카테고리 분기 확장: medical 추가
      const targetPath = data.category === 'facility' ? '/facility' : data.category === 'medical' ? '/medical' : '/it';
      await deleteDoc(doc(db, "requests", data.id));
      alert("삭제되었습니다.");
      router.push(targetPath); 
    } catch (error: any) {
      console.error("삭제 실패:", error);
    }
  };

  if (!data) return <div className="text-center py-20">데이터 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center py-10 px-4 font-sans text-slate-900">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-400">
        
        {/* 🔥 상단바: medical(에메랄드), facility(오렌지), it(슬레이트) 분기 */}
        <div className={`
          ${data.category === 'facility' ? 'bg-orange-600' : data.category === 'medical' ? 'bg-emerald-600' : 'bg-slate-800'} 
          text-white px-5 py-3 flex items-center justify-between select-none transition-colors
        `}>
          <div className="flex items-center gap-3">
             <div className="flex gap-2 mr-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
             <span className="font-bold tracking-wide text-sm">
               {data.category === 'facility' ? '시설업무요청' : data.category === 'medical' ? '의료기기업무요청' : '전산업무요청'} - 상세 보기
             </span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push(`/edit/${data.id}`)} className="text-xs bg-black/20 hover:bg-black/40 px-3 py-1 rounded transition text-white font-bold border border-white/20">
                ✏️ 수정
            </button>
            <button onClick={() => router.back()} className="text-xs bg-black/20 hover:bg-black/40 px-3 py-1 rounded transition text-white border border-white/20">
                ↩ 뒤로
            </button>
          </div>
        </div>

        <div className="p-12 bg-slate-50">
          <div className="bg-white border border-slate-300 rounded-lg p-8 shadow-sm">
            
            {/* 제목 영역 */}
            <div className="border-b border-slate-100 pb-5 mb-5">
                 <span className={`text-sm font-bold px-2 py-0.5 rounded mb-2 inline-block 
                   ${data.category === 'facility' ? 'text-orange-700 bg-orange-50' : data.category === 'medical' ? 'text-emerald-700 bg-emerald-50' : 'text-slate-500 bg-slate-100'}`}>
                    {data.dept}
                 </span>
                 <h2 className="text-xl font-bold text-slate-800">{data.title}</h2>
                 <p className="text-slate-400 text-sm mt-1">
                    작성자: {data.author} (내선: {data.ext}) | 작성일: {data.date}
                 </p>
                 <div className="mt-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                      ${data.status === '완료' ? 'bg-green-100 text-green-700 border-green-200' : 
                        data.status === '보류' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                        data.status === '확인' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'}`}> 
                      현재 상태: {data.status}
                    </span>
                 </div>
            </div>

            {/* 본문 내용 */}
            <div className="min-h-[200px] text-slate-700 leading-relaxed whitespace-pre-wrap mb-10">
              {data.content}
            </div>

            {/* 🛠️ 조치 기록 섹션 */}
            <div className="mb-5 bg-slate-50 p-4 rounded-lg border border-slate-200">
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold text-slate-500">조치 사항</label>
                {memoSavedTime && <span className="text-[10px] text-slate-400">{memoSavedTime}</span>}
              </div>
              <div className="relative">
                <textarea 
                  value={adminMemo}
                  onChange={(e) => setAdminMemo(e.target.value)}
                  placeholder="조치한 내용을 기록하세요..."
                  className="w-full p-4 pr-16 text-sm text-slate-900 border border-slate-300 rounded-lg focus:outline-none focus:border-slate-500 transition bg-white resize-none h-28 shadow-inner"
                />
                <button 
                  onClick={handleSaveMemo}
                  className={`absolute bottom-3 right-3 text-white px-3 py-1.5 rounded font-bold text-xs transition shadow-sm 
                    ${data.category === 'facility' ? 'bg-orange-600 hover:bg-orange-700' : data.category === 'medical' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-800 hover:bg-black'}`}
                >
                  저장
                </button>
              </div>
            </div>

            {/* 관리자 상태 변경 및 삭제 메뉴 */}
            <div className="bg-slate-100 p-4 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-200">
               <span className="font-bold text-slate-600 text-sm"></span>
               
               <div className="flex flex-wrap gap-2 w-full sm:w-auto justify-end items-center">
                 <button onClick={() => handleStatusChange('확인')} className="px-4 py-2 bg-blue-600 border border-blue-700 rounded hover:bg-blue-700 text-white font-bold transition shadow-sm text-sm">
                   확인
                 </button>

                 <button onClick={() => handleStatusChange('보류')} className="px-4 py-2 bg-orange-500 border border-orange-600 rounded hover:bg-orange-600 text-white font-bold transition shadow-sm text-sm">
                   보류
                 </button>

                 <button onClick={() => handleStatusChange('완료')} className="px-4 py-2 bg-green-600 border border-green-700 rounded hover:bg-green-700 text-white font-bold transition shadow-sm text-sm">
                   완료
                 </button>

                 {!isDeleting ? (
                   <button onClick={() => setIsDeleting(true)} className="px-4 py-2 bg-slate-200 border border-slate-300 rounded hover:bg-red-100 text-slate-600 hover:text-red-600 font-bold transition shadow-sm text-sm ml-2">
                     삭제
                   </button>
                 ) : (
                   <div className="flex gap-2 ml-2 animate-pulse">
                     <button onClick={handleDelete} className="px-4 py-2 bg-red-600 border border-red-700 rounded hover:bg-red-700 text-white font-bold transition shadow-sm text-sm">
                       🔥 삭제 확인
                     </button>
                     <button onClick={() => setIsDeleting(false)} className="px-4 py-2 bg-white border border-slate-300 rounded hover:bg-slate-100 text-slate-500 font-bold transition shadow-sm text-sm">
                       취소
                     </button>
                   </div>
                 )}
               </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}