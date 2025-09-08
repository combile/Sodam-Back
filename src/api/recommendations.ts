import apiClient from "./client.ts";

export interface ScoreRequest {
  features: {
    foot_traffic: number;
    competition: number;
    rent_cost: number;
    accessibility: number;
    demographics: number;
  };
}

export interface ScoreResponse {
  score: number;
  recommendation: string;
  factors: {
    positive: string[];
    negative: string[];
  };
}

export interface SampleData {
  features: {
    foot_traffic: number;
    competition: number;
    rent_cost: number;
    accessibility: number;
    demographics: number;
  };
  location: string;
  business_type: string;
}

export const recommendationsAPI = {
  // 점수 계산
  calculateScore: async (data: ScoreRequest): Promise<ScoreResponse> => {
    const response = await apiClient.post("/api/v1/recs/score", data);
    return response.data;
  },

  // 샘플 데이터 가져오기
  getSampleData: async (): Promise<SampleData[]> => {
    const response = await apiClient.get("/api/v1/recs/sample");
    return response.data;
  },
};
