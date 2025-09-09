from flask import Flask, request
from config import Config
from extensions import db, migrate, bcrypt, jwt, cors

def create_app(config_object: type = Config) -> Flask:
    app = Flask(__name__)
    app.config.from_object(config_object)

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
            ]
        }, 200
    
    @app.route('/docs/')
    def docs():
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>SODAM API Documentation</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 40px; }
                .endpoint { background: #f5f5f5; padding: 10px; margin: 10px 0; border-radius: 5px; }
                .method { font-weight: bold; color: #007bff; }
            </style>
        </head>
        <body>
            <h1>소담(SODAM) API 문서</h1>
            <p>소상공인을 위한 상권 진단 및 사업 추천 플랫폼 API</p>
            
            <h2>기본 엔드포인트</h2>
            <div class="endpoint">
                <span class="method">GET</span> / - API 기본 정보
            </div>
            <div class="endpoint">
                <span class="method">GET</span> /health - 헬스체크
            </div>
            <div class="endpoint">
                <span class="method">GET</span> /api/v1/ - API 엔드포인트 목록
            </div>
            
            <h2>주요 API 엔드포인트</h2>
            <div class="endpoint">
                <span class="method">POST</span> /api/v1/auth/login - 사용자 로그인
            </div>
            <div class="endpoint">
                <span class="method">POST</span> /api/v1/auth/register - 사용자 회원가입
            </div>
            <div class="endpoint">
                <span class="method">GET</span> /api/v1/market-diagnosis/markets - 상권 목록
            </div>
            <div class="endpoint">
                <span class="method">GET</span> /api/v1/core-diagnosis/foot-traffic/{market_code} - 유동인구 분석
            </div>
            
            <h2>테스트</h2>
            <p>각 엔드포인트를 클릭하거나 직접 호출해보세요.</p>
        </body>
        </html>
        ''', 200

    return app
