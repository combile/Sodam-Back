import os
import pandas as pd
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
import numpy as np

class CoreDiagnosisService:
    """상권 진단 핵심 지표 분석 서비스"""
    
    def __init__(self):
        self.data_loader = None
        # 임시로 하드코딩된 샘플 데이터 (실제로는 외부 API나 데이터베이스에서 가져와야 함)
        self.sample_data = self._init_sample_data()
    
    def _init_sample_data(self) -> Dict[str, Any]:
        """샘플 데이터 초기화"""
        return {
            "foot_traffic": {
                "10000": {  # 대전역 상권
                    "2024-01": 150000, "2024-02": 145000, "2024-03": 160000,
                    "2024-04": 155000, "2024-05": 170000, "2024-06": 165000,
                    "2024-07": 180000, "2024-08": 175000, "2024-09": 190000,
                    "2024-10": 185000, "2024-11": 200000, "2024-12": 195000
                },
                "20000": {  # 유성온천역 상권
                    "2024-01": 120000, "2024-02": 118000, "2024-03": 125000,
                    "2024-04": 122000, "2024-05": 130000, "2024-06": 128000,
                    "2024-07": 135000, "2024-08": 132000, "2024-09": 140000,
                    "2024-10": 138000, "2024-11": 145000, "2024-12": 142000
                }
            },
            "card_sales": {
                "10000": {
                    "2024-01": 2500000000, "2024-02": 2400000000, "2024-03": 2600000000,
                    "2024-04": 2550000000, "2024-05": 2700000000, "2024-06": 2650000000,
                    "2024-07": 2800000000, "2024-08": 2750000000, "2024-09": 2900000000,
                    "2024-10": 2850000000, "2024-11": 3000000000, "2024-12": 2950000000
                },
                "20000": {
                    "2024-01": 1800000000, "2024-02": 1750000000, "2024-03": 1850000000,
                    "2024-04": 1820000000, "2024-05": 1900000000, "2024-06": 1880000000,
                    "2024-07": 1950000000, "2024-08": 1920000000, "2024-09": 2000000000,
                    "2024-10": 1980000000, "2024-11": 2050000000, "2024-12": 2020000000
                }
            },
            "same_industry_count": {
                "10000": {
                    "식음료업": 45, "의류업": 32, "생활용품": 28, "전자제품": 15, "화장품": 12
                },
                "20000": {
                    "식음료업": 38, "의류업": 25, "생활용품": 22, "전자제품": 12, "화장품": 8
                }
            },
            "business_rates": {
                "10000": {
                    "startup_rate": 12.5,  # 창업률 (%)
                    "closure_rate": 8.3,   # 폐업률 (%)
                    "survival_rate": 91.7  # 생존률 (%)
                },
                "20000": {
                    "startup_rate": 15.2,
                    "closure_rate": 6.8,
                    "survival_rate": 93.2
                }
            },
            "dwell_time": {
                "10000": {
                    "average_dwell_time": 45,  # 평균 체류시간 (분)
                    "peak_hours": ["12:00-14:00", "18:00-20:00"],
                    "weekend_ratio": 1.3  # 주말 대비 평일 비율
                },
                "20000": {
                    "average_dwell_time": 38,
                    "peak_hours": ["11:00-13:00", "17:00-19:00"],
                    "weekend_ratio": 1.5
                }
            }
        }
    
    def get_foot_traffic_analysis(self, market_code: str, period_months: int = 12) -> Dict[str, Any]:
        """유동인구 변화량 분석"""
        if market_code not in self.sample_data["foot_traffic"]:
            return {"error": "해당 상권의 유동인구 데이터가 없습니다."}
        
        traffic_data = self.sample_data["foot_traffic"][market_code]
        
        # 최근 N개월 데이터 추출
        months = list(traffic_data.keys())[-period_months:]
        values = [traffic_data[month] for month in months]
        
        # 변화량 계산
        if len(values) >= 2:
            monthly_changes = []
            for i in range(1, len(values)):
                change = ((values[i] - values[i-1]) / values[i-1]) * 100
                monthly_changes.append(change)
            
            avg_monthly_change = np.mean(monthly_changes)
            total_change = ((values[-1] - values[0]) / values[0]) * 100
            trend = "증가" if avg_monthly_change > 0 else "감소"
        else:
            avg_monthly_change = 0
            total_change = 0
            trend = "안정"
        
        # 등급 산정
        if avg_monthly_change > 5:
            grade = "A"
        elif avg_monthly_change > 0:
            grade = "B"
        elif avg_monthly_change > -5:
            grade = "C"
        else:
            grade = "D"
        
        return {
            "market_code": market_code,
            "current_monthly_traffic": values[-1],
            "average_monthly_change": round(avg_monthly_change, 2),
            "total_change_period": round(total_change, 2),
            "trend": trend,
            "grade": grade,
            "monthly_data": [
                {"month": month, "traffic": traffic_data[month]} 
                for month in months
            ],
            "analysis": self._get_foot_traffic_analysis_text(avg_monthly_change, grade)
        }
    
    def get_card_sales_analysis(self, market_code: str, period_months: int = 12) -> Dict[str, Any]:
        """카드매출 추이 분석"""
        if market_code not in self.sample_data["card_sales"]:
            return {"error": "해당 상권의 카드매출 데이터가 없습니다."}
        
        sales_data = self.sample_data["card_sales"][market_code]
        
        # 최근 N개월 데이터 추출
        months = list(sales_data.keys())[-period_months:]
        values = [sales_data[month] for month in months]
        
        # 변화량 계산
        if len(values) >= 2:
            monthly_changes = []
            for i in range(1, len(values)):
                change = ((values[i] - values[i-1]) / values[i-1]) * 100
                monthly_changes.append(change)
            
            avg_monthly_change = np.mean(monthly_changes)
            total_change = ((values[-1] - values[0]) / values[0]) * 100
            trend = "증가" if avg_monthly_change > 0 else "감소"
        else:
            avg_monthly_change = 0
            total_change = 0
            trend = "안정"
        
        # 등급 산정
        if avg_monthly_change > 3:
            grade = "A"
        elif avg_monthly_change > 0:
            grade = "B"
        elif avg_monthly_change > -3:
            grade = "C"
        else:
            grade = "D"
        
        return {
            "market_code": market_code,
            "current_monthly_sales": values[-1],
            "average_monthly_change": round(avg_monthly_change, 2),
            "total_change_period": round(total_change, 2),
            "trend": trend,
            "grade": grade,
            "monthly_data": [
                {"month": month, "sales": sales_data[month]} 
                for month in months
            ],
            "analysis": self._get_card_sales_analysis_text(avg_monthly_change, grade)
        }
    
    def get_same_industry_analysis(self, market_code: str, industry: str = None) -> Dict[str, Any]:
        """동일업종 수 분석"""
        if market_code not in self.sample_data["same_industry_count"]:
            return {"error": "해당 상권의 업종별 사업체 데이터가 없습니다."}
        
        industry_data = self.sample_data["same_industry_count"][market_code]
        
        if industry and industry in industry_data:
            # 특정 업종 분석
            count = industry_data[industry]
            total_businesses = sum(industry_data.values())
            ratio = (count / total_businesses) * 100
            
            # 경쟁도 등급
            if ratio > 30:
                competition_level = "매우 높음"
                grade = "D"
            elif ratio > 20:
                competition_level = "높음"
                grade = "C"
            elif ratio > 10:
                competition_level = "보통"
                grade = "B"
            else:
                competition_level = "낮음"
                grade = "A"
            
            return {
                "market_code": market_code,
                "industry": industry,
                "business_count": count,
                "total_businesses": total_businesses,
                "industry_ratio": round(ratio, 2),
                "competition_level": competition_level,
                "grade": grade,
                "analysis": self._get_competition_analysis_text(ratio, competition_level)
            }
        else:
            # 전체 업종 분석
            return {
                "market_code": market_code,
                "industry_breakdown": industry_data,
                "total_businesses": sum(industry_data.values()),
                "analysis": "전체 업종별 사업체 현황입니다."
            }
    
    def get_business_rates_analysis(self, market_code: str) -> Dict[str, Any]:
        """창업·폐업 비율 분석"""
        if market_code not in self.sample_data["business_rates"]:
            return {"error": "해당 상권의 창업·폐업 데이터가 없습니다."}
        
        rates = self.sample_data["business_rates"][market_code]
        
        # 종합 등급 산정
        startup_score = min(rates["startup_rate"] / 15 * 100, 100)  # 15% 이상이면 100점
        closure_score = max(100 - rates["closure_rate"] / 10 * 100, 0)  # 10% 이상이면 0점
        survival_score = rates["survival_rate"]
        
        total_score = (startup_score * 0.3 + closure_score * 0.3 + survival_score * 0.4)
        
        if total_score >= 90:
            grade = "A"
            health_status = "매우 양호"
        elif total_score >= 80:
            grade = "B"
            health_status = "양호"
        elif total_score >= 70:
            grade = "C"
            health_status = "보통"
        else:
            grade = "D"
            health_status = "우려"
        
        return {
            "market_code": market_code,
            "startup_rate": rates["startup_rate"],
            "closure_rate": rates["closure_rate"],
            "survival_rate": rates["survival_rate"],
            "total_score": round(total_score, 2),
            "grade": grade,
            "health_status": health_status,
            "analysis": self._get_business_rates_analysis_text(total_score, health_status)
        }
    
    def get_dwell_time_analysis(self, market_code: str) -> Dict[str, Any]:
        """체류시간 분석"""
        if market_code not in self.sample_data["dwell_time"]:
            return {"error": "해당 상권의 체류시간 데이터가 없습니다."}
        
        dwell_data = self.sample_data["dwell_time"][market_code]
        
        # 체류시간 등급 산정
        avg_time = dwell_data["average_dwell_time"]
        if avg_time >= 60:
            grade = "A"
            time_quality = "매우 우수"
        elif avg_time >= 45:
            grade = "B"
            time_quality = "우수"
        elif avg_time >= 30:
            grade = "C"
            time_quality = "보통"
        else:
            grade = "D"
            time_quality = "부족"
        
        return {
            "market_code": market_code,
            "average_dwell_time": avg_time,
            "peak_hours": dwell_data["peak_hours"],
            "weekend_ratio": dwell_data["weekend_ratio"],
            "grade": grade,
            "time_quality": time_quality,
            "analysis": self._get_dwell_time_analysis_text(avg_time, time_quality)
        }
    
    def calculate_health_score(self, market_code: str, industry: str = None) -> Dict[str, Any]:
        """상권 건강 점수 종합 산정"""
        # 각 지표별 점수 계산
        foot_traffic = self.get_foot_traffic_analysis(market_code)
        card_sales = self.get_card_sales_analysis(market_code)
        business_rates = self.get_business_rates_analysis(market_code)
        dwell_time = self.get_dwell_time_analysis(market_code)
        
        # 에러 체크
        if "error" in foot_traffic or "error" in card_sales or "error" in business_rates or "error" in dwell_time:
            return {"error": "일부 데이터를 가져올 수 없습니다."}
        
        # 동일업종 분석 (업종이 지정된 경우)
        same_industry = None
        if industry:
            same_industry = self.get_same_industry_analysis(market_code, industry)
            if "error" in same_industry:
                same_industry = None
        
        # 점수 변환 (A=100, B=80, C=60, D=40)
        grade_scores = {"A": 100, "B": 80, "C": 60, "D": 40}
        
        foot_traffic_score = grade_scores.get(foot_traffic["grade"], 60)
        card_sales_score = grade_scores.get(card_sales["grade"], 60)
        business_rates_score = business_rates["total_score"]
        dwell_time_score = grade_scores.get(dwell_time["grade"], 60)
        
        # 가중치 적용
        weights = {
            "foot_traffic": 0.25,
            "card_sales": 0.25,
            "business_rates": 0.25,
            "dwell_time": 0.15,
            "competition": 0.10
        }
        
        total_score = (
            foot_traffic_score * weights["foot_traffic"] +
            card_sales_score * weights["card_sales"] +
            business_rates_score * weights["business_rates"] +
            dwell_time_score * weights["dwell_time"]
        )
        
        # 경쟁도 점수 추가 (업종이 지정된 경우)
        if same_industry:
            competition_score = grade_scores.get(same_industry["grade"], 60)
            total_score += competition_score * weights["competition"]
        else:
            total_score = total_score / (1 - weights["competition"])  # 가중치 재조정
        
        # 최종 등급 산정
        if total_score >= 90:
            final_grade = "A"
            health_status = "매우 건강"
        elif total_score >= 80:
            final_grade = "B"
            health_status = "건강"
        elif total_score >= 70:
            final_grade = "C"
            health_status = "보통"
        elif total_score >= 60:
            final_grade = "D"
            health_status = "주의"
        else:
            final_grade = "F"
            health_status = "위험"
        
        return {
            "market_code": market_code,
            "industry": industry,
            "total_score": round(total_score, 2),
            "final_grade": final_grade,
            "health_status": health_status,
            "score_breakdown": {
                "foot_traffic": {
                    "score": foot_traffic_score,
                    "grade": foot_traffic["grade"],
                    "weight": weights["foot_traffic"]
                },
                "card_sales": {
                    "score": card_sales_score,
                    "grade": card_sales["grade"],
                    "weight": weights["card_sales"]
                },
                "business_rates": {
                    "score": business_rates_score,
                    "grade": business_rates["grade"],
                    "weight": weights["business_rates"]
                },
                "dwell_time": {
                    "score": dwell_time_score,
                    "grade": dwell_time["grade"],
                    "weight": weights["dwell_time"]
                }
            },
            "detailed_analysis": {
                "foot_traffic": foot_traffic,
                "card_sales": card_sales,
                "business_rates": business_rates,
                "dwell_time": dwell_time,
                "same_industry": same_industry
            },
            "recommendations": self._get_health_score_recommendations(total_score, final_grade)
        }
    
    def _get_foot_traffic_analysis_text(self, change_rate: float, grade: str) -> str:
        """유동인구 분석 텍스트 생성"""
        if grade == "A":
            return f"유동인구가 월평균 {change_rate:.1f}% 증가하여 매우 활발한 상권입니다."
        elif grade == "B":
            return f"유동인구가 월평균 {change_rate:.1f}% 증가하여 양호한 성장세를 보입니다."
        elif grade == "C":
            return f"유동인구가 월평균 {change_rate:.1f}% 변화하여 안정적인 상태입니다."
        else:
            return f"유동인구가 월평균 {change_rate:.1f}% 감소하여 주의가 필요합니다."
    
    def _get_card_sales_analysis_text(self, change_rate: float, grade: str) -> str:
        """카드매출 분석 텍스트 생성"""
        if grade == "A":
            return f"카드매출이 월평균 {change_rate:.1f}% 증가하여 소비활동이 매우 활발합니다."
        elif grade == "B":
            return f"카드매출이 월평균 {change_rate:.1f}% 증가하여 양호한 소비 트렌드를 보입니다."
        elif grade == "C":
            return f"카드매출이 월평균 {change_rate:.1f}% 변화하여 안정적인 소비 패턴입니다."
        else:
            return f"카드매출이 월평균 {change_rate:.1f}% 감소하여 소비력 저하가 우려됩니다."
    
    def _get_competition_analysis_text(self, ratio: float, level: str) -> str:
        """경쟁도 분석 텍스트 생성"""
        if level == "매우 높음":
            return f"동일업종 비율이 {ratio:.1f}%로 경쟁이 매우 치열합니다. 차별화 전략이 필수입니다."
        elif level == "높음":
            return f"동일업종 비율이 {ratio:.1f}%로 경쟁이 치열한 편입니다. 차별화가 필요합니다."
        elif level == "보통":
            return f"동일업종 비율이 {ratio:.1f}%로 적당한 경쟁 수준입니다."
        else:
            return f"동일업종 비율이 {ratio:.1f}%로 경쟁이 낮아 진입 기회가 좋습니다."
    
    def _get_business_rates_analysis_text(self, score: float, status: str) -> str:
        """창업·폐업 비율 분석 텍스트 생성"""
        if status == "매우 양호":
            return f"창업·폐업 비율이 매우 양호하여 상권 활력이 높습니다."
        elif status == "양호":
            return f"창업·폐업 비율이 양호하여 상권이 안정적으로 성장하고 있습니다."
        elif status == "보통":
            return f"창업·폐업 비율이 보통 수준으로 상권이 안정적입니다."
        else:
            return f"창업·폐업 비율에 우려가 있어 상권 활력 제고가 필요합니다."
    
    def _get_dwell_time_analysis_text(self, avg_time: float, quality: str) -> str:
        """체류시간 분석 텍스트 생성"""
        if quality == "매우 우수":
            return f"평균 체류시간이 {avg_time}분으로 매우 우수하여 고객 만족도가 높습니다."
        elif quality == "우수":
            return f"평균 체류시간이 {avg_time}분으로 우수한 편입니다."
        elif quality == "보통":
            return f"평균 체류시간이 {avg_time}분으로 보통 수준입니다."
        else:
            return f"평균 체류시간이 {avg_time}분으로 부족하여 고객 유치 전략이 필요합니다."
    
    def _get_health_score_recommendations(self, score: float, grade: str) -> List[str]:
        """건강 점수 기반 추천사항 생성"""
        recommendations = []
        
        if grade in ["A", "B"]:
            recommendations.extend([
                "현재 상권 상태가 양호합니다. 지속적인 모니터링을 권장합니다.",
                "기존 고객 유지와 신규 고객 확보에 집중하세요.",
                "상권 내 경쟁력을 유지하기 위한 차별화 전략을 수립하세요."
            ])
        elif grade == "C":
            recommendations.extend([
                "상권 상태가 보통 수준입니다. 개선 여지가 있습니다.",
                "유동인구 증가를 위한 마케팅 전략을 검토하세요.",
                "고객 체류시간 연장을 위한 서비스 개선을 고려하세요."
            ])
        else:
            recommendations.extend([
                "상권 상태에 주의가 필요합니다. 신중한 진입을 권장합니다.",
                "상권 활성화 방안을 면밀히 검토하세요.",
                "대안 상권 검토를 권장합니다."
            ])
        
        return recommendations
