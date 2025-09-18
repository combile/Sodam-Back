import apiClient from "./client.ts";

export interface HeatmapRequest {
  dataType: "footTraffic" | "sales" | "competitors" | "businessRates";
  region?: string;
  industry?: string;
  timeRange?: {
    start: string;
    end: string;
  };
}

export interface HeatmapData {
  lat: number;
  lng: number;
  value: number;
  marketCode: string;
  marketName: string;
}

export interface HeatmapResponse {
  success: boolean;
  data: {
    heatmapData: HeatmapData[];
    summary: {
      totalMarkets: number;
      averageValue: number;
      maxValue: number;
      minValue: number;
    };
    metadata: {
      dataType: string;
      region: string;
      industry?: string;
      timeRange?: {
        start: string;
        end: string;
      };
    };
  };
  message: string;
  timestamp: string;
}

export interface ClusterRequest {
  region?: string;
  industry?: string;
  clusterCount?: number;
}

export interface ClusterData {
  clusterId: string;
  center: {
    lat: number;
    lng: number;
  };
  markets: Array<{
    marketCode: string;
    marketName: string;
    lat: number;
    lng: number;
    characteristics: {
      footTraffic: number;
      sales: number;
      competitors: number;
    };
  }>;
  characteristics: {
    averageFootTraffic: number;
    averageSales: number;
    averageCompetitors: number;
    dominantIndustry: string;
  };
}

export interface ClusterResponse {
  success: boolean;
  data: {
    clusters: ClusterData[];
    summary: {
      totalClusters: number;
      totalMarkets: number;
      averageMarketsPerCluster: number;
    };
    metadata: {
      region: string;
      industry?: string;
      clusterCount: number;
    };
  };
  message: string;
  timestamp: string;
}

export const mapVisualizationAPI = {
  // 히트맵 데이터 조회
  getHeatmapData: async (data: HeatmapRequest): Promise<HeatmapResponse> => {
    const response = await apiClient.post(
      "/api/v1/map-visualization/heatmap",
      data
    );
    return response.data;
  },

  // 클러스터 분석 데이터 조회
  getClusterData: async (data?: ClusterRequest): Promise<ClusterResponse> => {
    const response = await apiClient.post(
      "/api/v1/map-visualization/cluster",
      data || {}
    );
    return response.data;
  },
};
