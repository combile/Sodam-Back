from flask import Flask
from flask_restx import Api, Resource, fields, Namespace
from flask_cors import CORS
import os

def create_swagger_app():
    """Swagger API 문서를 위한 Flask 앱 생성"""
    app = Flask(__name__)
    CORS(app)
    
    # API 설정
    api = Api(
        app,
        version='1.0',
        title='소담(SODAM) API',
        description='''
        # 소담(SODAM) - 소상공인을 위한 상권 진단 및 사업 추천 플랫폼
        
        ## 플랫폼 개요
        소담(SODAM)은 소상공인들이 창업 및 사업 운영에 필요한 상권 분석, 리스크 평가, 전략 수립을 지원하는 종합 플랫폼입니다.
        
        ## 주요 기능
        - **상권 진단**: 5가지 핵심 지표를 통한 상권 건강도 분석
        - **리스크 분류**: 4가지 리스크 유형 자동 분류 및 완화 전략 제시
        - **전략 카드**: 맞춤형 사업 전략 및 실행 가이드 제공
        - **지원 도구**: 전문가 상담, 정책 추천, 성공 사례 브라우징
        - **지도 시각화**: 상권 데이터의 지도상 시각화 및 분석
        
        ## 데이터 소스
        - 실제 상권 현황 데이터 (CSV 기반)
        - 관광 소비액 데이터
        - 업종별/지역별 지출 데이터
        - 실시간 상권 분석 데이터
        
        ## 기술 스택
        - **Backend**: Flask, SQLAlchemy, Pandas
        - **API**: RESTful API, JWT 인증
        - **Documentation**: Swagger/OpenAPI 3.0
        - **Data**: CSV 파일 기반 실제 데이터
        
        ## 사용 방법
        1. **인증**: 먼저 회원가입/로그인을 통해 JWT 토큰을 발급받으세요
        2. **상권 분석**: 관심 있는 상권의 건강도를 분석해보세요
        3. **리스크 평가**: 상권의 리스크 유형을 파악하고 완화 전략을 확인하세요
        4. **전략 수립**: 맞춤형 사업 전략을 생성하고 실행 계획을 세우세요
        5. **지원 활용**: 전문가 상담 예약 및 정책 신청을 진행하세요
        
        ## API 특징
        - **실제 데이터 기반**: 샘플 데이터가 아닌 실제 상권 데이터 활용
        - **종합적 분석**: 다각도 지표를 통한 정확한 상권 평가
        - **개인화 추천**: 사용자 프로필 기반 맞춤형 솔루션 제공
        - **실행 중심**: 이론이 아닌 실제 실행 가능한 전략 제시
        - **시각화 지원**: 지도 기반 직관적 데이터 표현
        
        ## 지원 및 문의
        - **개발팀**: SODAM Development Team
        - **이메일**: support@sodam.kr
        - **문서**: 이 Swagger UI를 통해 모든 API를 테스트할 수 있습니다
        
        ## 관련 링크
        - [프론트엔드 개발 가이드](./FRONTEND_GUIDE.md)
        - [API 명세서](./API_SPECIFICATION.md)
        - [데이터 구조 가이드](./DATA_STRUCTURE.md)
        ''',
        doc='/docs/',  # Swagger UI 경로
        prefix='/api/v1'
    )
    
    # 네임스페이스 정의
    auth_ns = Namespace('auth', description='''
    인증 API
    사용자 인증 및 회원가입을 처리하는 API입니다.
    
    주요 기능:
    - 사용자 회원가입 (사용자명, 이메일, 비밀번호, 프로필 정보)
    - 사용자 로그인 (사용자명 기반)
    - JWT 토큰 발급 및 관리
    
    사용 방법:
    1. 먼저 회원가입을 통해 계정을 생성하세요
    2. 로그인을 통해 JWT 토큰을 발급받으세요
    3. 이후 API 호출 시 Authorization 헤더에 토큰을 포함하세요
    ''')
    
    core_diagnosis_ns = Namespace('core-diagnosis', description='''
    상권 진단 핵심 지표 API
    상권의 건강도를 평가하는 5가지 핵심 지표를 분석하는 API입니다.
    
    5가지 핵심 지표:
    1. 유동인구 변화량: 상권 내 유동인구의 변화 추이 분석
    2. 카드매출 추이: 카드 결제 매출의 변화 패턴 분석
    3. 동일업종 수: 경쟁업체 수 및 경쟁 강도 분석
    4. 창업·폐업 비율: 상권 내 사업체의 생존율 및 변화율 분석
    5. 체류시간: 고객의 평균 체류시간 및 시간대별 분석
    
    분석 결과:
    - 각 지표별 점수 및 등급 (A, B, C, D)
    - 종합 건강 점수 및 최종 등급
    - 상세한 분석 결과 및 개선 방안 제시
    ''')
    
    risk_classification_ns = Namespace('risk-classification', description='''
    리스크 분류 시스템 API
    상권의 리스크를 4가지 유형으로 자동 분류하고 완화 전략을 제시하는 API입니다.
    
    4가지 리스크 유형:
    1. 유입 저조형: 유동인구와 매출 증가율이 낮아 상권 활성화가 저조한 상태
    2. 과포화 경쟁형: 동일업종 사업체가 과도하게 많아 경쟁이 치열한 상태
    3. 소비력 약형: 지역 주민의 소비력이 약해 매출 증대가 어려운 상태
    4. 성장 잠재형: 성장 잠재력은 있지만 현재는 부진한 상태
    
    제공 기능:
    - 자동 리스크 분류 및 점수 산정
    - 리스크별 상세 분석 및 원인 파악
    - 완화 전략 및 실행 방안 제시
    - 성공 사례 기반 해결책 제안
    ''')
    
    strategy_cards_ns = Namespace('strategy-cards', description='''
    전략 카드 시스템 API
    사용자 프로필과 상권 특성을 기반으로 맞춤형 사업 전략을 생성하는 API입니다.
    
    전략 카드 구성:
    - 전략명: 구체적인 전략 제목
    - 카테고리: 마케팅, 고객관리, 운영, 재무 등
    - 난이도: 초급, 중급, 고급
    - 소요 기간: 1-3개월, 3-6개월, 6개월 이상
    - 비용 수준: 낮음, 중간, 높음
    - 예상 효과: 구체적인 성과 지표
    - 성공 확률: 통계 기반 성공 가능성
    
    제공 기능:
    - 개인화된 전략 카드 생성
    - 단계별 체크리스트 제공
    - 실행 팁 및 주의사항 안내
    - 성공 사례 및 참고 자료 제공
    ''')
    
    support_tools_ns = Namespace('support-tools', description='''
    실행 지원 도구 API
    사업 실행을 위한 실질적인 지원 도구들을 제공하는 API입니다.
    
    주요 지원 도구:
    1. 소상공인지원센터: 지역별 지원센터 정보 및 서비스 안내
    2. 전문가 상담: 창업 컨설턴트, 경영 전문가 상담 예약
    3. 정책 추천: 맞춤형 창업 지원 정책 및 신청 가이드
    4. 성공 사례: 유사 상권의 성공 사례 및 학습 자료
    5. 상담 예약: 전문가 상담 일정 예약 및 관리
    6. 정책 신청: 지원 정책 신청 및 진행 상황 추적
    
    지원 범위:
    - 창업 초기 자금 지원
    - 경영 컨설팅 및 교육
    - 마케팅 지원 및 홍보
    - 법무 및 세무 상담
    ''')
    
    map_visualization_ns = Namespace('map-visualization', description='''
    지도 기반 시각화 API
    상권 데이터를 지도상에 시각화하여 직관적으로 분석할 수 있는 API입니다.
    
    시각화 유형:
    1. 히트맵: 상권별 건강도, 유동인구, 경쟁도 등을 색상으로 표현
    2. 반경별 분석: 특정 지점을 중심으로 반경 내 상권 분석
    3. 클러스터 분석: 유사한 특성을 가진 상권들을 그룹화
    4. 유동인구 흐름: 시간대별 유동인구 이동 패턴 분석
    5. 접근성 분석: 교통편, 주차, 보행자 접근성 평가
    
    분석 기능:
    - 실시간 데이터 기반 시각화
    - 인터랙티브 지도 조작
    - 다층 데이터 오버레이
    - 반경별 필터링 및 분석
    ''')
    
    market_diagnosis_ns = Namespace('market-diagnosis', description='''
    상권 진단 API
    기본적인 상권 정보 및 통계를 제공하는 API입니다.
    
    제공 정보:
    - 상권 목록 및 기본 정보
    - 상권별 상세 정보 (위치, 규모, 특성)
    - 구/군별 상권 통계 및 분포
    - 상권별 업종 분포 및 특성
    ''')
    
    industry_analysis_ns = Namespace('industry-analysis', description='''
    업종별 분석 API
    업종별 사업 성과 및 리스크를 분석하는 API입니다.
    
    분석 지표:
    - 업종별 생존율 및 폐업율
    - 업종별 평균 매출 및 수익성
    - 업종별 리스크 요인 분석
    - 업종별 성장 전망 및 트렌드
    ''')
    
    regional_analysis_ns = Namespace('regional-analysis', description='''
    지역별 분석 API
    지역별 경제 지표 및 상권 특성을 분석하는 API입니다.
    
    분석 지표:
    - 지역별 인구 통계 및 변화 추이
    - 지역별 임대료 수준 및 변화
    - 지역별 상권 밀도 및 분포
    - 지역별 소비 패턴 및 특성
    ''')
    
    scoring_ns = Namespace('scoring', description='''
    종합 점수 계산 API
    다양한 지표를 종합하여 상권의 종합 점수를 계산하는 API입니다.
    
    점수 구성 요소:
    - 상권 건강도 점수
    - 접근성 점수
    - 경쟁 환경 점수
    - 성장 잠재력 점수
    - 사용자 프로필 매칭 점수
    
    제공 기능:
    - 종합 점수 계산 및 등급 산정
    - 위치별 비교 분석
    - 점수 구성 요소별 상세 분석
    - 개선 방안 및 권장사항 제시
    ''')
    
    recommendations_ns = Namespace('recommendations', description='''
    추천 시스템 API
    사용자 프로필과 상권 특성을 기반으로 맞춤형 추천을 제공하는 API입니다.
    
    추천 유형:
    1. 개인화 추천: 사용자 프로필 기반 맞춤형 상권 추천
    2. 업종별 추천: 특정 업종에 적합한 상권 추천
    3. 지역별 추천: 특정 지역 내 우수 상권 추천
    4. 유사 사용자 추천: 비슷한 프로필의 사용자들이 선택한 상권 추천
    
    추천 알고리즘:
    - 협업 필터링 (Collaborative Filtering)
    - 콘텐츠 기반 필터링 (Content-based Filtering)
    - 하이브리드 추천 시스템
    - 실시간 추천 업데이트
    ''')
    
    # 네임스페이스 등록
    api.add_namespace(auth_ns)
    api.add_namespace(core_diagnosis_ns)
    api.add_namespace(risk_classification_ns)
    api.add_namespace(strategy_cards_ns)
    api.add_namespace(support_tools_ns)
    api.add_namespace(map_visualization_ns)
    api.add_namespace(market_diagnosis_ns)
    api.add_namespace(industry_analysis_ns)
    api.add_namespace(regional_analysis_ns)
    api.add_namespace(scoring_ns)
    api.add_namespace(recommendations_ns)
    
    # 모델 정의
    # 인증 모델
    login_model = api.model('LoginRequest', {
        'username': fields.String(required=True, description='사용자명 (3-20자, 영문/숫자/언더스코어만 허용)', example='daejeon_user'),
        'password': fields.String(required=True, description='비밀번호 (최소 8자, 영문/숫자/특수문자 포함)', example='password123!')
    })
    
    register_model = api.model('RegisterRequest', {
        'username': fields.String(required=True, description='사용자명 (3-20자, 영문/숫자/언더스코어만 허용)', example='daejeon_user'),
        'email': fields.String(required=True, description='이메일 주소 (유효한 이메일 형식)', example='user@daejeon.kr'),
        'password': fields.String(required=True, description='비밀번호 (최소 8자, 영문/숫자/특수문자 포함)', example='password123!'),
        'nickname': fields.String(description='닉네임 (2-10자)', example='대전사업가'),
        'userType': fields.String(description='사용자 유형', enum=['ENTREPRENEUR', 'INVESTOR', 'ADVISOR'], example='ENTREPRENEUR'),
        'businessStage': fields.String(description='사업 단계', enum=['PLANNING', 'STARTUP', 'GROWTH', 'MATURE'], example='PLANNING'),
        'phone': fields.String(description='전화번호 (010-1234-5678 형식)', example='010-1234-5678'),
        'interestedBusinessTypes': fields.List(fields.String, description='관심 업종 목록', example=['카페', '음식점', '소매업']),
        'preferredAreas': fields.List(fields.String, description='선호 지역 목록', example=['중구', '서구', '유성구'])
    })
    
    # 인증 응답 모델
    auth_response = api.model('AuthResponse', {
        'access_token': fields.String(description='JWT 액세스 토큰', example='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...'),
        'token_type': fields.String(description='토큰 타입', example='Bearer'),
        'expires_in': fields.Integer(description='토큰 만료 시간 (초)', example=3600),
        'user': fields.Nested(api.model('UserInfo', {
            'id': fields.Integer(description='사용자 ID', example=1),
            'username': fields.String(description='사용자명', example='daejeon_user'),
            'email': fields.String(description='이메일', example='user@daejeon.kr'),
            'nickname': fields.String(description='닉네임', example='대전사업가'),
            'userType': fields.String(description='사용자 유형', example='ENTREPRENEUR'),
            'businessStage': fields.String(description='사업 단계', example='PLANNING')
        }))
    })
    
    # 상권 진단 모델
    health_score_request = api.model('HealthScoreRequest', {
        'industry': fields.String(description='업종 (선택사항)', example='카페', enum=['카페', '음식점', '소매업', '서비스업', '기타'])
    })
    
    foot_traffic_response = api.model('FootTrafficResponse', {
        'market_code': fields.String(description='상권 코드', example='DJ001'),
        'market_name': fields.String(description='상권명', example='대전역 상권'),
        'current_monthly_traffic': fields.Integer(description='현재 월 유동인구 (명)', example=150000),
        'previous_monthly_traffic': fields.Integer(description='이전 월 유동인구 (명)', example=145000),
        'average_monthly_change': fields.Float(description='월평균 변화율 (%)', example=3.4),
        'total_change_period': fields.Float(description='기간 총 변화율 (%)', example=12.5),
        'trend': fields.String(description='트렌드', example='상승', enum=['상승', '하락', '보합']),
        'grade': fields.String(description='등급', example='A', enum=['A', 'B', 'C', 'D']),
        'score': fields.Integer(description='점수 (0-100)', example=85),
        'analysis': fields.String(description='분석 결과', example='유동인구가 지속적으로 증가하고 있어 상권 활성화가 우수한 상태입니다.'),
        'recommendations': fields.List(fields.String, description='개선 권장사항', example=['고객 유입 증대를 위한 마케팅 강화', '체류시간 연장을 위한 서비스 개선'])
    })
    
    card_sales_response = api.model('CardSalesResponse', {
        'market_code': fields.String(description='상권 코드', example='DJ001'),
        'market_name': fields.String(description='상권명', example='대전역 상권'),
        'current_monthly_sales': fields.Integer(description='현재 월 카드매출 (원)', example=2500000000),
        'previous_monthly_sales': fields.Integer(description='이전 월 카드매출 (원)', example=2400000000),
        'average_monthly_change': fields.Float(description='월평균 변화율 (%)', example=4.2),
        'total_change_period': fields.Float(description='기간 총 변화율 (%)', example=15.8),
        'trend': fields.String(description='트렌드', example='상승', enum=['상승', '하락', '보합']),
        'grade': fields.String(description='등급', example='A', enum=['A', 'B', 'C', 'D']),
        'score': fields.Integer(description='점수 (0-100)', example=88),
        'analysis': fields.String(description='분석 결과', example='카드매출이 꾸준히 증가하여 상권의 구매력이 향상되고 있습니다.'),
        'recommendations': fields.List(fields.String, description='개선 권장사항', example=['고객 단가 상승을 위한 상품 다양화', '프리미엄 고객층 확보'])
    })
    
    same_industry_response = api.model('SameIndustryResponse', {
        'market_code': fields.String(description='상권 코드', example='DJ001'),
        'market_name': fields.String(description='상권명', example='대전역 상권'),
        'total_same_industry': fields.Integer(description='동일업종 사업체 수', example=45),
        'competition_intensity': fields.String(description='경쟁 강도', example='높음', enum=['낮음', '보통', '높음', '매우높음']),
        'market_share_potential': fields.Float(description='시장 점유율 잠재력 (%)', example=2.2),
        'grade': fields.String(description='등급', example='B', enum=['A', 'B', 'C', 'D']),
        'score': fields.Integer(description='점수 (0-100)', example=65),
        'analysis': fields.String(description='분석 결과', example='동일업종 사업체가 많아 경쟁이 치열하지만, 시장 규모가 커서 진입 가능성이 있습니다.'),
        'recommendations': fields.List(fields.String, description='개선 권장사항', example=['차별화된 컨셉으로 경쟁 우위 확보', '고객층 세분화를 통한 틈새시장 공략'])
    })
    
    business_rates_response = api.model('BusinessRatesResponse', {
        'market_code': fields.String(description='상권 코드', example='DJ001'),
        'market_name': fields.String(description='상권명', example='대전역 상권'),
        'startup_rate': fields.Float(description='창업률 (%)', example=8.5),
        'closure_rate': fields.Float(description='폐업률 (%)', example=6.2),
        'survival_rate': fields.Float(description='생존률 (%)', example=93.8),
        'net_growth_rate': fields.Float(description='순증가율 (%)', example=2.3),
        'grade': fields.String(description='등급', example='A', enum=['A', 'B', 'C', 'D']),
        'score': fields.Integer(description='점수 (0-100)', example=82),
        'analysis': fields.String(description='분석 결과', example='창업률이 폐업률보다 높아 상권이 활발하게 성장하고 있습니다.'),
        'recommendations': fields.List(fields.String, description='개선 권장사항', example=['신규 창업자 지원 프로그램 활용', '기존 사업자와의 협력 체계 구축'])
    })
    
    dwell_time_response = api.model('DwellTimeResponse', {
        'market_code': fields.String(description='상권 코드', example='DJ001'),
        'market_name': fields.String(description='상권명', example='대전역 상권'),
        'average_dwell_time': fields.Float(description='평균 체류시간 (분)', example=45.5),
        'peak_hours': fields.List(fields.String, description='체류시간이 긴 시간대', example=['12:00-14:00', '18:00-20:00']),
        'dwell_time_trend': fields.String(description='체류시간 트렌드', example='증가', enum=['증가', '감소', '보합']),
        'grade': fields.String(description='등급', example='B', enum=['A', 'B', 'C', 'D']),
        'score': fields.Integer(description='점수 (0-100)', example=72),
        'analysis': fields.String(description='분석 결과', example='점심시간과 저녁시간에 체류시간이 길어 식음료업에 유리한 상권입니다.'),
        'recommendations': fields.List(fields.String, description='개선 권장사항', example=['점심시간 메뉴 최적화', '저녁시간 이벤트 기획'])
    })
    
    comprehensive_health_response = api.model('ComprehensiveHealthResponse', {
        'market_code': fields.String(description='상권 코드', example='DJ001'),
        'market_name': fields.String(description='상권명', example='대전역 상권'),
        'overall_score': fields.Integer(description='종합 건강도 점수 (0-100)', example=78),
        'overall_grade': fields.String(description='종합 등급', example='B+', enum=['A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D']),
        'individual_scores': fields.Nested(api.model('IndividualScores', {
            'foot_traffic': fields.Integer(description='유동인구 점수', example=85),
            'card_sales': fields.Integer(description='카드매출 점수', example=88),
            'same_industry': fields.Integer(description='동종업계 점수', example=65),
            'business_rates': fields.Integer(description='사업률 점수', example=82),
            'dwell_time': fields.Integer(description='체류시간 점수', example=72)
        })),
        'strengths': fields.List(fields.String, description='강점', example=['유동인구 증가', '매출 성장', '창업 활발']),
        'weaknesses': fields.List(fields.String, description='약점', example=['경쟁 치열', '체류시간 부족']),
        'recommendations': fields.List(fields.String, description='종합 권장사항', example=['차별화 전략 수립', '고객 체류시간 연장 방안 모색']),
        'analysis_date': fields.String(description='분석 일시', example='2024-01-15T10:30:00Z')
    })
    
    # 리스크 분류 모델
    risk_classification_request = api.model('RiskClassificationRequest', {
        'industry': fields.String(description='업종 (선택사항)', example='카페', enum=['카페', '음식점', '소매업', '서비스업', '기타'])
    })
    
    risk_classification_response = api.model('RiskClassificationResponse', {
        'market_code': fields.String(description='상권 코드', example='DJ001'),
        'market_name': fields.String(description='상권명', example='대전역 상권'),
        'industry': fields.String(description='업종', example='카페'),
        'primary_risk_type': fields.String(description='주요 리스크 유형', example='과포화 경쟁형', enum=['유입 저조형', '과포화 경쟁형', '소비력 약형', '성장 잠재형']),
        'primary_risk_score': fields.Float(description='주요 리스크 점수 (0-100, 높을수록 위험)', example=75.5),
        'risk_level': fields.String(description='리스크 레벨', example='높음', enum=['낮음', '보통', '높음', '매우높음']),
        'risk_factors': fields.List(fields.String, description='리스크 요인', example=['동일업종 과다', '임대료 상승', '고객 유입 감소']),
        'analysis': fields.String(description='분석 결과', example='동일업종 사업체가 과도하게 많아 경쟁이 치열하며, 신규 진입 시 어려움이 예상됩니다.'),
        'recommendations': fields.List(fields.String, description='추천사항', example=['차별화된 컨셉 도입', '고객층 세분화', '온라인 마케팅 강화']),
        'success_probability': fields.Float(description='성공 확률 (%)', example=65.0),
        'analysis_date': fields.String(description='분석 일시', example='2024-01-15T10:30:00Z')
    })
    
    detailed_risk_analysis_request = api.model('DetailedRiskAnalysisRequest', {
        'risk_type': fields.String(required=True, description='분석할 리스크 유형', example='과포화 경쟁형', enum=['유입 저조형', '과포화 경쟁형', '소비력 약형', '성장 잠재형']),
        'industry': fields.String(description='업종 (선택사항)', example='카페', enum=['카페', '음식점', '소매업', '서비스업', '기타'])
    })
    
    detailed_risk_analysis_response = api.model('DetailedRiskAnalysisResponse', {
        'market_code': fields.String(description='상권 코드', example='DJ001'),
        'market_name': fields.String(description='상권명', example='대전역 상권'),
        'risk_type': fields.String(description='리스크 유형', example='과포화 경쟁형'),
        'risk_description': fields.String(description='리스크 설명', example='동일업종 사업체가 과도하게 많아 경쟁이 치열한 상태'),
        'risk_indicators': fields.Nested(api.model('RiskIndicators', {
            'competition_density': fields.Float(description='경쟁 밀도 지수', example=8.5),
            'market_saturation': fields.Float(description='시장 포화도 (%)', example=85.0),
            'price_competition': fields.Float(description='가격 경쟁 강도', example=7.2),
            'customer_acquisition_cost': fields.Float(description='고객 획득 비용', example=15000)
        })),
        'impact_assessment': fields.Nested(api.model('ImpactAssessment', {
            'revenue_impact': fields.String(description='매출 영향', example='중간', enum=['낮음', '중간', '높음']),
            'profit_margin_impact': fields.String(description='수익성 영향', example='높음', enum=['낮음', '중간', '높음']),
            'market_share_impact': fields.String(description='시장점유율 영향', example='높음', enum=['낮음', '중간', '높음']),
            'growth_potential_impact': fields.String(description='성장잠재력 영향', example='중간', enum=['낮음', '중간', '높음'])
        })),
        'mitigation_strategies': fields.List(fields.Nested(api.model('MitigationStrategy', {
            'strategy_name': fields.String(description='전략명', example='차별화된 컨셉 도입'),
            'description': fields.String(description='전략 설명', example='고유한 브랜드 아이덴티티와 차별화된 서비스로 경쟁 우위를 확보'),
            'implementation_difficulty': fields.String(description='구현 난이도', example='중간', enum=['쉬움', '중간', '어려움']),
            'expected_effectiveness': fields.String(description='예상 효과', example='높음', enum=['낮음', '중간', '높음']),
            'required_investment': fields.String(description='필요 투자', example='중간', enum=['낮음', '중간', '높음']),
            'timeline': fields.String(description='실행 기간', example='3-6개월')
        }))),
        'success_cases': fields.List(fields.Nested(api.model('SuccessCase', {
            'case_name': fields.String(description='사례명', example='대전 카페 A의 차별화 성공'),
            'description': fields.String(description='사례 설명', example='독특한 인테리어와 특별한 메뉴로 경쟁에서 승리'),
            'results': fields.String(description='성과', example='매출 30% 증가, 고객 충성도 향상'),
            'key_factors': fields.List(fields.String, description='성공 요인', example=['독창적 컨셉', '고품질 서비스', '지속적 혁신'])
        }))),
        'analysis_date': fields.String(description='분석 일시', example='2024-01-15T10:30:00Z')
    })
    
    # 전략 카드 모델
    user_profile_model = api.model('UserProfile', {
        'userType': fields.String(description='사용자 유형', example='ENTREPRENEUR', enum=['ENTREPRENEUR', 'INVESTOR', 'ADVISOR']),
        'businessStage': fields.String(description='사업 단계', example='PLANNING', enum=['PLANNING', 'STARTUP', 'GROWTH', 'MATURE']),
        'capital': fields.Integer(description='자본 (만원)', example=5000),
        'riskTolerance': fields.String(description='리스크 허용도', example='중간', enum=['낮음', '중간', '높음']),
        'experience': fields.String(description='경험 수준', example='초보', enum=['초보', '중급', '고급'])
    })
    
    strategy_cards_request = api.model('StrategyCardsRequest', {
        'market_code': fields.String(required=True, description='상권 코드', example='DJ001'),
        'industry': fields.String(required=True, description='업종', example='카페', enum=['카페', '음식점', '소매업', '서비스업', '기타']),
        'risk_type': fields.String(required=True, description='리스크 유형', example='과포화 경쟁형', enum=['유입 저조형', '과포화 경쟁형', '소비력 약형', '성장 잠재형']),
        'user_profile': fields.Nested(user_profile_model, required=True, description='사용자 프로필')
    })
    
    strategy_card_model = api.model('StrategyCard', {
        'strategy_id': fields.String(description='전략 ID', example='STRAT_001'),
        'strategy_name': fields.String(description='전략명', example='차별화된 컨셉 카페 운영'),
        'category': fields.String(description='카테고리', example='마케팅', enum=['마케팅', '운영', '재무', '인사', '기술']),
        'description': fields.String(description='설명', example='고유한 테마와 특별한 메뉴로 경쟁에서 차별화를 추구하는 전략'),
        'difficulty': fields.String(description='난이도', example='중간', enum=['쉬움', '중간', '어려움']),
        'duration': fields.String(description='소요 기간', example='3-6개월'),
        'cost_level': fields.String(description='비용 수준', example='중간', enum=['낮음', '중간', '높음']),
        'expected_impact': fields.String(description='예상 효과', example='매출 20-30% 증가, 고객 충성도 향상'),
        'priority': fields.Integer(description='우선순위 (1-5, 높을수록 우선)', example=4),
        'success_probability': fields.Integer(description='성공 확률 (%)', example=75),
        'required_resources': fields.List(fields.String, description='필요 자원', example=['창업자금 3000만원', '인테리어 비용 2000만원']),
        'implementation_steps': fields.List(fields.String, description='구현 단계', example=['컨셉 기획', '메뉴 개발', '인테리어 설계']),
        'tips': fields.List(fields.String, description='실행 팁', example=['고객 피드백 적극 수용', 'SNS 마케팅 활용'])
    })
    
    strategy_cards_response = api.model('StrategyCardsResponse', {
        'market_code': fields.String(description='상권 코드', example='DJ001'),
        'market_name': fields.String(description='상권명', example='대전역 상권'),
        'industry': fields.String(description='업종', example='카페'),
        'risk_type': fields.String(description='리스크 유형', example='과포화 경쟁형'),
        'strategy_cards': fields.List(fields.Nested(strategy_card_model), description='추천 전략 카드 목록'),
        'total_count': fields.Integer(description='총 전략 카드 수', example=5),
        'generation_date': fields.String(description='생성 일시', example='2024-01-15T10:30:00Z')
    })
    
    strategy_checklist_response = api.model('StrategyChecklistResponse', {
        'strategy_id': fields.String(description='전략 카드 ID', example='STRAT_001'),
        'strategy_title': fields.String(description='전략 제목', example='차별화된 컨셉 카페 운영'),
        'checklist_items': fields.List(fields.Nested(api.model('ChecklistItem', {
            'id': fields.String(description='체크리스트 항목 ID', example='CHK_001'),
            'title': fields.String(description='항목 제목', example='컨셉 기획 및 브랜드 아이덴티티 설정'),
            'description': fields.String(description='상세 설명', example='고유한 테마와 브랜드 스토리를 기반으로 한 컨셉 개발'),
            'priority': fields.String(description='우선순위', example='높음', enum=['높음', '중간', '낮음']),
            'estimated_time': fields.String(description='예상 소요 시간', example='2-3주'),
            'required_resources': fields.List(fields.String, description='필요 자원', example=['기획 인력', '디자인 비용']),
            'dependencies': fields.List(fields.String, description='선행 조건', example=['시장 조사 완료', '예산 확보']),
            'success_criteria': fields.String(description='성공 기준', example='브랜드 컨셉 확정 및 고객 반응 테스트 완료')
        }))),
        'total_items': fields.Integer(description='총 체크리스트 항목 수', example=15),
        'completion_estimate': fields.String(description='완료 예상 기간', example='3-6개월')
    })
    
    # 지원 도구 모델
    support_center_model = api.model('SupportCenter', {
        'id': fields.String(description='센터 ID', example='SC_001'),
        'name': fields.String(description='센터명', example='대전광역시 소상공인 지원센터'),
        'region': fields.String(description='지역', example='중구'),
        'address': fields.String(description='주소', example='대전광역시 중구 중앙로 101'),
        'phone': fields.String(description='전화번호', example='042-123-4567'),
        'email': fields.String(description='이메일', example='support@daejeon.go.kr'),
        'website': fields.String(description='웹사이트', example='https://support.daejeon.go.kr'),
        'services': fields.List(fields.String, description='제공 서비스', example=['창업 컨설팅', '자금 지원', '교육 프로그램', '네트워킹']),
        'operating_hours': fields.String(description='운영 시간', example='평일 09:00-18:00'),
        'specialties': fields.List(fields.String, description='전문 분야', example=['카페', '음식점', '소매업']),
        'consultation_fee': fields.String(description='상담비', example='무료'),
        'languages': fields.List(fields.String, description='지원 언어', example=['한국어', '영어']),
        'accessibility': fields.List(fields.String, description='접근성', example=['지하철역 도보 5분', '주차장 보유'])
    })
    
    expert_consultation_model = api.model('ExpertConsultation', {
        'expert_id': fields.String(description='전문가 ID', example='EXP_001'),
        'name': fields.String(description='전문가명', example='김상권'),
        'title': fields.String(description='직책', example='상권 분석 전문가'),
        'company': fields.String(description='소속 회사', example='상권연구소'),
        'experience_years': fields.Integer(description='경력 (년)', example=15),
        'specialties': fields.List(fields.String, description='전문 분야', example=['상권 분석', '창업 컨설팅', '마케팅 전략']),
        'consultation_types': fields.List(fields.String, description='상담 유형', example=['1:1 상담', '그룹 상담', '온라인 상담']),
        'consultation_fee': fields.Integer(description='상담비 (원/시간)', example=100000),
        'available_times': fields.List(fields.String, description='가능한 시간대', example=['평일 오전', '평일 오후', '주말']),
        'languages': fields.List(fields.String, description='지원 언어', example=['한국어', '영어']),
        'rating': fields.Float(description='평점 (1-5)', example=4.8),
        'review_count': fields.Integer(description='리뷰 수', example=127),
        'success_cases': fields.List(fields.String, description='성공 사례', example=['카페 창업 성공', '음식점 매출 2배 증가'])
    })
    
    policy_recommendation_request = api.model('PolicyRecommendationRequest', {
        'user_profile': fields.Nested(user_profile_model, required=True, description='사용자 프로필'),
        'business_type': fields.String(required=True, description='사업 유형', example='카페', enum=['카페', '음식점', '소매업', '서비스업', '기타']),
        'business_stage': fields.String(required=True, description='사업 단계', example='PLANNING', enum=['PLANNING', 'STARTUP', 'GROWTH', 'MATURE']),
        'location': fields.String(description='사업장 위치', example='중구'),
        'capital_amount': fields.Integer(description='자본금 (만원)', example=5000),
        'employment_plan': fields.Integer(description='고용 계획 (명)', example=3)
    })
    
    policy_recommendation_response = api.model('PolicyRecommendationResponse', {
        'recommended_policies': fields.List(fields.Nested(api.model('Policy', {
            'policy_id': fields.String(description='정책 ID', example='POL_001'),
            'policy_name': fields.String(description='정책명', example='소상공인 창업자금 지원'),
            'organization': fields.String(description='주관 기관', example='중소벤처기업부'),
            'description': fields.String(description='정책 설명', example='소상공인 창업 시 필요한 자금을 지원하는 정책'),
            'support_amount': fields.String(description='지원 금액', example='최대 5000만원'),
            'eligibility': fields.List(fields.String, description='지원 자격', example=['소상공인', '창업 3년 이내', '매출 1억원 이하']),
            'application_period': fields.String(description='신청 기간', example='상시 접수'),
            'required_documents': fields.List(fields.String, description='필요 서류', example=['사업자등록증', '사업계획서', '재무제표']),
            'contact_info': fields.String(description='문의처', example='02-1234-5678'),
            'website': fields.String(description='정책 홈페이지', example='https://policy.go.kr'),
            'match_score': fields.Float(description='매칭 점수 (0-100)', example=95.0),
            'application_difficulty': fields.String(description='신청 난이도', example='쉬움', enum=['쉬움', '중간', '어려움'])
        }))),
        'total_count': fields.Integer(description='추천 정책 수', example=5),
        'generation_date': fields.String(description='생성 일시', example='2024-01-15T10:30:00Z')
    })
    
    consultation_booking_request = api.model('ConsultationBookingRequest', {
        'expert_id': fields.String(required=True, description='전문가 ID', example='EXP_001'),
        'consultation_type': fields.String(required=True, description='상담 유형', example='1:1 상담', enum=['1:1 상담', '그룹 상담', '온라인 상담']),
        'preferred_date': fields.String(required=True, description='희망 날짜', example='2024-01-20'),
        'preferred_time': fields.String(required=True, description='희망 시간', example='14:00'),
        'duration': fields.Integer(description='상담 시간 (분)', example=60),
        'business_type': fields.String(description='사업 유형', example='카페'),
        'consultation_purpose': fields.String(description='상담 목적', example='창업 계획 수립'),
        'contact_phone': fields.String(description='연락처', example='010-1234-5678'),
        'additional_notes': fields.String(description='추가 요청사항', example='온라인 상담 희망')
    })
    
    consultation_booking_response = api.model('ConsultationBookingResponse', {
        'booking_id': fields.String(description='예약 ID', example='BOOK_001'),
        'expert_name': fields.String(description='전문가명', example='김상권'),
        'consultation_type': fields.String(description='상담 유형', example='1:1 상담'),
        'scheduled_date': fields.String(description='예약 날짜', example='2024-01-20'),
        'scheduled_time': fields.String(description='예약 시간', example='14:00'),
        'duration': fields.Integer(description='상담 시간 (분)', example=60),
        'consultation_fee': fields.Integer(description='상담비 (원)', example=100000),
        'status': fields.String(description='예약 상태', example='확정', enum=['대기', '확정', '완료', '취소']),
        'meeting_link': fields.String(description='온라인 상담 링크', example='https://meet.google.com/abc-defg-hij'),
        'contact_info': fields.String(description='연락처', example='02-1234-5678'),
        'booking_date': fields.String(description='예약 일시', example='2024-01-15T10:30:00Z')
    })
    
    # 지도 시각화 모델
    heatmap_data_model = api.model('HeatmapData', {
        'lat': fields.Float(description='위도', example=36.3504),
        'lng': fields.Float(description='경도', example=127.3845),
        'intensity': fields.Float(description='강도 (0-1)', example=0.85),
        'color': fields.String(description='색상 코드', example='#FF0000'),
        'market_code': fields.String(description='상권 코드', example='DJ001'),
        'market_name': fields.String(description='상권명', example='대전역 상권'),
        'grade': fields.String(description='등급', example='A', enum=['A', 'B', 'C', 'D']),
        'score': fields.Integer(description='점수 (0-100)', example=85),
        'metric_type': fields.String(description='지표 유형', example='health_score', enum=['health_score', 'foot_traffic', 'competition', 'growth_potential']),
        'value': fields.Float(description='실제 값', example=78.5)
    })
    
    heatmap_response = api.model('HeatmapResponse', {
        'heatmap_data': fields.List(fields.Nested(heatmap_data_model), description='히트맵 데이터'),
        'total_markets': fields.Integer(description='총 상권 수', example=150),
        'analysis_type': fields.String(description='분석 유형', example='health_score'),
        'date_range': fields.String(description='데이터 기간', example='2024-01-01 ~ 2024-01-31'),
        'generation_date': fields.String(description='생성 일시', example='2024-01-15T10:30:00Z')
    })
    
    radius_analysis_request = api.model('RadiusAnalysisRequest', {
        'center_lat': fields.Float(required=True, description='중심 위도', example=37.5665),
        'center_lng': fields.Float(required=True, description='중심 경도', example=126.9780),
        'radius_km': fields.Float(required=True, description='반경 (km)', example=2.0),
        'analysis_type': fields.String(description='분석 유형', example='comprehensive', enum=['comprehensive', 'competition', 'opportunity', 'accessibility'])
    })
    
    radius_analysis_response = api.model('RadiusAnalysisResponse', {
        'center_location': fields.Nested(api.model('Location', {
            'lat': fields.Float(description='위도', example=37.5665),
            'lng': fields.Float(description='경도', example=126.9780),
            'address': fields.String(description='주소', example='대전광역시 중구 중앙로 101')
        })),
        'radius_km': fields.Float(description='분석 반경 (km)', example=2.0),
        'analysis_type': fields.String(description='분석 유형', example='comprehensive'),
        'markets_in_radius': fields.List(fields.Nested(api.model('MarketInRadius', {
            'market_code': fields.String(description='상권 코드', example='DJ001'),
            'market_name': fields.String(description='상권명', example='강남역 상권'),
            'lat': fields.Float(description='위도', example=37.5665),
            'lng': fields.Float(description='경도', example=126.9780),
            'distance_km': fields.Float(description='중심점으로부터 거리 (km)', example=0.5),
            'health_score': fields.Integer(description='건강도 점수', example=85),
            'grade': fields.String(description='등급', example='A'),
            'competition_level': fields.String(description='경쟁 수준', example='높음', enum=['낮음', '보통', '높음', '매우높음']),
            'opportunity_score': fields.Integer(description='기회 점수', example=75)
        }))),
        'summary_statistics': fields.Nested(api.model('SummaryStatistics', {
            'total_markets': fields.Integer(description='총 상권 수', example=12),
            'average_health_score': fields.Float(description='평균 건강도 점수', example=78.5),
            'high_grade_markets': fields.Integer(description='고등급 상권 수 (A, B)', example=8),
            'competition_density': fields.Float(description='경쟁 밀도', example=7.2),
            'opportunity_index': fields.Float(description='기회 지수', example=6.8)
        })),
        'recommendations': fields.List(fields.String, description='권장사항', example=['대전역 상권이 가장 높은 건강도를 보임', '경쟁이 치열한 지역이므로 차별화 전략 필요']),
        'analysis_date': fields.String(description='분석 일시', example='2024-01-15T10:30:00Z')
    })
    
    cluster_analysis_response = api.model('ClusterAnalysisResponse', {
        'clusters': fields.List(fields.Nested(api.model('Cluster', {
            'cluster_id': fields.String(description='클러스터 ID', example='CLUSTER_001'),
            'cluster_name': fields.String(description='클러스터명', example='고성장 상권 클러스터'),
            'center_lat': fields.Float(description='중심 위도', example=37.5665),
            'center_lng': fields.Float(description='중심 경도', example=126.9780),
            'market_count': fields.Integer(description='포함 상권 수', example=15),
            'average_health_score': fields.Float(description='평균 건강도 점수', example=82.3),
            'common_characteristics': fields.List(fields.String, description='공통 특성', example=['유동인구 높음', '매출 증가 추세', '경쟁 적정']),
            'markets': fields.List(fields.Nested(api.model('ClusterMarket', {
                'market_code': fields.String(description='상권 코드', example='DJ001'),
                'market_name': fields.String(description='상권명', example='강남역 상권'),
                'lat': fields.Float(description='위도', example=37.5665),
                'lng': fields.Float(description='경도', example=126.9780),
                'health_score': fields.Integer(description='건강도 점수', example=85),
                'grade': fields.String(description='등급', example='A')
            })))
        }))),
        'total_clusters': fields.Integer(description='총 클러스터 수', example=5),
        'clustering_method': fields.String(description='클러스터링 방법', example='K-means'),
        'analysis_date': fields.String(description='분석 일시', example='2024-01-15T10:30:00Z')
    })
    
    traffic_flow_response = api.model('TrafficFlowResponse', {
        'market_code': fields.String(description='상권 코드', example='DJ001'),
        'market_name': fields.String(description='상권명', example='대전역 상권'),
        'traffic_patterns': fields.List(fields.Nested(api.model('TrafficPattern', {
            'time_period': fields.String(description='시간대', example='09:00-12:00'),
            'traffic_volume': fields.Integer(description='유동인구 수', example=25000),
            'traffic_direction': fields.String(description='주요 유동 방향', example='지하철역 → 상권'),
            'peak_intensity': fields.String(description='피크 강도', example='높음', enum=['낮음', '보통', '높음', '매우높음']),
            'demographics': fields.Nested(api.model('Demographics', {
                'age_groups': fields.List(fields.String, description='연령대', example=['20대', '30대', '40대']),
                'gender_ratio': fields.String(description='성별 비율', example='남성 45%, 여성 55%'),
                'purpose': fields.List(fields.String, description='방문 목적', example=['쇼핑', '식사', '업무'])
            }))
        }))),
        'daily_traffic_summary': fields.Nested(api.model('DailyTrafficSummary', {
            'total_daily_traffic': fields.Integer(description='일일 총 유동인구', example=180000),
            'peak_hour': fields.String(description='피크 시간대', example='18:00-19:00'),
            'peak_traffic': fields.Integer(description='피크 시간 유동인구', example=35000),
            'traffic_trend': fields.String(description='유동인구 트렌드', example='증가', enum=['증가', '감소', '보합'])
        })),
        'analysis_date': fields.String(description='분석 일시', example='2024-01-15T10:30:00Z')
    })
    
    accessibility_response = api.model('AccessibilityResponse', {
        'market_code': fields.String(description='상권 코드', example='DJ001'),
        'market_name': fields.String(description='상권명', example='대전역 상권'),
        'accessibility_score': fields.Integer(description='접근성 점수 (0-100)', example=88),
        'accessibility_grade': fields.String(description='접근성 등급', example='A', enum=['A', 'B', 'C', 'D']),
        'transportation': fields.Nested(api.model('Transportation', {
            'subway_stations': fields.List(fields.Nested(api.model('SubwayStation', {
                'station_name': fields.String(description='역명', example='대전역'),
                'line': fields.String(description='노선', example='1호선'),
                'walking_time': fields.Integer(description='도보 시간 (분)', example=3),
                'distance': fields.Float(description='거리 (m)', example=250)
            }))),
            'bus_stops': fields.List(fields.Nested(api.model('BusStop', {
                'stop_name': fields.String(description='정류장명', example='대전역 정류장'),
                'route_numbers': fields.List(fields.String, description='노선 번호', example=['146', '241', '360']),
                'walking_time': fields.Integer(description='도보 시간 (분)', example=2),
                'distance': fields.Float(description='거리 (m)', example=150)
            }))),
            'parking_facilities': fields.List(fields.Nested(api.model('ParkingFacility', {
                'facility_name': fields.String(description='주차장명', example='대전역 공영주차장'),
                'capacity': fields.Integer(description='수용 대수', example=500),
                'walking_time': fields.Integer(description='도보 시간 (분)', example=5),
                'distance': fields.Float(description='거리 (m)', example=400),
                'hourly_rate': fields.Integer(description='시간당 요금 (원)', example=2000)
            })))
        })),
        'walkability': fields.Nested(api.model('Walkability', {
            'sidewalk_quality': fields.String(description='보도 품질', example='우수', enum=['우수', '보통', '나쁨']),
            'pedestrian_traffic': fields.String(description='보행자 통행량', example='높음', enum=['낮음', '보통', '높음']),
            'safety_score': fields.Integer(description='안전 점수 (0-100)', example=85),
            'illumination': fields.String(description='조명 상태', example='양호', enum=['양호', '보통', '불량'])
        })),
        'recommendations': fields.List(fields.String, description='개선 권장사항', example=['지하철역과의 연결성 우수', '주차 공간 확보 필요']),
        'analysis_date': fields.String(description='분석 일시', example='2024-01-15T10:30:00Z')
    })
    
    # 공통 응답 모델
    success_response = api.model('SuccessResponse', {
        'success': fields.Boolean(description='성공 여부', example=True),
        'message': fields.String(description='응답 메시지', example='요청이 성공적으로 처리되었습니다.'),
        'data': fields.Raw(description='응답 데이터'),
        'timestamp': fields.String(description='응답 시간', example='2024-01-15T10:30:00Z')
    })
    
    error_response = api.model('ErrorResponse', {
        'success': fields.Boolean(description='성공 여부', example=False),
        'error': fields.Nested(api.model('ErrorInfo', {
            'code': fields.String(description='에러 코드', example='VALIDATION_ERROR'),
            'message': fields.String(description='에러 메시지', example='입력 데이터가 유효하지 않습니다.'),
            'details': fields.List(fields.String, description='상세 에러 정보', example=['사용자명은 필수입니다.', '비밀번호는 8자 이상이어야 합니다.']),
            'field': fields.String(description='에러 발생 필드', example='username')
        })),
        'timestamp': fields.String(description='에러 발생 시간', example='2024-01-15T10:30:00Z')
    })
    
    # 인증 API 엔드포인트
    @auth_ns.route('/login')
    class Login(Resource):
        @auth_ns.expect(login_model)
        @auth_ns.marshal_with(success_response)
        @auth_ns.doc('login', description='''
        사용자 로그인
        
        사용자명과 비밀번호를 통해 로그인하고 JWT 토큰을 발급받습니다.
        
        요청 파라미터:
        - username: 사용자명 (필수)
        - password: 비밀번호 (필수)
        
        응답 데이터:
        - access_token: JWT 액세스 토큰
        - token_type: 토큰 타입 (Bearer)
        - expires_in: 토큰 만료 시간 (초)
        - user_info: 사용자 기본 정보
        ''')
        def post(self):
            """사용자 로그인 - 사용자명과 비밀번호로 로그인하여 JWT 토큰을 발급받습니다."""
            pass
    
    @auth_ns.route('/register')
    class Register(Resource):
        @auth_ns.expect(register_model)
        @auth_ns.marshal_with(success_response)
        @auth_ns.doc('register', description='''
        사용자 회원가입
        
        새로운 사용자 계정을 생성합니다. 사용자명, 이메일, 비밀번호는 필수이며, 
        추가 프로필 정보는 선택사항입니다.
        ''')
        def post(self):
            """사용자 회원가입 - 새로운 사용자 계정을 생성합니다."""
            pass
    
    # 상권 진단 핵심 지표 API
    @core_diagnosis_ns.route('/foot-traffic/<string:market_code>')
    class FootTrafficAnalysis(Resource):
        @core_diagnosis_ns.marshal_with(success_response)
        @core_diagnosis_ns.doc('foot_traffic_analysis', description='유동인구 변화량 분석')
        def get(self, market_code):
            """유동인구 변화량 분석 - 상권의 유동인구 변화 추이를 분석하여 활성도를 평가합니다."""
            pass
    
    @core_diagnosis_ns.route('/card-sales/<string:market_code>')
    class CardSalesAnalysis(Resource):
        @core_diagnosis_ns.marshal_with(success_response)
        @core_diagnosis_ns.doc('card_sales_analysis', description='카드매출 추이 분석')
        def get(self, market_code):
            """카드매출 추이 분석"""
            pass
    
    @core_diagnosis_ns.route('/same-industry/<string:market_code>')
    class SameIndustryAnalysis(Resource):
        @core_diagnosis_ns.marshal_with(success_response)
        @core_diagnosis_ns.doc('same_industry_analysis', description='동일업종 수 분석')
        def get(self, market_code):
            """동일업종 수 분석"""
            pass
    
    @core_diagnosis_ns.route('/business-rates/<string:market_code>')
    class BusinessRatesAnalysis(Resource):
        @core_diagnosis_ns.marshal_with(success_response)
        @core_diagnosis_ns.doc('business_rates_analysis', description='창업·폐업 비율 분석')
        def get(self, market_code):
            """창업·폐업 비율 분석"""
            pass
    
    @core_diagnosis_ns.route('/dwell-time/<string:market_code>')
    class DwellTimeAnalysis(Resource):
        @core_diagnosis_ns.marshal_with(success_response)
        @core_diagnosis_ns.doc('dwell_time_analysis', description='체류시간 분석')
        def get(self, market_code):
            """체류시간 분석"""
            pass
    
    @core_diagnosis_ns.route('/health-score/<string:market_code>')
    class HealthScore(Resource):
        @core_diagnosis_ns.expect(health_score_request)
        @core_diagnosis_ns.marshal_with(success_response)
        @core_diagnosis_ns.doc('health_score', description='상권 건강 점수 종합 산정')
        def post(self, market_code):
            """상권 건강 점수 종합 산정"""
            pass
    
    @core_diagnosis_ns.route('/comprehensive/<string:market_code>')
    class ComprehensiveAnalysis(Resource):
        @core_diagnosis_ns.expect(health_score_request)
        @core_diagnosis_ns.marshal_with(success_response)
        @core_diagnosis_ns.doc('comprehensive_analysis', description='종합 상권 진단')
        def post(self, market_code):
            """종합 상권 진단"""
            pass
    
    # 리스크 분류 시스템 API
    @risk_classification_ns.route('/classify/<string:market_code>')
    class ClassifyRisk(Resource):
        @risk_classification_ns.expect(risk_classification_request)
        @risk_classification_ns.marshal_with(success_response)
        @risk_classification_ns.doc('classify_risk', description='4가지 리스크 유형 자동 분류')
        def post(self, market_code):
            """4가지 리스크 유형 자동 분류"""
            pass
    
    @risk_classification_ns.route('/detailed-analysis/<string:market_code>')
    class DetailedRiskAnalysis(Resource):
        @risk_classification_ns.expect(api.model('DetailedRiskRequest', {
            'risk_type': fields.String(required=True, description='리스크 유형'),
            'industry': fields.String(description='업종')
        }))
        @risk_classification_ns.marshal_with(success_response)
        @risk_classification_ns.doc('detailed_risk_analysis', description='특정 리스크 유형의 상세 분석')
        def post(self, market_code):
            """특정 리스크 유형의 상세 분석"""
            pass
    
    @risk_classification_ns.route('/risk-types')
    class RiskTypes(Resource):
        @risk_classification_ns.marshal_with(success_response)
        @risk_classification_ns.doc('risk_types', description='지원하는 리스크 유형 목록')
        def get(self):
            """지원하는 리스크 유형 목록"""
            pass
    
    @risk_classification_ns.route('/mitigation-strategies')
    class MitigationStrategies(Resource):
        @risk_classification_ns.marshal_with(success_response)
        @risk_classification_ns.doc('mitigation_strategies', description='리스크 완화 전략 목록')
        def get(self):
            """리스크 완화 전략 목록"""
            pass
    
    # 전략 카드 시스템 API
    @strategy_cards_ns.route('/generate')
    class GenerateStrategyCards(Resource):
        @strategy_cards_ns.expect(strategy_cards_request)
        @strategy_cards_ns.marshal_with(success_response)
        @strategy_cards_ns.doc('generate_strategy_cards', description='맞춤형 전략 카드 생성')
        def post(self):
            """맞춤형 전략 카드 생성"""
            pass
    
    @strategy_cards_ns.route('/checklist/<string:strategy_id>')
    class StrategyChecklist(Resource):
        @strategy_cards_ns.marshal_with(success_response)
        @strategy_cards_ns.doc('strategy_checklist', description='전략별 체크리스트 제공')
        def get(self, strategy_id):
            """전략별 체크리스트 제공"""
            pass
    
    @strategy_cards_ns.route('/success-cases')
    class SuccessCases(Resource):
        @strategy_cards_ns.marshal_with(success_response)
        @strategy_cards_ns.doc('success_cases', description='성공 사례 제공')
        def get(self):
            """성공 사례 제공"""
            pass
    
    @strategy_cards_ns.route('/templates')
    class StrategyTemplates(Resource):
        @strategy_cards_ns.marshal_with(success_response)
        @strategy_cards_ns.doc('strategy_templates', description='전략 템플릿 목록')
        def get(self):
            """전략 템플릿 목록"""
            pass
    
    @strategy_cards_ns.route('/categories')
    class StrategyCategories(Resource):
        @strategy_cards_ns.marshal_with(success_response)
        @strategy_cards_ns.doc('strategy_categories', description='전략 카테고리 목록')
        def get(self):
            """전략 카테고리 목록"""
            pass
    
    # 실행 지원 도구 API
    @support_tools_ns.route('/support-centers')
    class SupportCenters(Resource):
        @support_tools_ns.marshal_with(success_response)
        @support_tools_ns.doc('support_centers', description='소상공인지원센터 정보 조회')
        def get(self):
            """소상공인지원센터 정보 조회"""
            pass
    
    @support_tools_ns.route('/expert-consultation')
    class ExpertConsultation(Resource):
        @support_tools_ns.marshal_with(success_response)
        @support_tools_ns.doc('expert_consultation', description='전문가 상담 예약 정보')
        def get(self):
            """전문가 상담 예약 정보"""
            pass
    
    @support_tools_ns.route('/policy-recommendations')
    class PolicyRecommendations(Resource):
        @support_tools_ns.expect(api.model('PolicyRecommendationsRequest', {
            'userType': fields.String(description='사용자 유형'),
            'businessStage': fields.String(description='사업 단계'),
            'preferredAreas': fields.List(fields.String, description='선호 지역'),
            'interestedBusinessTypes': fields.List(fields.String, description='관심 업종')
        }))
        @support_tools_ns.marshal_with(success_response)
        @support_tools_ns.doc('policy_recommendations', description='지역 기반 맞춤 창업 지원 정책 추천')
        def post(self):
            """지역 기반 맞춤 창업 지원 정책 추천"""
            pass
    
    @support_tools_ns.route('/success-cases')
    class SupportSuccessCases(Resource):
        @support_tools_ns.marshal_with(success_response)
        @support_tools_ns.doc('support_success_cases', description='유사 상권 성공 사례 브라우징')
        def get(self):
            """유사 상권 성공 사례 브라우징"""
            pass
    
    @support_tools_ns.route('/consultation-booking')
    class ConsultationBooking(Resource):
        @support_tools_ns.expect(api.model('ConsultationBookingRequest', {
            'expert_id': fields.String(required=True, description='전문가 ID'),
            'consultation_type': fields.String(required=True, description='상담 유형'),
            'preferred_date': fields.String(required=True, description='희망 날짜'),
            'preferred_time': fields.String(required=True, description='희망 시간'),
            'user_info': fields.Raw(required=True, description='사용자 정보')
        }))
        @support_tools_ns.marshal_with(success_response)
        @support_tools_ns.doc('consultation_booking', description='전문가 상담 예약')
        def post(self):
            """전문가 상담 예약"""
            pass
    
    @support_tools_ns.route('/policy-application')
    class PolicyApplication(Resource):
        @support_tools_ns.expect(api.model('PolicyApplicationRequest', {
            'policy_id': fields.String(required=True, description='정책 ID'),
            'user_info': fields.Raw(required=True, description='사용자 정보'),
            'business_info': fields.Raw(required=True, description='사업 정보'),
            'required_documents': fields.List(fields.String, required=True, description='필요 서류')
        }))
        @support_tools_ns.marshal_with(success_response)
        @support_tools_ns.doc('policy_application', description='정책 신청')
        def post(self):
            """정책 신청"""
            pass
    
    # 지도 기반 시각화 API
    @map_visualization_ns.route('/heatmap')
    class MarketHeatmap(Resource):
        @map_visualization_ns.marshal_with(success_response)
        @map_visualization_ns.doc('market_heatmap', description='상권 히트맵 데이터 생성')
        def get(self):
            """상권 히트맵 데이터 생성"""
            pass
    
    @map_visualization_ns.route('/radius-analysis')
    class RadiusAnalysis(Resource):
        @map_visualization_ns.expect(radius_analysis_request)
        @map_visualization_ns.marshal_with(success_response)
        @map_visualization_ns.doc('radius_analysis', description='반경별 분석 결과')
        def post(self):
            """반경별 분석 결과"""
            pass
    
    @map_visualization_ns.route('/cluster-analysis')
    class MarketClusterAnalysis(Resource):
        @map_visualization_ns.marshal_with(success_response)
        @map_visualization_ns.doc('market_cluster_analysis', description='상권 클러스터 분석')
        def get(self):
            """상권 클러스터 분석"""
            pass
    
    @map_visualization_ns.route('/traffic-flow/<string:market_code>')
    class TrafficFlowAnalysis(Resource):
        @map_visualization_ns.marshal_with(success_response)
        @map_visualization_ns.doc('traffic_flow_analysis', description='유동인구 흐름 분석')
        def get(self, market_code):
            """유동인구 흐름 분석"""
            pass
    
    @map_visualization_ns.route('/accessibility/<string:market_code>')
    class AccessibilityAnalysis(Resource):
        @map_visualization_ns.marshal_with(success_response)
        @map_visualization_ns.doc('accessibility_analysis', description='접근성 분석')
        def get(self, market_code):
            """접근성 분석"""
            pass
    
    @map_visualization_ns.route('/analysis-types')
    class AnalysisTypes(Resource):
        @map_visualization_ns.marshal_with(success_response)
        @map_visualization_ns.doc('analysis_types', description='지원하는 분석 유형 목록')
        def get(self):
            """지원하는 분석 유형 목록"""
            pass
    
    # 상권 진단 API
    @market_diagnosis_ns.route('/markets')
    class Markets(Resource):
        @market_diagnosis_ns.marshal_with(success_response)
        @market_diagnosis_ns.doc('markets', description='상권 목록 조회')
        def get(self):
            """상권 목록 조회"""
            pass
    
    @market_diagnosis_ns.route('/markets/<string:market_code>')
    class MarketDetail(Resource):
        @market_diagnosis_ns.marshal_with(success_response)
        @market_diagnosis_ns.doc('market_detail', description='상권 상세 정보')
        def get(self, market_code):
            """상권 상세 정보"""
            pass
    
    @market_diagnosis_ns.route('/districts')
    class Districts(Resource):
        @market_diagnosis_ns.marshal_with(success_response)
        @market_diagnosis_ns.doc('districts', description='구/군별 상권 통계')
        def get(self):
            """구/군별 상권 통계"""
            pass
    
    # 업종별 분석 API
    @industry_analysis_ns.route('/survival-rates')
    class SurvivalRates(Resource):
        @industry_analysis_ns.marshal_with(success_response)
        @industry_analysis_ns.doc('survival_rates', description='생존율 분석')
        def get(self):
            """생존율 분석"""
            pass
    
    @industry_analysis_ns.route('/closure-rates')
    class ClosureRates(Resource):
        @industry_analysis_ns.marshal_with(success_response)
        @industry_analysis_ns.doc('closure_rates', description='폐업율 분석')
        def get(self):
            """폐업율 분석"""
            pass
    
    @industry_analysis_ns.route('/risk-analysis')
    class IndustryRiskAnalysis(Resource):
        @industry_analysis_ns.marshal_with(success_response)
        @industry_analysis_ns.doc('industry_risk_analysis', description='리스크 분석')
        def get(self):
            """리스크 분석"""
            pass
    
    # 지역별 분석 API
    @regional_analysis_ns.route('/population')
    class Population(Resource):
        @regional_analysis_ns.marshal_with(success_response)
        @regional_analysis_ns.doc('population', description='인구 통계')
        def get(self):
            """인구 통계"""
            pass
    
    @regional_analysis_ns.route('/rent-rates')
    class RentRates(Resource):
        @regional_analysis_ns.marshal_with(success_response)
        @regional_analysis_ns.doc('rent_rates', description='임대료 정보')
        def get(self):
            """임대료 정보"""
            pass
    
    @regional_analysis_ns.route('/market-density')
    class MarketDensity(Resource):
        @regional_analysis_ns.marshal_with(success_response)
        @regional_analysis_ns.doc('market_density', description='상권 밀도')
        def get(self):
            """상권 밀도"""
            pass
    
    # 종합 점수 계산 API
    @scoring_ns.route('/calculate')
    class CalculateScore(Resource):
        @scoring_ns.expect(api.model('ScoringRequest', {
            'market_code': fields.String(required=True, description='상권 코드'),
            'industry': fields.String(required=True, description='업종'),
            'region': fields.String(required=True, description='지역'),
            'user_profile': fields.Nested(user_profile_model, required=True, description='사용자 프로필')
        }))
        @scoring_ns.marshal_with(success_response)
        @scoring_ns.doc('calculate_score', description='종합 점수 계산')
        def post(self):
            """종합 점수 계산"""
            pass
    
    @scoring_ns.route('/compare')
    class CompareLocations(Resource):
        @scoring_ns.expect(api.model('CompareRequest', {
            'locations': fields.List(fields.Raw, required=True, description='비교할 위치들'),
            'user_profile': fields.Nested(user_profile_model, required=True, description='사용자 프로필')
        }))
        @scoring_ns.marshal_with(success_response)
        @scoring_ns.doc('compare_locations', description='위치 비교')
        def post(self):
            """위치 비교"""
            pass
    
    # 추천 시스템 API
    @recommendations_ns.route('/personalized')
    class PersonalizedRecommendations(Resource):
        @recommendations_ns.expect(api.model('PersonalizedRecommendationsRequest', {
            'user_profile': fields.Nested(user_profile_model, required=True, description='사용자 프로필')
        }))
        @recommendations_ns.marshal_with(success_response)
        @recommendations_ns.doc('personalized_recommendations', description='개인화 추천')
        def post(self):
            """개인화 추천"""
            pass
    
    @recommendations_ns.route('/industry-based')
    class IndustryBasedRecommendations(Resource):
        @recommendations_ns.marshal_with(success_response)
        @recommendations_ns.doc('industry_based_recommendations', description='업종별 추천')
        def get(self):
            """업종별 추천"""
            pass
    
    @recommendations_ns.route('/region-based')
    class RegionBasedRecommendations(Resource):
        @recommendations_ns.marshal_with(success_response)
        @recommendations_ns.doc('region_based_recommendations', description='지역별 추천')
        def get(self):
            """지역별 추천"""
            pass
    
    @recommendations_ns.route('/similar-users')
    class SimilarUsersRecommendations(Resource):
        @recommendations_ns.marshal_with(success_response)
        @recommendations_ns.doc('similar_users_recommendations', description='유사 사용자 추천')
        def get(self):
            """유사 사용자 추천"""
            pass
    
    return app

if __name__ == '__main__':
    app = create_swagger_app()
    app.run(debug=True, host='0.0.0.0', port=5003)