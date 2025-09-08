import React, { useState, useEffect, useRef, useCallback } from "react";

interface UserLocation {
  lat: number;
  lng: number;
}

interface MarketAnalysis {
  type: string;
  description: string;
  color: string;
  riskLevel: string;
}

interface StrategyCard {
  title: string;
  description: string;
  icon: string;
  color: string;
}

const MarketAnalysisPage: React.FC = () => {
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [map, setMap] = useState<any>(null);
  const [circle, setCircle] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analysisRadius, setAnalysisRadius] = useState(500);
  const [marketHealthScore, setMarketHealthScore] = useState(0);
  const [currentRiskType, setCurrentRiskType] = useState<string>("");
  const [riskAnalysis, setRiskAnalysis] = useState<MarketAnalysis | null>(null);
  const [strategyCards, setStrategyCards] = useState<StrategyCard[]>([]);

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
        setError("위치 정보를 가져올 수 없습니다.");
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  }, []);

  // 폴백 지도 로드
  const loadFallbackMap = useCallback(() => {
    console.log("폴백 지도 로드");
    setError("카카오맵을 불러올 수 없어 기본 지도를 표시합니다.");
  }, []);

  // 지도 초기화 (사용자 위치 기반)
  useEffect(() => {
    if (!userLocation) return;

    // 카카오맵 API 키가 유효한지 확인
    const checkKakaoMap = async () => {
      try {
        // 이미 스크립트가 로드되어 있는지 확인
        if (document.querySelector('script[src*="dapi.kakao.com"]')) {
          if ((window as any).kakao) {
            initializeKakaoMap();
          } else {
            // 스크립트는 있지만 kakao 객체가 없는 경우
            setTimeout(() => {
              if ((window as any).kakao) {
                initializeKakaoMap();
              } else {
                console.error("카카오맵 객체를 찾을 수 없습니다");
                loadFallbackMap();
              }
            }, 1000);
          }
        } else {
          console.log("카카오맵 스크립트 로딩 시작");
          const script = document.createElement("script");
          script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=f4cc7a593ecade740db60c38c67ff038&autoload=false&libraries=services`;
          script.async = true;

          script.onload = () => {
            console.log("카카오맵 스크립트 onload 실행됨");
            console.log("window.kakao 존재:", !!(window as any).kakao);
            if ((window as any).kakao) {
              console.log("카카오맵 객체 발견, 초기화 시작");
              initializeKakaoMap();
            } else {
              console.error(
                "카카오맵 스크립트 로드 후에도 객체를 찾을 수 없습니다"
              );
              loadFallbackMap();
            }
          };

          script.onerror = () => {
            console.error("카카오맵 스크립트 로드 실패");
            loadFallbackMap();
          };

          document.head.appendChild(script);
          console.log("카카오맵 스크립트 DOM에 추가됨");
        }
      } catch (error) {
        console.error("카카오맵 로드 중 오류:", error);
        loadFallbackMap();
      }
    };

    const initializeKakaoMap = () => {
      try {
        console.log("카카오맵 초기화 시작");
        console.log("window.kakao 존재:", !!(window as any).kakao);
        console.log("window.kakao.maps 존재:", !!(window as any).kakao?.maps);
        console.log(
          "window.kakao.maps.load 존재:",
          !!(window as any).kakao?.maps?.load
        );

        if (!(window as any).kakao || !(window as any).kakao.maps) {
          console.error("카카오맵 API가 로드되지 않았습니다");
          loadFallbackMap();
          return;
        }

        (window as any).kakao.maps.load(() => {
          console.log("카카오맵 로드 콜백 실행됨");
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
            console.log("카카오맵 생성 성공:", kakaoMap);
            setMap(kakaoMap);

            // API 호출 제거 - 카카오맵만 테스트
            console.log("카카오맵만 표시 - API 호출 제거됨");

            // 더미 데이터로 상권 분석 실행
            const dummyStores = [
              {
                bizesNm: "테스트 상점 1",
                indsLclsNm: "음식",
                rdnmAdr: "테스트 주소 1",
                lat: userLocation.lat + 0.001,
                lon: userLocation.lng + 0.001,
              },
              {
                bizesNm: "테스트 상점 2",
                indsLclsNm: "음식",
                rdnmAdr: "테스트 주소 2",
                lat: userLocation.lat - 0.001,
                lon: userLocation.lng - 0.001,
              },
            ];

            // 상권 분석 실행
            try {
              console.log("상권 분석 시작");
              const healthScore = 75; // 더미 점수
              console.log("건강도 점수:", healthScore);

              const riskAnalysis = {
                type: "안정형",
                description: "유입·소비력 보통, 경쟁 낮음",
                color: "#28a745",
                riskLevel: "낮음",
              };
              console.log("위험도 분석:", riskAnalysis);

              const strategyCards = [
                {
                  title: "고객 유치 전략",
                  description: "주변 대학생을 타겟으로 한 마케팅 강화",
                  color: "#2196F3",
                },
                {
                  title: "차별화 전략",
                  description: "독특한 메뉴와 서비스로 경쟁 우위 확보",
                  color: "#FF9800",
                },
              ];
              console.log("전략 카드 생성 완료:", strategyCards.length, "개");

              setMarketHealthScore(healthScore);
              setCurrentRiskType(riskAnalysis.type);
              setRiskAnalysis(riskAnalysis);
              setStrategyCards(strategyCards);
            } catch (analysisError) {
              console.error("상권 분석 중 에러:", analysisError);
            }
          } catch (error) {
            console.error("카카오맵 초기화 중 오류:", error);
            loadFallbackMap();
          }
        });
      } catch (error) {
        console.error("카카오맵 초기화 중 오류:", error);
        loadFallbackMap();
      }
    };

    checkKakaoMap();
  }, [userLocation, analysisRadius, loadFallbackMap]);

  // 컴포넌트 마운트 시 위치 정보 가져오기
  useEffect(() => {
    getUserLocation();
  }, [getUserLocation]);

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>
          로딩 중...
        </div>
        <div
          style={{
            width: "40px",
            height: "40px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #3498db",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
            margin: "0 auto",
          }}
        ></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <div
          style={{
            padding: "1rem",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            border: "1px solid #f5c6cb",
            borderRadius: "4px",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "1rem",
        minHeight: "calc(100vh - 120px)", // 헤더와 푸터 높이를 고려한 최소 높이
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "0.5rem", marginTop: 0 }}>
        상권 분석
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "1.5rem",
          flex: 1,
          minHeight: 0, // 그리드 아이템이 부모 높이를 넘지 않도록
        }}
      >
        {/* 지도 섹션 */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              flex: 1,
              display: "flex",
              flexDirection: "column",
              minHeight: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <h2 style={{ fontSize: "1.25rem", margin: 0 }}>상권 지도</h2>
              <button
                onClick={getUserLocation}
                style={{
                  padding: "0.5rem",
                  border: "none",
                  backgroundColor: "#007bff",
                  color: "white",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                현재 위치
              </button>
            </div>
            <div
              ref={mapRef}
              style={{
                width: "100%",
                flex: 1,
                minHeight: "400px",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
                backgroundColor: "#f8f9fa",
              }}
            />
            {userLocation && (
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "#666",
                  marginTop: "0.5rem",
                  margin: 0,
                }}
              >
                현재 위치: {userLocation.lat.toFixed(6)},{" "}
                {userLocation.lng.toFixed(6)}
              </p>
            )}
          </div>
        </div>

        {/* 분석 결과 섹션 */}
        <div style={{ display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div
            style={{
              backgroundColor: "white",
              padding: "1.5rem",
              borderRadius: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              flex: 1,
              overflowY: "auto", // 내용이 많을 때 스크롤 가능
              maxHeight: "100%",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                marginBottom: "1rem",
                marginTop: 0,
              }}
            >
              상권 분석 결과
            </h2>

            {/* 건강도 점수 */}
            <div
              style={{
                backgroundColor: "#f8f9fa",
                padding: "1rem",
                borderRadius: "8px",
                marginBottom: "1rem",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#666" }}>
                  상권 건강도
                </span>
                <span
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "bold",
                    color: "#007bff",
                  }}
                >
                  {marketHealthScore}점
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center" }}>
                <span style={{ color: "#28a745", marginRight: "0.5rem" }}>
                  ✓
                </span>
                <span style={{ fontSize: "0.875rem" }}>
                  {marketHealthScore >= 80
                    ? "매우 좋음"
                    : marketHealthScore >= 60
                    ? "좋음"
                    : marketHealthScore >= 40
                    ? "보통"
                    : "주의 필요"}
                </span>
              </div>
            </div>

            {/* 위험도 분석 */}
            {riskAnalysis && (
              <div
                style={{
                  padding: "1rem",
                  border: "1px solid #e0e0e0",
                  borderRadius: "8px",
                  marginBottom: "1rem",
                }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "#666",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  위험도 분석
                </span>
                <span
                  style={{
                    display: "inline-block",
                    padding: "0.25rem 0.5rem",
                    backgroundColor:
                      riskAnalysis.riskLevel === "낮음" ? "#d4edda" : "#fff3cd",
                    color:
                      riskAnalysis.riskLevel === "낮음" ? "#155724" : "#856404",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {riskAnalysis.type}
                </span>
                <p style={{ fontSize: "0.875rem", margin: 0 }}>
                  {riskAnalysis.description}
                </p>
              </div>
            )}

            {/* 전략 카드 */}
            {strategyCards.length > 0 && (
              <div>
                <span
                  style={{
                    fontSize: "0.875rem",
                    color: "#666",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  추천 전략
                </span>
                {strategyCards.map((card, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "1rem",
                      border: "1px solid #e0e0e0",
                      borderRadius: "8px",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span
                        style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
                      >
                        {card.icon}
                      </span>
                      <div>
                        <div
                          style={{
                            fontSize: "0.875rem",
                            fontWeight: "bold",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {card.title}
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#666" }}>
                          {card.description}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketAnalysisPage;
