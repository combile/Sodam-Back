import apiClient from "./client.ts";

export interface IndustryData {
  industry: string;
  survivalRate: number;
  closureRate: number;
  averageRevenue: number;
  riskLevel: string;
  marketCount: number;
}

export interface IndustryAnalysisResponse {
  success: boolean;
  data: {
    industries: IndustryData[];
    summary: {
      totalIndustries: number;
      averageSurvivalRate: number;
      averageClosureRate: number;
      highRiskIndustries: string[];
      lowRiskIndustries: string[];
    };
  };
  message: string;
  timestamp: string;
}

export interface IndustryDetailRequest {
  industry: string;
  region?: string;
}

export interface IndustryDetailResponse {
  success: boolean;
  data: {
    industry: string;
    region?: string;
    statistics: {
      totalBusinesses: number;
      survivalRate: number;
      closureRate: number;
      averageRevenue: number;
      riskLevel: string;
    };
    trends: Array<{
      period: string;
      survivalRate: number;
      closureRate: number;
      revenue: number;
    }>;
    recommendations: string[];
  };
  message: string;
  timestamp: string;
}

export const industryAnalysisAPI = {
  // 업종별 분석 데이터 조회
  getIndustryAnalysis: async (): Promise<IndustryAnalysisResponse> => {
    const response = await apiClient.get("/api/v1/industry-analysis/");
    return response.data;
  },

  // 특정 업종 상세 분석
  getIndustryDetail: async (
    data: IndustryDetailRequest
  ): Promise<IndustryDetailResponse> => {
    const response = await apiClient.post(
      "/api/v1/industry-analysis/detail",
      data
    );
    return response.data;
  },
};
