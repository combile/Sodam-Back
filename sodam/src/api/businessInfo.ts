import apiClient from "./client.ts";

export interface Business {
  상가업소번호: string;
  상호명: string;
  지점명: string;
  상권업종대분류코드: string;
  상권업종대분류명: string;
  상권업종중분류코드: string;
  상권업종중분류명: string;
  상권업종소분류코드: string;
  상권업종소분류명: string;
  표준산업분류코드: string;
  표준산업분류명: string;
  시도코드: string;
  시도명: string;
  시군구코드: string;
  시군구명: string;
  행정동코드: string;
  행정동명: string;
  법정동코드: string;
  법정동명: string;
  지번주소: string;
  도로명주소: string;
  건물명: string;
  경도: number;
  위도: number;
}

export interface BusinessSearchResponse {
  success: boolean;
  data: {
    businesses: Business[];
    total_count: number;
    search_term: string;
    limit: number;
  };
  message: string;
  timestamp: string;
}

export interface BusinessListResponse {
  success: boolean;
  data: {
    businesses: Business[];
    total_count: number;
    market_code?: string;
    market_name?: string;
    industry_code?: string;
    industry_name?: string;
    district?: string;
    industry_filter?: string;
    district_filter?: string;
    limit: number;
  };
  message: string;
  timestamp: string;
}

export interface CompetitionAnalysis {
  total_businesses: number;
  industry_breakdown: Array<{
    상권업종대분류명: string;
    상권업종중분류명: string;
    count: number;
  }>;
  competition_score: number;
  market_name: string;
}

export interface CompetitionAnalysisResponse {
  success: boolean;
  data: CompetitionAnalysis;
  message: string;
  timestamp: string;
}

export interface HeatmapPoint {
  시군구명: string;
  행정동명: string;
  경도: number;
  위도: number;
  business_count: number;
  density_score: number;
}

export interface HeatmapResponse {
  success: boolean;
  data: {
    heatmap_data: HeatmapPoint[];
    region: string;
    total_points: number;
  };
  message: string;
  timestamp: string;
}

export interface IndustryDistribution {
  industries: Array<{
    상권업종대분류명: string;
    count: number;
    percentage: number;
  }>;
  total_businesses: number;
  region: string;
}

export interface IndustryDistributionResponse {
  success: boolean;
  data: IndustryDistribution;
  message: string;
  timestamp: string;
}

// 새로운 인터페이스들
export interface IndustryCategory {
  code: string;
  name: string;
}

export interface District {
  code: string;
  name: string;
}

export interface AdministrativeDong {
  code: string;
  name: string;
  district: string;
}

export interface LocationSearchResult {
  district_code: string;
  district_name: string;
  dong_code: string;
  dong_name: string;
  full_name: string;
}

export interface IndustryCategoriesResponse {
  success: boolean;
  categories: IndustryCategory[];
  message: string;
  timestamp: string;
}

export interface DistrictsResponse {
  success: boolean;
  districts: District[];
  message: string;
  timestamp: string;
}

export interface AdministrativeDongsResponse {
  success: boolean;
  dongs: AdministrativeDong[];
  message: string;
  timestamp: string;
}

export interface LocationSearchResponse {
  success: boolean;
  locations: LocationSearchResult[];
  message: string;
  timestamp: string;
}

export interface BusinessInfoResponse {
  success: boolean;
  message: string;
  endpoints: {
    search: string;
    market_businesses: string;
    industry_businesses: string;
    district_businesses: string;
    competition_analysis: string;
    density_heatmap: string;
    industry_distribution: string;
  };
  timestamp: string;
}

export const businessInfoAPI = {
  // API 기본 정보
  getInfo: async (): Promise<BusinessInfoResponse> => {
    const response = await apiClient.get("/api/v1/businesses/");
    return response.data;
  },

  // 업소명으로 검색
  searchBusinesses: async (
    searchTerm: string,
    limit: number = 20
  ): Promise<BusinessSearchResponse> => {
    const response = await apiClient.get(
      `/api/v1/businesses/search?q=${encodeURIComponent(
        searchTerm
      )}&limit=${limit}`
    );
    return response.data;
  },

  // 상권별 업소 목록 조회
  getBusinessesByMarket: async (
    marketCode: string,
    industryFilter?: string,
    limit: number = 100
  ): Promise<BusinessListResponse> => {
    let url = `/api/v1/businesses/market/${marketCode}?limit=${limit}`;
    if (industryFilter) {
      url += `&industry=${encodeURIComponent(industryFilter)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  // 업종별 업소 목록 조회
  getBusinessesByIndustry: async (
    industryCode: string,
    districtFilter?: string,
    limit: number = 100
  ): Promise<BusinessListResponse> => {
    let url = `/api/v1/businesses/industry/${industryCode}?limit=${limit}`;
    if (districtFilter) {
      url += `&district=${encodeURIComponent(districtFilter)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  // 지역구별 업소 목록 조회
  getBusinessesByDistrict: async (
    district: string,
    industryFilter?: string,
    limit: number = 100
  ): Promise<BusinessListResponse> => {
    let url = `/api/v1/businesses/district/${encodeURIComponent(
      district
    )}?limit=${limit}`;
    if (industryFilter) {
      url += `&industry=${encodeURIComponent(industryFilter)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  // 경쟁 업소 분석
  getCompetitionAnalysis: async (
    marketCode: string,
    industryCode?: string
  ): Promise<CompetitionAnalysisResponse> => {
    let url = `/api/v1/businesses/competition/${marketCode}`;
    if (industryCode) {
      url += `?industry=${encodeURIComponent(industryCode)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  // 업소 밀도 히트맵 데이터
  getBusinessDensityHeatmap: async (
    region?: string
  ): Promise<HeatmapResponse> => {
    let url = "/api/v1/businesses/density-heatmap";
    if (region) {
      url += `?region=${encodeURIComponent(region)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  // 업종별 분포 분석
  getIndustryDistribution: async (
    region?: string
  ): Promise<IndustryDistributionResponse> => {
    let url = "/api/v1/businesses/industry-distribution";
    if (region) {
      url += `?region=${encodeURIComponent(region)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  // 새로운 API 메서드들
  getIndustryCategories: async (): Promise<IndustryCategoriesResponse> => {
    const response = await apiClient.get(
      "/api/v1/businesses/industry-categories"
    );
    return response.data;
  },

  getDistricts: async (): Promise<DistrictsResponse> => {
    const response = await apiClient.get("/api/v1/businesses/districts");
    return response.data;
  },

  getAdministrativeDongs: async (
    district?: string
  ): Promise<AdministrativeDongsResponse> => {
    let url = "/api/v1/businesses/administrative-dongs";
    if (district) {
      url += `?district=${encodeURIComponent(district)}`;
    }
    const response = await apiClient.get(url);
    return response.data;
  },

  searchLocations: async (
    searchTerm: string
  ): Promise<LocationSearchResponse> => {
    const response = await apiClient.get(
      `/api/v1/businesses/search-locations?q=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
  },
};
