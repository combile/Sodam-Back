#!/usr/bin/env python3
"""
데이터 로더 서비스
CSV 파일들을 로드하고 전처리하는 서비스
"""
import pandas as pd
import os
import json
from typing import Dict, List, Any, Optional

class DataLoader:
    def __init__(self):
        self.data_dir = os.path.join(os.path.dirname(__file__), '..', 'csv')
        self._cache = {}
    
    def load_market_data(self) -> pd.DataFrame:
        """상권 데이터 로드"""
        if 'market_data' in self._cache:
            return self._cache['market_data']
        
        file_path = os.path.join(self.data_dir, 'market_data.csv')
        try:
            # CSV 파일 로드 (인코딩 문제 해결)
            encodings = ['utf-8', 'cp949', 'euc-kr', 'latin1']
            df = None
            for encoding in encodings:
                try:
                    df = pd.read_csv(file_path, encoding=encoding)
                    break
                except UnicodeDecodeError:
                    continue
            
            if df is None:
                raise Exception("모든 인코딩 시도 실패")
            
            # 컬럼명 정리 (실제 CSV 구조에 맞게)
            df.columns = ['market_code', 'market_name', 'market_type', 'city_code', 
                         'city_name', 'district_code', 'district_name', 
                         'coordinate_count', 'coordinates', 'data_date']
            
            # 좌표 데이터 파싱
            df['coordinates'] = df['coordinates'].apply(self._parse_coordinates)
            
            self._cache['market_data'] = df
            return df
        except Exception as e:
            print(f"상권 데이터 로드 실패: {e}")
            return pd.DataFrame()
    
    def load_tourism_consumption(self) -> pd.DataFrame:
        """관광 소비 데이터 로드"""
        if 'tourism_consumption' in self._cache:
            return self._cache['tourism_consumption']
        
        file_path = os.path.join(self.data_dir, 'tourism_consumption.csv')
        try:
            df = pd.read_csv(file_path, encoding='utf-8')
            
            # 컬럼명 정리 (실제 CSV 구조에 맞게)
            df.columns = ['year_month', 'region', 'category', 'consumption_amount']
            
            # 소비액을 숫자로 변환
            df['consumption_amount'] = pd.to_numeric(df['consumption_amount'], errors='coerce')
            
            self._cache['tourism_consumption'] = df
            return df
        except Exception as e:
            print(f"관광 소비 데이터 로드 실패: {e}")
            return pd.DataFrame()
    
    def load_industry_expenditure(self) -> pd.DataFrame:
        """업종별 지출액 데이터 로드"""
        if 'industry_expenditure' in self._cache:
            return self._cache['industry_expenditure']
        
        file_path = os.path.join(self.data_dir, 'industry_expenditure.csv')
        try:
            df = pd.read_csv(file_path, encoding='utf-8')
            
            # 컬럼명 정리 (실제 CSV 구조에 맞게)
            df.columns = ['major_category', 'minor_category', 'major_ratio', 'minor_ratio']
            
            # 비율을 숫자로 변환
            df['major_ratio'] = pd.to_numeric(df['major_ratio'], errors='coerce')
            df['minor_ratio'] = pd.to_numeric(df['minor_ratio'], errors='coerce')
            
            self._cache['industry_expenditure'] = df
            return df
        except Exception as e:
            print(f"업종별 지출액 데이터 로드 실패: {e}")
            return pd.DataFrame()
    
    def load_regional_expenditure(self) -> pd.DataFrame:
        """지역별 지출액 데이터 로드"""
        if 'regional_expenditure' in self._cache:
            return self._cache['regional_expenditure']
        
        file_path = os.path.join(self.data_dir, 'regional_expenditure.csv')
        try:
            df = pd.read_csv(file_path, encoding='utf-8')
            
            # 컬럼명 정리 (실제 CSV 구조에 맞게)
            df.columns = ['region', 'expenditure_ratio']
            
            # 비율을 숫자로 변환
            df['expenditure_ratio'] = pd.to_numeric(df['expenditure_ratio'], errors='coerce')
            
            self._cache['regional_expenditure'] = df
            return df
        except Exception as e:
            print(f"지역별 지출액 데이터 로드 실패: {e}")
            return pd.DataFrame()
    
    def _parse_coordinates(self, coord_string: str) -> List[Dict[str, float]]:
        """좌표 문자열을 파싱하여 좌표 리스트로 변환"""
        try:
            if pd.isna(coord_string) or not coord_string:
                return []
            
            import re
            
            # 좌표 문자열 파싱 (예: "127.336177188568|36.2980852615076127.335920649761|36.2978275312051...")
            coord_string = str(coord_string)
            
            # 정규식으로 좌표 쌍 추출 (경도|위도 패턴)
            # 좌표는 보통 127.xxx|36.xxx 형태
            pattern = r'(127\.\d+)\|(36\.\d+)'
            matches = re.findall(pattern, coord_string)
            
            coordinate_pairs = []
            for match in matches:
                try:
                    lng = float(match[0])
                    lat = float(match[1])
                    coordinate_pairs.append({'lng': lng, 'lat': lat})
                except ValueError:
                    continue
            
            return coordinate_pairs
        except Exception as e:
            print(f"좌표 파싱 실패: {e}")
            return []
    
    def get_market_by_code(self, market_code: str) -> Optional[Dict[str, Any]]:
        """상권 코드로 상권 정보 조회"""
        df = self.load_market_data()
        if df.empty:
            return None
        
        market = df[df['market_code'].astype(str) == str(market_code)]
        if market.empty:
            return None
        
        market_info = market.iloc[0].to_dict()
        return {
            'market_code': market_info['market_code'],
            'market_name': market_info['market_name'],
            'city_name': market_info['city_name'],
            'district_name': market_info['district_name'],
            'market_type': market_info['market_type'],
            'coordinates': market_info['coordinates']
        }
    
    def get_markets_by_district(self, district: str) -> List[Dict[str, Any]]:
        """지역구별 상권 목록 조회"""
        df = self.load_market_data()
        if df.empty:
            return []
        
        markets = df[df['district_name'] == district]
        return markets.to_dict('records')
    
    def get_tourism_trend(self, region: str = "대전광역시") -> List[Dict[str, Any]]:
        """관광 소비 트렌드 조회 - 위치별 실제 데이터"""
        df = self.load_tourism_consumption()
        if df.empty:
            return []
        
        # 해당 지역의 관광총소비 데이터만 필터링
        tourism_data = df[(df['region'] == region) & (df['category'] == '관광총소비')]
        
        # 최신 12개월 데이터
        trend_data = tourism_data.tail(12).to_dict('records')
        
        return trend_data
    
    def get_tourism_trend_by_industry(self, region: str, industry: str) -> List[Dict[str, Any]]:
        """업종별 관광 소비 트렌드 조회 - 위치별, 업종별 실제 데이터"""
        df = self.load_tourism_consumption()
        if df.empty:
            return []
        
        # 업종 매핑 (실제 데이터의 카테고리명 사용)
        industry_mapping = {
            "쇼핑업": "대형쇼핑몰",  # 쇼핑업의 대표 카테고리
            "숙박업": "호텔",  # 숙박업의 대표 카테고리
            "식음료업": "식음료",
            "여가서비스업": "관광유원시설",  # 여가서비스업의 대표 카테고리
            "여행업": "여행업",
            "운송업": "육상운송"  # 운송업의 대표 카테고리
        }
        
        category = industry_mapping.get(industry, "관광총소비")
        
        # 해당 지역과 업종의 데이터 필터링
        tourism_data = df[(df['region'] == region) & (df['category'] == category)]
        
        # 최신 12개월 데이터
        trend_data = tourism_data.tail(12).to_dict('records')
        
        return trend_data
    
    def get_industry_ratios(self) -> List[Dict[str, Any]]:
        """업종별 지출액 비율 조회"""
        df = self.load_industry_expenditure()
        if df.empty:
            return []
        
        return df.to_dict('records')
    
    def get_industry_ratio_by_category(self, major_category: str, minor_category: str = None) -> Dict[str, float]:
        """특정 업종의 지출액 비율 조회"""
        df = self.load_industry_expenditure()
        if df.empty:
            return {"major_ratio": 0.0, "minor_ratio": 0.0}
        
        # 대분류 필터링
        major_data = df[df['major_category'] == major_category]
        if major_data.empty:
            return {"major_ratio": 0.0, "minor_ratio": 0.0}
        
        major_ratio = major_data.iloc[0]['major_ratio'] if not major_data.empty else 0.0
        
        # 중분류 필터링 (있는 경우)
        minor_ratio = 0.0
        if minor_category:
            minor_data = major_data[major_data['minor_category'] == minor_category]
            if not minor_data.empty:
                minor_ratio = minor_data.iloc[0]['minor_ratio']
        
        return {
            "major_ratio": major_ratio,
            "minor_ratio": minor_ratio
        }
    
    def get_regional_ratios(self) -> List[Dict[str, Any]]:
        """지역별 지출액 비율 조회"""
        df = self.load_regional_expenditure()
        if df.empty:
            return []
        
        return df.to_dict('records')
    
    def get_regional_ratio_by_region(self, region: str) -> float:
        """특정 지역의 지출액 비율 조회"""
        df = self.load_regional_expenditure()
        if df.empty:
            return 0.0
        
        region_data = df[df['region'] == region]
        if region_data.empty:
            return 0.0
        
        return region_data.iloc[0]['expenditure_ratio']
    
    def get_tourism_consumption_data(self) -> pd.DataFrame:
        """관광 소비액 데이터 로드"""
        try:
            file_path = os.path.join(self.data_dir, 'tourism_consumption.csv')
            df = pd.read_csv(file_path, encoding='utf-8')
            
            # 컬럼명 정리
            df.columns = ['year_month', 'region', 'category', 'consumption_amount']
            
            # 소비액을 숫자로 변환 (과학적 표기법 처리)
            df['consumption_amount'] = pd.to_numeric(df['consumption_amount'], errors='coerce')
            
            return df
        except Exception as e:
            print(f"관광 소비액 데이터 로드 실패: {e}")
            return pd.DataFrame()
    
    def estimate_foot_traffic_from_tourism(self, market_name: str, district_name: str) -> int:
        """관광 소비액 데이터를 기반으로 유동인구 추정"""
        try:
            df = self.get_tourism_consumption_data()
            if df.empty:
                return 1000  # 기본값
            
            # 최신 월의 관광총소비 데이터
            latest_data = df[df['category'] == '관광총소비'].tail(1)
            if latest_data.empty:
                return 1000
            
            # 기본 관광 소비액 (천원 단위)
            base_consumption = latest_data.iloc[0]['consumption_amount']
            
            # 상권별 특성에 따른 가중치
            weight = 1.0
            if "역" in market_name:
                weight = 3.0  # 역 근처는 유동인구 많음
            elif "터미널" in market_name:
                weight = 2.5  # 터미널 근처
            elif "대학" in market_name or "캠퍼스" in market_name:
                weight = 2.0  # 대학가
            elif "시장" in market_name:
                weight = 1.8  # 전통시장
            elif "상가" in market_name or "상권" in market_name:
                weight = 1.5  # 일반 상가
            
            # 지역별 가중치
            district_weights = {
                '서구': 1.2,  # 서구는 인구 많음
                '유성구': 1.3,  # 유성구는 대학가
                '중구': 1.1,  # 중구는 도심
                '동구': 1.0,  # 기본값
                '대덕구': 0.9  # 대덕구는 상대적으로 적음
            }
            district_weight = district_weights.get(district_name, 1.0)
            
            # 유동인구 추정 (관광 소비액을 기반으로 한 더 현실적인 추정)
            # 기본 관광 소비액을 1000으로 나누어 일일 유동인구 추정
            base_traffic = int(base_consumption / 1000000)  # 기본 유동인구
            
            # 상권별, 지역별 가중치 적용
            estimated_traffic = int(base_traffic * weight * district_weight)
            
            # 상권명에 따른 추가 변동 (더 다양성을 위해)
            name_variation = hash(market_name) % 1000  # 0-999 범위의 변동
            estimated_traffic += name_variation
            
            # 최소/최대값 제한
            estimated_traffic = max(1000, min(estimated_traffic, 15000))
            
            return estimated_traffic
            
        except Exception as e:
            print(f"유동인구 추정 실패: {e}")
            return 1000
    
    def get_regional_population_data(self) -> pd.DataFrame:
        """지역별 주거인구 데이터 로드"""
        try:
            file_path = os.path.join(self.data_dir, 'regional_population.xlsx')
            
            # Excel 파일 읽기 (.xlsx 파일은 openpyxl 사용)
            if file_path.endswith('.xlsx'):
                try:
                    df = pd.read_excel(file_path, engine='openpyxl')
                except ImportError as e:
                    print(f"openpyxl import 오류: {e}")
                    print("openpyxl을 설치하세요: pip install openpyxl")
                    return pd.DataFrame()
                except Exception as e:
                    print(f"openpyxl로 Excel 파일 읽기 실패: {e}")
                    # xlrd로 재시도
                    try:
                        df = pd.read_excel(file_path, engine='xlrd')
                    except Exception as e2:
                        print(f"xlrd로도 읽기 실패: {e2}")
                        return pd.DataFrame()
            else:
                df = pd.read_excel(file_path, engine='xlrd')
            
            # 실제 Excel 파일의 컬럼명에 맞게 매핑
            # ['기준년월', '시도 명', '시군구 명', '읍면동 명', '총인구수(명)', ...]
            column_mapping = {
                '기준년월': 'year_month',
                '시도 명': 'city', 
                '시군구 명': 'district',
                '읍면동 명': 'dong',
                '총인구수(명)': 'total_population'
            }
            
            # 컬럼명 변경
            df = df.rename(columns=column_mapping)
            
            # 총인구수를 숫자로 변환 (콤마 제거)
            if 'total_population' in df.columns:
                df['total_population'] = df['total_population'].astype(str).str.replace(',', '').astype(int)
            
            print(f"지역별 주거인구 데이터 로드 성공: {df.shape[0]}행")
            return df
        except Exception as e:
            print(f"지역별 주거인구 데이터 로드 실패: {e}")
            import traceback
            traceback.print_exc()
            return pd.DataFrame()
    
    def get_district_population_summary(self, region: str = "대전시 전체") -> List[Dict[str, Any]]:
        """지역구별 주거인구 요약 데이터 조회"""
        try:
            df = self.get_regional_population_data()
            if df.empty:
                return []
            
            # 대전 데이터만 필터링
            df = df[df['city'] == '대전광역시']
            
            # 최신 데이터만 사용 (기준년월이 가장 큰 값)
            if 'year_month' in df.columns:
                latest_month = df['year_month'].max()
                df = df[df['year_month'] == latest_month]
                print(f"주거인구 데이터: {latest_month} 기준 사용")
            
            # 남녀구분이 있는 경우, 동별로 합계를 구한 후 지역구별로 집계
            # (남성+여성 데이터가 따로 있어서 중복 계산 방지)
            if '남녀구분' in df.columns:
                # 동별로 남녀 인구 합계 계산
                df_dong_summary = df.groupby(['district', 'dong'])['total_population'].sum().reset_index()
                # 지역구별로 다시 집계
                district_data = df_dong_summary.groupby('district')['total_population'].sum()
            else:
                # 남녀구분이 없는 경우 기존 방식 사용
                if region != "자치구 전체" and region != "대전시 전체":
                    # 특정 지역구만
                    district_data = df[df['district'] == region].groupby('district')['total_population'].sum()
                else:
                    # 모든 지역구
                    district_data = df.groupby('district')['total_population'].sum()
            
            # 특정 지역구만 요청한 경우 필터링
            if region != "자치구 전체" and region != "대전시 전체":
                if region in district_data.index:
                    district_data = district_data[[region]]
                else:
                    return []
            
            # 결과 정리
            population_data = []
            max_population = district_data.max() if len(district_data) > 0 else 1
            
            for district, population in district_data.items():
                population_data.append({
                    "name": district,
                    "population": population,
                    "percentage": (population / max_population) * 100
                })
            
            # 인구수 기준으로 정렬 (내림차순)
            population_data.sort(key=lambda x: x['population'], reverse=True)
            
            return population_data
            
        except Exception as e:
            print(f"지역구별 주거인구 요약 조회 실패: {e}")
            return []
    
    def load_daejeon_market_info(self) -> pd.DataFrame:
        """대전 상권정보.csv 로드"""
        if 'daejeon_market_info' in self._cache:
            return self._cache['daejeon_market_info']
        
        file_path = os.path.join(self.data_dir, '소상공인시장진흥공단_상가정보', '대전 상권정보.csv')
        try:
            df = pd.read_csv(file_path, encoding='utf-8')
            
            # 좌표 데이터 정리 (경도, 위도 컬럼이 있음)
            df['경도'] = pd.to_numeric(df['경도'], errors='coerce')
            df['위도'] = pd.to_numeric(df['위도'], errors='coerce')
            
            # 결측값 제거
            df = df.dropna(subset=['경도', '위도'])
            
            self._cache['daejeon_market_info'] = df
            return df
        except Exception as e:
            print(f"대전 상권정보 데이터 로드 실패: {e}")
            return pd.DataFrame()
    
    def get_businesses_by_market(self, market_code: str) -> List[Dict[str, Any]]:
        """상권 코드로 업소 목록 조회"""
        df = self.load_daejeon_market_info()
        if df.empty:
            return []
        
        # 상권 코드로 필터링 (시군구코드 사용)
        businesses = df[df['시군구코드'] == market_code]
        
        return businesses.to_dict('records')
    
    def get_businesses_by_industry(self, industry_code: str) -> List[Dict[str, Any]]:
        """업종 코드로 업소 목록 조회"""
        df = self.load_daejeon_market_info()
        if df.empty:
            return []
        
        # 업종 코드로 필터링
        businesses = df[df['상권업종대분류코드'] == industry_code]
        
        return businesses.to_dict('records')
    
    def get_businesses_by_district(self, district: str) -> List[Dict[str, Any]]:
        """지역구별 업소 목록 조회"""
        df = self.load_daejeon_market_info()
        if df.empty:
            return []
        
        # 지역구로 필터링
        businesses = df[df['시군구명'] == district]
        
        return businesses.to_dict('records')
    
    def search_businesses(self, search_term: str) -> List[Dict[str, Any]]:
        """업소명으로 검색"""
        df = self.load_daejeon_market_info()
        if df.empty or not search_term:
            return []
        
        # 상호명으로 검색 (대소문자 구분 없음)
        businesses = df[df['상호명'].str.contains(search_term, case=False, na=False)]
        
        return businesses.head(50).to_dict('records')  # 최대 50개만 반환
    
    def get_competition_analysis(self, market_code: str, industry_code: str = None) -> Dict[str, Any]:
        """경쟁 업소 분석"""
        df = self.load_daejeon_market_info()
        if df.empty:
            return {"total_businesses": 0, "industry_breakdown": [], "competition_score": 0}
        
        # 상권 내 업소 필터링
        market_businesses = df[df['시군구코드'] == market_code]
        
        if market_businesses.empty:
            return {"total_businesses": 0, "industry_breakdown": [], "competition_score": 0}
        
        # 업종별 집계
        industry_breakdown = market_businesses.groupby(['상권업종대분류명', '상권업종중분류명']).size().reset_index(name='count')
        industry_breakdown = industry_breakdown.sort_values('count', ascending=False).head(10)
        
        # 특정 업종 경쟁도 계산
        competition_score = 0
        if industry_code:
            specific_industry = market_businesses[market_businesses['상권업종대분류코드'] == industry_code]
            competition_score = len(specific_industry)
        
        return {
            "total_businesses": len(market_businesses),
            "industry_breakdown": industry_breakdown.to_dict('records'),
            "competition_score": competition_score,
            "market_name": market_businesses.iloc[0]['시군구명'] if not market_businesses.empty else ""
        }
    
    def get_business_density_heatmap(self, region: str = None) -> List[Dict[str, Any]]:
        """업소 밀도 히트맵 데이터 생성"""
        df = self.load_daejeon_market_info()
        if df.empty:
            return []
        
        # 지역 필터링
        if region:
            df = df[df['시군구명'] == region]
        
        # 행정동별 업소 수 집계
        density_data = df.groupby(['시군구명', '행정동명', '경도', '위도']).size().reset_index(name='business_count')
        
        # 밀도 점수 계산 (0-1 범위로 정규화)
        max_count = density_data['business_count'].max()
        density_data['density_score'] = density_data['business_count'] / max_count if max_count > 0 else 0
        
        return density_data.to_dict('records')
    
    def get_industry_distribution(self, region: str = None) -> Dict[str, Any]:
        """업종별 분포 분석"""
        df = self.load_daejeon_market_info()
        if df.empty:
            return {"industries": [], "total_businesses": 0}
        
        # 지역 필터링
        if region:
            df = df[df['시군구명'] == region]
        
        # 업종별 집계
        industry_dist = df.groupby('상권업종대분류명').size().reset_index(name='count')
        industry_dist = industry_dist.sort_values('count', ascending=False)
        
        # 비율 계산
        total = industry_dist['count'].sum()
        industry_dist['percentage'] = (industry_dist['count'] / total * 100).round(2)
        
        return {
            "industries": industry_dist.to_dict('records'),
            "total_businesses": int(total),  # numpy 타입을 int로 변환
            "region": region or "전체"
        }

    def get_industry_categories(self) -> List[Dict]:
        """업종 대분류 목록 반환"""
        try:
            df = self.load_daejeon_market_info()
            
            # 업종 대분류 코드와 이름 조합
            categories = df[['상권업종대분류코드', '상권업종대분류명']].drop_duplicates()
            categories = categories.sort_values('상권업종대분류명')
            
            result = []
            for _, row in categories.iterrows():
                result.append({
                    'code': row['상권업종대분류코드'],
                    'name': row['상권업종대분류명']
                })
            
            return result
        except Exception as e:
            print(f"Error in get_industry_categories: {e}")
            return []

    def get_districts(self) -> List[Dict]:
        """시군구 목록 반환"""
        try:
            df = self.load_daejeon_market_info()
            
            # 시군구 코드와 이름 조합
            districts = df[['시군구코드', '시군구명']].drop_duplicates()
            districts = districts.sort_values('시군구명')
            
            result = []
            for _, row in districts.iterrows():
                result.append({
                    'code': row['시군구코드'],
                    'name': row['시군구명']
                })
            
            return result
        except Exception as e:
            print(f"Error in get_districts: {e}")
            return []

    def get_administrative_dongs(self, district: str = None) -> List[Dict]:
        """행정동 목록 반환 (시군구 필터링 가능)"""
        try:
            df = self.load_daejeon_market_info()
            
            if district:
                df = df[df['시군구명'] == district]
            
            # 행정동 코드와 이름 조합
            dongs = df[['행정동코드', '행정동명', '시군구명']].drop_duplicates()
            dongs = dongs.sort_values(['시군구명', '행정동명'])
            
            result = []
            for _, row in dongs.iterrows():
                result.append({
                    'code': row['행정동코드'],
                    'name': row['행정동명'],
                    'district': row['시군구명']
                })
            
            return result
        except Exception as e:
            print(f"Error in get_administrative_dongs: {e}")
            return []

    def search_locations(self, search_term: str) -> List[Dict]:
        """지역 검색 (시군구, 행정동 검색)"""
        try:
            df = self.load_daejeon_market_info()
            
            # 검색어가 포함된 행정동과 시군구 검색
            if search_term:
                district_matches = df[df['시군구명'].str.contains(search_term, na=False, case=False)]
                dong_matches = df[df['행정동명'].str.contains(search_term, na=False, case=False)]
                
                # 중복 제거하고 결합
                all_matches = pd.concat([district_matches, dong_matches]).drop_duplicates()
            else:
                all_matches = df
            
            # 결과 정리
            locations = all_matches[['시군구코드', '시군구명', '행정동코드', '행정동명']].drop_duplicates()
            locations = locations.sort_values(['시군구명', '행정동명'])
            
            result = []
            for _, row in locations.head(50).iterrows():  # 상위 50개만 반환
                result.append({
                    'district_code': row['시군구코드'],
                    'district_name': row['시군구명'],
                    'dong_code': row['행정동코드'],
                    'dong_name': row['행정동명'],
                    'full_name': f"{row['시군구명']} {row['행정동명']}"
                })
            
            return result
        except Exception as e:
            print(f"Error in search_locations: {e}")
            return []
    
    def clear_cache(self):
        """캐시 초기화"""
        self._cache.clear()
