const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3000;

// 1. 파일 업로드 설정 (상위 폴더나 현재 폴더에 data.csv로 고정하여 저장)
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname); // 현재 server.js가 있는 폴더에 저장
    },
    filename: function (req, file, cb) {
        cb(null, 'data.csv'); // 🚨 원본 파일명 무시하고 무조건 'data.csv'로 덮어쓰기
    }
});
const upload = multer({ storage: storage });

// 2. 정적 파일 서비스 (HTML, CSV 파일들을 브라우저가 접근할 수 있도록 개방)
app.use(express.static(__dirname));

// 3. 메인 페이지 라우팅 (접속 시 index.html 띄우기)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 4. 🚨 [핵심] 파일 업로드 API 엔드포인트
app.post('/upload-csv', upload.single('stockFile'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: '파일이 업로드되지 않았습니다.' });
    }
    console.log(`[시스템] 새로운 재고 파일이 업로드되어 기존 data.csv를 교체했습니다.`);
    res.json({ success: true, message: '서버의 data.csv 파일이 성공적으로 교체되었습니다.' });
});

// 서버 시작
app.listen(PORT, () => {
    console.log(`======================================================`);
    console.log(`  📱 위치 기준 재고 검색 시스템 서버 구동 완료`);
    console.log(`  🌐 접속 주소: http://localhost:${PORT}`);
    console.log(`======================================================`);
});
