#!/usr/bin/env python3
"""
실제 업소 정보 API
대전 상권정보.csv 기반 실제 업소 데이터 제공
"""
from flask import Blueprint, request, jsonify
from services.data_loader import DataLoader
from datetime import datetime

business_info_bp = Blueprint('business_info', __name__, url_prefix='/api/v1/businesses')

# 데이터 로더 인스턴스
data_loader = DataLoader()

@business_info_bp.route('/')
def business_info():
    """실제 업소 정보 API 메인"""
    return jsonify({
        "success": True,
        "message": "실제 업소 정보 API (대전 상권정보.csv 기반)",
        "endpoints": {
            "search": "/api/v1/businesses/search",
            "market_businesses": "/api/v1/businesses/market/<market_code>",
            "industry_businesses": "/api/v1/businesses/industry/<industry_code>",
            "district_businesses": "/api/v1/businesses/district/<district>",
            "competition_analysis": "/api/v1/businesses/competition/<market_code>",
            "density_heatmap": "/api/v1/businesses/density-heatmap",
            "industry_distribution": "/api/v1/businesses/industry-distribution"
        },
        "timestamp": datetime.utcnow().isoformat()
    })

@business_info_bp.route('/search', methods=['GET'])
def search_businesses():
    """
    업소명으로 검색
    
    상호명을 기반으로 업소를 검색합니다.
    
    ### 쿼리 파라미터
    - **q**: 검색어 (필수)
    - **limit**: 결과 수 제한 (기본값: 20, 최대: 50)
    
    ### 응답 예시
    ```json
    {
        "success": true,
        "data": {
            "businesses": [
                {
                    "상가업소번호": "MA010120220806289177",
                    "상호명": "얀헤어컬렉션",
                    "상권업종대분류명": "수리·개인",
                    "상권업종중분류명": "이용·미용",
                    "시군구명": "유성구",
                    "도로명주소": "대전광역시 유성구 신성로72번길 56",
                    "경도": 127.350008321342,
                    "위도": 36.3874769252915
                }
            ],
            "total_count": 1,
            "search_term": "얀헤어"
        }
    }
    ```
    """
    search_term = request.args.get('q', '').strip()
    limit = min(int(request.args.get('limit', 20)), 50)
    
    if not search_term:
        return jsonify({
            "success": False,
            "message": "검색어를 입력해주세요.",
            "timestamp": datetime.utcnow().isoformat()
        }), 400
    
    try:
        businesses = data_loader.search_businesses(search_term)
        
        # 결과 수 제한
        businesses = businesses[:limit]
        
        return jsonify({
            "success": True,
            "data": {
                "businesses": businesses,
                "total_count": len(businesses),
                "search_term": search_term,
                "limit": limit
            },
            "message": f"'{search_term}' 검색 결과 {len(businesses)}개",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"검색 중 오류가 발생했습니다: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

@business_info_bp.route('/market/<string:market_code>', methods=['GET'])
def get_businesses_by_market(market_code):
    """
    상권별 업소 목록 조회
    
    특정 상권(시군구) 내의 모든 업소 목록을 조회합니다.
    
    ### 경로 파라미터
    - **market_code**: 상권 코드 (시군구코드)
    
    ### 쿼리 파라미터
    - **industry**: 업종 필터 (선택사항)
    - **limit**: 결과 수 제한 (기본값: 100, 최대: 500)
    
    ### 응답 예시
    ```json
    {
        "success": true,
        "data": {
            "businesses": [...],
            "total_count": 150,
            "market_code": "30200",
            "market_name": "유성구"
        }
    }
    ```
    """
    industry_filter = request.args.get('industry')
    limit = min(int(request.args.get('limit', 100)), 500)
    
    try:
        businesses = data_loader.get_businesses_by_market(market_code)
        
        # 업종 필터링
        if industry_filter:
            businesses = [b for b in businesses if b.get('상권업종대분류코드') == industry_filter]
        
        # 결과 수 제한
        businesses = businesses[:limit]
        
        market_name = businesses[0].get('시군구명', '') if businesses else ''
        
        return jsonify({
            "success": True,
            "data": {
                "businesses": businesses,
                "total_count": len(businesses),
                "market_code": market_code,
                "market_name": market_name,
                "industry_filter": industry_filter,
                "limit": limit
            },
            "message": f"{market_name} 상권 업소 {len(businesses)}개 조회 완료",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"상권별 업소 조회 중 오류가 발생했습니다: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

@business_info_bp.route('/industry/<string:industry_code>', methods=['GET'])
def get_businesses_by_industry(industry_code):
    """
    업종별 업소 목록 조회
    
    특정 업종의 모든 업소 목록을 조회합니다.
    
    ### 경로 파라미터
    - **industry_code**: 업종 코드 (상권업종대분류코드)
    
    ### 쿼리 파라미터
    - **district**: 지역 필터 (선택사항)
    - **limit**: 결과 수 제한 (기본값: 100, 최대: 500)
    
    ### 응답 예시
    ```json
    {
        "success": true,
        "data": {
            "businesses": [...],
            "total_count": 250,
            "industry_code": "I2",
            "industry_name": "음식"
        }
    }
    ```
    """
    district_filter = request.args.get('district')
    limit = min(int(request.args.get('limit', 100)), 500)
    
    try:
        businesses = data_loader.get_businesses_by_industry(industry_code)
        
        # 지역 필터링
        if district_filter:
            businesses = [b for b in businesses if b.get('시군구명') == district_filter]
        
        # 결과 수 제한
        businesses = businesses[:limit]
        
        industry_name = businesses[0].get('상권업종대분류명', '') if businesses else ''
        
        return jsonify({
            "success": True,
            "data": {
                "businesses": businesses,
                "total_count": len(businesses),
                "industry_code": industry_code,
                "industry_name": industry_name,
                "district_filter": district_filter,
                "limit": limit
            },
            "message": f"{industry_name} 업종 업소 {len(businesses)}개 조회 완료",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"업종별 업소 조회 중 오류가 발생했습니다: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

@business_info_bp.route('/district/<string:district>', methods=['GET'])
def get_businesses_by_district(district):
    """
    지역구별 업소 목록 조회
    
    특정 지역구의 모든 업소 목록을 조회합니다.
    
    ### 경로 파라미터
    - **district**: 지역구명 (예: 유성구, 서구, 중구)
    
    ### 쿼리 파라미터
    - **industry**: 업종 필터 (선택사항)
    - **limit**: 결과 수 제한 (기본값: 100, 최대: 500)
    
    ### 응답 예시
    ```json
    {
        "success": true,
        "data": {
            "businesses": [...],
            "total_count": 300,
            "district": "유성구"
        }
    }
    ```
    """
    industry_filter = request.args.get('industry')
    limit = min(int(request.args.get('limit', 100)), 500)
    
    try:
        businesses = data_loader.get_businesses_by_district(district)
        
        # 업종 필터링
        if industry_filter:
            businesses = [b for b in businesses if b.get('상권업종대분류코드') == industry_filter]
        
        # 결과 수 제한
        businesses = businesses[:limit]
        
        return jsonify({
            "success": True,
            "data": {
                "businesses": businesses,
                "total_count": len(businesses),
                "district": district,
                "industry_filter": industry_filter,
                "limit": limit
            },
            "message": f"{district} 지역구 업소 {len(businesses)}개 조회 완료",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"지역구별 업소 조회 중 오류가 발생했습니다: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

@business_info_bp.route('/competition/<string:market_code>', methods=['GET'])
def get_competition_analysis(market_code):
    """
    경쟁 업소 분석
    
    특정 상권의 경쟁 업소 분석을 제공합니다.
    
    ### 경로 파라미터
    - **market_code**: 상권 코드 (시군구코드)
    
    ### 쿼리 파라미터
    - **industry**: 특정 업종 코드 (선택사항)
    
    ### 응답 예시
    ```json
    {
        "success": true,
        "data": {
            "total_businesses": 150,
            "industry_breakdown": [
                {
                    "상권업종대분류명": "음식",
                    "상권업종중분류명": "한식",
                    "count": 45
                }
            ],
            "competition_score": 45,
            "market_name": "유성구"
        }
    }
    ```
    """
    industry_code = request.args.get('industry')
    
    try:
        analysis = data_loader.get_competition_analysis(market_code, industry_code)
        
        return jsonify({
            "success": True,
            "data": analysis,
            "message": f"{analysis.get('market_name', '')} 상권 경쟁 분석 완료",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"경쟁 분석 중 오류가 발생했습니다: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

@business_info_bp.route('/density-heatmap', methods=['GET'])
def get_business_density_heatmap():
    """
    업소 밀도 히트맵 데이터
    
    지역별 업소 밀도를 히트맵 형태로 제공합니다.
    
    ### 쿼리 파라미터
    - **region**: 지역 필터 (선택사항, 예: 유성구)
    
    ### 응답 예시
    ```json
    {
        "success": true,
        "data": {
            "heatmap_data": [
                {
                    "시군구명": "유성구",
                    "행정동명": "신성동",
                    "경도": 127.35,
                    "위도": 36.38,
                    "business_count": 25,
                    "density_score": 0.8
                }
            ],
            "region": "유성구"
        }
    }
    ```
    """
    region = request.args.get('region')
    
    try:
        heatmap_data = data_loader.get_business_density_heatmap(region)
        
        return jsonify({
            "success": True,
            "data": {
                "heatmap_data": heatmap_data,
                "region": region or "전체",
                "total_points": len(heatmap_data)
            },
            "message": f"업소 밀도 히트맵 데이터 {len(heatmap_data)}개 포인트 생성 완료",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"히트맵 데이터 생성 중 오류가 발생했습니다: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

@business_info_bp.route('/industry-distribution', methods=['GET'])
def get_industry_distribution():
    """
    업종별 분포 분석
    
    지역별 업종 분포를 분석합니다.
    
    ### 쿼리 파라미터
    - **region**: 지역 필터 (선택사항, 예: 유성구)
    
    ### 응답 예시
    ```json
    {
        "success": true,
        "data": {
            "industries": [
                {
                    "상권업종대분류명": "음식",
                    "count": 250,
                    "percentage": 35.5
                }
            ],
            "total_businesses": 704,
            "region": "유성구"
        }
    }
    ```
    """
    region = request.args.get('region')
    
    try:
        distribution = data_loader.get_industry_distribution(region)
        
        return jsonify({
            "success": True,
            "data": distribution,
            "message": f"{distribution.get('region', '')} 지역 업종별 분포 분석 완료",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"업종별 분포 분석 중 오류가 발생했습니다: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

@business_info_bp.route('/industry-categories', methods=['GET'])
def get_industry_categories():
    """
    업종 대분류 목록 조회
    
    모든 업종 대분류 목록을 조회합니다.
    
    ### 응답 예시
    ```json
    {
        "success": true,
        "categories": [
            {
                "code": "I2",
                "name": "음식"
            },
            {
                "code": "G2",
                "name": "소매"
            }
        ]
    }
    ```
    """
    try:
        categories = data_loader.get_industry_categories()
        
        return jsonify({
            "success": True,
            "categories": categories,
            "message": f"업종 대분류 {len(categories)}개 조회 완료",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"업종 목록 조회 중 오류가 발생했습니다: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

@business_info_bp.route('/districts', methods=['GET'])
def get_districts():
    """
    시군구 목록 조회
    
    모든 시군구 목록을 조회합니다.
    
    ### 응답 예시
    ```json
    {
        "success": true,
        "districts": [
            {
                "code": "30140",
                "name": "중구"
            },
            {
                "code": "30200",
                "name": "유성구"
            }
        ]
    }
    ```
    """
    try:
        districts = data_loader.get_districts()
        
        return jsonify({
            "success": True,
            "districts": districts,
            "message": f"시군구 {len(districts)}개 조회 완료",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"시군구 목록 조회 중 오류가 발생했습니다: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

@business_info_bp.route('/administrative-dongs', methods=['GET'])
def get_administrative_dongs():
    """
    행정동 목록 조회
    
    특정 시군구의 행정동 목록을 조회합니다.
    
    ### 쿼리 파라미터
    - **district**: 시군구명 (선택사항, 없으면 전체)
    
    ### 응답 예시
    ```json
    {
        "success": true,
        "dongs": [
            {
                "code": "30140740",
                "name": "산성동",
                "district": "중구"
            }
        ]
    }
    ```
    """
    district = request.args.get('district')
    
    try:
        dongs = data_loader.get_administrative_dongs(district)
        
        return jsonify({
            "success": True,
            "dongs": dongs,
            "message": f"행정동 {len(dongs)}개 조회 완료",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"행정동 목록 조회 중 오류가 발생했습니다: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }), 500

@business_info_bp.route('/search-locations', methods=['GET'])
def search_locations():
    """
    지역 검색
    
    시군구, 행정동을 검색합니다.
    
    ### 쿼리 파라미터
    - **q**: 검색어 (필수)
    
    ### 응답 예시
    ```json
    {
        "success": true,
        "locations": [
            {
                "district_code": "30200",
                "district_name": "유성구",
                "dong_code": "30200550",
                "dong_name": "신성동",
                "full_name": "유성구 신성동"
            }
        ]
    }
    ```
    """
    search_term = request.args.get('q', '').strip()
    
    if not search_term:
        return jsonify({
            "success": False,
            "message": "검색어를 입력해주세요.",
            "timestamp": datetime.utcnow().isoformat()
        }), 400
    
    try:
        locations = data_loader.search_locations(search_term)
        
        return jsonify({
            "success": True,
            "locations": locations,
            "message": f"'{search_term}' 지역 검색 결과 {len(locations)}개",
            "timestamp": datetime.utcnow().isoformat()
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "message": f"지역 검색 중 오류가 발생했습니다: {str(e)}",
            "timestamp": datetime.utcnow().isoformat()
        }), 500
