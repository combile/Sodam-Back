from flask import Flask, request
from datetime import datetime
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

    # 기본 엔드포인트들
    @app.route('/')
    def root():
        return {
            'message': 'SODAM Backend API', 
            'version': '1.0.0',
            'status': 'running',
            'endpoints': {
                'health': '/health',
                'api': '/api/v1/',
                'docs': '/docs/'
            }
        }, 200
    
    @app.route('/health')
    def health_check():
        return {'status': 'healthy', 'message': 'SODAM Backend API is running'}, 200
    
    @app.route('/api/v1/')
    def api_info():
        return {
            'message': 'SODAM API v1',
            'status': 'active',
            'endpoints': [
                '/api/v1/auth/',
                '/api/v1/market-diagnosis/',
                '/api/v1/industry-analysis/',
                '/api/v1/regional-analysis/',
                '/api/v1/scoring/',
                '/api/v1/recommendations/',
                '/api/v1/core-diagnosis/',
                '/api/v1/risk-classification/',
                '/api/v1/strategy-cards/',
                '/api/v1/support-tools/',
                '/api/v1/map-visualization/'
            ],
            'test_endpoints': {
                'auth_login': 'POST /api/v1/auth/login',
                'auth_register': 'POST /api/v1/auth/register',
                'market_list': 'GET /api/v1/market-diagnosis/markets',
                'health_check': 'GET /health'
            }
        }, 200
    
    # 테스트용 간단한 API 엔드포인트들
    @app.route('/api/v1/test')
    def test_api():
        return {
            'message': 'API 테스트 성공!',
            'timestamp': datetime.now().isoformat(),
            'status': 'working'
        }, 200
    
    @app.route('/api/v1/markets')
    def test_markets():
        return {
            'markets': [
                {'id': 10000, 'name': '강남역 상권', 'area': '서울특별시'},
                {'id': 10001, 'name': '홍대 상권', 'area': '서울특별시'},
                {'id': 10002, 'name': '명동 상권', 'area': '서울특별시'}
            ],
            'total': 3
        }, 200
    
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
