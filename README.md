# SODAM - 소상공인 상권 진단 및 사업 추천 플랫폼

## 프로젝트 개요

SODAM은 대전광역시 소상공인을 위한 종합적인 상권 진단 및 사업 추천 플랫폼입니다. 소상공인시장진흥공단의 상권정보 데이터를 기반으로 상권 건강도를 분석하고, 맞춤형 전략과 실행 지원 도구를 제공합니다.

## 프로젝트 구조

이 프로젝트는 React 프론트엔드와 Flask 백엔드로 구성된 풀스택 웹 애플리케이션입니다.

### 프론트엔드 (React + TypeScript)

- **기술 스택**: React 19.1.1, TypeScript, CSS Modules
- **주요 기능**:
  - 상권 진단 및 분석 대시보드
  - 리스크 분류 및 전략 카드 제공
  - 지도 기반 시각화 (히트맵, 클러스터 분석)
  - 정책 추천 및 전문가 상담 연결
  - 업종별/지역별 분석 차트

### 백엔드 (Flask + SQLAlchemy)

- **기술 스택**: Flask 3.0.3, SQLAlchemy 2.0.30, JWT 인증
- **주요 기능**:
  - 상권 진단 API (유동인구, 매출, 경쟁도 분석)
  - 리스크 분류 시스템 (4가지 리스크 유형)
  - 전략 카드 생성 및 추천
  - 지원 도구 및 정책 매칭
  - 지도 시각화 데이터 제공

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

## 주요 기능

### 🏪 상권 진단 시스템

- **5가지 핵심 지표 분석**: 유동인구 변화량, 카드매출 추이, 동일업종 수, 창업·폐업 비율, 체류시간
- **상권 건강 점수**: 종합적인 상권 건강도 산정
- **종합 진단**: 다각도 상권 분석 및 진단 리포트

### ⚠️ 리스크 분류 시스템

- **4가지 리스크 유형**: 시장 리스크, 경쟁 리스크, 운영 리스크, 정책 리스크
- **자동 분류**: 상권 데이터 기반 리스크 유형 자동 분류
- **완화 전략**: 각 리스크 유형별 맞춤형 완화 전략 제시

### 🃏 전략 카드 시스템

- **맞춤형 전략**: 상권 특성과 업종에 맞는 사업 전략 제안
- **실행 가이드**: 단계별 실행 체크리스트 제공
- **성공 사례**: 유사 상권의 성공 사례 브라우징

### 🛠️ 실행 지원 도구

- **정책 추천**: 지역 기반 맞춤 창업 지원 정책 추천
- **전문가 상담**: 소상공인지원센터 및 전문가 상담 연결
- **성공 사례**: 유사 상권 성공 사례 데이터베이스

### 🗺️ 지도 기반 시각화

- **히트맵**: 상권별 소비 패턴 및 활성도 시각화
- **클러스터 분석**: 상권 밀도 및 분포 분석
- **유동인구 흐름**: 시간대별 유동인구 흐름 분석

## API 엔드포인트

### 🔐 인증 API

- `POST /api/v1/sodam/auth/register` — 회원가입
- `POST /api/v1/sodam/auth/login` — 로그인

### 🏪 상권 진단 API

- `GET /api/v1/core-diagnosis/foot-traffic/{market_code}` — 유동인구 변화량 분석
- `GET /api/v1/core-diagnosis/card-sales/{market_code}` — 카드매출 추이 분석
- `GET /api/v1/core-diagnosis/same-industry/{market_code}` — 동일업종 수 분석
- `GET /api/v1/core-diagnosis/business-rates/{market_code}` — 창업·폐업 비율 분석
- `GET /api/v1/core-diagnosis/dwell-time/{market_code}` — 체류시간 분석
- `POST /api/v1/core-diagnosis/health-score/{market_code}` — 상권 건강 점수 산정
- `POST /api/v1/core-diagnosis/comprehensive/{market_code}` — 종합 상권 진단

### ⚠️ 리스크 분류 API

- `POST /api/v1/risk-classification/classify/{market_code}` — 리스크 유형 분류
- `GET /api/v1/risk-classification/risk-types` — 지원 리스크 유형 목록
- `GET /api/v1/risk-classification/mitigation-strategies` — 완화 전략 목록

### 🃏 전략 카드 API

- `POST /api/v1/strategy-cards/generate` — 맞춤형 전략 카드 생성
- `GET /api/v1/strategy-cards/checklist/{strategy_id}` — 전략별 체크리스트
- `GET /api/v1/strategy-cards/success-cases` — 성공 사례 제공

### 🛠️ 지원 도구 API

- `GET /api/v1/support-tools/support-centers` — 소상공인지원센터 정보
- `POST /api/v1/support-tools/policy-recommendations` — 정책 추천
- `POST /api/v1/support-tools/consultation-booking` — 전문가 상담 예약

### 🗺️ 지도 시각화 API

