#!/bin/bash

# SODAM 프로젝트 실행 스크립트

echo "🚀 SODAM 프로젝트를 시작합니다..."

# 백엔드 실행
echo "📦 백엔드 서버를 시작합니다..."
cd backend

# 가상환경이 없으면 생성
if [ ! -d ".venv" ]; then
    echo "가상환경을 생성합니다..."
    python -m venv .venv
fi

# 가상환경 활성화
source .venv/bin/activate

# 의존성 설치
echo "백엔드 의존성을 설치합니다..."
pip install -r ../requirements.txt

# PYTHONPATH 설정
export PYTHONPATH=$(pwd)/..

# 데이터베이스 초기화 (필요한 경우)
if [ ! -f "../instance/app.db" ]; then
    echo "데이터베이스를 초기화합니다..."
    flask --app backend.wsgi db init
    flask --app backend.wsgi db migrate -m "init"
    flask --app backend.wsgi db upgrade
fi

# 백엔드 서버 시작 (백그라운드)
echo "백엔드 서버를 시작합니다 (포트 5000)..."
flask --app backend.wsgi run -p 5000 --debug &
BACKEND_PID=$!

# 프론트엔드 실행
echo "🎨 프론트엔드 서버를 시작합니다..."
cd ../sodam

# 의존성 설치
echo "프론트엔드 의존성을 설치합니다..."
npm install

# 프론트엔드 서버 시작
echo "프론트엔드 서버를 시작합니다 (포트 3000)..."
npm start &
FRONTEND_PID=$!

echo "✅ 서버가 시작되었습니다!"
echo "📱 프론트엔드: http://localhost:3000"
echo "🔧 백엔드: http://localhost:5000"
echo ""
echo "서버를 중지하려면 Ctrl+C를 누르세요."

# 스크립트 종료 시 백그라운드 프로세스도 종료
trap "echo '서버를 중지합니다...'; kill $BACKEND_PID $FRONTEND_PID; exit" INT

# 프로세스가 종료될 때까지 대기
wait
