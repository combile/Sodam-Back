from flask import Flask, request
from datetime import datetime
from flask_restx import Api, Resource, fields
from config import Config
from extensions import db, migrate, bcrypt, jwt, cors
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

def create_app(config_object: type = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)

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
        description='소상공인을 위한 상권 진단 및 사업 추천 플랫폼 API',
        doc='/docs/',  # Swagger UI 경로
        prefix='/api/v1',
        catch_all_404s=True  # 404 에러를 API에서 처리
    )
    
    # CORS 설정
    cors.init_app(app, resources={
        r"/*": {
            "origins": "*",
            "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
            "allow_headers": ["Content-Type", "Authorization", "X-Requested-With"],
            "supports_credentials": True
        }
    })
    
    # CORS 헤더를 모든 응답에 추가
    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization,X-Requested-With')
        response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
        response.headers.add('Access-Control-Allow-Credentials', 'true')
        return response

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
    
    # 실제 블루프린트 엔드포인트들을 Swagger에 등록
    
    # 인증 API
    @ns.route('/auth/login')
    class AuthLogin(Resource):
        @ns.doc('auth_login')
        def post(self):
            """사용자 로그인"""
            # 실제 블루프린트로 리다이렉트
            with app.test_client() as client:
                response = client.post('/api/v1/auth/login', 
                                     json=request.get_json() or {},
                                     headers=request.headers)
                return response.get_json(), response.status_code
    
    @ns.route('/auth/register')
    class AuthRegister(Resource):
        @ns.doc('auth_register')
        def post(self):
            """사용자 회원가입"""
            with app.test_client() as client:
                response = client.post('/api/v1/auth/register',
                                     json=request.get_json() or {},
                                     headers=request.headers)
                return response.get_json(), response.status_code
    
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

    # Blueprints 등록
    api.add_namespace(auth_ns, path="/sodam/auth")
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
    
    return app
