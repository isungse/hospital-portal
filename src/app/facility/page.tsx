'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../firebase'; 
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore'; 

export default function FacilityBoard() {
  const router = useRouter();
  const [allRequests, setAllRequests] = useState<any[]>([]); 
  const [filteredRequests, setFilteredRequests] = useState<any[]>([]); 
  const [isLoading, setIsLoading] = useState(true); 
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('전체');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        // 🔥 핵심: category 필드가 'facility'인 데이터만 쿼리합니다.
        const q = query(
          collection(db, "requests"), 
          where("category", "==", "facility"), 
          orderBy("date", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const list = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setAllRequests(list);      
        setFilteredRequests(list); 
      } catch (error) {
        console.error("시설 데이터 가져오기 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

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
    <div className="min-h-screen bg-slate-100 flex items-center justify-center py-10 px-4 font-sans text-slate-900">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl overflow-hidden border border-slate-300">
        
        {/* 상단바: 시설팀 오렌지 테마 */}
        <div className="bg-orange-600 text-white px-6 py-4 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
             <span className="font-bold tracking-wide text-lg">🛠️ 시설 업무 요청 현황</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => router.push('/')} className="text-sm bg-orange-700 hover:bg-orange-800 px-4 py-2 rounded transition font-bold border border-orange-800 shadow-sm text-white">HOME</button>
            <button onClick={() => router.push('/write?type=facility')} className="text-sm bg-white text-orange-600 hover:bg-orange-50 px-4 py-2 rounded transition font-bold shadow-md">글작성</button>
          </div>
        </div>

        <div className="p-6 bg-white min-h-[600px]">
          <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
             <div className="flex gap-1">
                {['전체', '대기중', '확인', '보류', '완료'].map((status) => (
                  <button 
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`px-4 py-2 text-sm font-bold rounded-md transition border
                      ${statusFilter === status 
                        ? 'bg-orange-600 text-white border-orange-600' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                  >
                    {status}
                  </button>
                ))}
             </div>

             <div className="relative w-full md:w-72">
                <input 
                  type="text" 
                  placeholder="시설 요청 검색..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:border-orange-600 focus:ring-1 focus:ring-orange-600 transition bg-white"
                />
                <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
             </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed"> 
              <thead>
                <tr className="bg-slate-100 text-slate-600 text-sm border-b border-slate-200">
                  <th className="p-4 w-28 text-center">상태</th>
                  <th className="p-4 w-auto">제목</th>
                  <th className="p-4 w-28 text-center">부서</th>
                  <th className="p-4 w-24 text-center">작성자</th>
                  <th className="p-4 w-24 text-center">내선번호</th>
                  <th className="p-4 w-40 text-center">작성일</th>
                </tr>
              </thead>
              
              <tbody className="text-sm text-slate-700">
                {isLoading ? (
                  <tr><td colSpan={6} className="p-10 text-center text-slate-500 font-bold">데이터를 불러오는 중입니다...</td></tr>
                ) : filteredRequests.length === 0 ? (
                  <tr><td colSpan={6} className="p-10 text-center border-b border-slate-100"><p className="text-4xl mb-2">📭</p><span className="text-slate-400 font-medium">시설 요청 데이터가 없습니다.</span></td></tr>
                ) : (
                  filteredRequests.map((req) => (
                    <tr 
                      key={req.id} 
                      onClick={() => router.push(`/view/${req.id}`)}
                      className="border-b border-slate-100 hover:bg-orange-50 cursor-pointer transition group"
                    >
                      <td className="p-4 text-center align-middle">
                        <span className={`inline-block w-15 py-1 rounded text-[11px] font-bold border text-center whitespace-nowrap
                          ${req.status === '완료' ? 'bg-green-100 text-green-700 border-green-200' : 
                            req.status === '보류' ? 'bg-orange-100 text-orange-700 border-orange-200' : 
                            req.status === '확인' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                            'bg-slate-100 text-slate-500 border-slate-200'}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-4 align-middle"><span className="font-medium text-slate-900 group-hover:text-orange-700 block truncate">{req.title}</span></td>
                      <td className="p-4 text-center align-middle text-slate-600 truncate">{req.dept}</td>
                      <td className="p-4 text-center align-middle text-slate-900 font-medium">{req.author}</td>
                      <td className="p-4 text-center align-middle text-slate-600 whitespace-nowrap">📞 {req.ext}</td>
                      <td className="p-4 text-center align-middle text-slate-400 text-xs whitespace-nowrap">{req.date}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 text-right text-xs text-slate-400">
            총 {filteredRequests.length}건의 시설 요청이 있습니다.
          </div>
        </div>
      </div>
    </div>
  );
}