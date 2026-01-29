'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

export default function MedicalBoard() {
    const router = useRouter();

    const [allRequests, setAllRequests] = useState<any[]>([]);
    const [filteredRequests, setFilteredRequests] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('전체');

    // 데이터 가져오기 및 초기 정렬
    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const q = query(
                    collection(db, "requests"),
                    where("category", "==", "medical"), // 🔥 medical 카테고리만 필터링
                    orderBy("date", "desc")
                );

                const querySnapshot = await getDocs(q);
                const list = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));

                // 🔥 숫자 기반 정렬 (오전/오후 혼용 대응)
                const sortedList = list.sort((a: any, b: any) => {
                    const valA = a.date.replace(/[^0-9]/g, "");
                    const valB = b.date.replace(/[^0-9]/g, "");
                    return valB.localeCompare(valA);
                });

                setAllRequests(sortedList);
                setFilteredRequests(sortedList);
            } catch (error) {
                console.error("의료기기 데이터 가져오기 실패:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRequests();
    }, []);

    // 검색 및 필터링 로직
    useEffect(() => {
        let result = [...allRequests];

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

        result.sort((a, b) => {
            const valA = a.date.replace(/[^0-9]/g, "");
            const valB = b.date.replace(/[^0-9]/g, "");
            return valB.localeCompare(valA);
        });

        setFilteredRequests(result);
    }, [searchTerm, statusFilter, allRequests]);

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center py-10 px-4 font-sans text-slate-900">
            <div className="w-full max-w-7xl bg-white rounded-lg shadow-xl overflow-hidden border border-slate-300">

                {/* 🏥 상단바: 의료기기 테마 (Emerald) */}
                <div className="bg-emerald-600 text-white px-6 py-4 flex items-center justify-between select-none">
                    <div className="flex items-center gap-3">
                        <span className="font-bold tracking-wide text-lg">🏥 의료기기 업무 요청 현황</span>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => router.push('/')} className="text-xs bg-emerald-700/50 hover:bg-emerald-700 px-4 py-2 rounded transition font-bold border border-white/20">HOME</button>
                        <button onClick={() => window.location.reload()} className="text-xs bg-emerald-700/50 hover:bg-emerald-500 px-4 py-2 rounded transition font-bold border border-white/20 shadow-md flex items-center gap-1">🔄새로고침</button>
                        <button onClick={() => router.push('/write?type=medical')} className="text-xs bg-white text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded transition font-black shadow-md border border-white">+ 글작성</button>
                    </div>
                </div>

                <div className="p-6 bg-white min-h-[600px]">
                    {/* 필터 영역 */}
                    <div className="mb-6 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0">
                            {['전체', '대기중', '확인', '보류', '완료'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 text-sm font-bold rounded-md transition border whitespace-nowrap
                      ${statusFilter === status
                                            ? 'bg-emerald-600 text-white border-emerald-600'
                                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'}`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                        <div className="relative w-full md:w-72">
                            <input
                                type="text"
                                placeholder="제목, 부서, 이름 검색"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 text-sm text-slate-900 border border-slate-300 rounded-md focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 transition bg-white"
                            />
                            <span className="absolute left-3 top-2.5 text-slate-400">🔍</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse table-auto">
                            <thead>
                                <tr className="bg-slate-100 text-slate-600 text-sm border-b border-slate-200">
                                    <th className="p-4 w-16 text-center whitespace-nowrap">No.</th>
                                    <th className="p-4 w-28 text-center whitespace-nowrap">상태</th>
                                    <th className="p-4 min-w-[300px]">제목</th>
                                    <th className="p-4 text-center whitespace-nowrap min-w-[150px]">부서</th>
                                    <th className="p-4 w-24 text-center whitespace-nowrap">작성자</th>
                                    <th className="p-4 w-24 text-center whitespace-nowrap">내선번호</th>
                                    <th className="p-4 w-44 text-center whitespace-nowrap">작성일</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm text-slate-700">
                                {isLoading ? (
                                    <tr><td colSpan={7} className="p-10 text-center font-bold">로딩 중...</td></tr>
                                ) : filteredRequests.length === 0 ? (
                                    <tr><td colSpan={7} className="p-10 text-center text-slate-400 font-medium">요청 데이터가 없습니다.</td></tr>
                                ) : (
                                    filteredRequests.map((req, index) => (
                                        <tr
                                            key={req.id}
                                            onClick={() => router.push(`/view/${req.id}`)}
                                            className="border-b border-slate-100 hover:bg-emerald-50 cursor-pointer transition group"
                                        >
                                            <td className="p-4 text-center align-middle text-slate-400 font-mono">
                                                {filteredRequests.length - index}
                                            </td>
                                            <td className="p-4 text-center align-middle">
                                                <span className={`inline-block px-3 py-1 rounded text-xs font-bold border whitespace-nowrap
                          ${req.status === '완료' ? 'bg-green-100 text-green-700 border-green-200' :
                                                        req.status === '보류' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                            req.status === '확인' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                                                'bg-slate-100 text-slate-500 border-slate-200'}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="p-4 align-middle font-medium text-slate-900 group-hover:text-emerald-700">
                                                <div className="line-clamp-1">{req.title}</div>
                                            </td>
                                            <td className="p-4 text-center align-middle text-slate-600 whitespace-nowrap px-6">
                                                {req.dept}
                                            </td>
                                            <td className="p-4 text-center align-middle text-slate-900 font-medium whitespace-nowrap">
                                                {req.author}
                                            </td>
                                            <td className="p-4 text-center align-middle text-slate-600 whitespace-nowrap">
                                                📞 {req.ext}
                                            </td>
                                            <td className="p-4 text-center align-middle text-slate-400 text-xs whitespace-nowrap">
                                                {req.date}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 text-right text-xs text-slate-400 font-medium">
                        총 {filteredRequests.length}건의 의료기기 요청이 있습니다.
                    </div>
                </div>
            </div>
        </div>
    );
}