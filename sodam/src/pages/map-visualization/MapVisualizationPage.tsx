import React, { useState, useEffect, useRef, useCallback } from "react";
import { mapVisualizationAPI } from "../../api/mapVisualization.ts";
import { businessInfoAPI, HeatmapPoint } from "../../api/businessInfo.ts";
import BusinessInfoModal from "../../components/BusinessInfoModal.tsx";
import styles from "./MapVisualizationPage.module.css";

interface HeatmapData {
  lat: number;
  lng: number;
  intensity: number;
  category: string;
  value: number;
}

interface ClusterData {
  lat: number;
  lng: number;
  count: number;
  category: string;
  markets: string[];
}

interface UserLocation {
  lat: number;
  lng: number;
}

const MapVisualizationPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [map, setMap] = useState<any>(null);
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [clusterData, setClusterData] = useState<ClusterData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "heatmap" | "clusters" | "combined"
  >("heatmap");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [mapType, setMapType] = useState<string>("standard");
  const [showLegend, setShowLegend] = useState(true);
  const [selectedBusiness, setSelectedBusiness] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);

  // 사용자 위치 가져오기
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      setLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setLoading(false);
      },
      (error) => {
        console.error("위치 정보 가져오기 실패:", error);
        // 대전 시청 좌표로 폴백
        setUserLocation({ lat: 36.3504, lng: 127.3845 });
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  // 지도 시각화 데이터 가져오기
  const fetchMapVisualizationData = useCallback(async () => {
    try {
      // 실제 업소 밀도 히트맵 데이터 가져오기
      const heatmapResponse = await businessInfoAPI.getBusinessDensityHeatmap(
        selectedCategory === "all" ? undefined : selectedCategory
      );

      if (heatmapResponse.success) {
        const businessHeatmapData = heatmapResponse.data.heatmap_data.map(
          (point: HeatmapPoint) => ({
            lat: point.위도,
            lng: point.경도,
            intensity: point.density_score,
            category: point.시군구명,
            value: point.business_count,
          })
        );
        setHeatmapData(businessHeatmapData);
      }

      // 기존 클러스터 데이터도 유지
      const clusterResponse = await mapVisualizationAPI.getClusterData({
        region: "대전광역시",
        category: selectedCategory,
        radius: 1000,
      });

      if (clusterResponse.success) {
        setClusterData(clusterResponse.data.clusterData);
      }
    } catch (err) {
      console.error("지도 시각화 데이터 가져오기 실패:", err);
      // API 실패 시 더미 데이터로 폴백
      setHeatmapData([
        {
          lat: 36.3504,
          lng: 127.3845,
          intensity: 0.8,
          category: "상업지구",
          value: 150000,
        },
        {
          lat: 36.3514,
          lng: 127.3855,
          intensity: 0.6,
          category: "주거지구",
          value: 120000,
        },
        {
          lat: 36.3524,
          lng: 127.3865,
          intensity: 0.9,
          category: "혼합지구",
          value: 180000,
        },
        {
          lat: 36.3534,
          lng: 127.3875,
          intensity: 0.4,
          category: "상업지구",
          value: 80000,
        },
        {
          lat: 36.3544,
          lng: 127.3885,
          intensity: 0.7,
          category: "주거지구",
          value: 130000,
        },
      ]);

      setClusterData([
        {
          lat: 36.3504,
          lng: 127.3845,
          count: 15,
          category: "상업지구",
          markets: ["대전역 상권", "중앙로 상권"],
        },
        {
          lat: 36.3514,
          lng: 127.3855,
          count: 8,
          category: "주거지구",
          markets: ["둔산동 상권"],
        },
        {
          lat: 36.3524,
          lng: 127.3865,
          count: 12,
          category: "혼합지구",
          markets: ["유성온천 상권"],
        },
      ]);
    }
  }, [selectedCategory]);

  // 지도 초기화
  useEffect(() => {
    if (!userLocation) return;

    const checkKakaoMap = async () => {
      try {
        if (document.querySelector('script[src*="dapi.kakao.com"]')) {
          if ((window as any).kakao) {
            initializeKakaoMap();
          } else {
            setTimeout(() => {
              if ((window as any).kakao) {
                initializeKakaoMap();
              } else {
                console.error("카카오맵 객체를 찾을 수 없습니다");
              }
            }, 1000);
          }
        } else {
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
      } catch (error) {
        console.error("카카오맵 로드 중 오류:", error);
      }
    };

    const initializeKakaoMap = () => {
      try {
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

            const options = {
              center: new (window as any).kakao.maps.LatLng(
                userLocation.lat,
                userLocation.lng
              ),
              level: 3,
            };

            const kakaoMap = new (window as any).kakao.maps.Map(
              mapRef.current,
              options
            );

            setMap(kakaoMap);
            fetchMapVisualizationData();
          } catch (error) {
            console.error("카카오맵 초기화 중 오류:", error);
          }
        });
      } catch (error) {
        console.error("카카오맵 초기화 중 오류:", error);
      }
    };

    checkKakaoMap();
  }, [userLocation, fetchMapVisualizationData]);

  // 히트맵을 마커로 대체하는 함수
  const displayHeatmapAsMarkers = useCallback(
    (data: HeatmapData[]) => {
      if (!map || !data.length) return;

      data.forEach((item) => {
        // 강도에 따른 색상 결정
        const getHeatColor = (intensity: number) => {
          if (intensity >= 0.8) return "#FF0000"; // 빨강 (높음)
          if (intensity >= 0.6) return "#FF8C00"; // 주황 (보통)
          if (intensity >= 0.4) return "#FFD700"; // 노랑 (낮음)
          return "#90EE90"; // 연녹색 (매우 낮음)
        };

        // 강도에 따른 크기 결정
        const getHeatSize = (intensity: number) => {
          return Math.max(10, intensity * 30);
        };

        const color = getHeatColor(item.intensity);
        const size = getHeatSize(item.intensity);

        // 커스텀 마커 이미지 생성
        new (window as any).kakao.maps.CustomOverlay({
          position: new (window as any).kakao.maps.LatLng(item.lat, item.lng),
          content: `
          <div style="
            width: ${size}px;
            height: ${size}px;
            background-color: ${color};
            border-radius: 50%;
            opacity: 0.7;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: ${Math.max(8, size / 3)}px;
          " onclick="this.click()">
            ${Math.round(item.intensity * 100)}
          </div>
        `,
          map: map,
        });

        // 클릭 이벤트를 위한 마커도 생성 (투명)
        const marker = new (window as any).kakao.maps.Marker({
          position: new (window as any).kakao.maps.LatLng(item.lat, item.lng),
          map: map,
          image: new (window as any).kakao.maps.MarkerImage(
            "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            new (window as any).kakao.maps.Size(1, 1)
          ),
        });

        // 마커에 인포윈도우 추가
        const infowindow = new (window as any).kakao.maps.InfoWindow({
          content: `
          <div style="padding: 15px; min-width: 200px;">
            <h4 style="margin: 0 0 10px 0; color: #333;">${item.category}</h4>
            <div style="margin-bottom: 8px;">
              <strong>업소 밀도:</strong> ${Math.round(item.intensity * 100)}%
            </div>
            <div style="margin-bottom: 8px;">
              <strong>업소 수:</strong> ${item.value.toLocaleString()}개
            </div>
            <div style="
              width: 100%;
              height: 8px;
              background-color: #e0e0e0;
              border-radius: 4px;
              overflow: hidden;
              margin-top: 10px;
            ">
              <div style="
                width: ${item.intensity * 100}%;
                height: 100%;
                background-color: ${color};
                transition: width 0.3s ease;
              "></div>
            </div>
            <button onclick="window.openBusinessModal(${item.lat}, ${
            item.lng
          }, '${item.category}')" 
                    style="margin-top: 10px; padding: 8px 12px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">
              업소 목록 보기
            </button>
          </div>
        `,
        });

        (window as any).kakao.maps.event.addListener(marker, "click", () => {
          infowindow.open(map, marker);
        });
      });
    },
    [map]
  );

  const displayHeatmap = useCallback(() => {
    if (!map || !heatmapData.length) return;

    const filteredData =
      selectedCategory === "all"
        ? heatmapData
        : heatmapData.filter((data) => data.category === selectedCategory);

    // 히트맵을 시각적으로 구현하기 위해 색상별 마커 사용
    displayHeatmapAsMarkers(filteredData);
  }, [map, heatmapData, selectedCategory, displayHeatmapAsMarkers]);

  const displayClusters = useCallback(() => {
    if (!map || !clusterData.length) return;

    const filteredData =
      selectedCategory === "all"
        ? clusterData
        : clusterData.filter((data) => data.category === selectedCategory);

    // 클러스터 마커 표시
    filteredData.forEach((cluster) => {
      const marker = new (window as any).kakao.maps.Marker({
        position: new (window as any).kakao.maps.LatLng(
          cluster.lat,
          cluster.lng
        ),
        title: `${cluster.category} 클러스터 (${cluster.count}개)`,
      });

      marker.setMap(map);

      // 마커 클릭 이벤트
      (window as any).kakao.maps.event.addListener(marker, "click", () => {
        const infoWindow = new (window as any).kakao.maps.InfoWindow({
          content: `
              <div style="padding: 10px;">
                <h4>${cluster.category} 클러스터</h4>
                <p>상권 수: ${cluster.count}개</p>
                <p>주요 상권: ${cluster.markets.slice(0, 3).join(", ")}</p>
              </div>
            `,
        });
        infoWindow.open(map, marker);
      });
    });
  }, [map, clusterData, selectedCategory]);

  // 지도에 데이터 표시
  useEffect(() => {
    if (!map) return;

    // 기존 오버레이 제거
    if (map.overlayMapTypes) {
      map.overlayMapTypes.clear();
    }

    if (activeTab === "heatmap" || activeTab === "combined") {
      // 히트맵 표시
      displayHeatmap();
    }

    if (activeTab === "clusters" || activeTab === "combined") {
      // 클러스터 표시
      displayClusters();
    }
  }, [
    map,
    heatmapData,
    clusterData,
    activeTab,
    selectedCategory,
    displayHeatmap,
    displayClusters,
  ]);

  // 전역 함수로 모달 열기 함수 등록
  useEffect(() => {
    (window as any).openBusinessModal = (
      lat: number,
      lng: number,
      category: string
    ) => {
      // 해당 위치의 업소 정보를 가져와서 모달에 표시
      setSelectedBusiness({ lat, lng, category });
      setIsModalOpen(true);
    };

    getUserLocation();

    return () => {
      delete (window as any).openBusinessModal;
    };
  }, [getUserLocation]);

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>
          지도 시각화 데이터를 불러오는 중...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <span className="material-icons">warning</span>
        </div>
        <p className={styles.errorText}>{error}</p>
        <button
          className={styles.retryButton}
          onClick={() => {
            setError(null);
            getUserLocation();
          }}
        >
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>지도 시각화</h1>
        <p className={styles.subtitle}>
          대전광역시 상권 데이터를 지도상에서 시각적으로 분석합니다
        </p>
      </div>

      {/* 컨트롤 패널 */}
      <div className={styles.controlPanel}>
        <div className={styles.tabMenu}>
          <button
            className={`${styles.tab} ${
              activeTab === "heatmap" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("heatmap")}
          >
            <span className={styles.tabIcon}>
              <span className="material-icons">local_fire_department</span>
            </span>
            히트맵
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "clusters" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("clusters")}
          >
            <span className={styles.tabIcon}>
              <span className="material-icons">place</span>
            </span>
            클러스터
          </button>
          <button
            className={`${styles.tab} ${
              activeTab === "combined" ? styles.active : ""
            }`}
            onClick={() => setActiveTab("combined")}
          >
            <span className={styles.tabIcon}>
              <span className="material-icons">map</span>
            </span>
            통합 보기
          </button>
        </div>

        <div className={styles.controls}>
          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>카테고리</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.controlSelect}
            >
              <option value="all">전체</option>
              <option value="상업지구">상업지구</option>
              <option value="주거지구">주거지구</option>
              <option value="혼합지구">혼합지구</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>지도 유형</label>
            <select
              value={mapType}
              onChange={(e) => setMapType(e.target.value)}
              className={styles.controlSelect}
            >
              <option value="standard">일반</option>
              <option value="satellite">위성</option>
              <option value="hybrid">하이브리드</option>
            </select>
          </div>

          <div className={styles.controlGroup}>
            <label className={styles.controlLabel}>
              <input
                type="checkbox"
                checked={showLegend}
                onChange={(e) => setShowLegend(e.target.checked)}
                className={styles.controlCheckbox}
              />
              범례 표시
            </label>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className={styles.mainContent}>
        <div className={styles.mapContainer}>
          <div ref={mapRef} className={styles.map} />

          {showLegend && (
            <div className={styles.legend}>
              <h4 className={styles.legendTitle}>범례</h4>

              {activeTab === "heatmap" || activeTab === "combined" ? (
                <div className={styles.legendSection}>
                  <h5 className={styles.legendSubtitle}>활성도</h5>
                  <div className={styles.legendItems}>
                    <div className={styles.legendItem}>
                      <div
                        className={styles.legendColor}
                        style={{ backgroundColor: "#dc3545" }}
                      ></div>
                      <span>매우 높음 (0.8+)</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div
                        className={styles.legendColor}
                        style={{ backgroundColor: "#fd7e14" }}
                      ></div>
                      <span>높음 (0.6-0.8)</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div
                        className={styles.legendColor}
                        style={{ backgroundColor: "#ffc107" }}
                      ></div>
                      <span>보통 (0.4-0.6)</span>
                    </div>
                    <div className={styles.legendItem}>
                      <div
                        className={styles.legendColor}
                        style={{ backgroundColor: "#28a745" }}
                      ></div>
                      <span>낮음 (0.4 미만)</span>
                    </div>
                  </div>
                </div>
              ) : null}

              {activeTab === "clusters" || activeTab === "combined" ? (
                <div className={styles.legendSection}>
                  <h5 className={styles.legendSubtitle}>클러스터</h5>
                  <div className={styles.legendItems}>
                    <div className={styles.legendItem}>
                      <div className={styles.legendCluster}>15</div>
                      <span>상권 밀집도</span>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* 데이터 요약 */}
        <div className={styles.dataSummary}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <span className="material-icons">analytics</span>
            </div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryNumber}>
                {activeTab === "heatmap" || activeTab === "combined"
                  ? heatmapData.length
                  : 0}
              </div>
              <div className={styles.summaryLabel}>
                {activeTab === "heatmap" || activeTab === "combined"
                  ? "히트맵 포인트"
                  : "클러스터 수"}
              </div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <span className="material-icons">place</span>
            </div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryNumber}>
                {activeTab === "clusters" || activeTab === "combined"
                  ? clusterData.length
                  : 0}
              </div>
              <div className={styles.summaryLabel}>
                {activeTab === "clusters" || activeTab === "combined"
                  ? "클러스터 수"
                  : "히트맵 포인트"}
              </div>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <span className="material-icons">business</span>
            </div>
            <div className={styles.summaryContent}>
              <div className={styles.summaryNumber}>
                {clusterData.reduce((sum, cluster) => sum + cluster.count, 0)}
              </div>
              <div className={styles.summaryLabel}>총 상권 수</div>
            </div>
          </div>
        </div>
      </div>

      {/* 업소 정보 모달 */}
      <BusinessInfoModal
        business={selectedBusiness}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default MapVisualizationPage;
