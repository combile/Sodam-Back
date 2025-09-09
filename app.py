from flask import Flask, request
from datetime import datetime
from flask_restx import Api, Resource, fields
from config import Config
from extensions import db, migrate, bcrypt, jwt, cors
from blueprints.auth import auth_bp
from blueprints.market_diagnosis import market_diagnosis_bp
from blueprints.industry_analysis import industry_analysis_bp
from blueprints.regional_analysis import regional_analysis_bp
from blueprints.scoring import scoring_bp
from blueprints.recommendations import recommendations_bp
from blueprints.core_diagnosis import core_diagnosis_bp
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
        doc='/swagger/',  # Swagger UI 경로
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
    
    @app.route('/docs/')
    def docs():
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>SODAM API Documentation</title>
            <style>
                body { 
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
                    margin: 0; 
                    padding: 20px; 
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    min-height: 100vh;
                }
                .container {
                    max-width: 1200px;
                    margin: 0 auto;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                    overflow: hidden;
                }
                .header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 30px;
                    text-align: center;
                }
                .content {
                    padding: 30px;
                }
                .endpoint { 
                    background: #f8f9fa; 
                    padding: 15px; 
                    margin: 15px 0; 
                    border-radius: 8px; 
                    border-left: 4px solid #007bff;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                .endpoint:hover {
                    background: #e3f2fd;
                    transform: translateX(5px);
                }
                .method { 
                    font-weight: bold; 
                    color: #007bff; 
                    background: #e3f2fd;
                    padding: 4px 8px;
                    border-radius: 4px;
                    margin-right: 10px;
                }
                .method.post { background: #e8f5e8; color: #28a745; }
                .method.get { background: #e3f2fd; color: #007bff; }
                .test-section {
                    background: #f8f9fa;
                    padding: 20px;
                    border-radius: 8px;
                    margin-top: 30px;
                }
                .test-button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin: 5px;
                    transition: background 0.3s ease;
                }
                .test-button:hover {
                    background: #0056b3;
                }
                .result {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 5px;
                    padding: 15px;
                    margin-top: 10px;
                    font-family: monospace;
                    white-space: pre-wrap;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🚀 소담(SODAM) API 문서</h1>
                    <p>소상공인을 위한 상권 진단 및 사업 추천 플랫폼 API</p>
                </div>
                
                <div class="content">
                    <h2>📋 기본 엔드포인트</h2>
                    <div class="endpoint" onclick="testEndpoint('/')">
                        <span class="method get">GET</span> / - API 기본 정보
                    </div>
                    <div class="endpoint" onclick="testEndpoint('/health')">
                        <span class="method get">GET</span> /health - 헬스체크
                    </div>
                    <div class="endpoint" onclick="testEndpoint('/api/v1/')">
                        <span class="method get">GET</span> /api/v1/ - API 엔드포인트 목록
                    </div>
                    
                    <h2>🔧 테스트 엔드포인트</h2>
                    <div class="endpoint" onclick="testEndpoint('/api/v1/test')">
                        <span class="method get">GET</span> /api/v1/test - API 테스트
                    </div>
                    <div class="endpoint" onclick="testEndpoint('/api/v1/markets')">
                        <span class="method get">GET</span> /api/v1/markets - 상권 목록 (테스트)
                    </div>
                    
                    <h2>🔐 인증 API</h2>
                    <div class="endpoint">
                        <span class="method post">POST</span> /api/v1/auth/login - 사용자 로그인
                    </div>
                    <div class="endpoint">
                        <span class="method post">POST</span> /api/v1/auth/register - 사용자 회원가입
                    </div>
                    
                    <h2>📊 상권 분석 API</h2>
                    <div class="endpoint">
                        <span class="method get">GET</span> /api/v1/market-diagnosis/markets - 상권 목록
                    </div>
                    <div class="endpoint">
                        <span class="method get">GET</span> /api/v1/core-diagnosis/foot-traffic/{market_code} - 유동인구 분석
                    </div>
                    
                    <div class="test-section">
                        <h3>🧪 API 테스트</h3>
                        <p>엔드포인트를 클릭하거나 아래 버튼으로 테스트해보세요:</p>
                        <button class="test-button" onclick="testEndpoint('/')">기본 정보</button>
                        <button class="test-button" onclick="testEndpoint('/health')">헬스체크</button>
                        <button class="test-button" onclick="testEndpoint('/api/v1/test')">API 테스트</button>
                        <button class="test-button" onclick="testEndpoint('/api/v1/markets')">상권 목록</button>
                        <div id="result" class="result" style="display: none;"></div>
                    </div>
                </div>
            </div>
            
            <script>
                async function testEndpoint(endpoint) {
                    const resultDiv = document.getElementById('result');
                    resultDiv.style.display = 'block';
                    resultDiv.textContent = '로딩 중...';
                    
                    try {
                        const response = await fetch(endpoint);
                        const data = await response.json();
                        resultDiv.textContent = JSON.stringify(data, null, 2);
                    } catch (error) {
                        resultDiv.textContent = '에러: ' + error.message;
                    }
                }
            </script>
        </body>
        </html>
        ''', 200

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
    
    # API 엔드포인트 정보를 Swagger에 추가
    @ns.route('/endpoints')
    class AllEndpoints(Resource):
        @ns.doc('all_endpoints')
        def get(self):
            """모든 API 엔드포인트 목록"""
            return {
                'auth': {
                    'POST /auth/login': '사용자 로그인',
                    'POST /auth/register': '사용자 회원가입'
                },
                'core-diagnosis': {
                    'GET /core-diagnosis/foot-traffic/{market_code}': '유동인구 변화량 분석',
                    'GET /core-diagnosis/card-sales/{market_code}': '카드매출 추이 분석',
                    'GET /core-diagnosis/same-industry/{market_code}': '동일업종 수 분석',
                    'GET /core-diagnosis/business-rates/{market_code}': '창업·폐업 비율 분석',
                    'GET /core-diagnosis/dwell-time/{market_code}': '체류시간 분석',
                    'POST /core-diagnosis/health-score/{market_code}': '상권 건강 점수 종합 산정',
                    'POST /core-diagnosis/comprehensive/{market_code}': '종합 상권 진단'
                },
                'risk-classification': {
                    'POST /risk-classification/classify/{market_code}': '4가지 리스크 유형 자동 분류',
                    'POST /risk-classification/detailed-analysis/{market_code}': '특정 리스크 유형의 상세 분석',
                    'GET /risk-classification/risk-types': '지원하는 리스크 유형 목록',
                    'GET /risk-classification/mitigation-strategies': '리스크 완화 전략 목록'
                },
                'strategy-cards': {
                    'POST /strategy-cards/generate': '맞춤형 전략 카드 생성',
                    'GET /strategy-cards/checklist/{strategy_id}': '전략별 체크리스트 제공',
                    'GET /strategy-cards/success-cases': '성공 사례 제공',
                    'GET /strategy-cards/templates': '전략 템플릿 목록',
                    'GET /strategy-cards/categories': '전략 카테고리 목록'
                },
                'support-tools': {
                    'GET /support-tools/support-centers': '소상공인지원센터 정보 조회',
                    'GET /support-tools/expert-consultation': '전문가 상담 예약 정보',
                    'POST /support-tools/policy-recommendations': '지역 기반 맞춤 창업 지원 정책 추천',
                    'GET /support-tools/success-cases': '유사 상권 성공 사례 브라우징',
                    'POST /support-tools/consultation-booking': '전문가 상담 예약',
                    'POST /support-tools/policy-application': '정책 신청'
                },
                'map-visualization': {
                    'GET /map-visualization/heatmap': '상권 히트맵 데이터 생성',
                    'POST /map-visualization/radius-analysis': '반경별 분석 결과',
                    'GET /map-visualization/cluster-analysis': '상권 클러스터 분석',
                    'GET /map-visualization/traffic-flow/{market_code}': '유동인구 흐름 분석',
                    'GET /map-visualization/accessibility/{market_code}': '접근성 분석',
                    'GET /map-visualization/analysis-types': '지원하는 분석 유형 목록'
                },
                'market-diagnosis': {
                    'GET /market-diagnosis/markets': '상권 목록 조회',
                    'GET /market-diagnosis/markets/{market_code}': '상권 상세 정보',
                    'GET /market-diagnosis/districts': '구/군별 상권 통계'
                },
                'industry-analysis': {
                    'GET /industry-analysis/closure-rates': '폐업율 분석',
                    'GET /industry-analysis/risk-analysis': '리스크 분석',
                    'GET /industry-analysis/survival-rates': '생존율 분석'
                },
                'regional-analysis': {
                    'GET /regional-analysis/market-density': '상권 밀도',
                    'GET /regional-analysis/population': '인구 통계',
                    'GET /regional-analysis/rent-rates': '임대료 정보'
                },
                'scoring': {
                    'POST /scoring/calculate': '종합 점수 계산',
                    'POST /scoring/compare': '위치 비교'
                },
                'recommendations': {
                    'GET /recommendations/industry-based': '업종별 추천',
                    'POST /recommendations/personalized': '개인화 추천',
                    'GET /recommendations/region-based': '지역별 추천',
                    'GET /recommendations/similar-users': '유사 사용자 추천'
                }
            }, 200

    # Blueprints 등록
    app.register_blueprint(auth_bp, url_prefix="/api/v1/auth")
    app.register_blueprint(market_diagnosis_bp, url_prefix="/api/v1/market-diagnosis")
    app.register_blueprint(industry_analysis_bp, url_prefix="/api/v1/industry-analysis")
    app.register_blueprint(regional_analysis_bp, url_prefix="/api/v1/regional-analysis")
    app.register_blueprint(scoring_bp, url_prefix="/api/v1/scoring")
    app.register_blueprint(recommendations_bp, url_prefix="/api/v1/recommendations")
    app.register_blueprint(core_diagnosis_bp, url_prefix="/api/v1/core-diagnosis")
    app.register_blueprint(risk_classification_bp, url_prefix="/api/v1/risk-classification")
    app.register_blueprint(strategy_cards_bp, url_prefix="/api/v1/strategy-cards")
    app.register_blueprint(support_tools_bp, url_prefix="/api/v1/support-tools")
    app.register_blueprint(map_visualization_bp, url_prefix="/api/v1/map-visualization")
    
    return app
