import React, { useState, useEffect, useCallback, useRef } from "react";
import { useLocation } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  ExpandMore,
  Store,
  BarChart,
  Map,
  Description,
  Assessment,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  LocalFireDepartment,
  Star,
  Warning,
  Nature,
  ArrowForward,
  Lightbulb,
  Bolt,
  Business,
  School,
  Factory,
  Home,
  Train,
  LocationOn,
  GpsFixed,
  Psychology,
  Bookmark,
  BookmarkBorder,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import { marketDiagnosisAPI } from "../../api/marketDiagnosis.ts";
import { businessInfoAPI } from "../../api/businessInfo.ts";
import { profileAPI } from "../../api/profile.ts";
import CompetitionAnalysisChart from "../../components/CompetitionAnalysisChart.tsx";
import BusinessSearch from "../../components/BusinessSearch.tsx";
import BusinessInfoModal from "../../components/BusinessInfoModal.tsx";
import DetailedMarketReport from "../../components/DetailedMarketReport.tsx";
import BusinessInsightsPanel from "../../components/BusinessInsightsPanel.tsx";
import CustomDropdown from "../../components/CustomDropdown.tsx";
import styles from "./MarketAnalysisPage.module.css";

interface MarketData {
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

interface AnalysisFilters {
  region: string;
  analysisType: "district" | "market";
  indicator: "stores" | "sales" | "footTraffic" | "residents";
  period: string;
  showAllRegions: boolean;
}

interface IndustryData {
  상권업종대분류명: string;
  count: number;
  percentage: number;
}

interface CompetitionAnalysis {
  total_businesses: number;
  industry_breakdown: Array<{
    상권업종대분류명: string;
    상권업종중분류명: string;
    count: number;
  }>;
  competition_score: number;
  market_name: string;
}

const MarketAnalysisPage: React.FC = () => {
  const location = useLocation();

  // 상태 관리
  const [filteredData, setFilteredData] = useState<MarketData[]>([]);
  const [loading, setLoading] = useState(false);
  const [map, setMap] = useState<any>(null);
  const [selectedMarket, setSelectedMarket] = useState<MarketData | null>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [overlays, setOverlays] = useState<any[]>([]);

  // 새로운 상태들
  const [activeTab, setActiveTab] = useState<"market" | "regional" | "report">(
    "market"
  );
  const [selectedDistrict, setSelectedDistrict] = useState<string>("중구");
  const [regionalData, setRegionalData] = useState<{
    [key: string]: IndustryData[];
  }>({});
  const [competitionAnalysis, setCompetitionAnalysis] =
    useState<CompetitionAnalysis | null>(null);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [isBusinessModalOpen, setIsBusinessModalOpen] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [favoriteMarkets, setFavoriteMarkets] = useState<Set<string>>(
    new Set()
  );

  // 필터 상태
  const [filters, setFilters] = useState<AnalysisFilters>({
    region: "대전시 전체",
    analysisType: "market",
    indicator: "stores",
    period: "2024년 4분기 기준 (전분기)",
    showAllRegions: true,
  });

  // 상세조건 상태
  const [showDetailedConditions, setShowDetailedConditions] = useState(false);
  const [detailedFilters, setDetailedFilters] = useState({
    minStores: 0,
    maxStores: 1000,
    minSales: 0,
    maxSales: 1000000000,
    minFootTraffic: 0,
    maxFootTraffic: 100000,
    businessTypes: [] as string[],
    growthRate: 0,
  });

  // 지도 참조
  const mapRef = useRef<HTMLDivElement>(null);

  // 데이터 로드
  const fetchMarketData = useCallback(async () => {
    try {
      setLoading(true);

      // 백엔드 API 호출
      const response = await marketDiagnosisAPI.getMarketAnalysis({
        region: filters.region,
        analysisType: filters.analysisType,
        indicator: filters.indicator,
        period: filters.period,
      });

      if (response.success) {
        setFilteredData(response.data.markets);
        console.log(
          "API 데이터 로드 성공:",
          response.data.markets.length,
          "개"
        );
      } else {
        throw new Error("API 응답 실패");
      }
    } catch (err) {
      console.error("상권 데이터 로드 실패:", err);
      // API 실패 시 더미 데이터로 테스트
      const dummyData = [
        {
          id: "1",
          name: "테스트 상권 1",
          region: "대전시",
          district: "중구",
          value: 100,
          changeRate: 5.2,
          rank: 1,
          lat: 36.3504,
          lng: 127.3845,
          category: "음식점업",
        },
        {
          id: "2",
          name: "테스트 상권 2",
          region: "대전시",
          district: "서구",
          value: 80,
          changeRate: -2.1,
          rank: 2,
          lat: 36.3514,
          lng: 127.3855,
          category: "소매업",
        },
        {
          id: "3",
          name: "테스트 상권 3",
          region: "대전시",
          district: "유성구",
          value: 60,
          changeRate: 3.8,
          rank: 3,
          lat: 36.3524,
          lng: 127.3865,
          category: "서비스업",
        },
      ];
      setFilteredData(dummyData);
      console.log("더미 데이터로 설정:", dummyData.length, "개");
    } finally {
      setLoading(false);
    }
  }, [filters.region, filters.analysisType, filters.indicator, filters.period]);

  // 경쟁 분석 데이터 로드
  const loadCompetitionAnalysis = useCallback(async () => {
    if (!selectedMarket?.id) return;

    try {
      const response = await businessInfoAPI.getCompetitionAnalysis(
        selectedMarket.id
      );
      if (response.success) {
        setCompetitionAnalysis(response.data);
      }
    } catch (error) {
      console.error("경쟁 분석 데이터 로드 실패:", error);
      // API 실패 시 더미 데이터로 폴백
      setCompetitionAnalysis({
        total_businesses: 150,
        industry_breakdown: [
          { 상권업종대분류명: "음식", 상권업종중분류명: "한식", count: 45 },
          { 상권업종대분류명: "음식", 상권업종중분류명: "중식", count: 20 },
          {
            상권업종대분류명: "수리·개인",
            상권업종중분류명: "이용·미용",
            count: 25,
          },
          { 상권업종대분류명: "소매", 상권업종중분류명: "의류", count: 30 },
          { 상권업종대분류명: "소매", 상권업종중분류명: "생활용품", count: 20 },
          {
            상권업종대분류명: "과학·기술",
            상권업종중분류명: "컴퓨터",
            count: 10,
          },
        ],
        competition_score: 45,
        market_name: selectedMarket.name,
      });
    }
  }, [selectedMarket]);

  // 지역별 분석 데이터 로드
  const loadRegionalData = useCallback(async () => {
    const districts = ["동구", "중구", "서구", "유성구", "대덕구"];
    const regionalDataMap: { [key: string]: IndustryData[] } = {};

    try {
      // 각 지역구별로 업종별 분포 데이터 가져오기
      await Promise.all(
        districts.map(async (district) => {
          try {
            const response = await businessInfoAPI.getIndustryDistribution(
              district
            );
            if (response && response.success && response.data) {
              regionalDataMap[district] = response.data.industries || [];
            } else {
              // API 실패 시 더미 데이터
              regionalDataMap[district] = [
                {
                  상권업종대분류명: "음식",
                  count: Math.floor(Math.random() * 100) + 50,
                  percentage: 35.5,
                },
                {
                  상권업종대분류명: "수리·개인",
                  count: Math.floor(Math.random() * 80) + 30,
                  percentage: 25.6,
                },
                {
                  상권업종대분류명: "소매",
                  count: Math.floor(Math.random() * 60) + 20,
                  percentage: 17.0,
                },
                {
                  상권업종대분류명: "과학·기술",
                  count: Math.floor(Math.random() * 40) + 10,
                  percentage: 11.4,
                },
              ];
            }
          } catch (error) {
            console.error(`${district} 지역 데이터 로드 실패:`, error);
            // 오류 시 더미 데이터
            regionalDataMap[district] = [
              {
                상권업종대분류명: "음식",
                count: Math.floor(Math.random() * 100) + 50,
                percentage: 35.5,
              },
              {
                상권업종대분류명: "수리·개인",
                count: Math.floor(Math.random() * 80) + 30,
                percentage: 25.6,
              },
              {
                상권업종대분류명: "소매",
                count: Math.floor(Math.random() * 60) + 20,
                percentage: 17.0,
              },
              {
                상권업종대분류명: "과학·기술",
                count: Math.floor(Math.random() * 40) + 10,
                percentage: 11.4,
              },
            ];
          }
        })
      );

      setRegionalData(regionalDataMap);
    } catch (error) {
      console.error("지역별 데이터 로드 실패:", error);
      // 전체 실패 시 기본 더미 데이터
      districts.forEach((district) => {
        regionalDataMap[district] = [
          {
            상권업종대분류명: "음식",
            count: Math.floor(Math.random() * 100) + 50,
            percentage: 35.5,
          },
          {
            상권업종대분류명: "수리·개인",
            count: Math.floor(Math.random() * 80) + 30,
            percentage: 25.6,
          },
          {
            상권업종대분류명: "소매",
            count: Math.floor(Math.random() * 60) + 20,
            percentage: 17.0,
          },
        ];
      });
      setRegionalData(regionalDataMap);
    }
  }, []);

  // 카카오 맵 초기화 (상권 분석 탭에서만)
  const initializeKakaoMap = useCallback(() => {
    try {
      if (activeTab !== "market") return; // 상권 분석 탭이 아닐 때는 초기화하지 않음

      // 이미 지도가 초기화되어 있으면 다시 초기화하지 않음
      if (map) {
        console.log("지도가 이미 초기화되어 있습니다.");
        return;
      }

      if (!(window as any).kakao || !(window as any).kakao.maps) {
        console.error("카카오맵 API가 로드되지 않았습니다");
        return;
      }

      (window as any).kakao.maps.load(() => {
        try {
          if (!mapRef.current) {
            console.error("지도 컨테이너를 찾을 수 없습니다");
            return;
          }

          // 새로운 지도 생성
          const options = {
            center: new (window as any).kakao.maps.LatLng(36.3504, 127.3845), // 대전 중심
            level: 8,
          };

          const kakaoMap = new (window as any).kakao.maps.Map(
            mapRef.current,
            options
          );

          setMap(kakaoMap);
          console.log("지도 초기화 성공");
        } catch (error) {
          console.error("카카오맵 초기화 중 오류:", error);
        }
      });
    } catch (error) {
      console.error("카카오맵 초기화 실패:", error);
    }
  }, [activeTab, map]);

  // 카카오 맵 API 로드 및 초기화
  const loadKakaoMapAPI = useCallback(() => {
    if (typeof window === "undefined") return;

    // 이미 로드된 경우
    if ((window as any).kakao && (window as any).kakao.maps) {
      initializeKakaoMap();
      return;
    }

    // 이미 스크립트가 있는지 확인
    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com"]'
    );
    if (existingScript) {
      // 스크립트가 있으면 로드 완료 대기
      const checkAPI = () => {
        if ((window as any).kakao && (window as any).kakao.maps) {
          initializeKakaoMap();
        } else {
          setTimeout(checkAPI, 100);
        }
      };
      checkAPI();
    } else {
      // 스크립트가 없으면 새로 로드
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
      script.async = true;

      script.onload = () => {
        if ((window as any).kakao) {
          initializeKakaoMap();
        }
      };

      script.onerror = () => {
        console.error("카카오맵 스크립트 로드 실패");
      };

      document.head.appendChild(script);
    }
  }, [initializeKakaoMap]);

