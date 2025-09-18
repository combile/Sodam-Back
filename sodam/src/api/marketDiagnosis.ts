import apiClient from "./client.ts";

export interface Market {
  id: number;
  name: string;
  area: string;
  code: string;
}

export interface MarketDetail {
  id: number;
  name: string;
  area: string;
  code: string;
  footTraffic?: number;
  sales?: number;
  competitors?: number;
  healthScore?: number;
}

export interface MarketListResponse {
  success: boolean;
  data: Market[];
  message: string;
  timestamp: string;
}

export interface MarketDetailResponse {
  success: boolean;
  data: MarketDetail;
  message: string;
  timestamp: string;
}

export interface MarketAnalysisRequest {
  region: string;
  analysisType: "district" | "market";
  indicator: "stores" | "sales" | "footTraffic" | "residents";
  period: string;
}

export interface MarketAnalysisData {
  id: string;
  name: string;
  region: string;
  district: string;
  value: number;
  changeRate: number;
  rank: number;
  lat: number;
  lng: number;
  category: string;
}

export interface MarketAnalysisResponse {
  success: boolean;
  data: {
    markets: MarketAnalysisData[];
    totalCount: number;
    period: string;
  };
  message: string;
  timestamp: string;
}

export interface MarketStatusRequest {
  region: string;
  industry: string;
  period: string;
}

export interface MarketStatusData {
  averageSales: {
    current: number;
    previous: number;
    growthRate: number;
  };
  residentialPopulation: Array<{
    name: string;
    population: number;
    percentage: number;
  }>;
  totalStores: number;
  totalMarkets: number;
  period: string;
}

export interface MarketStatusResponse {
  success: boolean;
  data: MarketStatusData;
  message: string;
  timestamp: string;
}

export const marketDiagnosisAPI = {
  // 상권 목록 조회
  getMarkets: async (): Promise<MarketListResponse> => {
    const response = await apiClient.get("/api/v1/market-diagnosis/markets");
    return response.data;
  },

  // 상권 상세 정보 조회
  getMarketDetail: async (
    marketCode: string
  ): Promise<MarketDetailResponse> => {
    const response = await apiClient.get(
      `/api/v1/market-diagnosis/markets/${marketCode}`
    );
    return response.data;
  },

  // 상권 분석 데이터 조회 (뜨는 상권)
  getMarketAnalysis: async (
    params: MarketAnalysisRequest
  ): Promise<MarketAnalysisResponse> => {
    const response = await apiClient.post(
      "/api/v1/market-diagnosis/analysis",
      params
    );
    return response.data;
  },

  // 상권 현황 데이터 조회 (홈페이지용)
  getMarketStatus: async (
    params: MarketStatusRequest
  ): Promise<MarketStatusResponse> => {
    const response = await apiClient.post(
      "/api/v1/market-diagnosis/market-status",
      params
    );
    return response.data;
  },
};
