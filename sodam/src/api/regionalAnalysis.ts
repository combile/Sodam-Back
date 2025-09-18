import apiClient from "./client.ts";

export interface RegionalData {
  region: string;
  population: number;
  averageIncome: number;
  rentCost: number;
  marketCount: number;
  businessDensity: number;
}

export interface RegionalAnalysisResponse {
  success: boolean;
  data: {
    regions: RegionalData[];
    summary: {
      totalRegions: number;
      totalPopulation: number;
      averageIncome: number;
      averageRentCost: number;
      totalMarkets: number;
    };
  };
  message: string;
  timestamp: string;
}

export interface RegionalDetailRequest {
  region: string;
}

export interface RegionalDetailResponse {
  success: boolean;
  data: {
    region: string;
    demographics: {
      population: number;
      ageDistribution: {
        "20s": number;
        "30s": number;
        "40s": number;
        "50s": number;
        "60+": number;
      };
      averageIncome: number;
    };
    economic: {
      rentCost: number;
      businessDensity: number;
      marketCount: number;
      averageRevenue: number;
    };
    trends: Array<{
      period: string;
      population: number;
      income: number;
      rentCost: number;
    }>;
    recommendations: string[];
  };
  message: string;
  timestamp: string;
}

export const regionalAnalysisAPI = {
  // 지역별 분석 데이터 조회
  getRegionalAnalysis: async (): Promise<RegionalAnalysisResponse> => {
    const response = await apiClient.get("/api/v1/regional-analysis/");
    return response.data;
  },

  // 지역별 인구 데이터 조회
  getPopulationData: async (region?: string, ageGroup?: string) => {
    const params = new URLSearchParams();
    if (region) params.append("region", region);
    if (ageGroup) params.append("age_group", ageGroup);

    const response = await apiClient.get(
      `/api/v1/regional-analysis/population?${params.toString()}`
    );
    return response.data;
  },

  // 지역별 임대료 데이터 조회
  getRentRates: async (region?: string, propertyType?: string) => {
    const params = new URLSearchParams();
    if (region) params.append("region", region);
    if (propertyType) params.append("property_type", propertyType);

    const response = await apiClient.get(
      `/api/v1/regional-analysis/rent-rates?${params.toString()}`
    );
    return response.data;
  },

  // 지역별 상권 밀도 조회
  getMarketDensity: async (region?: string) => {
    const params = new URLSearchParams();
    if (region) params.append("region", region);

    const response = await apiClient.get(
      `/api/v1/regional-analysis/market-density?${params.toString()}`
    );
    return response.data;
  },

  // 지역별 인구 통계 조회
  getDemographics: async (region?: string) => {
    const params = new URLSearchParams();
    if (region) params.append("region", region);

    const response = await apiClient.get(
      `/api/v1/regional-analysis/demographics?${params.toString()}`
    );
    return response.data;
  },

  // 지역별 경제 지표 조회
  getEconomicIndicators: async (region?: string) => {
    const params = new URLSearchParams();
    if (region) params.append("region", region);

    const response = await apiClient.get(
      `/api/v1/regional-analysis/economic-indicators?${params.toString()}`
    );
    return response.data;
  },

  // 특정 지역 상세 분석
  getRegionalDetail: async (
    data: RegionalDetailRequest
  ): Promise<RegionalDetailResponse> => {
    const response = await apiClient.post(
      "/api/v1/regional-analysis/detail",
      data
    );
    return response.data;
  },
};
