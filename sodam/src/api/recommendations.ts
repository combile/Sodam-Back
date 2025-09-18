import apiClient from "./client.ts";

export interface RecommendationRequest {
  marketCode: string;
  industry?: string;
  businessStage?: string;
  userPreferences?: {
    budget?: number;
    experience?: string;
    riskTolerance?: string;
    preferredAreas?: string[];
  };
}

export interface Recommendation {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: string;
  confidence: number;
  estimatedCost?: number;
  expectedROI?: number;
  timeline?: string;
  requirements?: string[];
  benefits?: string[];
  risks?: string[];
}

export interface RecommendationsResponse {
  success: boolean;
  data: {
    marketCode: string;
    recommendations: Recommendation[];
    summary: {
      totalRecommendations: number;
      highPriorityCount: number;
      averageConfidence: number;
      categories: string[];
    };
  };
  message: string;
  timestamp: string;
}

export interface RecommendationDetailRequest {
  recommendationId: string;
  marketCode: string;
}

export interface RecommendationDetailResponse {
  success: boolean;
  data: {
    recommendation: Recommendation;
    implementation: {
      steps: Array<{
        step: number;
        title: string;
        description: string;
        duration: string;
        cost?: number;
      }>;
      resources: Array<{
        type: string;
        name: string;
        description: string;
        cost?: number;
        necessity: string;
      }>;
    };
    successFactors: string[];
    riskMitigation: string[];
    alternatives: Array<{
      id: string;
      title: string;
      description: string;
      pros: string[];
      cons: string[];
    }>;
  };
  message: string;
  timestamp: string;
}

export const recommendationsAPI = {
  // 추천 사업 조회
  getRecommendations: async (
    data: RecommendationRequest
  ): Promise<RecommendationsResponse> => {
    const response = await apiClient.post("/api/v1/recommendations/", data);
    return response.data;
  },

  // 추천 사업 상세 정보
  getRecommendationDetail: async (
    data: RecommendationDetailRequest
  ): Promise<RecommendationDetailResponse> => {
    const response = await apiClient.post(
      "/api/v1/recommendations/detail",
      data
    );
    return response.data;
  },
};
