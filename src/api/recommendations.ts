import apiClient from "./client.ts";

export interface ScoreRequest {
  features: {
    foot_traffic: number;
    competitors_500m: number;
    avg_income: number;
    rent_cost: number;
    age_20s_ratio: number;
  };
}

export interface ScoreResponse {
  score: number;
  breakdown: {
    [key: string]: {
      value: number;
      weight: number;
      contrib: number;
    };
  };
}

export interface SampleData {
  area_id: string;
  area_name: string;
  features: {
    foot_traffic: number;
    competitors_500m: number;
    avg_income: number;
    rent_cost: number;
    age_20s_ratio: number;
  };
  score: number;
  breakdown: {
    [key: string]: {
      value: number;
      weight: number;
      contrib: number;
    };
  };
}

export const recommendationsAPI = {
  // 점수 계산
  calculateScore: async (data: ScoreRequest): Promise<ScoreResponse> => {
    const response = await apiClient.post("/api/v1/recs/score", data);
    return response.data;
  },

  // 샘플 데이터 가져오기
  getSampleData: async (): Promise<{ items: SampleData[] }> => {
    const response = await apiClient.get("/api/v1/recs/sample");
    return response.data;
  },
};
