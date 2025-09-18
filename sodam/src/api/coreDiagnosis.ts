import apiClient from "./client.ts";

export interface FootTrafficResponse {
  success: boolean;
  data: {
    marketCode: string;
    footTrafficData: Array<{
      date: string;
      footTraffic: number;
      changeRate: number;
    }>;
    summary: {
      average: number;
      trend: string;
      changeRate: number;
    };
  };
  message: string;
  timestamp: string;
}

export interface CardSalesResponse {
  success: boolean;
  data: {
    marketCode: string;
    salesData: Array<{
      date: string;
      sales: number;
      changeRate: number;
    }>;
    summary: {
      average: number;
      trend: string;
      changeRate: number;
    };
  };
  message: string;
  timestamp: string;
}

export interface SameIndustryResponse {
  success: boolean;
  data: {
    marketCode: string;
    industryData: Array<{
      industry: string;
      count: number;
      density: number;
    }>;
    summary: {
      totalBusinesses: number;
      averageDensity: number;
    };
  };
  message: string;
  timestamp: string;
}

export interface BusinessRatesResponse {
  success: boolean;
  data: {
    marketCode: string;
    ratesData: Array<{
      period: string;
      startupRate: number;
      closureRate: number;
      netRate: number;
    }>;
    summary: {
      averageStartupRate: number;
      averageClosureRate: number;
      netGrowthRate: number;
    };
  };
  message: string;
  timestamp: string;
}

export interface DwellTimeResponse {
  success: boolean;
  data: {
    marketCode: string;
    dwellTimeData: Array<{
      timeSlot: string;
      averageDwellTime: number;
      visitorCount: number;
    }>;
    summary: {
      averageDwellTime: number;
      peakTimeSlot: string;
    };
  };
  message: string;
  timestamp: string;
}

export interface HealthScoreRequest {
  weights?: {
    footTraffic?: number;
    sales?: number;
    competitors?: number;
    businessRates?: number;
    dwellTime?: number;
  };
}

export interface HealthScoreResponse {
  success: boolean;
  data: {
    marketCode: string;
    healthScore: number;
    breakdown: {
      footTraffic: number;
      sales: number;
      competitors: number;
      businessRates: number;
      dwellTime: number;
    };
    grade: string;
    recommendations: string[];
  };
  message: string;
  timestamp: string;
}

export interface ComprehensiveDiagnosisRequest {
  weights?: {
    footTraffic?: number;
    sales?: number;
    competitors?: number;
    businessRates?: number;
    dwellTime?: number;
  };
}

export interface ComprehensiveDiagnosisResponse {
  success: boolean;
  data: {
    marketCode: string;
    overallScore: number;
    grade: string;
    analysis: {
      footTraffic: FootTrafficResponse["data"];
      sales: CardSalesResponse["data"];
      competitors: SameIndustryResponse["data"];
      businessRates: BusinessRatesResponse["data"];
      dwellTime: DwellTimeResponse["data"];
    };
    healthScore: HealthScoreResponse["data"];
    recommendations: string[];
  };
  message: string;
  timestamp: string;
}

export const coreDiagnosisAPI = {
  // 유동인구 변화량 분석
  getFootTraffic: async (marketCode: string): Promise<FootTrafficResponse> => {
    const response = await apiClient.get(
      `/api/v1/core-diagnosis/foot-traffic/${marketCode}`
    );
    return response.data;
  },

  // 카드매출 추이 분석
  getCardSales: async (marketCode: string): Promise<CardSalesResponse> => {
    const response = await apiClient.get(
      `/api/v1/core-diagnosis/card-sales/${marketCode}`
    );
    return response.data;
  },

  // 동일업종 수 분석
  getSameIndustry: async (
    marketCode: string
  ): Promise<SameIndustryResponse> => {
    const response = await apiClient.get(
      `/api/v1/core-diagnosis/same-industry/${marketCode}`
    );
    return response.data;
  },

  // 창업·폐업 비율 분석
  getBusinessRates: async (
    marketCode: string
  ): Promise<BusinessRatesResponse> => {
    const response = await apiClient.get(
      `/api/v1/core-diagnosis/business-rates/${marketCode}`
    );
    return response.data;
  },

  // 체류시간 분석
  getDwellTime: async (marketCode: string): Promise<DwellTimeResponse> => {
    const response = await apiClient.get(
      `/api/v1/core-diagnosis/dwell-time/${marketCode}`
    );
    return response.data;
  },

  // 상권 건강 점수 종합 산정
  getHealthScore: async (
    marketCode: string,
    data?: HealthScoreRequest
  ): Promise<HealthScoreResponse> => {
    const response = await apiClient.post(
      `/api/v1/core-diagnosis/health-score/${marketCode}`,
      data || {}
    );
    return response.data;
  },

  // 종합 상권 진단
  getComprehensiveDiagnosis: async (
    marketCode: string,
    data?: ComprehensiveDiagnosisRequest
  ): Promise<ComprehensiveDiagnosisResponse> => {
    const response = await apiClient.post(
      `/api/v1/core-diagnosis/comprehensive/${marketCode}`,
      data || {}
    );
    return response.data;
  },
};
