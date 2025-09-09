from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from extensions import db, bcrypt
from models import User
from flask_jwt_extended import create_access_token
from datetime import datetime

auth_ns = Namespace('auth', description='사용자 인증 및 회원가입 API')

# 모델 정의
login_model = auth_ns.model('LoginRequest', {
    'username': fields.String(required=True, description='사용자명', example='daejeon_user'),
    'password': fields.String(required=True, description='비밀번호', example='password123!')
})

register_model = auth_ns.model('RegisterRequest', {
    'username': fields.String(required=True, description='사용자명', example='daejeon_user'),
    'email': fields.String(required=True, description='이메일', example='user@daejeon.kr'),
    'password': fields.String(required=True, description='비밀번호', example='password123!'),
    'name': fields.String(required=True, description='이름', example='홍길동'),
    'nickname': fields.String(description='닉네임', example='대전사업가'),
    'userType': fields.String(description='사용자 유형', example='ENTREPRENEUR'),
    'businessStage': fields.String(description='사업 단계', example='PLANNING'),
    'phone': fields.String(description='전화번호', example='010-1234-5678'),
    'interestedBusinessTypes': fields.List(fields.String, description='관심 업종', example=['카페', '음식점']),
    'preferredAreas': fields.List(fields.String, description='선호 지역', example=['중구', '서구'])
})

success_response = auth_ns.model('SuccessResponse', {
    'success': fields.Boolean(description='성공 여부', example=True),
    'message': fields.String(description='응답 메시지', example='요청이 성공적으로 처리되었습니다.'),
    'data': fields.Raw(description='응답 데이터')
})

error_response = auth_ns.model('ErrorResponse', {
    'success': fields.Boolean(description='성공 여부', example=False),
    'error': fields.Raw(description='에러 정보')
})

@auth_ns.route('/register')
class Register(Resource):
    @auth_ns.expect(register_model)
    @auth_ns.marshal_with(success_response)
    @auth_ns.doc('register', description='사용자 회원가입')
    def post(self):
        data = request.get_json() or {}
        username = (data.get("username") or "").strip()
        email = (data.get("email") or "").strip().lower()
        password = (data.get("password") or "").strip()
        name = (data.get("name") or "").strip()
        nickname = (data.get("nickname") or "").strip()
        user_type = data.get("userType", "ENTREPRENEUR")
        business_stage = data.get("businessStage")
        phone = data.get("phone")
        interested_business_types = data.get("interestedBusinessTypes", [])
        preferred_areas = data.get("preferredAreas", [])
        profile_image = data.get("profileImage")

        # 필수 필드 검증
        if not username or not email or not password or not name:
            return jsonify({
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "아이디, 이메일, 비밀번호, 이름은 필수입니다.",
                    "details": {}
                }
            }), 400

        # 아이디 중복 검사
        if User.query.filter_by(username=username).first():
            return jsonify({
                "success": False,
                "error": {
                    "code": "CONFLICT",
                    "message": "이미 사용 중인 아이디입니다.",
                    "details": {"field": "username"}
                }
            }), 409

        # 이메일 중복 검사
        if User.query.filter_by(email=email).first():
            return jsonify({
                "success": False,
                "error": {
                    "code": "CONFLICT",
                    "message": "이미 사용 중인 이메일입니다.",
                    "details": {"field": "email"}
                }
            }), 409

        # 비밀번호 길이 검증
        if len(password) < 8:
            return jsonify({
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "비밀번호는 8자 이상이어야 합니다.",
                    "details": {"field": "password"}
                }
            }), 400

        pw_hash = bcrypt.generate_password_hash(password).decode()
        user = User(
            username=username,
            email=email,
            name=name,
            nickname=nickname,
            password_hash=pw_hash,
            user_type=user_type,
            business_stage=business_stage,
            phone=phone,
            interested_business_types=interested_business_types,
            preferred_areas=preferred_areas,
            profile_image=profile_image
        )
        
        db.session.add(user)
        db.session.commit()

        return jsonify({
            "success": True,
            "data": {
                "user": user.to_dict()
            },
            "message": "회원가입이 완료되었습니다.",
            "timestamp": datetime.utcnow().isoformat()
        }), 201

@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(login_model)
    @auth_ns.marshal_with(success_response)
    @auth_ns.doc('login', description='사용자 로그인')
    def post(self):
        data = request.get_json() or {}
        username = (data.get("username") or "").strip()  # 아이디로 로그인
        password = (data.get("password") or "").strip()

        if not username or not password:
            return jsonify({
                "success": False,
                "error": {
                    "code": "VALIDATION_ERROR",
                    "message": "아이디와 비밀번호를 입력해주세요.",
                    "details": {}
                }
            }), 400

        # 아이디로 사용자 찾기
        user = User.query.filter_by(username=username).first()
        if not user or not bcrypt.check_password_hash(user.password_hash, password):
            return jsonify({
                "success": False,
                "error": {
                    "code": "UNAUTHORIZED",
                    "message": "아이디 또는 비밀번호가 올바르지 않습니다.",
                    "details": {}
                }
            }), 401

        # 비활성화된 계정 확인
        if not user.is_active:
            return jsonify({
                "success": False,
                "error": {
                    "code": "FORBIDDEN",
                    "message": "비활성화된 계정입니다.",
                    "details": {}
                }
            }), 403

        # JWT 토큰 생성
        token = create_access_token(identity=user.id)
        
        return jsonify({
            "success": True,
            "data": {
                "accessToken": token,
                "user": user.to_dict()
            },
            "message": "로그인에 성공했습니다.",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
