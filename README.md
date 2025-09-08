# SODAM - 소상공인 맞춤 정책 추천 서비스

## 프로젝트 구조

이 프로젝트는 React 프론트엔드와 Flask 백엔드로 구성된 풀스택 웹 애플리케이션입니다.

### 프론트엔드 (React)

- Create React App으로 부트스트랩됨
- TypeScript 사용
- 소상공인 맞춤 정책 추천 UI

### 백엔드 (Flask)

- Flask 기반 REST API
- JWT 인증
- SQLite 데이터베이스
- 정책 추천 알고리즘

## 개발 환경 설정

### 프론트엔드 실행

```bash
cd sodam
npm install
npm start
```

### 백엔드 실행

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt

# set PYTHONPATH to project root if needed
export PYTHONPATH=$(pwd)

# initialize DB (SQLite)
flask --app backend.wsgi db init
flask --app backend.wsgi db migrate -m "init"
flask --app backend.wsgi db upgrade

# run
flask --app backend.wsgi run -p 5000 --debug
```

### API 엔드포인트

- `GET /api/v1/health`
- `POST /api/v1/auth/register` — body: `{ "email": "...", "password": "...", "name": "..." }`
- `POST /api/v1/auth/login` — body: `{ "email": "...", "password": "..." }`
- `POST /api/v1/recs/score` — body: `{ "features": { "foot_traffic": 0.7, ... } }`
- `GET  /api/v1/recs/sample`

## 사용 가능한 스크립트

프로젝트 디렉토리에서 다음 명령어를 실행할 수 있습니다:

### `npm start`

개발 모드로 앱을 실행합니다.\
브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### `npm test`

대화형 감시 모드에서 테스트 러너를 실행합니다.

### `npm run build`

프로덕션용으로 앱을 빌드합니다.

## 기술 스택

- **Frontend**: React, TypeScript, CSS Modules
- **Backend**: Flask, SQLAlchemy, JWT
- **Database**: SQLite
- **Authentication**: JWT 토큰 기반 인증
