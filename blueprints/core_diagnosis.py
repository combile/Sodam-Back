from flask import Blueprint, request, jsonify
from services.core_diagnosis_service import CoreDiagnosisService
from datetime import datetime
from typing import Dict, List, Any

core_diagnosis_bp = Blueprint('core_diagnosis', __name__, url_prefix='/api/v1/core-diagnosis')

core_diagnosis_service = CoreDiagnosisService()

@core_diagnosis_bp.route('/foot-traffic/<string:market_code>', methods=['GET'])
def get_foot_traffic_analysis(market_code: str):
    """유동인구 변화량 분석"""
    try:
        period_months = request.args.get('period_months', 12, type=int)
        analysis = core_diagnosis_service.get_foot_traffic_analysis(market_code, period_months)
        
        if "error" in analysis:
            return jsonify({
                "success": False,
                "error": {
                    "code": "DATA_NOT_FOUND",
                    "message": analysis["error"]
                }
            }), 404
        
        return jsonify({
            "success": True,
            "data": analysis
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": str(e)
            }
        }), 500

@core_diagnosis_bp.route('/card-sales/<string:market_code>', methods=['GET'])
def get_card_sales_analysis(market_code: str):
    """카드매출 추이 분석"""
    try:
        period_months = request.args.get('period_months', 12, type=int)
        analysis = core_diagnosis_service.get_card_sales_analysis(market_code, period_months)
        
        if "error" in analysis:
            return jsonify({
                "success": False,
                "error": {
                    "code": "DATA_NOT_FOUND",
                    "message": analysis["error"]
                }
            }), 404
        
        return jsonify({
            "success": True,
            "data": analysis
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": str(e)
            }
        }), 500

@core_diagnosis_bp.route('/same-industry/<string:market_code>', methods=['GET'])
def get_same_industry_analysis(market_code: str):
    """동일업종 수 분석"""
    try:
        industry = request.args.get('industry')
        analysis = core_diagnosis_service.get_same_industry_analysis(market_code, industry)
        
        if "error" in analysis:
            return jsonify({
                "success": False,
                "error": {
                    "code": "DATA_NOT_FOUND",
                    "message": analysis["error"]
                }
            }), 404
        
        return jsonify({
            "success": True,
            "data": analysis
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": str(e)
            }
        }), 500

@core_diagnosis_bp.route('/business-rates/<string:market_code>', methods=['GET'])
def get_business_rates_analysis(market_code: str):
    """창업·폐업 비율 분석"""
    try:
        analysis = core_diagnosis_service.get_business_rates_analysis(market_code)
        
        if "error" in analysis:
            return jsonify({
                "success": False,
                "error": {
                    "code": "DATA_NOT_FOUND",
                    "message": analysis["error"]
                }
            }), 404
        
        return jsonify({
            "success": True,
            "data": analysis
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": str(e)
            }
        }), 500

@core_diagnosis_bp.route('/dwell-time/<string:market_code>', methods=['GET'])
def get_dwell_time_analysis(market_code: str):
    """체류시간 분석"""
    try:
        analysis = core_diagnosis_service.get_dwell_time_analysis(market_code)
        
        if "error" in analysis:
            return jsonify({
                "success": False,
                "error": {
                    "code": "DATA_NOT_FOUND",
                    "message": analysis["error"]
                }
            }), 404
        
        return jsonify({
            "success": True,
            "data": analysis
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": str(e)
            }
        }), 500

@core_diagnosis_bp.route('/health-score/<string:market_code>', methods=['POST'])
def calculate_health_score(market_code: str):
    """상권 건강 점수 종합 산정"""
    try:
        data = request.get_json() or {}
        industry = data.get('industry')
        
        analysis = core_diagnosis_service.calculate_health_score(market_code, industry)
        
        if "error" in analysis:
            return jsonify({
                "success": False,
                "error": {
                    "code": "DATA_NOT_FOUND",
                    "message": analysis["error"]
                }
            }), 404
        
        return jsonify({
            "success": True,
            "data": analysis
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": str(e)
            }
        }), 500

@core_diagnosis_bp.route('/comprehensive/<string:market_code>', methods=['POST'])
def get_comprehensive_analysis(market_code: str):
    """종합 상권 진단"""
    try:
        data = request.get_json() or {}
        industry = data.get('industry')
        
        # 모든 지표 분석
        foot_traffic = core_diagnosis_service.get_foot_traffic_analysis(market_code)
        card_sales = core_diagnosis_service.get_card_sales_analysis(market_code)
        same_industry = core_diagnosis_service.get_same_industry_analysis(market_code, industry)
        business_rates = core_diagnosis_service.get_business_rates_analysis(market_code)
        dwell_time = core_diagnosis_service.get_dwell_time_analysis(market_code)
        health_score = core_diagnosis_service.calculate_health_score(market_code, industry)
        
        comprehensive_analysis = {
            "market_code": market_code,
            "industry": industry,
            "analysis_timestamp": datetime.now().isoformat(),
            "indicators": {
                "foot_traffic": foot_traffic,
                "card_sales": card_sales,
                "same_industry": same_industry,
                "business_rates": business_rates,
                "dwell_time": dwell_time
            },
            "health_score": health_score,
            "summary": {
                "overall_grade": health_score.get("final_grade", "C"),
                "health_status": health_score.get("health_status", "보통"),
                "total_score": health_score.get("total_score", 70),
                "key_insights": [
                    f"유동인구 변화율: {foot_traffic.get('average_monthly_change', 0):.1f}%",
                    f"카드매출 변화율: {card_sales.get('average_monthly_change', 0):.1f}%",
                    f"생존률: {business_rates.get('survival_rate', 0):.1f}%",
                    f"평균 체류시간: {dwell_time.get('average_dwell_time', 0)}분"
                ]
            }
        }
        
        return jsonify({
            "success": True,
            "data": comprehensive_analysis
        })
    except Exception as e:
        return jsonify({
            "success": False,
            "error": {
                "code": "INTERNAL_ERROR",
                "message": str(e)
            }
        }), 500
