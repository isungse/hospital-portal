'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from './firebase'; 
import { collection, getDocs, query, orderBy } from 'firebase/firestore'; 

export default function Home() {
  const router = useRouter();
  
  // 1. 상태 관리 변수들
  const [allRequests, setAllRequests] = useState<any[]>([]); // 원본
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]); // 화면용
  const [isLoading, setIsLoading] = useState(true); 

  // 🔍 검색 및 필터 상태
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');

  // 2. 데이터 가져오기
  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const q = query(collection(db, "requests"), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        
        setAllRequests(list);      
        setFilteredRequests(list); 
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  // 3. 필터링 로직
  useEffect(() => {
    let result = allRequests;

    if (statusFilter !== '전체') {
      result = result.filter(req => req.status === statusFilter);
    }

    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(req => 
        req.title.toLowerCase().includes(lowerTerm) ||
        req.dept.toLowerCase().includes(lowerTerm) ||
        req.author.toLowerCase().includes(lowerTerm) ||
        req.ext.includes(lowerTerm)
      );
    }

    setFilteredRequests(result);
  }, [searchTerm, statusFilter, allRequests]);


  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center py-10 px-4 font-sans">
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-400">
        
        {/* 상단바 */}
        <div className="bg-slate-800 text-white px-5 py-3 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
             <div className="flex gap-2 mr-2">
               <div className="w-3 h-3 rounded-full bg-red-500"></div>
               <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
             </div>
             <span className="font-bold tracking-wide text-sm">전산업무요청 - 현황판</span>
          </div>
          <button onClick={() => router.push('/write')} className="text-xs bg-slate-700 hover:bg-slate-600 px-3 py-1.5 rounded transition font-bold border border-slate-600">
            ➕ 새 요청 작성
          </button>
        </div>

        {/* 리스트 내용 */}
        <div className="p-8 bg-slate-50 min-h-[600px]">
          
          {/* 검색 및 필터 영역 */}
          <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
             
             {/* 왼쪽: 상태 필터 버튼들 */}
             <div className="flex gap-1 bg-slate-100 p-1 rounded-md">
                {['전체', '대기중', '확인', '보류', '완료'].map((status) => (
                  <button 
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-3 py-1.5 text-xs font-bold rounded transition 
                      ${statusFilter === status 
                        ? 'bg-white text-slate-800 shadow-sm border border-slate-200' 
                        : 'text-slate-500 hover:text-slate-700'}`}
                  >
                    {status}
                  </button>
                ))}
             </div>

             {/* 오른쪽: 검색창 */}
             <div className="relative w-full md:w-64">
                {/* 👇 [수정됨] text-slate-900 추가하여 글자색 진하게 변경 */}
                <input 
                  type="text" 
                  placeholder="제목, 부서, 이름 검색..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:border-blue-500 transition"
                />
                <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
             </div>
          </div>

          <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center justify-between">
             <span>📂 접수 목록</span>
             <span className="text-sm font-normal text-slate-500 bg-white px-3 py-1 rounded border">
               Total: {isLoading ? '...' : filteredRequests.length}
             </span>
          </h2>
          
          <div className="space-y-3 h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="h-full flex flex-col items-center justify-center">
                <div className="w-12 h-12 border-4 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="text-slate-500 font-bold">목록을 불러오는 중입니다...</p>
              </div>
            ) : filteredRequests.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-lg text-slate-400 bg-slate-50/50">
                <p className="text-5xl mb-4">🔍</p>
                <p className="text-lg font-bold text-slate-500">
                  {searchTerm || statusFilter !== '전체' ? "검색 결과가 없습니다." : "접수된 요청이 없습니다."}
                </p>
              </div>
            ) : (
              filteredRequests.map((req) => (
                <div key={req.id} onClick={() => router.push(`/view/${req.id}`)} className="bg-white p-5 rounded border border-slate-200 shadow-sm hover:shadow-md transition flex justify-between items-center group cursor-pointer">
                  <div>
                     <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{req.dept}</span>
                        <span className="text-xs text-slate-400">
                            | {req.date} | {req.author} (내선: {req.ext})
                        </span>
                     </div>
                     <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition">{req.title}</h3>
                  </div>
                  
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border 
                    ${req.status === '완료' ? 'bg-green-100 text-green-700 border-green-200' : 
                      req.status === '보류' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                      req.status === '확인' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                      'bg-slate-100 text-slate-500 border-slate-200'}`}>
                    {req.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}