# 소담(SODAM) Backend API

소상공인을 위한 상권 진단 및 사업 추천 플랫폼의 백엔드 API 서버입니다.

## 🚀 주요 기능

- **상권 진단**: 5가지 핵심 지표를 통한 상권 건강도 분석
- **리스크 분류**: 4가지 리스크 유형 자동 분류 및 완화 전략 제시
- **전략 카드**: 맞춤형 사업 전략 및 실행 가이드 제공
- **지원 도구**: 전문가 상담, 정책 추천, 성공 사례 브라우징
- **지도 시각화**: 상권 데이터의 지도상 시각화 및 분석

## 📋 API 엔드포인트

### 인증 API (`/api/v1/auth`)

- `POST /auth/login` - 사용자 로그인
- `POST /auth/register` - 사용자 회원가입

### 상권 진단 핵심 지표 API (`/api/v1/core-diagnosis`)

- `GET /core-diagnosis/foot-traffic/{market_code}` - 유동인구 변화량 분석
- `GET /core-diagnosis/card-sales/{market_code}` - 카드매출 추이 분석
- `GET /core-diagnosis/same-industry/{market_code}` - 동일업종 수 분석
- `GET /core-diagnosis/business-rates/{market_code}` - 창업·폐업 비율 분석
- `GET /core-diagnosis/dwell-time/{market_code}` - 체류시간 분석
- `POST /core-diagnosis/health-score/{market_code}` - 상권 건강 점수 종합 산정
- `POST /core-diagnosis/comprehensive/{market_code}` - 종합 상권 진단

### 리스크 분류 시스템 API (`/api/v1/risk-classification`)

- `POST /risk-classification/classify/{market_code}` - 4가지 리스크 유형 자동 분류
- `POST /risk-classification/detailed-analysis/{market_code}` - 특정 리스크 유형의 상세 분석
- `GET /risk-classification/risk-types` - 지원하는 리스크 유형 목록
- `GET /risk-classification/mitigation-strategies` - 리스크 완화 전략 목록

### 전략 카드 시스템 API (`/api/v1/strategy-cards`)

- `POST /strategy-cards/generate` - 맞춤형 전략 카드 생성
- `GET /strategy-cards/checklist/{strategy_id}` - 전략별 체크리스트 제공
- `GET /strategy-cards/success-cases` - 성공 사례 제공
- `GET /strategy-cards/templates` - 전략 템플릿 목록
- `GET /strategy-cards/categories` - 전략 카테고리 목록

### 실행 지원 도구 API (`/api/v1/support-tools`)

- `GET /support-tools/support-centers` - 소상공인지원센터 정보 조회
- `GET /support-tools/expert-consultation` - 전문가 상담 예약 정보
- `POST /support-tools/policy-recommendations` - 지역 기반 맞춤 창업 지원 정책 추천
- `GET /support-tools/success-cases` - 유사 상권 성공 사례 브라우징
- `POST /support-tools/consultation-booking` - 전문가 상담 예약
- `POST /support-tools/policy-application` - 정책 신청

### 지도 기반 시각화 API (`/api/v1/map-visualization`)

- `GET /map-visualization/heatmap` - 상권 히트맵 데이터 생성
- `POST /map-visualization/radius-analysis` - 반경별 분석 결과
- `GET /map-visualization/cluster-analysis` - 상권 클러스터 분석
- `GET /map-visualization/traffic-flow/{market_code}` - 유동인구 흐름 분석
- `GET /map-visualization/accessibility/{market_code}` - 접근성 분석
- `GET /map-visualization/analysis-types` - 지원하는 분석 유형 목록

### 기타 API

- **상권 진단**: `/api/v1/market-diagnosis`
- **업종별 분석**: `/api/v1/industry-analysis`
- **지역별 분석**: `/api/v1/regional-analysis`
- **종합 점수 계산**: `/api/v1/scoring`
- **추천 시스템**: `/api/v1/recommendations`

## 🛠️ 설치 및 실행

### 1. 의존성 설치

```bash
pip install -r requirements.txt
```

### 2. 환경 변수 설정

```bash
export FLASK_APP=run_server.py
export FLASK_ENV=development
export JWT_SECRET_KEY=your-secret-key
export DATABASE_URL=sqlite:///instance/app.db
```

### 3. 데이터베이스 초기화

```bash
flask db init
flask db migrate -m "Initial migration"
flask db upgrade
```

### 4. 서버 실행

```bash
python run_server.py
```

서버가 `http://localhost:5002`에서 실행됩니다.

**배포된 서버**: `https://port-0-sodam-back-lyo9x8ghce54051e.sel5.cloudtype.app`

## 📊 데이터 소스

- **market_data.csv**: 상권 현황 데이터
- **tourism_consumption.csv**: 관광 소비 데이터
- **tourism_heatmap.csv**: 관광 소비 히트맵 데이터
- **industry_expenditure.csv**: 업종별 지출액 데이터
- **regional_expenditure.csv**: 지역별 지출액 데이터
- **regional_population.xlsx**: 지역별 인구수 데이터
- **regional_rent.xlsx**: 지역별 임대료 데이터
- **market_classification.xlsx**: 상권 분류 데이터

## 🔧 기술 스택

- **Framework**: Flask 3.0.3
- **Database**: SQLAlchemy 2.0.30
- **Authentication**: Flask-JWT-Extended 4.6.0
- **Data Processing**: Pandas 2.2.2
- **API Documentation**: Flask-RESTX 1.3.0
- **CORS**: Flask-CORS 4.0.0

## 📝 API 문서

Swagger UI를 통해 API 문서를 확인할 수 있습니다:

**로컬 개발 환경:**
- **Swagger UI**: `http://localhost:5003/docs/`
- **API JSON**: `http://localhost:5003/api/v1/swagger.json`

**배포된 서버:**
- **Swagger UI**: `https://port-0-sodam-back-lyo9x8ghce54051e.sel5.cloudtype.app/docs/`
- **API JSON**: `https://port-0-sodam-back-lyo9x8ghce54051e.sel5.cloudtype.app/api/v1/swagger.json`

## 🚀 배포

### Docker 배포

```bash
docker build -t sodam-backend .
docker run -p 5002:5002 sodam-backend
```

### 환경 변수

- `FLASK_ENV`: development/production
- `JWT_SECRET_KEY`: JWT 토큰 암호화 키
- `DATABASE_URL`: 데이터베이스 연결 URL
- `CORS_ORIGINS`: 허용할 CORS 오리진

## 📞 지원

- **개발팀**: SODAM Development Team
- **이메일**: support@sodam.kr
- **문서**: `DETAILED_SWAGGER_GUIDE.md` 참조