  // 지도에 마커 표시
  const displayMarkers = useCallback(() => {
    try {
      console.log(
        "displayMarkers 호출됨 - map:",
        !!map,
        "filteredData:",
        filteredData.length
      );

      if (!map) {
        console.log("지도가 없어서 마커를 표시할 수 없습니다");
        return;
      }

      if (!filteredData.length) {
        console.log("표시할 데이터가 없습니다");
        return;
      }

      console.log("마커 표시 시작:", filteredData.length, "개");

      // 기존 마커와 오버레이 모두 제거
      if (markers.length > 0) {
        markers.forEach((marker: any) => {
          if (marker && typeof marker.setMap === "function") {
            marker.setMap(null);
          }
        });
      }
      if (overlays.length > 0) {
        overlays.forEach((overlay: any) => {
          if (overlay && typeof overlay.setMap === "function") {
            overlay.setMap(null);
          }
        });
      }

      // 상태 초기화
      setMarkers([]);
      setOverlays([]);

      const newOverlays: any[] = [];

      filteredData.forEach((market, index) => {
        console.log(
          `오버레이 ${index + 1} 생성 중:`,
          market.name,
          "위치:",
          market.lat,
          market.lng
        );

        // 오버레이 데이터 유효성 검사
        if (!market.lat || !market.lng) {
          console.error("오버레이 위치 데이터가 유효하지 않습니다:", market);
          return;
        }

        // 순위별 색상 결정
        const getRankColor = (rank: number) => {
          if (rank <= 3) return "#FF6B6B"; // 상위 3개 - 빨강
          if (rank <= 6) return "#4ECDC4"; // 4-6위 - 청록
          return "#45B7D1"; // 7-10위 - 파랑
        };

        const color = getRankColor(market.rank);
        const size = Math.max(40, 60 - market.rank * 2);

        // 카카오 기본 마커는 제거하고 커스텀 오버레이만 사용

        // 커스텀 오버레이 생성
        const overlayContent = document.createElement("div");
        overlayContent.id = `marker-${market.id}`;
        overlayContent.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          background-color: ${color};
          border-radius: 50%;
          border: 3px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: bold;
          font-size: ${Math.max(12, size / 4)}px;
          cursor: pointer;
          transition: transform 0.2s ease;
        `;
        overlayContent.textContent = market.rank.toString();

        // 마우스 이벤트 추가
        overlayContent.addEventListener("mouseover", () => {
          overlayContent.style.transform = "scale(1.1)";
        });
        overlayContent.addEventListener("mouseout", () => {
          overlayContent.style.transform = "scale(1)";
        });

        // 클릭 이벤트 추가
        overlayContent.addEventListener("click", (e) => {
          e.preventDefault();
          e.stopPropagation();
          try {
            console.log("오버레이 클릭됨:", market.name);
            handleMarketClick(market);
          } catch (error) {
            console.error("오버레이 클릭 처리 중 오류:", error);
          }
        });

        const overlay = new (window as any).kakao.maps.CustomOverlay({
          position: new (window as any).kakao.maps.LatLng(
            market.lat,
            market.lng
          ),
          content: overlayContent,
          map: map,
        });

        // 인포윈도우 제거 - 커스텀 오버레이만 사용

        // 오버레이만 배열에 추가 (카카오 기본 마커 제거)
        newOverlays.push(overlay);

        console.log(`오버레이 ${index + 1} 생성 완료:`, market.name);
        console.log("오버레이 객체:", overlay);
      });

      // 한 번에 상태 업데이트 (오버레이만)
      setMarkers([]); // 마커는 더 이상 사용하지 않음
      setOverlays(newOverlays);
      console.log("오버레이 표시 완료:", newOverlays.length, "개 오버레이");
    } catch (error) {
      console.error("마커 표시 중 오류 발생:", error);
      // 오류 발생 시 상태 초기화
      setMarkers([]);
      setOverlays([]);
    }
  }, [map, filteredData, filters.indicator]);

  // 지표 라벨 반환
  const getIndicatorLabel = (indicator: string) => {
    const labels = {
      stores: "점포수",
      sales: "매출",
      footTraffic: "유동인구",
      residents: "주거인구",
    };
    return labels[indicator as keyof typeof labels] || indicator;
  };

  // 값 포맷팅
  const formatValue = (value: number, indicator: string) => {
    if (indicator === "stores") return `${value}개`;
    if (indicator === "sales") return `${(value / 100000000).toFixed(1)}억원`;
    if (indicator === "footTraffic" || indicator === "residents")
      return `${value.toLocaleString()}명`;
    return value.toString();
  };

  // 필터 변경 핸들러
  const handleFilterChange = (key: keyof AnalysisFilters, value: any) => {
    // analysisType은 "market"으로 고정
    if (key === "analysisType") {
      return;
    }
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // 마켓 선택 핸들러
  const handleMarketSelect = (market: MarketData) => {
    setSelectedMarket(market);
    if (map) {
      map.setCenter(
        new (window as any).kakao.maps.LatLng(market.lat, market.lng)
      );
      map.setLevel(5);
    }
  };

  // 마켓 클릭 핸들러 (마커/오버레이 클릭 시 사용)
  const handleMarketClick = useCallback((market: MarketData) => {
    console.log("마켓 클릭 핸들러 호출됨:", market.name);
    console.log("선택된 상권 데이터:", market);

    // 상권 선택
    setSelectedMarket(market);

    // 지도 위치 이동 제거 - 보고서가 열려도 지도 위치는 그대로 유지

    // 오른쪽 패널이 열렸는지 확인하기 위한 로그
    setTimeout(() => {
      console.log("오른쪽 패널이 열렸습니다. selectedMarket:", market.name);

      // 패널이 열렸을 때 시각적 피드백을 위해 패널에 포커스
      const panel = document.querySelector(`.${styles.marketDetailPanel}`);
      if (panel) {
        panel.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 100);
  }, []);

  // 전역 마커 클릭 핸들러 등록 (더 이상 사용하지 않음 - 직접 이벤트 리스너 사용)
  // useEffect(() => {
  //   // 이제 전역 핸들러를 사용하지 않고 직접 이벤트 리스너를 사용합니다.
  // }, [filteredData]);

  // 업소 선택 핸들러
  const handleBusinessSelect = (business: any) => {
    setSelectedBusiness(business);
    setIsBusinessModalOpen(true);
  };

  // 탭 변경 핸들러
  const handleTabChange = (tab: "market" | "regional" | "report") => {
    setActiveTab(tab);
  };

  // 관심 상권 등록/해제 핸들러
  const handleFavoriteToggle = async (marketId: string) => {
    try {
      const isCurrentlyFavorite = favoriteMarkets.has(marketId);
      const selectedMarketData = filteredData.find(
        (market) => market.id === marketId
      );

      if (!selectedMarketData) {
        console.error("선택된 상권 데이터를 찾을 수 없습니다.");
        return;
      }

      // 관심 상권 지역 정보 (예: "대전시 중구")
      const marketArea = `${selectedMarketData.region} ${selectedMarketData.district}`;

      // 현재 유저 프로필 조회
      const profileResponse = await profileAPI.getProfile();
      const currentPreferredAreas =
        profileResponse.user.preferences.preferredAreas || [];

      let updatedPreferredAreas;
      if (isCurrentlyFavorite) {
        // 관심 상권 해제 - 해당 지역 제거
        updatedPreferredAreas = currentPreferredAreas.filter(
          (area) => area !== marketArea
        );
      } else {
        // 관심 상권 등록 - 해당 지역 추가 (중복 방지)
        const newAreas = [...currentPreferredAreas, marketArea];
        updatedPreferredAreas = Array.from(new Set(newAreas));
      }

      // 유저 프로필 업데이트
      await profileAPI.updateProfile({
        preferences: {
          preferredAreas: updatedPreferredAreas,
        },
      });

      // 로컬 상태 업데이트
      setFavoriteMarkets((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(marketId)) {
          newSet.delete(marketId);
        } else {
          newSet.add(marketId);
        }
        return newSet;
      });

      console.log(
        `${isCurrentlyFavorite ? "관심 상권 해제" : "관심 상권 등록"} 성공:`,
        {
          marketId,
          marketArea,
          updatedPreferredAreas,
        }
      );
    } catch (error: any) {
      console.error("관심 상권 등록/해제 실패:", error);

      // 토큰 만료 에러 처리
      if (error.response?.status === 401) {
        const errorMessage =
          error.response?.data?.msg || error.response?.data?.message;
        if (
          errorMessage &&
          (errorMessage.includes("Token has expired") ||
            errorMessage.includes("expired"))
        ) {
          alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
          // API 클라이언트 인터셉터에서 자동으로 로그인 페이지로 리다이렉트됩니다.
          return;
        }
      }

      // 기타 에러 처리
      alert("관심 상권 등록/해제 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  // 기존 관심상권 데이터 로드 및 동기화
  const loadFavoriteMarkets = useCallback(async () => {
    try {
      const profileResponse = await profileAPI.getProfile();
      const preferredAreas =
        profileResponse.user.preferences.preferredAreas || [];

      // 현재 로드된 상권 데이터에서 관심상권에 해당하는 것들을 찾아서 favoriteMarkets에 추가
      const favoriteMarketIds = filteredData
        .filter((market) =>
          preferredAreas.includes(`${market.region} ${market.district}`)
        )
        .map((market) => market.id);

      setFavoriteMarkets(new Set(favoriteMarketIds));
      console.log("관심상권 데이터 동기화 완료:", favoriteMarketIds);
    } catch (error: any) {
      console.error("관심상권 데이터 로드 실패:", error);

      // 토큰 만료 에러는 API 클라이언트 인터셉터에서 자동 처리되므로 여기서는 조용히 처리
      if (error.response?.status === 401) {
        console.warn(
          "토큰 만료로 인한 관심상권 데이터 로드 실패 - 자동 로그아웃 처리됨"
        );
        return;
      }
    }
  }, [filteredData]);

  // useEffect
  useEffect(() => {
    console.log("데이터 로드 useEffect 실행");
    fetchMarketData();
  }, [fetchMarketData]);

  // 필터된 데이터가 변경되면 관심상권 동기화
  useEffect(() => {
    if (filteredData.length > 0) {
      loadFavoriteMarkets();
    }
  }, [filteredData, loadFavoriteMarkets]);

  // 지역별 데이터 로드 (탭 변경 시)
  useEffect(() => {
    if (activeTab === "regional") {
      loadRegionalData();
    }
  }, [activeTab, loadRegionalData]);

  useEffect(() => {
    if (selectedMarket && activeTab === "market") {
      loadCompetitionAnalysis();
    }
  }, [selectedMarket, activeTab, loadCompetitionAnalysis]);

  useEffect(() => {
    // 상권 분석 탭일 때만 지도 초기화
    if (activeTab === "market") {
      // 탭 전환 시 지도 컨테이너가 보이도록 약간의 지연 후 초기화
      setTimeout(() => {
        loadKakaoMapAPI();
      }, 100);
    } else {
      // 다른 탭으로 전환 시 지도 상태 초기화
      if (map && typeof map.setMap === "function") {
        markers.forEach((marker: any) => {
          if (marker && typeof marker.setMap === "function") {
            marker.setMap(null);
          }
        });
        overlays.forEach((overlay: any) => {
          if (overlay && typeof overlay.setMap === "function") {
            overlay.setMap(null);
          }
        });
        setMarkers([]);
        setOverlays([]);
        setMap(null);
      }
    }
  }, [activeTab, loadKakaoMapAPI]);

  useEffect(() => {
    console.log(
      "마커 표시 useEffect 실행 - map:",
      !!map,
      "filteredData:",
      filteredData.length
    );

    if (map && filteredData.length > 0 && activeTab === "market") {
      // 지도가 완전히 렌더링된 후 마커 표시
      setTimeout(() => {
        console.log("마커 표시 시도 중...");
        displayMarkers();
      }, 200);
    } else {
      console.log(
        "마커 표시 조건 미충족 - map:",
        !!map,
        "data:",
        filteredData.length,
        "activeTab:",
        activeTab
      );
    }
  }, [map, filteredData, filters.indicator, displayMarkers, activeTab]);

  // 페이지 변경 시 상태 초기화
  useEffect(() => {
    // 페이지가 변경될 때마다 상태 초기화
    setSelectedMarket(null);
    setFilteredData([]);
    setLoading(false);
  }, [location.pathname]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      // 마커와 오버레이 정리
      markers.forEach((marker: any) => {
        if (marker && typeof marker.setMap === "function") {
          marker.setMap(null);
        }
      });
      overlays.forEach((overlay: any) => {
        if (overlay && typeof overlay.setMap === "function") {
          overlay.setMap(null);
        }
      });
    };
  }, [markers, overlays]);

  return (
    <div className={styles.container}>
      {/* 탭 메뉴 */}
      <div className={styles.tabMenu}>
        <button
          className={`${styles.tab} ${
            activeTab === "market" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("market")}
        >
          <span className={styles.tabIcon}>
            <Store style={{ fontSize: "18px" }} />
          </span>
          상권 분석
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "regional" ? styles.active : ""
          }`}
          onClick={() => handleTabChange("regional")}
        >
          <span className={styles.tabIcon}>
            <Map style={{ fontSize: "18px" }} />
          </span>
          지역별 분석
        </button>
      </div>

      {/* 업소 검색 */}
      <div className={styles.mainContent}>
        {/* 상권 분석 탭 */}
        {activeTab === "market" && (
          <>
            {/* 좌측 분석 패널 */}
            <aside className={styles.analysisPanel}>
              <div className={styles.panelSection}>
                <h3 className={styles.sectionTitle}>뜨는 상권</h3>

                {/* 지역 선택 */}
                <div className={styles.filterGroup}>
                  <label className={styles.filterLabel}>지역 선택</label>
                  <CustomDropdown
                    options={[
                      { value: "대전시 전체", label: "대전시 전체" },
                      { value: "동구", label: "동구" },
                      { value: "중구", label: "중구" },
                      { value: "서구", label: "서구" },
                      { value: "유성구", label: "유성구" },
                      { value: "대덕구", label: "대덕구" },
                    ]}
                    value={filters.region}
                    onChange={(value) => handleFilterChange("region", value)}
                    placeholder="지역을 선택하세요"
                  />
                  <label className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      checked={filters.showAllRegions}
                      onChange={(e) =>
                        handleFilterChange("showAllRegions", e.target.checked)
                      }
                    />
                    지도에 전체 지역 표시
                  </label>
                </div>

                {/* 분석 유형 - 뜨는 상권으로 고정 */}
                <div className={styles.tabGroup}>
                  <div className={`${styles.tab} ${styles.tabActive}`}>
                    뜨는 상권
                  </div>
                </div>

                {/* 지표 선택 탭 */}
                <div className={styles.indicatorTabs}>
                  <button
                    className={`${styles.indicatorTab} ${
                      filters.indicator === "stores"
                        ? styles.indicatorTabActive
                        : ""
                    }`}
                    onClick={() => handleFilterChange("indicator", "stores")}
                  >
                    점포수
                  </button>
                  <button
                    className={`${styles.indicatorTab} ${
                      filters.indicator === "sales"
                        ? styles.indicatorTabActive
                        : ""
                    }`}
                    onClick={() => handleFilterChange("indicator", "sales")}
                  >
                    매출
                  </button>
                  <button
                    className={`${styles.indicatorTab} ${
                      filters.indicator === "footTraffic"
                        ? styles.indicatorTabActive
                        : ""
                    }`}
                    onClick={() =>
                      handleFilterChange("indicator", "footTraffic")
                    }
                  >
                    유동인구
                  </button>
                  <button
                    className={`${styles.indicatorTab} ${
                      filters.indicator === "residents"
                        ? styles.indicatorTabActive
                        : ""
                    }`}
                    onClick={() => handleFilterChange("indicator", "residents")}
                  >
                    주거인구
                  </button>
                </div>

                {/* 상세조건 */}
                <div className={styles.detailedConditions}>
                  <button
                    className={`${styles.detailedButton} ${
                      showDetailedConditions ? styles.active : ""
                    }`}
                    onClick={() =>
                      setShowDetailedConditions(!showDetailedConditions)
                    }
                  >
                    상세조건{" "}
                    <ExpandMore
                      className={`${styles.expandIcon} ${
                        showDetailedConditions ? styles.rotated : ""
                      }`}
                    />
                  </button>

                  {showDetailedConditions && (
                    <div className={styles.detailedPanel}>
                      {/* 점포수 범위 */}
                      <div className={styles.rangeGroup}>
                        <label className={styles.rangeLabel}>점포수 범위</label>
                        <div className={styles.rangeInputs}>
                          <input
                            type="number"
                            className={styles.rangeInput}
                            placeholder="최소"
                            value={detailedFilters.minStores || ""}
                            onChange={(e) =>
                              setDetailedFilters((prev) => ({
                                ...prev,
                                minStores: parseInt(e.target.value) || 0,
                              }))
                            }
                          />
                          <span className={styles.rangeSeparator}>~</span>
                          <input
                            type="number"
                            className={styles.rangeInput}
                            placeholder="최대"
                            value={detailedFilters.maxStores || ""}
                            onChange={(e) =>
                              setDetailedFilters((prev) => ({
                                ...prev,
                                maxStores: parseInt(e.target.value) || 1000,
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* 매출 범위 */}
                      <div className={styles.rangeGroup}>
                        <label className={styles.rangeLabel}>
                          매출 범위 (원)
                        </label>
                        <div className={styles.rangeInputs}>
                          <input
                            type="number"
                            className={styles.rangeInput}
                            placeholder="최소"
                            value={detailedFilters.minSales || ""}
                            onChange={(e) =>
                              setDetailedFilters((prev) => ({
                                ...prev,
                                minSales: parseInt(e.target.value) || 0,
                              }))
                            }
                          />
                          <span className={styles.rangeSeparator}>~</span>
                          <input
                            type="number"
                            className={styles.rangeInput}
                            placeholder="최대"
                            value={detailedFilters.maxSales || ""}
                            onChange={(e) =>
                              setDetailedFilters((prev) => ({
                                ...prev,
                                maxSales:
                                  parseInt(e.target.value) || 1000000000,
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* 유동인구 범위 */}
                      <div className={styles.rangeGroup}>
                        <label className={styles.rangeLabel}>
                          유동인구 범위
                        </label>
                        <div className={styles.rangeInputs}>
                          <input
                            type="number"
                            className={styles.rangeInput}
                            placeholder="최소"
                            value={detailedFilters.minFootTraffic || ""}
                            onChange={(e) =>
                              setDetailedFilters((prev) => ({
                                ...prev,
                                minFootTraffic: parseInt(e.target.value) || 0,
                              }))
                            }
                          />
                          <span className={styles.rangeSeparator}>~</span>
                          <input
                            type="number"
                            className={styles.rangeInput}
                            placeholder="최대"
                            value={detailedFilters.maxFootTraffic || ""}
                            onChange={(e) =>
                              setDetailedFilters((prev) => ({
                                ...prev,
                                maxFootTraffic:
                                  parseInt(e.target.value) || 100000,
                              }))
                            }
                          />
                        </div>
                      </div>

                      {/* 성장률 필터 */}
                      <div className={styles.rangeGroup}>
                        <label className={styles.rangeLabel}>
                          최소 성장률 (%)
                        </label>
                        <input
                          type="number"
                          className={styles.singleInput}
                          placeholder="성장률"
                          value={detailedFilters.growthRate || ""}
                          onChange={(e) =>
                            setDetailedFilters((prev) => ({
                              ...prev,
                              growthRate: parseFloat(e.target.value) || 0,
                            }))
                          }
                        />
                      </div>

                      {/* 필터 초기화 버튼 */}
                      <div className={styles.filterActions}>
                        <button
                          className={styles.resetButton}
                          onClick={() =>
                            setDetailedFilters({
                              minStores: 0,
                              maxStores: 1000,
                              minSales: 0,
                              maxSales: 1000000000,
                              minFootTraffic: 0,
                              maxFootTraffic: 100000,
                              businessTypes: [],
                              growthRate: 0,
                            })
                          }
                        >
                          초기화
                        </button>
                        <button
                          className={styles.applyButton}
                          onClick={() => {
                            // 상세 필터 적용 로직
                            console.log("상세 필터 적용:", detailedFilters);
                            // 여기에 실제 필터링 로직을 추가할 수 있습니다
                          }}
                        >
                          적용
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* 순위 TOP 10 */}
                <div className={styles.rankingSection}>
                  <h4 className={styles.rankingTitle}>순위 TOP 10</h4>
                  <div className={styles.rankingPeriod}>{filters.period}</div>

                  {/* 상권 분석 인사이트 */}
                  <div className={styles.marketInsights}>
                    <div className={styles.insightItem}>
                      <span className={styles.insightIcon}>
                        <Assessment style={{ fontSize: "16px" }} />
                      </span>
                      <span className={styles.insightText}>
                        상위 3개 상권은 평균{" "}
                        {Math.round(
                          filteredData
                            .slice(0, 3)
                            .reduce((sum, market) => sum + market.value, 0) / 3
                        ).toLocaleString()}
                        의 {getIndicatorLabel(filters.indicator)}를 보유하고
                        있습니다.
                      </span>
                    </div>
                    <div className={styles.insightItem}>
                      <span className={styles.insightIcon}>
                        <TrendingUpIcon style={{ fontSize: "16px" }} />
                      </span>
                      <span className={styles.insightText}>
                        성장률이 높은 상권은{" "}
                        {filteredData.filter((m) => m.changeRate > 0).length}
                        개로, 전체의{" "}
                        {Math.round(
                          (filteredData.filter((m) => m.changeRate > 0).length /
                            filteredData.length) *
                            100
                        )}
                        %입니다.
                      </span>
                    </div>
                  </div>

                  <div className={styles.rankingList}>
                    {filteredData.slice(0, 10).map((market) => {
                      const getMarketInsight = (
                        rank: number,
                        changeRate: number
                      ) => {
                        if (rank <= 3) {
                          return changeRate > 0 ? "핫한 상권" : "안정적 상권";
                        } else if (rank <= 6) {
                          return changeRate > 0 ? "성장 중" : "보통";
                        } else {
                          return changeRate > 0 ? "잠재력" : "주의";
                        }
                      };

                      const marketInsight = getMarketInsight(
                        market.rank,
                        market.changeRate
                      );

                      return (
                        <div
                          key={market.id}
                          className={`${styles.rankingItem} ${
                            selectedMarket?.id === market.id
                              ? styles.rankingItemSelected
                              : ""
                          }`}
                          onClick={() => handleMarketSelect(market)}
                        >
                          <div className={styles.rankingNumber}>
                            {market.rank}
                          </div>
                          <div className={styles.rankingInfo}>
                            <div className={styles.rankingName}>
                              {market.name}
                            </div>
                            <div className={styles.rankingValue}>
                              {formatValue(market.value, filters.indicator)}
                            </div>
                            <div className={styles.rankingInsight}>
                              {market.rank <= 3 ? (
                                market.changeRate > 0 ? (
                                  <>
                                    <LocalFireDepartment
                                      style={{
                                        fontSize: "14px",
                                        marginRight: "4px",
                                      }}
                                    />
                                    핫한 상권
                                  </>
                                ) : (
                                  <>
                                    <Star
                                      style={{
                                        fontSize: "14px",
                                        marginRight: "4px",
                                      }}
                                    />
                                    안정적 상권
                                  </>
                                )
                              ) : market.rank <= 6 ? (
                                market.changeRate > 0 ? (
                                  <>
                                    <TrendingUpIcon
                                      style={{
                                        fontSize: "14px",
                                        marginRight: "4px",
                                      }}
                                    />
                                    성장 중
                                  </>
                                ) : (
                                  <>
                                    <ArrowForward
                                      style={{
                                        fontSize: "14px",
                                        marginRight: "4px",
                                      }}
                                    />
                                    보통
                                  </>
                                )
                              ) : market.changeRate > 0 ? (
                                <>
                                  <Nature
                                    style={{
                                      fontSize: "14px",
                                      marginRight: "4px",
                                    }}
                                  />
                                  잠재력
                                </>
                              ) : (
                                <>
                                  <Warning
                                    style={{
                                      fontSize: "14px",
                                      marginRight: "4px",
                                    }}
                                  />
                                  주의
                                </>
                              )}
                            </div>
                          </div>
                          <div className={styles.rankingChange}>
                            <span className={styles.changeRate}>
                              {market.changeRate > 0 ? (
                                <TrendingUpIcon
                                  style={{
                                    fontSize: "14px",
                                    marginRight: "4px",
                                  }}
                                />
                              ) : (
                                <TrendingDownIcon
                                  style={{
                                    fontSize: "14px",
                                    marginRight: "4px",
                                  }}
                                />
                              )}
                              {Math.abs(market.changeRate)}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* 상권 선택 가이드 */}
                  <div className={styles.selectionGuide}>
                    <h5 className={styles.guideTitle}>
                      <Lightbulb
                        style={{ fontSize: "16px", marginRight: "8px" }}
                      />
                      상권 선택 가이드
                    </h5>
                    <div className={styles.guideList}>
                      <div className={styles.guideItem}>
                        <span className={styles.guideIcon}>
                          <LocalFireDepartment style={{ fontSize: "16px" }} />
                        </span>
                        <span className={styles.guideText}>
                          <strong>핫한 상권:</strong> 높은 순위 + 성장률로
                          안정적 성장 기대
                        </span>
                      </div>
                      <div className={styles.guideItem}>
                        <span className={styles.guideIcon}>
                          <Nature style={{ fontSize: "16px" }} />
                        </span>
                        <span className={styles.guideText}>
                          <strong>잠재력 상권:</strong> 낮은 순위 + 성장률로
                          미래 성장 가능성
                        </span>
                      </div>
                      <div className={styles.guideItem}>
                        <span className={styles.guideIcon}>
                          <Star style={{ fontSize: "16px" }} />
                        </span>
                        <span className={styles.guideText}>
                          <strong>안정적 상권:</strong> 높은 순위로 안정적이지만
                          성장률은 보통
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* 메인 지도 영역 */}
            <main className={styles.mapArea}>
              {activeTab === "market" && (
                <div
                  key={`map-${activeTab}`}
                  ref={mapRef}
                  className={styles.map}
                  style={{
                    minHeight: "500px",
                    display: "block",
                  }}
                ></div>
              )}
              {activeTab !== "market" && (
                <div className={styles.noMapMessage}>
                  <p>지도는 상권 분석 탭에서만 표시됩니다.</p>
                </div>
              )}
              {loading && (
                <div className={styles.loadingOverlay}>
                  <div className={styles.spinner}></div>
                  <p>데이터를 불러오는 중...</p>
                </div>
              )}
            </main>

            {/* 우측 지도 도구 패널 */}
          </>
        )}

        {/* 지역별 분석 탭 */}
        {activeTab === "regional" && (
          <div className={styles.regionalAnalysis}>
            <div className={styles.analysisContent}>
              <h2 className={styles.analysisTitle}>지역별 분석</h2>

              {/* 지역별 특성 요약 */}
              <div className={styles.regionalOverview}>
                <h3 className={styles.overviewTitle}>지역별 특성 요약</h3>
                <div className={styles.overviewGrid}>
                  <div className={styles.overviewCard}>
                    <h4>
                      <Business
                        style={{ fontSize: "16px", marginRight: "6px" }}
                      />
                      중구 - 상업 중심지
                    </h4>
                    <p>
                      대전의 핵심 상업지구로 다양한 업종이 집중되어 있습니다.
                    </p>
                  </div>
                  <div className={styles.overviewCard}>
                    <h4>
                      <School
                        style={{ fontSize: "16px", marginRight: "6px" }}
                      />
                      유성구 - 교육·연구 중심
                    </h4>
                    <p>KAIST, 충남대 등 대학가로 젊은 층이 많은 지역입니다.</p>
                  </div>
                  <div className={styles.overviewCard}>
                    <h4>
                      <Factory
                        style={{ fontSize: "16px", marginRight: "6px" }}
                      />
                      대덕구 - 산업단지
                    </h4>
                    <p>
                      대덕연구개발특구로 첨단기술 기업들이 집중되어 있습니다.
                    </p>
                  </div>
                  <div className={styles.overviewCard}>
                    <h4>
                      <Home style={{ fontSize: "16px", marginRight: "6px" }} />
                      서구 - 주거 중심
                    </h4>
                    <p>주거지역으로 생활밀착형 서비스업이 발달했습니다.</p>
                  </div>
                  <div className={styles.overviewCard}>
                    <h4>
                      <Train style={{ fontSize: "16px", marginRight: "6px" }} />
                      동구 - 교통 중심
                    </h4>
                    <p>대전역과 고속도로 접근성이 좋은 교통 요충지입니다.</p>
                  </div>
                </div>
              </div>

              {/* 지역별 상세 분석 탭 */}
              <div className={styles.regionalTabs}>
                <div className={styles.tabHeader}>
                  {["동구", "중구", "서구", "유성구", "대덕구"].map(
                    (district) => (
                      <button
                        key={district}
                        className={`${styles.regionalTab} ${
                          selectedDistrict === district
                            ? styles.regionalTabActive
                            : ""
                        }`}
                        onClick={() => setSelectedDistrict(district)}
                      >
                        {district}
                      </button>
                    )
                  )}
                </div>

                <div className={styles.tabContent}>
                  {selectedDistrict && (
                    <div className={styles.districtDetail}>
                      {(() => {
                        const districtData =
                          regionalData[selectedDistrict] || [];
                        const totalBusinesses = districtData.reduce(
                          (sum, industry) => sum + industry.count,
                          0
                        );
                        const mainIndustry =
                          districtData[0]?.상권업종대분류명 || "음식";

                        const getDistrictInsights = (districtName: string) => {
                          const insights = {
                            동구: {
                              characteristics: "교통 접근성 우수, 물류 중심지",
                              opportunities: "물류·유통업, 교통 연계 서비스",
                              challenges: "주거 인구 감소, 상업시설 부족",
                              recommendation:
                                "교통 접근성을 활용한 물류·유통업 진출을 고려하세요",
                            },
                            중구: {
                              characteristics: "상업 중심지, 다양한 업종 집중",
                              opportunities: "소매업, 서비스업, 관광업",
                              challenges: "높은 임대료, 치열한 경쟁",
                              recommendation:
                                "차별화된 서비스와 브랜딩으로 경쟁 우위를 확보하세요",
                            },
                            서구: {
                              characteristics: "주거 중심지, 생활밀착형 서비스",
                              opportunities: "생활서비스, 교육업, 헬스케어",
                              challenges: "인구 고령화, 소비력 제한",
                              recommendation:
                                "고령층을 위한 맞춤형 서비스 개발을 고려하세요",
                            },
                            유성구: {
                              characteristics: "교육·연구 중심, 젊은 인구 집중",
                              opportunities: "교육업, IT서비스, 문화업",
                              challenges: "계절적 수요 변동, 높은 임대료",
                              recommendation:
                                "젊은 층을 타겟으로 한 혁신적인 서비스를 제공하세요",
                            },
                            대덕구: {
                              characteristics: "산업단지, 첨단기술 기업 집중",
                              opportunities: "B2B 서비스, 기술지원업, 연구개발",
                              challenges: "전문성 요구, 높은 진입장벽",
                              recommendation:
                                "기술 전문성을 바탕으로 한 B2B 서비스 진출을 고려하세요",
                            },
                          };
                          return (
                            insights[districtName as keyof typeof insights] || {
                              characteristics: "지역 특성 분석 필요",
                              opportunities: "기회 분석 필요",
                              challenges: "도전과제 분석 필요",
                              recommendation: "상세한 지역 분석이 필요합니다",
                            }
                          );
                        };

                        const insight = getDistrictInsights(selectedDistrict);

                        return (
                          <div className={styles.districtCard}>
                            <div className={styles.districtHeader}>
                              <h3 className={styles.districtName}>
                                {selectedDistrict}
                              </h3>
                              <div className={styles.districtBadge}>
                                {selectedDistrict === "중구" ? (
                                  <Business style={{ fontSize: "24px" }} />
                                ) : selectedDistrict === "유성구" ? (
                                  <School style={{ fontSize: "24px" }} />
                                ) : selectedDistrict === "대덕구" ? (
                                  <Factory style={{ fontSize: "24px" }} />
                                ) : selectedDistrict === "서구" ? (
                                  <Home style={{ fontSize: "24px" }} />
                                ) : (
                                  <Train style={{ fontSize: "24px" }} />
                                )}
                              </div>
                            </div>

                            <div className={styles.districtStats}>
                              <div className={styles.statItem}>
                                <span className={styles.statLabel}>
                                  총 업소 수
                                </span>
                                <span className={styles.statValue}>
                                  {totalBusinesses.toLocaleString()}개
                                </span>
                              </div>
                              <div className={styles.statItem}>
                                <span className={styles.statLabel}>
                                  주요 업종
                                </span>
                                <span className={styles.statValue}>
                                  {mainIndustry}
                                </span>
                              </div>
                              <div className={styles.statItem}>
                                <span className={styles.statLabel}>
                                  업종 다양성
                                </span>
                                <span className={styles.statValue}>
                                  {districtData.length}개 업종
                                </span>
                              </div>
                            </div>

                            {/* 지역 특성 분석 */}
                            <div className={styles.districtInsights}>
                              <div className={styles.insightSection}>
                                <h5 className={styles.insightSectionTitle}>
                                  <LocationOn
                                    style={{
                                      fontSize: "14px",
                                      marginRight: "6px",
                                    }}
                                  />
                                  지역 특성
                                </h5>
                                <p className={styles.insightText}>
                                  {insight.characteristics}
                                </p>
                              </div>
                              <div className={styles.insightSection}>
                                <h5 className={styles.insightSectionTitle}>
                                  <GpsFixed
                                    style={{
                                      fontSize: "14px",
                                      marginRight: "6px",
                                    }}
                                  />
                                  기회요인
                                </h5>
                                <p className={styles.insightText}>
                                  {insight.opportunities}
                                </p>
                              </div>
                              <div className={styles.insightSection}>
                                <h5 className={styles.insightSectionTitle}>
                                  <Warning
                                    style={{
                                      fontSize: "14px",
                                      marginRight: "6px",
                                    }}
                                  />
                                  도전과제
                                </h5>
                                <p className={styles.insightText}>
                                  {insight.challenges}
                                </p>
                              </div>
                              <div className={styles.insightSection}>
                                <h5 className={styles.insightSectionTitle}>
                                  <Lightbulb
                                    style={{
                                      fontSize: "14px",
                                      marginRight: "6px",
                                    }}
                                  />
                                  진출 권장사항
                                </h5>
                                <p className={styles.insightText}>
                                  {insight.recommendation}
                                </p>
                              </div>
                            </div>

                            {/* 업종별 상세 정보 */}
                            <div className={styles.industryBreakdown}>
                              <h4 className={styles.breakdownTitle}>
                                업종별 분포
                              </h4>
                              <div className={styles.breakdownList}>
                                {districtData
                                  .slice(0, 3)
                                  .map((industry, index) => (
                                    <div
                                      key={industry.상권업종대분류명}
                                      className={styles.breakdownItem}
                                    >
                                      <span className={styles.industryName}>
                                        {industry.상권업종대분류명}
                                      </span>
                                      <span className={styles.industryCount}>
                                        {industry.count}개 (
                                        {industry.percentage}%)
                                      </span>
                                    </div>
                                  ))}
                              </div>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 상권 상세 패널 (선택된 상권이 있을 때만 표시) */}
        {selectedMarket && activeTab !== "report" && (
          <div className={styles.marketDetailPanel}>
            {/* 패널 헤더 */}
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>
                <div className={styles.titleContent}>
                  <Assessment className={styles.titleIcon} />
                  <div className={styles.titleText}>
                    <span>{selectedMarket?.name || "상권 정보"}</span>
                    <span className={styles.panelSubtitle}>
                      {selectedMarket?.region || ""}{" "}
                      {selectedMarket?.district || ""}
                    </span>
                  </div>
                </div>
              </div>
              <button
                className={styles.closeButton}
                onClick={() => setSelectedMarket(null)}
                title="패널 닫기"
              >
                ×
              </button>
            </div>

            {/* 상권 기본 정보 카드 */}
            <div className={styles.basicInfoCard}>
              <div className={styles.rankBadge}>
                <span className={styles.rankNumber}>
                  {selectedMarket?.rank || 0}
                </span>
                <span className={styles.rankLabel}>위</span>
              </div>
              <div className={styles.basicInfo}>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>지역</span>
                  <span className={styles.infoValue}>
                    {selectedMarket?.region || ""}{" "}
                    {selectedMarket?.district || ""}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>
                    {getIndicatorLabel(filters.indicator)}
                  </span>
                  <span className={styles.infoValue}>
                    {formatValue(selectedMarket?.value || 0, filters.indicator)}
                  </span>
                </div>
                <div className={styles.infoRow}>
                  <span className={styles.infoLabel}>전분기 대비</span>
                  <span
                    className={`${styles.infoValue} ${
                      (selectedMarket?.changeRate || 0) > 0
                        ? styles.positive
                        : styles.negative
                    }`}
                  >
                    {(selectedMarket?.changeRate || 0) > 0 ? (
                      <TrendingUpIcon className={styles.changeIcon} />
                    ) : (
                      <TrendingDownIcon className={styles.changeIcon} />
                    )}
                    {Math.abs(selectedMarket?.changeRate || 0)}%
                  </span>
                </div>
              </div>
            </div>

            {/* 상권 분석 섹션 */}
            <div className={styles.analysisContainer}>
              {/* 상권의 장점 */}
              <div className={styles.analysisCard}>
                <div className={styles.cardHeader}>
                  <CheckCircle className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>장점</h3>
                </div>
                <div className={styles.cardContent}>
                  {(selectedMarket?.rank || 0) <= 3 && (
                    <div className={styles.advantageItem}>
                      <LocalFireDepartment className={styles.advantageIcon} />
                      <div className={styles.advantageContent}>
                        <h4>핫한 상권</h4>
                        <p>
                          상위 3위 내 순위로 높은 상권력과 안정성을 보유하고
                          있습니다.
                        </p>
                      </div>
                    </div>
                  )}
                  {(selectedMarket?.changeRate || 0) > 0 && (
                    <div className={styles.advantageItem}>
                      <TrendingUpIcon className={styles.advantageIcon} />
                      <div className={styles.advantageContent}>
                        <h4>성장세</h4>
                        <p>
                          전분기 대비 {selectedMarket?.changeRate || 0}%
                          성장하여 지속적인 발전 가능성이 높습니다.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className={styles.advantageItem}>
                    <LocationOn className={styles.advantageIcon} />
                    <div className={styles.advantageContent}>
                      <h4>접근성</h4>
                      <p>
                        {selectedMarket?.region || ""}{" "}
                        {selectedMarket?.district || ""} 지역의 핵심 상권으로
                        교통 접근성이 우수합니다.
                      </p>
                    </div>
                  </div>
                  <div className={styles.advantageItem}>
                    <Business className={styles.advantageIcon} />
                    <div className={styles.advantageContent}>
                      <h4>상권 활성도</h4>
                      <p>
                        {formatValue(
                          selectedMarket?.value || 0,
                          filters.indicator
                        )}
                        의 {getIndicatorLabel(filters.indicator)}를 보유하여
                        활발한 상권 활동을 보입니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 상권의 단점 */}
              <div className={styles.analysisCard}>
                <div className={styles.cardHeader}>
                  <Cancel className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>단점</h3>
                </div>
                <div className={styles.cardContent}>
                  {(selectedMarket?.rank || 0) > 6 && (
                    <div className={styles.disadvantageItem}>
                      <Warning className={styles.disadvantageIcon} />
                      <div className={styles.disadvantageContent}>
                        <h4>낮은 순위</h4>
                        <p>
                          상위권에 속하지 않아 상권력이 상대적으로 약할 수
                          있습니다.
                        </p>
                      </div>
                    </div>
                  )}
                  {(selectedMarket?.changeRate || 0) < 0 && (
                    <div className={styles.disadvantageItem}>
                      <TrendingDownIcon className={styles.disadvantageIcon} />
                      <div className={styles.disadvantageContent}>
                        <h4>감소세</h4>
                        <p>
                          전분기 대비{" "}
                          {Math.abs(selectedMarket?.changeRate || 0)}% 감소하여
                          주의가 필요합니다.
                        </p>
                      </div>
                    </div>
                  )}
                  <div className={styles.disadvantageItem}>
                    <Warning className={styles.disadvantageIcon} />
                    <div className={styles.disadvantageContent}>
                      <h4>경쟁 심화</h4>
                      <p>
                        상권 내 경쟁이 치열할 수 있어 차별화된 전략이
                        필요합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 창업 추천 */}
              <div className={styles.analysisCard}>
                <div className={styles.cardHeader}>
                  <Lightbulb className={styles.cardIcon} />
                  <h3 className={styles.cardTitle}>추천</h3>
                </div>
                <div className={styles.cardContent}>
                  {(selectedMarket?.rank || 0) <= 3 &&
                  (selectedMarket?.changeRate || 0) > 0 ? (
                    <div className={styles.recommendationItem}>
                      <LocalFireDepartment
                        className={styles.recommendationIcon}
                      />
                      <div className={styles.recommendationContent}>
                        <h4>추천</h4>
                        <p>
                          상위 순위와 성장세를 모두 보유한 최적의 창업
                          지역입니다. 안정적이고 성장 가능성이 높은 상권입니다.
                        </p>
                        <div className={styles.businessTags}>
                          <span className={styles.businessTag}>음식점</span>
                          <span className={styles.businessTag}>카페</span>
                          <span className={styles.businessTag}>소매업</span>
                        </div>
                      </div>
                    </div>
                  ) : (selectedMarket?.rank || 0) <= 6 &&
                    (selectedMarket?.changeRate || 0) > 0 ? (
                    <div className={styles.recommendationItem}>
                      <TrendingUpIcon className={styles.recommendationIcon} />
                      <div className={styles.recommendationContent}>
                        <h4>추천</h4>
                        <p>
                          성장세를 보이고 있어 미래 발전 가능성이 높은
                          상권입니다. 신중한 분석 후 진출을 고려해보세요.
                        </p>
                        <div className={styles.businessTags}>
                          <span className={styles.businessTag}>서비스업</span>
                          <span className={styles.businessTag}>교육업</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className={styles.recommendationItem}>
                      <Warning className={styles.recommendationIcon} />
                      <div className={styles.recommendationContent}>
                        <h4>신중한 검토 필요</h4>
                        <p>
                          상권 분석을 더욱 신중하게 진행하고, 차별화된 전략을
                          수립한 후 진출을 고려해보세요.
                        </p>
                        <div className={styles.businessTags}>
                          <span className={styles.businessTag}>특수업종</span>
                          <span className={styles.businessTag}>B2B 서비스</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 액션 버튼들 */}
            <div className={styles.actionButtons}>
              <button
                className={`${styles.favoriteButton} ${
                  favoriteMarkets.has(selectedMarket?.id || "")
                    ? styles.favorited
                    : ""
                }`}
                onClick={() => handleFavoriteToggle(selectedMarket?.id || "")}
              >
                {favoriteMarkets.has(selectedMarket?.id || "") ? (
                  <Bookmark className={styles.buttonIcon} />
                ) : (
                  <BookmarkBorder className={styles.buttonIcon} />
                )}
                {favoriteMarkets.has(selectedMarket?.id || "")
                  ? "관심 상권 해제"
                  : "관심 상권 등록"}
              </button>

              <button
                className={styles.detailButton}
                onClick={() => setShowDetailedReport(true)}
              >
                <Assessment className={styles.buttonIcon} />
                상세보기
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 업소 정보 모달 */}
      <BusinessInfoModal
        business={selectedBusiness}
        isOpen={isBusinessModalOpen}
        onClose={() => setIsBusinessModalOpen(false)}
      />

      {/* 상세 보고서 모달 */}
      {showDetailedReport && selectedMarket && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>상권 상세 분석 보고서</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowDetailedReport(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.modalContent}>
              <DetailedMarketReport
                marketData={{
                  ...selectedMarket,
                  // 추가 상세 정보
                  totalStores: Math.floor((selectedMarket?.value || 0) * 0.8),
                  avgSales: Math.floor((selectedMarket?.value || 0) * 1000000),
                  footTraffic: Math.floor((selectedMarket?.value || 0) * 50),
                  residentPopulation: Math.floor(
                    (selectedMarket?.value || 0) * 2.5
                  ),
                  businessDensity: Math.floor(
                    (selectedMarket?.value || 0) * 0.1
                  ),
                  avgRent: Math.floor((selectedMarket?.value || 0) * 50000),
                  ageGroup20s: Math.floor((selectedMarket?.value || 0) * 0.3),
                  ageGroup30s: Math.floor((selectedMarket?.value || 0) * 0.4),
                  ageGroup40s: Math.floor((selectedMarket?.value || 0) * 0.2),
                  ageGroup50s: Math.floor((selectedMarket?.value || 0) * 0.1),
                }}
                industryData={
                  regionalData[selectedMarket?.district || ""] || [
                    {
                      상권업종대분류명: "음식점업",
                      count: Math.floor((selectedMarket?.value || 0) * 0.4),
                      percentage: 40,
                    },
                    {
                      상권업종대분류명: "소매업",
                      count: Math.floor((selectedMarket?.value || 0) * 0.3),
                      percentage: 30,
                    },
                    {
                      상권업종대분류명: "서비스업",
                      count: Math.floor((selectedMarket?.value || 0) * 0.2),
                      percentage: 20,
                    },
                    {
                      상권업종대분류명: "숙박업",
                      count: Math.floor((selectedMarket?.value || 0) * 0.1),
                      percentage: 10,
                    },
                  ]
                }
                regionalData={regionalData}
                competitionAnalysis={
                  competitionAnalysis || {
                    total_businesses: Math.floor(
                      (selectedMarket?.value || 0) * 0.8
                    ),
                    industry_breakdown: [
                      {
                        상권업종대분류명: "음식점업",
                        상권업종중분류명: "한식",
                        count: Math.floor((selectedMarket?.value || 0) * 0.2),
                      },
                      {
                        상권업종대분류명: "소매업",
                        상권업종중분류명: "의류",
                        count: Math.floor((selectedMarket?.value || 0) * 0.15),
                      },
                      {
                        상권업종대분류명: "서비스업",
                        상권업종중분류명: "미용",
                        count: Math.floor((selectedMarket?.value || 0) * 0.1),
                      },
                    ],
                    competition_score:
                      (selectedMarket?.rank || 0) <= 5
                        ? 75
                        : (selectedMarket?.rank || 0) <= 10
                        ? 60
                        : 45,
                  }
                }
                riskAnalysis={{
                  risk_type:
                    (selectedMarket?.rank || 0) <= 5
                      ? "안정형"
                      : (selectedMarket?.rank || 0) <= 10
                      ? "보통형"
                      : "주의형",
                  risk_score:
                    (selectedMarket?.rank || 0) <= 5
                      ? 85
                      : (selectedMarket?.rank || 0) <= 10
                      ? 65
                      : 45,
                  key_indicators:
                    (selectedMarket?.rank || 0) <= 5
                      ? [
                          "높은 상권 순위",
                          "안정적인 성장률",
                          "우수한 시장 환경",
                          "낮은 경쟁 위험도",
                          "높은 유동인구",
                        ]
                      : (selectedMarket?.rank || 0) <= 10
                      ? [
                          "보통 수준의 상권 순위",
                          "적당한 경쟁 환경",
                          "성장 가능성",
                          "중간 수준의 리스크",
                          "안정적인 매출",
                        ]
                      : [
                          "낮은 상권 순위",
                          "높은 경쟁 위험",
                          "신중한 투자 필요",
                          "유동인구 감소 우려",
                          "매출 변동성 높음",
                        ],
                }}
                actualScore={
                  (selectedMarket?.rank || 0) <= 5
                    ? 85
                    : (selectedMarket?.rank || 0) <= 10
                    ? 65
                    : 45
                }
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketAnalysisPage;
