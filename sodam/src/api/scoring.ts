import apiClient from "./client.ts";

export interface ScoringRequest {
  marketCode: string;
  weights?: {
    footTraffic?: number;
    sales?: number;
    competitors?: number;
    businessRates?: number;
    dwellTime?: number;
  };
}

export interface ScoringResponse {
  success: boolean;
  data: {
    marketCode: string;
    score: number;
    grade: string;
    breakdown: {
      footTraffic: number;
      sales: number;
      competitors: number;
      businessRates: number;
      dwellTime: number;
    };
    recommendations: string[];
  };
  message: string;
  timestamp: string;
}

export interface BatchScoringRequest {
  marketCodes: string[];
  weights?: {
    footTraffic?: number;
    sales?: number;
    competitors?: number;
    businessRates?: number;
    dwellTime?: number;
  };
}

export interface BatchScoringResponse {
  success: boolean;
  data: {
    results: Array<{
      marketCode: string;
      score: number;
      grade: string;
      breakdown: {
        footTraffic: number;
        sales: number;
        competitors: number;
        businessRates: number;
        dwellTime: number;
      };
    }>;
    summary: {
      averageScore: number;
      highestScore: string;
      lowestScore: string;
      gradeDistribution: {
        [grade: string]: number;
      };
    };
  };
  message: string;
  timestamp: string;
}

export const scoringAPI = {
  // 단일 상권 점수 계산
  calculateScore: async (data: ScoringRequest): Promise<ScoringResponse> => {
    const response = await apiClient.post("/api/v1/scoring/calculate", data);
    return response.data;
  },

  // 배치 점수 계산 (여러 상권 비교)
  calculateBatchScore: async (
    data: BatchScoringRequest
  ): Promise<BatchScoringResponse> => {
    const response = await apiClient.post("/api/v1/scoring/batch", data);
    return response.data;
  },
};
