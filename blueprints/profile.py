#!/usr/bin/env python3
"""
사용자 프로필 관리 API
"""
from flask import Blueprint, request, jsonify
from flask_restx import Namespace, Resource, fields
from models import User, db
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

profile_bp = Blueprint('profile', __name__, url_prefix='/api/v1/profile')
profile_ns = Namespace('profile', description='사용자 프로필 관리 API')

# Flask-RESTX 모델 정의
preferences_model = profile_ns.model('Preferences', {
    'interestedBusinessTypes': fields.List(fields.String),
    'preferredAreas': fields.List(fields.String)
})

update_profile_model = profile_ns.model('UpdateProfileRequest', {
    'name': fields.String,
    'nickname': fields.String,
    'businessStage': fields.String,
    'phone': fields.String,
    'profileImage': fields.String,
    'preferences': fields.Nested(preferences_model)
})

@profile_bp.route('/test', methods=['GET'])
def test_endpoint():
    """API 테스트용 엔드포인트"""
    return jsonify({
        "success": True,
        "message": "프로필 API가 정상적으로 작동합니다.",
        "timestamp": datetime.utcnow().isoformat()
    }), 200


@profile_bp.route('/update', methods=['PUT'])
@jwt_required()
def update_profile():
    """
    사용자 프로필 업데이트
    
    ### 요청 본문 예시
    ```json
    {
        "name": "홍길동",
        "nickname": "길동이",
        "businessStage": "STARTUP",
        "phone": "010-1234-5678",
        "preferences": {
            "interestedBusinessTypes": ["음식", "소매"],
            "preferredAreas": ["유성구 신성동", "중구 산성동"]
        }
    }
    ```
    
    ### 응답 예시
    ```json
    {
        "success": true,
        "message": "프로필이 성공적으로 업데이트되었습니다.",
        "user": {
            "id": 1,
            "username": "testuser",
            "email": "test@example.com",
            "name": "홍길동",
            "nickname": "길동이",
            "businessStage": "STARTUP",
            "phone": "010-1234-5678",
            "preferences": {
                "interestedBusinessTypes": ["음식", "소매"],
                "preferredAreas": ["유성구 신성동", "중구 산성동"]
            }
        }
    }
    ```
    """
    try:
        # JWT 토큰 검증
        current_user_id = get_jwt_identity()
        print(f"[DEBUG] JWT Identity: {current_user_id}")
        print(f"[DEBUG] Request headers: {dict(request.headers)}")
        print(f"[DEBUG] Request method: {request.method}")
        print(f"[DEBUG] Request content type: {request.content_type}")
        
        if not current_user_id:
            print(f"[ERROR] JWT Identity is None")
            return jsonify({
                "success": False,
                "message": "인증 토큰이 유효하지 않습니다."
            }), 401
        
        # 사용자 조회
        user = User.query.get(current_user_id)
        print(f"[DEBUG] Found user: {user}")
        
        if not user:
            print(f"[ERROR] User not found for ID: {current_user_id}")
            return jsonify({
                "success": False,
                "message": "사용자를 찾을 수 없습니다."
            }), 404
        
        # JSON 데이터 파싱
        try:
            data = request.get_json(force=True)
            print(f"[DEBUG] Request data: {data}")
            print(f"[DEBUG] Data type: {type(data)}")
        except Exception as json_error:
            print(f"[ERROR] JSON parsing error: {json_error}")
            return jsonify({
                "success": False,
                "message": "요청 데이터 형식이 올바르지 않습니다."
            }), 400
        
        if not data:
            print(f"[ERROR] No JSON data in request")
            return jsonify({
                "success": False,
                "message": "요청 데이터가 없습니다."
            }), 400
        
        # 데이터 검증
        valid_business_stages = ['PLANNING', 'STARTUP', 'OPERATING']
        
        # 프로필 정보 업데이트
        if 'name' in data:
            if data['name'] and isinstance(data['name'], str) and len(data['name'].strip()) > 0:
                user.name = data['name'].strip()
            else:
                return jsonify({
                    "success": False,
                    "message": "이름은 비어있을 수 없습니다."
                }), 400
                
        if 'nickname' in data:
            if data['nickname'] and isinstance(data['nickname'], str):
                user.nickname = data['nickname'].strip()
            else:
                user.nickname = None
                
        if 'businessStage' in data:
            if data['businessStage'] and data['businessStage'] in valid_business_stages:
                user.business_stage = data['businessStage']
                print(f"[DEBUG] Business stage updated to: {data['businessStage']}")
            elif data['businessStage']:
                return jsonify({
                    "success": False,
                    "message": f"유효하지 않은 사업 단계입니다. 가능한 값: {', '.join(valid_business_stages)}"
                }), 400
            else:
                user.business_stage = None
                
        if 'phone' in data:
            if data['phone'] and isinstance(data['phone'], str):
                user.phone = data['phone'].strip()
            else:
                user.phone = None
                
        if 'profileImage' in data:
            if data['profileImage'] and isinstance(data['profileImage'], str):
                user.profile_image = data['profileImage'].strip()
            else:
                user.profile_image = None
        
        # 선호도 정보 업데이트
        if 'preferences' in data:
            preferences = data['preferences']
            if isinstance(preferences, dict):
                if 'interestedBusinessTypes' in preferences:
                    if isinstance(preferences['interestedBusinessTypes'], list):
                        user.interested_business_types = preferences['interestedBusinessTypes']
                    else:
                        user.interested_business_types = []
                        
                if 'preferredAreas' in preferences:
                    if isinstance(preferences['preferredAreas'], list):
                        user.preferred_areas = preferences['preferredAreas']
                    else:
                        user.preferred_areas = []
        
        user.updated_at = datetime.utcnow()
        
        db.session.commit()
        
        # 업데이트된 사용자 정보 반환
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": user.name,
            "nickname": user.nickname,
            "userType": user.user_type,
            "businessStage": user.business_stage,
            "phone": user.phone,
            "preferences": {
                "interestedBusinessTypes": user.interested_business_types or [],
                "preferredAreas": user.preferred_areas or []
            },
            "profileImage": user.profile_image,
            "isActive": user.is_active,
            "createdAt": user.created_at.isoformat() if user.created_at else None,
            "updatedAt": user.updated_at.isoformat() if user.updated_at else None
        }
        
        return jsonify({
            "success": True,
            "message": "프로필이 성공적으로 업데이트되었습니다.",
            "user": user_data,
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        print(f"[ERROR] Profile update error: {str(e)}")
        print(f"[ERROR] Error type: {type(e)}")
        print(f"[ERROR] Error details: {e}")
        
        # JWT 관련 오류인지 확인
        if "jwt" in str(e).lower() or "token" in str(e).lower():
            return jsonify({
                "success": False,
                "message": "인증 토큰이 유효하지 않습니다. 다시 로그인해주세요.",
                "error_code": "INVALID_TOKEN",
                "timestamp": datetime.utcnow().isoformat()
            }), 401
        
        # 데이터베이스 관련 오류인지 확인
        if "database" in str(e).lower() or "sql" in str(e).lower():
            return jsonify({
                "success": False,
                "message": "데이터베이스 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
                "error_code": "DATABASE_ERROR",
                "timestamp": datetime.utcnow().isoformat()
            }), 500
        
        # 일반적인 서버 오류
        return jsonify({
            "success": False,
            "message": "프로필 업데이트 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
            "error_code": "INTERNAL_ERROR",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

@profile_bp.route('/get', methods=['GET'])
@jwt_required()
def get_profile():
    """
    현재 사용자 프로필 조회
    """
    try:
        current_user_id = get_jwt_identity()
        print(f"[DEBUG] JWT Identity: {current_user_id}")
        user = User.query.get(current_user_id)
        print(f"[DEBUG] Found user: {user}")
        
        if not user:
            return jsonify({
                "success": False,
                "message": "사용자를 찾을 수 없습니다."
            }), 404
        
        user_data = {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "name": user.name,
            "nickname": user.nickname,
            "userType": user.user_type,
            "businessStage": user.business_stage,
            "phone": user.phone,
            "preferences": {
                "interestedBusinessTypes": user.interested_business_types or [],
                "preferredAreas": user.preferred_areas or []
            },
            "profileImage": user.profile_image,
            "isActive": user.is_active,
            "createdAt": user.created_at.isoformat() if user.created_at else None,
            "updatedAt": user.updated_at.isoformat() if user.updated_at else None
        }
        
        return jsonify({
            "success": True,
            "user": user_data,
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"프로필 조회 중 오류가 발생했습니다: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

# Flask-RESTX Resource 클래스들 (Swagger 문서화용)
@profile_ns.route('/update')
class UpdateProfileResource(Resource):
    @profile_ns.doc('update_profile')
    @profile_ns.expect(update_profile_model)
    @jwt_required()
    def put(self):
        """사용자 프로필 업데이트 (Swagger 문서화용)"""
        # 실제 구현은 Blueprint 함수를 호출
        return update_profile()

@profile_ns.route('/get')
class GetProfileResource(Resource):
    @profile_ns.doc('get_profile')
    @jwt_required()
    def get(self):
        """현재 사용자 프로필 조회 (Swagger 문서화용)"""
        # 실제 구현은 Blueprint 함수를 호출
        return get_profile()
