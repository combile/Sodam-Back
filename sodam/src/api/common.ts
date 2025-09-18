import apiClient from "./client.ts";

export interface Industry {
  code: string;
  name: string;
  description: string;
  category: string;
  icon: string;
}

export interface Region {
  code: string;
  name: string;
  full_name: string;
  population: number;
  area_km2: number;
  market_count: number;
  description: string;
}

export interface IndustriesResponse {
  success: boolean;
  data: {
    total_industries: number;
    industries: Industry[];
    categories: {
      [category: string]: string[];
    };
    last_updated: string;
  };
  message: string;
  timestamp: string;
}

export interface RegionsResponse {
  success: boolean;
  data: {
    total_regions: number;
    regions: Region[];
    city_info: {
      name: string;
      total_population: number;
      total_area: number;
      total_markets: number;
      description: string;
    };
    last_updated: string;
  };
  message: string;
  timestamp: string;
}

export const commonAPI = {
  // 지원 업종 목록 조회
  getSupportedIndustries: async (): Promise<IndustriesResponse> => {
    const response = await apiClient.get("/api/v1/sodam/supported-industries");
    return response.data;
  },

  // 지원 지역 목록 조회
  getSupportedRegions: async (): Promise<RegionsResponse> => {
    const response = await apiClient.get("/api/v1/sodam/supported-regions");
    return response.data;
  },

  // API 상태 확인
  getHealthStatus: async (): Promise<{ status: string; message: string }> => {
    const response = await apiClient.get("/health");
    return response.data;
  },
};
