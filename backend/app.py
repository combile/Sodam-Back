from flask import Flask, request, jsonify
from datetime import datetime
from flask_restx import Api, Resource, fields
import json
from config import Config
from extensions import db, migrate, bcrypt, jwt, cors
from models import User
from blueprints.auth import auth_ns
from blueprints.market_diagnosis import market_diagnosis_bp
from blueprints.industry_analysis import industry_analysis_bp
from blueprints.regional_analysis import regional_analysis_bp
from blueprints.scoring import scoring_bp
from blueprints.recommendations import recommendations_bp
from blueprints.core_diagnosis import core_diagnosis_ns
from blueprints.risk_classification import risk_classification_bp
from blueprints.strategy_cards import strategy_cards_bp
from blueprints.support_tools import support_tools_bp
from blueprints.map_visualization import map_visualization_bp
from blueprints.business_info import business_info_bp
from blueprints.profile import profile_bp, profile_ns
from blueprints.community import community_bp

class CustomJSONEncoder(json.JSONEncoder):
    """커스텀 JSON 인코더 - bytes 객체를 문자열로 변환"""
    def default(self, obj):
        if isinstance(obj, bytes):
            return obj.decode('utf-8')
        return super().default(obj)

def create_app(config_object: type = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)
    
    # 커스텀 JSON 인코더 설정
    app.json_encoder = CustomJSONEncoder

    # Extensions 초기화
    db.init_app(app)
    migrate.init_app(app, db)
    bcrypt.init_app(app)
    jwt.init_app(app)
    
    # Flask-RESTX API 설정
    api = Api(
        app,
        version='1.0',
        title='소담(SODAM) API',
        description='''
        # 소담(SODAM) - 소상공인 상권 진단 및 사업 추천 플랫폼 API
        
        ## 개요
        소담(SODAM)은 소상공인을 위한 종합적인 상권 진단 및 사업 추천 플랫폼입니다.
        대전광역시를 중심으로 한 상권 데이터를 기반으로 다음과 같은 서비스를 제공합니다:
        
        ## 주요 기능
        - **상권 진단**: 유동인구, 매출, 경쟁도 등 종합 분석
        - **업종별 분석**: 생존율, 폐업율, 리스크 분석
        - **지역별 분석**: 인구, 임대료, 경제 지표 분석
        - **리스크 분류**: 4가지 리스크 유형 자동 분류
        - **전략 카드**: 맞춤형 사업 전략 제안
        - **지원 도구**: 정책 지원, 전문가 상담 연결
        - **지도 시각화**: 히트맵, 클러스터 분석
        
        ## API 사용법
        1. **인증**: JWT 토큰 기반 인증 (회원가입/로그인 필요)
        2. **요청**: JSON 형태로 데이터 전송
        3. **응답**: 표준화된 JSON 응답 형식
        4. **에러 처리**: HTTP 상태 코드와 상세 에러 메시지
        
        ## 환경별 접속 정보
        - **개발 환경**: 로컬 개발 시 사용
        - **배포 환경**: 실제 서비스 운영 환경 (권장)
        
        ## 기본 URL
        - 개발 서버: `http://localhost:5000`
        - 배포 서버: `https://port-0-sodam-back-lyo9x8ghce54051e.sel5.cloudtype.app`
        - API 엔드포인트: `https://port-0-sodam-back-lyo9x8ghce54051e.sel5.cloudtype.app/api/v1`
        - Swagger 문서: `https://port-0-sodam-back-lyo9x8ghce54051e.sel5.cloudtype.app/docs/`
        
        ## 지원 지역
        - 대전광역시 (동구, 중구, 서구, 유성구, 대덕구)
        
        ## 지원 업종
        - 식음료업, 쇼핑업, 숙박업, 여가서비스업, 운송업
        - 의료업, 교육업, 문화업, 스포츠업, 기타서비스업
        ''',
        doc='/docs/',  # Swagger UI 경로
        prefix='/api/v1',
        catch_all_404s=True,  # 404 에러를 API에서 처리
        contact='SODAM Development Team',
        contact_email='sodam@example.com',
        license='MIT',
        license_url='https://opensource.org/licenses/MIT'
    )
    
    # Flask-RESTX JSON representation을 커스텀 인코더로 교체
    def custom_json_output(data, code, headers=None):
        """커스텀 JSON 출력 함수 - bytes 객체 처리"""
        from flask import make_response, current_app
        
        settings = current_app.config.get('RESTX_JSON', {})
        if current_app.debug:
            settings.setdefault('indent', 4)
        
        # bytes 객체를 문자열로 변환하는 재귀 함수
        def convert_bytes(obj):
            if isinstance(obj, bytes):
                return obj.decode('utf-8')
            elif isinstance(obj, dict):
                return {key: convert_bytes(value) for key, value in obj.items()}
            elif isinstance(obj, list):
                return [convert_bytes(item) for item in obj]
            else:
                return obj
        
        # 데이터 변환
        converted_data = convert_bytes(data)
        
        # JSON 직렬화
        dumped = json.dumps(converted_data, cls=CustomJSONEncoder, **settings) + "\n"
        
        resp = make_response(dumped, code)
        resp.headers.extend(headers or {})
        return resp
    
    # 기존 JSON representation을 커스텀 함수로 교체
    api.representations['application/json'] = custom_json_output
    
    # CORS 설정
    cors.init_app(app, resources={
        r"/*": {
            "origins": [
                "http://localhost:3000", 
                "http://127.0.0.1:3000",
                "http://localhost:5001",
                "http://127.0.0.1:5001",
                "https://combile.github.io"
            ],
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
            "allow_headers": [
                "Content-Type", 
                "Authorization", 
                "X-Requested-With",
                "Accept",
                "Origin",
                "Access-Control-Request-Method",
                "Access-Control-Request-Headers"
            ],
            "supports_credentials": True,
            "expose_headers": ["Content-Range", "X-Content-Range"],
            "send_wildcard": False,
            "vary_header": True
        }
    })

    # 기본 엔드포인트들 (Flask-RESTX와 충돌 방지)
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'SODAM Backend API is running'}, 200

    # Swagger 네임스페이스 정의
    ns = api.namespace('sodam', description='SODAM API operations')
    
    # Swagger 모델 정의
    market_model = api.model('Market', {
        'id': fields.Integer(required=True, description='상권 ID'),
        'name': fields.String(required=True, description='상권명'),
        'area': fields.String(required=True, description='지역'),
        'code': fields.String(description='상권 코드')
    })
    
    # Swagger 엔드포인트 추가
    @ns.route('/')
    class APIInfo(Resource):
        @ns.doc('api_info')
        def get(self):
            """API 기본 정보"""
            return {
                'message': 'SODAM Backend API', 
                'version': '1.0.0',
                'status': 'running',
                'endpoints': {
                    'health': '/health',
                    'swagger': '/swagger/',
                    'docs': '/docs/'
                },
                'available_apis': [
                    'auth', 'market-diagnosis', 'industry-analysis', 
                    'regional-analysis', 'scoring', 'recommendations',
                    'core-diagnosis', 'risk-classification', 'strategy-cards',
                    'support-tools', 'map-visualization'
                ]
            }, 200
    
    @ns.route('/markets')
    class MarketList(Resource):
        @ns.doc('get_markets')
        @ns.marshal_list_with(market_model)
        def get(self):
            """상권 목록 조회 (실제 CSV 데이터)"""
            try:
                from services.data_loader import DataLoader
                data_loader = DataLoader()
                markets = data_loader.get_market_list()
                return markets[:20], 200  # 처음 20개만 반환
            except Exception as e:
                api.abort(500, f'CSV 데이터 로드 실패: {str(e)}')
    
    @ns.route('/test')
    class TestAPI(Resource):
        @ns.doc('test_api')
        def get(self):
            """API 테스트"""
            return {
                'message': 'SODAM API 정상 작동',
                'timestamp': datetime.now().isoformat(),
                'status': 'success'
            }, 200
    
    @ns.route('/test-real-apis')
    class TestRealAPIs(Resource):
        @ns.doc('test_real_apis')
        def get(self):
            """실제 블루프린트 API 테스트"""
            import requests
            base_url = request.host_url.rstrip('/')
            
            test_results = {}
            
            # 실제 API 엔드포인트들 테스트
            test_endpoints = [
                '/api/v1/auth/',
                '/api/v1/market-diagnosis/',
                '/api/v1/core-diagnosis/foot-traffic/10000',
                '/api/v1/industry-analysis/',
                '/api/v1/regional-analysis/',
                '/api/v1/scoring/',
                '/api/v1/recommendations/',
                '/api/v1/risk-classification/',
                '/api/v1/strategy-cards/',
                '/api/v1/support-tools/',
                '/api/v1/map-visualization/'
            ]
            
            for endpoint in test_endpoints:
                try:
                    # 내부에서 직접 호출
                    with app.test_client() as client:
                        response = client.get(endpoint)
                        test_results[endpoint] = {
                            'status_code': response.status_code,
                            'success': response.status_code < 400,
                            'message': 'OK' if response.status_code < 400 else 'Error'
                        }
                except Exception as e:
                    test_results[endpoint] = {
                        'status_code': 500,
                        'success': False,
                        'message': str(e)
                    }
            
            return {
                'message': '실제 블루프린트 API 테스트 결과',
                'timestamp': datetime.now().isoformat(),
                'test_results': test_results
            }, 200
    
    @ns.route('/supported-industries')
    class SupportedIndustries(Resource):
        @ns.doc('supported_industries', 
            description='''
            ## 지원 업종 목록
            
            SODAM 플랫폼에서 지원하는 모든 업종 목록을 조회합니다.
            프론트엔드에서 드롭다운, 체크박스 등의 UI 컴포넌트 생성 시 사용할 수 있습니다.
            
            ### 응답 예시
            ```json
            {
                "success": true,
                "data": {
                    "total_industries": 10,
                    "industries": [
                        {
                            "code": "food_beverage",
                            "name": "식음료업",
                            "description": "음식점, 카페, 베이커리 등",
                            "category": "서비스업"
                        }
                    ],
                    "categories": {
                        "서비스업": ["식음료업", "쇼핑업", "숙박업", "여가서비스업", "운송업"],
                        "전문업": ["의료업", "교육업", "문화업", "스포츠업", "기타서비스업"]
                    }
                }
            }
            ```
            ''')
        def get(self):
            """지원 업종 목록 조회"""
            industries = [
                {
                    "code": "food_beverage",
                    "name": "식음료업",
                    "description": "음식점, 카페, 베이커리, 주점 등",
                    "category": "서비스업",
                    "icon": "🍽️"
                },
                {
                    "code": "retail",
                    "name": "쇼핑업",
                    "description": "소매업, 도매업, 온라인 쇼핑몰 등",
                    "category": "서비스업",
                    "icon": "🛍️"
                },
                {
                    "code": "accommodation",
                    "name": "숙박업",
                    "description": "호텔, 펜션, 게스트하우스 등",
                    "category": "서비스업",
                    "icon": "🏨"
                },
                {
                    "code": "leisure",
                    "name": "여가서비스업",
                    "description": "헬스클럽, 노래방, PC방, 게임장 등",
                    "category": "서비스업",
                    "icon": "🎮"
                },
                {
                    "code": "transportation",
                    "name": "운송업",
                    "description": "택시, 배달, 물류, 운송 서비스 등",
                    "category": "서비스업",
                    "icon": "🚗"
                },
                {
                    "code": "medical",
                    "name": "의료업",
                    "description": "병원, 약국, 의료기기, 헬스케어 등",
                    "category": "전문업",
                    "icon": "🏥"
                },
                {
                    "code": "education",
                    "name": "교육업",
                    "description": "학원, 과외, 온라인 교육, 교육 콘텐츠 등",
                    "category": "전문업",
                    "icon": "📚"
                },
                {
                    "code": "culture",
                    "name": "문화업",
                    "description": "영화관, 전시관, 공연장, 문화센터 등",
                    "category": "전문업",
                    "icon": "🎭"
                },
                {
                    "code": "sports",
                    "name": "스포츠업",
                    "description": "체육관, 스포츠 용품, 스포츠 교육 등",
                    "category": "전문업",
                    "icon": "⚽"
                },
                {
                    "code": "other_services",
                    "name": "기타서비스업",
                    "description": "미용실, 세탁소, 수리업, 기타 서비스 등",
                    "category": "전문업",
                    "icon": "🔧"
                }
            ]
            
            # 카테고리별 분류
            categories = {}
            for industry in industries:
                category = industry["category"]
                if category not in categories:
                    categories[category] = []
                categories[category].append(industry["name"])
            
            return {
                "success": True,
                "data": {
                    "total_industries": len(industries),
                    "industries": industries,
                    "categories": categories,
                    "last_updated": "2024-01-01"
                },
                "message": "지원 업종 목록을 성공적으로 조회했습니다.",
                "timestamp": datetime.now().isoformat()
            }, 200
    
    @ns.route('/supported-regions')
    class SupportedRegions(Resource):
        @ns.doc('supported_regions',
            description='''
            ## 지원 지역 목록
            
            SODAM 플랫폼에서 지원하는 모든 지역 목록을 조회합니다.
            대전광역시를 중심으로 한 지역 정보를 제공합니다.
            
            ### 응답 예시
            ```json
            {
                "success": true,
                "data": {
                    "total_regions": 5,
                    "regions": [
                        {
                            "code": "dong_gu",
                            "name": "동구",
                            "full_name": "대전광역시 동구",
                            "population": 95000,
                            "area_km2": 136.5,
                            "market_count": 4
                        }
                    ],
                    "city_info": {
                        "name": "대전광역시",
                        "total_population": 1440000,
                        "total_area": 539.2,
                        "total_markets": 26
                    }
                }
            }
            ```
            ''')
        def get(self):
            """지원 지역 목록 조회"""
            regions = [
                {
                    "code": "dong_gu",
                    "name": "동구",
                    "full_name": "대전광역시 동구",
                    "population": 95000,
                    "area_km2": 136.5,
                    "market_count": 4,
                    "description": "대전의 동쪽 지역, 주거지역 중심"
                },
                {
                    "code": "jung_gu",
                    "name": "중구",
                    "full_name": "대전광역시 중구",
                    "population": 120000,
                    "area_km2": 62.1,
                    "market_count": 2,
                    "description": "대전의 중심가, 상업지역 중심"
                },
                {
                    "code": "seo_gu",
                    "name": "서구",
                    "full_name": "대전광역시 서구",
                    "population": 180000,
                    "area_km2": 95.2,
                    "market_count": 11,
                    "description": "대전의 서쪽 지역, 신도시 개발지역"
                },
                {
                    "code": "yuseong_gu",
                    "name": "유성구",
                    "full_name": "대전광역시 유성구",
                    "population": 220000,
                    "area_km2": 177.0,
                    "market_count": 6,
                    "description": "대덕연구개발특구, 대학가 지역"
                },
                {
                    "code": "daedeok_gu",
                    "name": "대덕구",
                    "full_name": "대전광역시 대덕구",
                    "population": 75000,
                    "area_km2": 68.4,
                    "market_count": 3,
                    "description": "대덕연구개발특구, 산업단지 지역"
                }
            ]
            
            city_info = {
                "name": "대전광역시",
                "total_population": sum(region["population"] for region in regions),
                "total_area": sum(region["area_km2"] for region in regions),
                "total_markets": sum(region["market_count"] for region in regions),
                "description": "대한민국 중부에 위치한 광역시, 과학기술 특화 도시"
            }
            
            return {
                "success": True,
                "data": {
                    "total_regions": len(regions),
                    "regions": regions,
                    "city_info": city_info,
                    "last_updated": "2024-01-01"
                },
                "message": "지원 지역 목록을 성공적으로 조회했습니다.",
                "timestamp": datetime.now().isoformat()
            }, 200
    
    # 실제 블루프린트 엔드포인트들을 Swagger에 등록
    
    
    # 상권 진단 API
    @ns.route('/market-diagnosis/markets')
    class MarketDiagnosisMarkets(Resource):
        @ns.doc('market_diagnosis_markets')
        def get(self):
            """상권 목록 조회"""
            with app.test_client() as client:
                response = client.get('/api/v1/market-diagnosis/markets')
                return response.get_json(), response.status_code
    
    @ns.route('/market-diagnosis/markets/<string:market_code>')
    class MarketDiagnosisMarketDetail(Resource):
        @ns.doc('market_diagnosis_market_detail')
        def get(self, market_code):
            """상권 상세 정보"""
            with app.test_client() as client:
                response = client.get(f'/api/v1/market-diagnosis/markets/{market_code}')
                return response.get_json(), response.status_code
    
    # 핵심 진단 API
    @ns.route('/core-diagnosis/foot-traffic/<string:market_code>')
    class CoreDiagnosisFootTraffic(Resource):
        @ns.doc('core_diagnosis_foot_traffic')
        def get(self, market_code):
            """유동인구 변화량 분석"""
            with app.test_client() as client:
                response = client.get(f'/api/v1/core-diagnosis/foot-traffic/{market_code}')
                return response.get_json(), response.status_code
    
    @ns.route('/core-diagnosis/card-sales/<string:market_code>')
    class CoreDiagnosisCardSales(Resource):
        @ns.doc('core_diagnosis_card_sales')
        def get(self, market_code):
            """카드매출 추이 분석"""
            with app.test_client() as client:
                response = client.get(f'/api/v1/core-diagnosis/card-sales/{market_code}')
                return response.get_json(), response.status_code
    
    @ns.route('/core-diagnosis/same-industry/<string:market_code>')
    class CoreDiagnosisSameIndustry(Resource):
        @ns.doc('core_diagnosis_same_industry')
        def get(self, market_code):
            """동일업종 수 분석"""
            with app.test_client() as client:
                response = client.get(f'/api/v1/core-diagnosis/same-industry/{market_code}')
                return response.get_json(), response.status_code
    
    @ns.route('/core-diagnosis/business-rates/<string:market_code>')
    class CoreDiagnosisBusinessRates(Resource):
        @ns.doc('core_diagnosis_business_rates')
        def get(self, market_code):
            """창업·폐업 비율 분석"""
            with app.test_client() as client:
                response = client.get(f'/api/v1/core-diagnosis/business-rates/{market_code}')
                return response.get_json(), response.status_code
    
    @ns.route('/core-diagnosis/dwell-time/<string:market_code>')
    class CoreDiagnosisDwellTime(Resource):
        @ns.doc('core_diagnosis_dwell_time')
        def get(self, market_code):
            """체류시간 분석"""
            with app.test_client() as client:
                response = client.get(f'/api/v1/core-diagnosis/dwell-time/{market_code}')
                return response.get_json(), response.status_code
    
    @ns.route('/core-diagnosis/health-score/<string:market_code>')
    class CoreDiagnosisHealthScore(Resource):
        @ns.doc('core_diagnosis_health_score')
        def post(self, market_code):
            """상권 건강 점수 종합 산정"""
            with app.test_client() as client:
                response = client.post(f'/api/v1/core-diagnosis/health-score/{market_code}',
                                     json=request.get_json() or {},
                                     headers=request.headers)
                return response.get_json(), response.status_code
    
    @ns.route('/core-diagnosis/comprehensive/<string:market_code>')
    class CoreDiagnosisComprehensive(Resource):
        @ns.doc('core_diagnosis_comprehensive')
        def post(self, market_code):
            """종합 상권 진단"""
            with app.test_client() as client:
                response = client.post(f'/api/v1/core-diagnosis/comprehensive/{market_code}',
                                     json=request.get_json() or {},
                                     headers=request.headers)
                return response.get_json(), response.status_code

    # JWT 오류 핸들러 추가
    from flask_jwt_extended.exceptions import JWTExtendedException
    from jwt import InvalidTokenError
    
    @app.errorhandler(422)
    def handle_422_error(error):
        """422 오류 처리 - 주로 JWT 토큰 관련 오류"""
        print(f"[ERROR] 422 오류 발생: {error}")
        print(f"[ERROR] 오류 설명: {error.description}")
        
        # JWT 관련 오류인지 확인
        if hasattr(error, 'description') and error.description:
            if 'jwt' in error.description.lower() or 'token' in error.description.lower():
                return jsonify({
                    "success": False,
                    "message": "인증 토큰이 유효하지 않습니다. 다시 로그인해주세요.",
                    "error_code": "INVALID_TOKEN",
                    "timestamp": datetime.now().isoformat()
                }), 401
        
        return jsonify({
            "success": False,
            "message": "요청 데이터가 올바르지 않습니다.",
            "error_code": "VALIDATION_ERROR",
            "timestamp": datetime.now().isoformat()
        }), 422
    
    @app.errorhandler(401)
    def handle_401_error(error):
        """401 오류 처리 - 인증 실패"""
        print(f"[ERROR] 401 오류 발생: {error}")
        return jsonify({
            "success": False,
            "message": "인증이 필요합니다. 로그인해주세요.",
            "error_code": "UNAUTHORIZED",
            "timestamp": datetime.now().isoformat()
        }), 401

    # Blueprints 등록
    api.add_namespace(auth_ns, path="/sodam/auth")
    api.add_namespace(profile_ns, path="/sodam/profile")
    app.register_blueprint(market_diagnosis_bp, url_prefix="/api/v1/market-diagnosis")
    app.register_blueprint(industry_analysis_bp, url_prefix="/api/v1/industry-analysis")
    app.register_blueprint(regional_analysis_bp, url_prefix="/api/v1/regional-analysis")
    app.register_blueprint(scoring_bp, url_prefix="/api/v1/scoring")
    app.register_blueprint(recommendations_bp, url_prefix="/api/v1/recommendations")
    api.add_namespace(core_diagnosis_ns, path="/sodam/core-diagnosis")
    app.register_blueprint(risk_classification_bp, url_prefix="/api/v1/risk-classification")
    app.register_blueprint(strategy_cards_bp, url_prefix="/api/v1/strategy-cards")
    app.register_blueprint(support_tools_bp, url_prefix="/api/v1/support-tools")
    app.register_blueprint(map_visualization_bp, url_prefix="/api/v1/map-visualization")
    app.register_blueprint(business_info_bp, url_prefix="/api/v1/businesses")
    app.register_blueprint(profile_bp)
    app.register_blueprint(community_bp)
    
    return app