- `GET /api/v1/map-visualization/heatmap` — 상권 히트맵 데이터
- `GET /api/v1/map-visualization/cluster-analysis` — 클러스터 분석
- `GET /api/v1/map-visualization/traffic-flow/{market_code}` — 유동인구 흐름 분석

## 사용 가능한 스크립트

프로젝트 디렉토리에서 다음 명령어를 실행할 수 있습니다:

### `npm start`

개발 모드로 앱을 실행합니다.\
브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 확인하세요.

### `npm test`

대화형 감시 모드에서 테스트 러너를 실행합니다.

### `npm run build`

프로덕션용으로 앱을 빌드합니다.

## 데이터 소스

### 📊 상권 데이터

- **소상공인시장진흥공단 상권정보**: 대전광역시 상가업소 데이터 (77,000+ 건)
- **관광 소비 데이터**: 월별 관광 총소비액 및 업종별 소비 패턴
- **업종별 지출 데이터**: 대분류/중분류별 지출액 비율 분석
- **지역별 데이터**: 인구수, 임대료, 지출액 등 지역별 통계

### 🏢 지원 업종

- **서비스업**: 식음료업, 쇼핑업, 숙박업, 여가서비스업, 운송업
- **전문업**: 의료업, 교육업, 문화업, 스포츠업, 기타서비스업

### 🏘️ 지원 지역

- **대전광역시**: 동구, 중구, 서구, 유성구, 대덕구 (5개 구)

## 기술 스택

### Frontend

- **React 19.1.1**: 최신 React 버전 사용
- **TypeScript**: 타입 안전성 보장
- **CSS Modules**: 컴포넌트별 스타일 격리
- **Chart.js**: 데이터 시각화
- **React Router**: SPA 라우팅

### Backend

- **Flask 3.0.3**: 경량 웹 프레임워크
- **SQLAlchemy 2.0.30**: ORM 및 데이터베이스 관리
- **Flask-JWT-Extended 4.6.0**: JWT 토큰 기반 인증
- **Pandas 2.2.2**: 데이터 처리 및 분석
- **Flask-RESTX 1.3.0**: API 문서화 (Swagger)

### Database & Infrastructure

- **SQLite**: 개발 및 프로토타입용 데이터베이스
- **Flask-Migrate**: 데이터베이스 마이그레이션 관리
- **Docker**: 컨테이너화 및 배포
- **CloudType**: 클라우드 배포 플랫폼

## 배포 정보

### 🌐 서비스 URL

- **프론트엔드**: `http://localhost:3000` (개발)
- **백엔드 API**: `https://port-0-sodam-back-lyo9x8ghce54051e.sel5.cloudtype.app`
- **API 문서**: `https://port-0-sodam-back-lyo9x8ghce54051e.sel5.cloudtype.app/docs/`

### 📚 API 문서

- **Swagger UI**: 실시간 API 테스트 및 문서 확인
- **JSON 스펙**: `https://port-0-sodam-back-lyo9x8ghce54051e.sel5.cloudtype.app/api/v1/swagger.json`

## 프로젝트 특징

### 🎯 핵심 가치

- **데이터 기반 의사결정**: 실제 상권 데이터를 기반으로 한 객관적 분석
- **맞춤형 서비스**: 상권 특성과 업종에 맞는 개인화된 전략 제안
- **실행 가능한 솔루션**: 이론이 아닌 실제 실행 가능한 전략과 지원 도구 제공
- **지속가능한 성장**: 상권 건강도 모니터링을 통한 지속가능한 사업 운영 지원

### 🔍 분석 방법론

- **5가지 핵심 지표**: 유동인구, 매출, 경쟁도, 창업/폐업률, 체류시간
- **리스크 기반 접근**: 4가지 리스크 유형별 맞춤형 완화 전략
- **지역 특화 분석**: 대전광역시 특성을 반영한 지역 맞춤형 분석
- **업종별 특성 고려**: 업종별 생존율과 성공 요인 분석

### 🚀 혁신 요소

- **실시간 데이터 분석**: 최신 상권 데이터를 활용한 실시간 분석
- **AI 기반 리스크 분류**: 머신러닝을 활용한 자동 리스크 분류 시스템
- **지도 기반 시각화**: 직관적인 지도 인터페이스를 통한 상권 분석
- **통합 지원 플랫폼**: 진단부터 실행까지 원스톱 서비스 제공

## 기여 방법

1. **이슈 리포트**: 버그나 개선사항을 GitHub Issues에 등록
2. **기능 제안**: 새로운 기능이나 개선 아이디어 제안
3. **코드 기여**: Pull Request를 통한 코드 기여
4. **문서 개선**: README나 API 문서 개선

## 라이선스

이 프로젝트는 MIT 라이선스 하에 배포됩니다.

## 연락처

- **개발팀**: SODAM Development Team
- **이메일**: support@sodam.kr
- **프로젝트**: 소상공인 상권 진단 및 사업 추천 플랫폼
