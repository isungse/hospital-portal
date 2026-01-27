import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // 👈 DB 기능 추가

// 선생님의 고유 설정값 (건드리지 마세요!)
const firebaseConfig = {
  apiKey: "AIzaSyD8ojAKf1Xlkh4i5BuHb49N7B5iwzNw4hE",
  authDomain: "itportal-61850.firebaseapp.com",
  projectId: "itportal-61850",
  storageBucket: "itportal-61850.firebasestorage.app",
  messagingSenderId: "434003392454",
  appId: "1:434003392454:web:51fcf4425385cbcd5d64c7"
};

// 1. 파이어베이스 앱 시작
const app = initializeApp(firebaseConfig);

// 2. 데이터베이스(Firestore)를 켜서 밖으로 내보내기 (다른 파일에서 쓰려고)
export const db = getFirestore(app);