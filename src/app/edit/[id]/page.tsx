'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { db } from '../../firebase'; 
import { doc, getDoc, updateDoc } from 'firebase/firestore'; 

export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const [formData, setFormData] = useState({ title: '', dept: '', author: '', ext: '', content: '' });
  const [isLoading, setIsLoading] = useState(true);

  // 1. 기존 데이터 불러오기
  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;
      try {
        const docRef = doc(db, "requests", params.id as string);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setFormData(docSnap.data() as any);
        } else {
          alert("없는 게시물입니다.");
          router.back();
        }
      } catch (error) {
        console.error("데이터 로딩 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [params.id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => { 
    e.preventDefault();

    if (!formData.title.trim() || !formData.dept.trim() || !formData.author.trim() || !formData.ext.trim()) {
      return alert("필수 항목을 모두 입력해주세요.");
    }

    try {
      const docRef = doc(db, "requests", params.id as string);
      
      await updateDoc(docRef, {
        title: formData.title,
        dept: formData.dept,
        author: formData.author,
        ext: formData.ext,
        content: formData.content
      });
      
      alert("✅ 수정이 완료되었습니다.");
      
      // 👇 [수정됨] 상세 페이지(/view/...)가 아니라 목록(/)으로 이동!
      window.location.href = '/'; 

    } catch (error) {
      console.error("수정 에러:", error);
      alert("수정 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) return <div className="text-center py-20">데이터 불러오는 중...</div>;

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center py-10 px-4 font-sans">
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-400">
        
        <div className="bg-slate-800 text-white px-5 py-3 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
             <div className="flex gap-2 mr-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
             <span className="font-bold tracking-wide text-sm">전산업무요청 - 내용 수정</span>
          </div>
          <button onClick={() => router.back()} className="text-xs bg-slate-600 hover:bg-slate-500 px-3 py-1 rounded transition text-white">
            ↩ 취소
          </button>
        </div>

        <div className="p-10 bg-slate-50 flex justify-center">
          <div className="w-full bg-white border border-slate-300 rounded-lg p-8 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-800 mb-8 pb-4 border-b border-slate-100 flex items-center gap-2">
              🛠️ 요청 내용 수정
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-base font-bold text-slate-700 mb-2">제목 <span className="text-red-500">*</span></label>
                <input type="text" name="title" value={formData.title} onChange={handleChange} required 
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-600 transition" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-2">부서 <span className="text-red-500">*</span></label>
                  <input type="text" name="dept" value={formData.dept} onChange={handleChange} required
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-600 transition" />
                </div>
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-2">작성자 <span className="text-red-500">*</span></label>
                  <input type="text" name="author" value={formData.author} onChange={handleChange} required
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-600 transition" />
                </div>
                <div>
                  <label className="block text-base font-bold text-slate-700 mb-2">내선번호 <span className="text-red-500">*</span></label>
                  <input type="text" name="ext" value={formData.ext} onChange={handleChange} required
                    className="w-full bg-white text-slate-900 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-600 transition" />
                </div>
              </div>

              <div>
                <label className="block text-base font-bold text-slate-700 mb-2">상세 내용</label>
                <textarea name="content" value={formData.content} onChange={handleChange} rows={8} 
                  className="w-full bg-white text-slate-900 border border-slate-300 rounded-md p-3 outline-none focus:border-blue-600 resize-none transition"></textarea>
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-md hover:bg-blue-700 transition shadow-md text-lg mt-4 active:scale-[0.99]">
                수정 완료
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}