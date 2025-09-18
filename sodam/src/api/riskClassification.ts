import apiClient from "./client.ts";

export interface RiskClassificationRequest {
  marketCode: string;
  industry?: string;
  businessStage?: string;
}

export interface RiskClassificationResponse {
  success: boolean;
  data: {
    marketCode: string;
    riskLevel: string;
    riskScore: number;
    riskFactors: Array<{
      factor: string;
      impact: number;
      description: string;
    }>;
    recommendations: Array<{
      category: string;
      action: string;
      priority: string;
    }>;
  };
  message: string;
  timestamp: string;
}

export interface RiskAnalysisRequest {
  marketCodes: string[];
  industry?: string;
}

export interface RiskAnalysisResponse {
  success: boolean;
  data: {
    results: Array<{
      marketCode: string;
      riskLevel: string;
      riskScore: number;
      riskFactors: string[];
    }>;
    summary: {
      riskDistribution: {
        [riskLevel: string]: number;
      };
      averageRiskScore: number;
      highRiskMarkets: string[];
      lowRiskMarkets: string[];
    };
  };
  message: string;
  timestamp: string;
}

export const riskClassificationAPI = {
  // 상권 리스크 분류
  classifyRisk: async (
    data: RiskClassificationRequest
  ): Promise<RiskClassificationResponse> => {
    const response = await apiClient.post(
      "/api/v1/risk-classification/classify",
      data
    );
    return response.data;
  },

  // 다중 상권 리스크 분석
  analyzeRisk: async (
    data: RiskAnalysisRequest
  ): Promise<RiskAnalysisResponse> => {
    const response = await apiClient.post(
      "/api/v1/risk-classification/analyze",
      data
    );
    return response.data;
  },
};
