import apiClient from "./client.ts";

export interface StrategyCardRequest {
  marketCode: string;
  industry?: string;
  businessStage?: string;
  userPreferences?: {
    budget?: number;
    experience?: string;
    riskTolerance?: string;
  };
}

export interface StrategyCard {
  id: string;
  title: string;
  category: string;
  description: string;
  priority: string;
  estimatedCost: number;
  expectedROI: number;
  riskLevel: string;
  timeline: string;
  requirements: string[];
  benefits: string[];
  challenges: string[];
}

export interface StrategyCardsResponse {
  success: boolean;
  data: {
    marketCode: string;
    strategyCards: StrategyCard[];
    summary: {
      totalCards: number;
      highPriorityCards: number;
      averageCost: number;
      averageROI: number;
    };
  };
  message: string;
  timestamp: string;
}

export interface StrategyCardDetailRequest {
  cardId: string;
  marketCode: string;
}

export interface StrategyCardDetailResponse {
  success: boolean;
  data: {
    card: StrategyCard;
    implementation: {
      steps: Array<{
        step: number;
        title: string;
        description: string;
        duration: string;
        cost: number;
      }>;
      resources: Array<{
        type: string;
        name: string;
        description: string;
        cost: number;
        necessity: string;
      }>;
    };
    successFactors: string[];
    riskMitigation: string[];
  };
  message: string;
  timestamp: string;
}

export const strategyCardsAPI = {
  // 전략 카드 목록 조회
  getStrategyCards: async (
    data: StrategyCardRequest
  ): Promise<StrategyCardsResponse> => {
    const response = await apiClient.post("/api/v1/strategy-cards/", data);
    return response.data;
  },

  // 전략 카드 상세 정보
  getStrategyCardDetail: async (
    data: StrategyCardDetailRequest
  ): Promise<StrategyCardDetailResponse> => {
    const response = await apiClient.post(
      "/api/v1/strategy-cards/detail",
      data
    );
    return response.data;
  },
};
