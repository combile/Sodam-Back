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
        소담(SODAM) - 소상공인을 위한 상권 진단 및 사업 추천 플랫폼
        
        플랫폼 개요
        소담(SODAM)은 소상공인들이 창업 및 사업 운영에 필요한 상권 분석, 리스크 평가, 전략 수립을 지원하는 종합 플랫폼입니다.
        
        주요 기능
        - 상권 진단: 5가지 핵심 지표를 통한 상권 건강도 분석
        - 리스크 분류: 4가지 리스크 유형 자동 분류 및 완화 전략 제시
        - 전략 카드: 맞춤형 사업 전략 및 실행 가이드 제공
        - 지원 도구: 전문가 상담, 정책 추천, 성공 사례 브라우징
        - 지도 시각화: 상권 데이터의 지도상 시각화 및 분석
        
        데이터 소스
        - 실제 상권 현황 데이터 (CSV 기반)
        - 관광 소비액 데이터
        - 업종별/지역별 지출 데이터
        - 실시간 상권 분석 데이터
        
        기술 스택
        - Backend: Flask, SQLAlchemy, Pandas
        - API: RESTful API, JWT 인증
        - Documentation: Swagger/OpenAPI 3.0
        - Data: CSV 파일 기반 실제 데이터
        
        사용 방법
        1. 인증: 먼저 회원가입/로그인을 통해 JWT 토큰을 발급받으세요
        2. 상권 분석: 관심 있는 상권의 건강도를 분석해보세요
        3. 리스크 평가: 상권의 리스크 유형을 파악하고 완화 전략을 확인하세요
        4. 전략 수립: 맞춤형 사업 전략을 생성하고 실행 계획을 세우세요
        5. 지원 활용: 전문가 상담 예약 및 정책 신청을 진행하세요
        
        API 특징
        - 실제 데이터 기반: 샘플 데이터가 아닌 실제 상권 데이터 활용
        - 종합적 분석: 다각도 지표를 통한 정확한 상권 평가
        - 개인화 추천: 사용자 프로필 기반 맞춤형 솔루션 제공
        - 실행 중심: 이론이 아닌 실제 실행 가능한 전략 제시
        - 시각화 지원: 지도 기반 직관적 데이터 표현
        
        지원 및 문의
        - 개발팀: SODAM Development Team
        - 이메일: support@sodam.kr
        - 문서: 이 Swagger UI를 통해 모든 API를 테스트할 수 있습니다
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
        'username': fields.String(required=True, description='사용자명'),
        'password': fields.String(required=True, description='비밀번호')
    })
    
    register_model = api.model('RegisterRequest', {
        'username': fields.String(required=True, description='사용자명'),
        'email': fields.String(required=True, description='이메일'),
        'password': fields.String(required=True, description='비밀번호'),
        'nickname': fields.String(description='닉네임'),
        'userType': fields.String(description='사용자 유형', enum=['ENTREPRENEUR', 'INVESTOR', 'ADVISOR']),
        'businessStage': fields.String(description='사업 단계', enum=['PLANNING', 'STARTUP', 'GROWTH', 'MATURE']),
        'phone': fields.String(description='전화번호'),
        'interestedBusinessTypes': fields.List(fields.String, description='관심 업종'),
        'preferredAreas': fields.List(fields.String, description='선호 지역')
    })
    
    # 상권 진단 모델
    health_score_request = api.model('HealthScoreRequest', {
        'industry': fields.String(description='업종')
    })
    
    foot_traffic_response = api.model('FootTrafficResponse', {
        'market_code': fields.String(description='상권 코드'),
        'current_monthly_traffic': fields.Integer(description='현재 월 유동인구'),
        'average_monthly_change': fields.Float(description='월평균 변화율'),
        'total_change_period': fields.Float(description='기간 총 변화율'),
        'trend': fields.String(description='트렌드'),
        'grade': fields.String(description='등급'),
        'analysis': fields.String(description='분석 결과')
    })
    
    # 리스크 분류 모델
    risk_classification_request = api.model('RiskClassificationRequest', {
        'industry': fields.String(description='업종')
    })
    
    risk_classification_response = api.model('RiskClassificationResponse', {
        'market_code': fields.String(description='상권 코드'),
        'industry': fields.String(description='업종'),
        'primary_risk_type': fields.String(description='주요 리스크 유형'),
        'primary_risk_score': fields.Float(description='주요 리스크 점수'),
        'risk_level': fields.String(description='리스크 레벨'),
        'analysis': fields.String(description='분석 결과'),
        'recommendations': fields.List(fields.String, description='추천사항')
    })
    
    # 전략 카드 모델
    user_profile_model = api.model('UserProfile', {
        'userType': fields.String(description='사용자 유형'),
        'businessStage': fields.String(description='사업 단계'),
        'capital': fields.Integer(description='자본'),
        'riskTolerance': fields.String(description='리스크 허용도'),
        'experience': fields.String(description='경험 수준')
    })
    
    strategy_cards_request = api.model('StrategyCardsRequest', {
        'market_code': fields.String(required=True, description='상권 코드'),
        'industry': fields.String(required=True, description='업종'),
        'risk_type': fields.String(required=True, description='리스크 유형'),
        'user_profile': fields.Nested(user_profile_model, required=True, description='사용자 프로필')
    })
    
    strategy_card_model = api.model('StrategyCard', {
        'strategy_id': fields.String(description='전략 ID'),
        'strategy_name': fields.String(description='전략명'),
        'category': fields.String(description='카테고리'),
        'description': fields.String(description='설명'),
        'difficulty': fields.String(description='난이도'),
        'duration': fields.String(description='소요 기간'),
        'cost_level': fields.String(description='비용 수준'),
        'expected_impact': fields.String(description='예상 효과'),
        'priority': fields.Integer(description='우선순위'),
        'success_probability': fields.Integer(description='성공 확률')
    })
    
    # 지원 도구 모델
    support_center_model = api.model('SupportCenter', {
        'id': fields.String(description='센터 ID'),
        'name': fields.String(description='센터명'),
        'region': fields.String(description='지역'),
        'address': fields.String(description='주소'),
        'phone': fields.String(description='전화번호'),
        'email': fields.String(description='이메일'),
        'website': fields.String(description='웹사이트'),
        'services': fields.List(fields.String, description='제공 서비스'),
        'operating_hours': fields.String(description='운영 시간'),
        'specialties': fields.List(fields.String, description='전문 분야')
    })
    
    # 지도 시각화 모델
    heatmap_data_model = api.model('HeatmapData', {
        'lat': fields.Float(description='위도'),
        'lng': fields.Float(description='경도'),
        'intensity': fields.Float(description='강도'),
        'color': fields.String(description='색상'),
        'market_code': fields.String(description='상권 코드'),
        'market_name': fields.String(description='상권명'),
        'grade': fields.String(description='등급')
    })
    
    radius_analysis_request = api.model('RadiusAnalysisRequest', {
        'center_lat': fields.Float(required=True, description='중심 위도'),
        'center_lng': fields.Float(required=True, description='중심 경도'),
        'radius_km': fields.Float(required=True, description='반경 (km)'),
        'analysis_type': fields.String(description='분석 유형', enum=['comprehensive', 'competition', 'opportunity'])
    })
    
    # 공통 응답 모델
    success_response = api.model('SuccessResponse', {
        'success': fields.Boolean(description='성공 여부'),
        'data': fields.Raw(description='응답 데이터')
    })
    
    error_response = api.model('ErrorResponse', {
        'success': fields.Boolean(description='성공 여부'),
        'error': fields.Raw(description='에러 정보')
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