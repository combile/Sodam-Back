// pages/home.tsx
import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowForward,
  ExpandMore,
  TrendingUp,
  TrendingDown,
} from "@mui/icons-material";
import styles from "./Home.module.css";
import { authAPI } from "../../api/auth.ts";
import { profileAPI } from "../../api/profile.ts";
import StartupStageModal from "../../components/StartupStageModal.tsx";

import { ReactComponent as MapIcon } from "../../assets/home/MapIcon.svg";
import { ReactComponent as BuildingIcon } from "../../assets/home/BuildingIcon.svg";
import { ReactComponent as MoneyIcon } from "../../assets/home/MoneyIcon.svg";
import { ReactComponent as BooksIcon } from "../../assets/home/BooksIcon.svg";
import { ReactComponent as ChatIcon } from "../../assets/home/ChatIcon.svg";

import DaejeonImage from "./styles/daejeon.png";
import { marketDiagnosisAPI } from "../../api/marketDiagnosis.ts";
import type { MarketStatusData } from "../../api/marketDiagnosis.ts";

interface LocationInfo {
  address: string;
  district: string;
  dong: string;
  isLoading: boolean;
  error: string | null;
}

const Home = () => {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [isBottomSectionVisible, setIsBottomSectionVisible] = useState(false);
  const bottomSectionRef = useRef<HTMLElement>(null);

  // 사장님 유형 모달 상태
  const [showStartupStageModal, setShowStartupStageModal] = useState(false);

  // 위치 정보 상태
  const [locationInfo, setLocationInfo] = useState<LocationInfo>({
    address: "현재 위치",
    district: "",
    dong: "",
    isLoading: false,
    error: null,
  });

  // 드롭다운 상태 관리
  const [dropdownStates, setDropdownStates] = useState({
    district: { isOpen: false, selected: "자치구 전체" },
    industry: { isOpen: false, selected: "전체 업종" },
    period: { isOpen: false, selected: "2025년 1분기" },
  });

  // 상권 현황 데이터 상태
  const [marketStatusData, setMarketStatusData] =
    useState<MarketStatusData | null>(null);
  const [isLoadingMarketStatus, setIsLoadingMarketStatus] = useState(false);
  const [progressBarWidth, setProgressBarWidth] = useState(0);
  const [hoveredBar, setHoveredBar] = useState<string | null>(null);

  const dropdownOptions = {
    district: ["자치구 전체", "동구", "중구", "서구", "유성구", "대덕구"],
    industry: ["전체 업종", "음식점업", "소매업", "서비스업", "제조업"],
    period: ["2025년 1분기", "2024년 4분기", "2024년 3분기", "2024년 2분기"],
  };

  const toggleDropdown = (type: "district" | "industry" | "period") => {
    setDropdownStates((prev) => {
      // 다른 드롭다운들은 모두 닫고, 클릭한 드롭다운만 토글
      const newState = {
        district: { ...prev.district, isOpen: false },
        industry: { ...prev.industry, isOpen: false },
        period: { ...prev.period, isOpen: false },
      };

      newState[type] = {
        ...prev[type],
        isOpen: !prev[type].isOpen,
      };

      return newState;
    });
  };

  const selectOption = (
    type: "district" | "industry" | "period",
    option: string
  ) => {
    setDropdownStates((prev) => ({
      ...prev,
      [type]: {
        selected: option,
        isOpen: false,
      },
    }));
  };

  // 상권 현황 데이터 로드
  const fetchMarketStatusData = useCallback(async () => {
    try {
      setIsLoadingMarketStatus(true);
      const response = await marketDiagnosisAPI.getMarketStatus({
        region: dropdownStates.district.selected,
        industry: dropdownStates.industry.selected,
        period: dropdownStates.period.selected,
      });

      if (response.success) {
        setMarketStatusData(response.data);
        console.log("상권 현황 데이터 로드 성공:", response.data);
      } else {
        console.error("상권 현황 데이터 로드 실패:", response);
      }
    } catch (error) {
      console.error("상권 현황 데이터 로드 실패:", error);
    } finally {
      setIsLoadingMarketStatus(false);
    }
  }, [
    dropdownStates.district.selected,
    dropdownStates.industry.selected,
    dropdownStates.period.selected,
  ]);

  // 외부 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(`.${styles.dropdown}`)) {
        setDropdownStates((prev) => ({
          district: { ...prev.district, isOpen: false },
          industry: { ...prev.industry, isOpen: false },
          period: { ...prev.period, isOpen: false },
        }));
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 상권 현황 데이터 로드
  useEffect(() => {
    fetchMarketStatusData();
  }, [fetchMarketStatusData]);

  // 진행률 바 애니메이션
  useEffect(() => {
    if (marketStatusData) {
      // 초기값을 0으로 설정
      setProgressBarWidth(0);

      // 약간의 지연 후 실제 값으로 애니메이션
      const timer = setTimeout(() => {
        const targetWidth = Math.min(
          Math.abs(marketStatusData.averageSales.growthRate) * 10,
          100
        );
        setProgressBarWidth(targetWidth);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [marketStatusData]);

  // 숫자 포맷팅 함수
  const formatNumber = (num: number): string => {
    if (num >= 100000000) {
      return `${(num / 100000000).toFixed(1)}억`;
    } else if (num >= 10000) {
      return `${(num / 10000).toFixed(0)}만`;
    } else {
      return num.toLocaleString();
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 사장님 유형 확인 및 모달 표시
  useEffect(() => {
    const checkStartupStage = () => {
      const currentUser = authAPI.getCurrentUser();
      if (currentUser && !currentUser.businessStage) {
        setShowStartupStageModal(true);
      }
    };

    checkStartupStage();
  }, []);

  // Intersection Observer for bottom section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isBottomSectionVisible) {
          setIsBottomSectionVisible(true);
        }
      },
      {
        threshold: 0.3, // 30%가 보이면 트리거
        rootMargin: "0px 0px -100px 0px", // 하단에서 100px 전에 트리거
      }
    );

    const currentRef = bottomSectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isBottomSectionVisible]);

  // 패럴랙스 효과를 위한 인라인 스타일
  const heroStyle = {
    transform: `translateY(${scrollY * 0.3}px)`,
  };

  const cardsStyle = {
    transform: `translateY(${
      Math.max(0, scrollY - 200) * -0.15
    }px) rotateX(${Math.min(scrollY * 0.02, 5)}deg)`,
  };

  const analysisStyle = {
    transform: `translateX(${Math.max(
      0,
      (scrollY - 600) * 0.08
    )}px) scale(${Math.max(0.95, 1 - scrollY * 0.00005)})`,
  };

  const bottomStyle = {
    transform: `translateY(${Math.max(
      0,
      (scrollY - 1400) * -0.05
    )}px) scale(${Math.min(1.05, 1 + scrollY * 0.00002)})`,
  };

  // 사장님 유형 선택 처리
  const handleStartupStageSelect = async (stage: "STARTUP" | "PLANNING") => {
    try {
      setShowStartupStageModal(false);

      // 현재 토큰 확인
      const token =
        localStorage.getItem("token") || localStorage.getItem("access_token");
      if (!token) {
        alert("로그인이 필요합니다.");
        window.location.href = "/login";
        return;
      }

      console.log("사장님 유형 설정 요청:", { businessStage: stage });
      console.log("사용 중인 토큰:", token.substring(0, 20) + "...");

      // 프로필 업데이트 API 호출
      const response = await profileAPI.updateProfile({
        businessStage: stage,
      });

      if (response.success) {
        // 업데이트된 사용자 정보로 로컬 스토리지 업데이트
        localStorage.setItem("user", JSON.stringify(response.user));

        // 성공 알림
        alert("사장님 유형이 설정되었습니다!");

        console.log("사장님 유형 설정 완료:", stage);
      } else {
        alert("사장님 유형 설정에 실패했습니다.");
        // 실패 시 모달 다시 표시
        setShowStartupStageModal(true);
      }
    } catch (error) {
      console.error("사장님 유형 설정 중 오류:", error);
      console.error("오류 응답:", error.response?.data);
      console.error("오류 상태 코드:", error.response?.status);

      // 401 오류인 경우 로그인 페이지로 리다이렉트
      if (error.response?.status === 401) {
        alert("로그인이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return;
      }

      // 400 오류인 경우 (잘못된 요청)
      if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message || "요청 데이터가 올바르지 않습니다.";
        alert(`사장님 유형 설정 실패: ${errorMessage}`);
        console.error("400 오류 상세:", error.response?.data);
        setShowStartupStageModal(true);
        return;
      }

      // 422 오류인 경우 (데이터 검증 실패)
      if (error.response?.status === 422) {
        const errorMessage =
          error.response?.data?.message || "요청 데이터가 올바르지 않습니다.";
        alert(`사장님 유형 설정 실패: ${errorMessage}`);
        console.error("422 오류 상세:", error.response?.data);
        setShowStartupStageModal(true);
        return;
      }

      // 500 오류인 경우 (서버 오류)
      if (error.response?.status === 500) {
        const errorMessage =
          error.response?.data?.message || "서버 오류가 발생했습니다.";
        alert(`사장님 유형 설정 실패: ${errorMessage}`);
        console.error("500 오류 상세:", error.response?.data);
        setShowStartupStageModal(true);
        return;
      }

      // 네트워크 오류 또는 기타 오류
      if (error.code === "NETWORK_ERROR" || !error.response) {
        alert("네트워크 연결을 확인해주세요.");
        setShowStartupStageModal(true);
        return;
      }

      // 기타 오류
      const errorMessage =
        error.response?.data?.message || "알 수 없는 오류가 발생했습니다.";
      alert(`사장님 유형 설정 실패: ${errorMessage}`);
      setShowStartupStageModal(true);
    }
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    setLocationInfo((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!navigator.geolocation) {
      setLocationInfo((prev) => ({
        ...prev,
        isLoading: false,
        error: "이 브라우저에서는 위치 정보를 지원하지 않습니다.",
      }));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // 좌표를 기반으로 대전 지역인지 확인하고 간단한 주소 생성
          const isInDaejeon =
            latitude >= 36.0 &&
            latitude <= 36.5 &&
            longitude >= 127.0 &&
            longitude <= 127.6;

          if (isInDaejeon) {
            try {
              // 좌표를 주소로 변환하는 API 호출
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                {
                  headers: {
                    "Accept-Language": "ko",
                  },
                }
              );

              if (response.ok) {
                const data = await response.json();
                const address = data.address;

                if (address) {
                  // 한국 주소인지 확인
                  if (
                    address.country === "대한민국" ||
                    address.country === "Korea"
                  ) {
                    const city = address.city || address.state || "";
                    const districtName =
                      address.county || address.district || "";
                    const dongName =
                      address.suburb || address.neighbourhood || "";

                    if (city.includes("대전") || city.includes("Daejeon")) {
                      setLocationInfo({
                        address: `대전 ${districtName} ${dongName}`,
                        district: districtName,
                        dong: dongName,
                        isLoading: false,
                        error: null,
                      });
                      return;
                    }
                  }
                }
              }

              // API 호출 실패 또는 대전이 아닌 경우 기본값
              setLocationInfo({
                address: "대전 유성구 도안동",
                district: "유성구",
                dong: "도안동",
                isLoading: false,
                error: "정확한 주소를 가져올 수 없습니다.",
              });
            } catch (error) {
              console.error("주소 변환 실패:", error);
              setLocationInfo({
                address: "대전 유성구 도안동",
                district: "유성구",
                dong: "도안동",
                isLoading: false,
                error: "주소 변환에 실패했습니다.",
              });
            }

            setLocationInfo({
              address: `대전 ${district} ${dong}`,
              district,
              dong,
              isLoading: false,
              error: null,
            });
          } else {
            // 대전 지역이 아닌 경우 기본값 사용
            setLocationInfo({
              address: "현재 위치",
              district: "",
              dong: "",
              isLoading: false,
              error: "대전 지역이 아닙니다.",
            });
          }
        } catch (error) {
          console.error("위치 정보 가져오기 실패:", error);
          setLocationInfo((prev) => ({
            ...prev,
            isLoading: false,
            error: "위치 정보를 가져올 수 없습니다.",
          }));
        }
      },
      (error) => {
        console.error("Geolocation 에러:", error);
        let errorMessage = "위치 정보를 가져올 수 없습니다.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근이 거부되었습니다.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
            break;
        }

        setLocationInfo((prev) => ({
          ...prev,
          isLoading: false,
          error: errorMessage,
        }));
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      }
    );
  };

  // 컴포넌트 마운트 시 위치 정보 가져오기
  useEffect(() => {
    getCurrentLocation();
  }, []);

  return (
    <>
      <main className={styles.container}>
        {/* Hero Section */}
        <section className={styles.hero} style={heroStyle}>
          <p className={styles.subheading}>창업을 꿈꾸는 당신에게</p>
          <h1 className={styles.heading}>소담한 전략을 제공해드립니다</h1>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1252"
            height="50"
            viewBox="0 0 1252 50"
            fill="none"
            className={styles.underline}
          >
            <path
              d="M1215.96 11.1563C964.389 34.6647 684.514 50.5447 0.388938 37.6275M1251.27 1C879.481 13.957 491.548 17.791 8.21917 48.6165"
              stroke="url(#paint0_linear_102_589)"
            />
            <defs>
              <linearGradient
                id="paint0_linear_102_589"
                x1="-0.139363"
                y1="45.273"
                x2="1242.28"
                y2="131.127"
                gradientUnits="userSpaceOnUse"
              >
                <stop stopColor="#5789FF" />
                <stop offset="0.254808" stopColor="#5F9BDE" />
                <stop offset="1" stopColor="#7DDB69" />
              </linearGradient>
            </defs>
          </svg>
        </section>

        {/* 3 Feature Cards */}
        <section className={styles.featureCards} style={cardsStyle}>
          <div className={styles.cardWrapper}>
            <div
              className={`${styles.card} ${styles.cardBlue}`}
              onClick={() => navigate("/today-ceo")}
              style={{ cursor: "pointer" }}
            >
              <h3 className={styles.cardTitle}>
                여기 터가
                <br />
                좋네유
              </h3>
              <div className={styles.cardIcon}>
                <MapIcon />
              </div>
            </div>
          </div>
          <div className={styles.cardWrapper}>
            <div
              className={`${styles.card} ${styles.cardGreen}`}
              onClick={() => navigate("/today-ceo")}
              style={{ cursor: "pointer" }}
            >
              <h3 className={styles.cardTitle}>
                오늘도
                <br />
                사장
              </h3>
              <div className={styles.cardIcon}>
                <BuildingIcon />
              </div>
            </div>
          </div>
          <div className={styles.cardWrapper}>
            <div
              className={`${styles.card} ${styles.cardLightGreen}`}
              onClick={() => navigate("/tomorrow-ceo")}
              style={{ cursor: "pointer" }}
            >
              <h3 className={styles.cardTitle}>
                내일은
                <br />
                사장
              </h3>
              <div className={styles.cardIcon}>
                <MoneyIcon />
              </div>
            </div>
          </div>
        </section>

        {/* 분석 Top3 */}
        <section className={styles.analysisSection} style={analysisStyle}>
          <img
            src={DaejeonImage}
            alt="대전 배경"
            className={styles.backgroundImage}
          />
          <h2 className={styles.analysisTitle}>분석 바로보기</h2>
          <hr className={styles.divider} />

          <div className={styles.analysisCards}>
            <div
              className={styles.analysisCard}
              onClick={() => navigate("/market-analysis")}
            >
              <div className={styles.cardHeader}>
                <h4>상권분석</h4>
                <ArrowForward className={styles.arrow} />
              </div>
              <p>
                {locationInfo.isLoading ? (
                  "위치 정보를 가져오는 중..."
                ) : locationInfo.error ? (
                  <>
                    현재 위치,
                    <br />
                    <button
                      onClick={getCurrentLocation}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#a9c2cb",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontSize: "14px",
                        marginTop: "8px",
                      }}
                    >
                      내 위치로 변경
                    </button>
                  </>
                ) : (
                  <>
                    {locationInfo.address},
                    <br />
                    이곳 주변은 어떤가요?
                    <br />
                    <button
                      onClick={getCurrentLocation}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#a9c2cb",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontSize: "14px",
                        marginTop: "8px",
                      }}
                    >
                      위치 다시 가져오기
                    </button>
                  </>
                )}
              </p>
            </div>
            <div className={styles.analysisCard}>
              <div className={styles.cardHeader}>
                <h4>창업분석</h4>
                <ArrowForward className={styles.arrow} />
              </div>
              <p>
                당신의 창업 아이템,
                <br />
                이곳에서 통할까요?
              </p>
            </div>
            <div className={styles.analysisCard}>
              <div className={styles.cardHeader}>
                <h4>리스크 분석</h4>
                <ArrowForward className={styles.arrow} />
              </div>
              <p>
                이 상권은 안전한가요?
                <br />
                데이터로 확인하세요
              </p>
            </div>
          </div>
        </section>

        {/* 상권 현황 */}
        <section className={styles.marketSection}>
          <div className={styles.marketHeader}>
            <h2 className={styles.marketTitle}>
              대전광역시
              <br />
              <span className={styles.marketTitleBold}>상권 현황</span>
            </h2>
            <div className={styles.filters}>
              <div className={styles.dropdown}>
                <button
                  className={styles.dropdownButton}
                  onClick={() => toggleDropdown("district")}
                >
                  {dropdownStates.district.selected}
                  <span
                    className={`${styles.dropdownArrow} ${
                      dropdownStates.district.isOpen ? styles.open : ""
                    }`}
                  >
                    <ExpandMore />
                  </span>
                </button>
                {dropdownStates.district.isOpen && (
                  <div className={styles.dropdownMenu}>
                    {dropdownOptions.district.map((option) => (
                      <button
                        key={option}
                        className={styles.dropdownOption}
                        onClick={() => selectOption("district", option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.dropdown}>
                <button
                  className={styles.dropdownButton}
                  onClick={() => toggleDropdown("industry")}
                >
                  {dropdownStates.industry.selected}
                  <span
                    className={`${styles.dropdownArrow} ${
                      dropdownStates.industry.isOpen ? styles.open : ""
                    }`}
                  >
                    <ExpandMore />
                  </span>
                </button>
                {dropdownStates.industry.isOpen && (
                  <div className={styles.dropdownMenu}>
                    {dropdownOptions.industry.map((option) => (
                      <button
                        key={option}
                        className={styles.dropdownOption}
                        onClick={() => selectOption("industry", option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={styles.dropdown}>
                <button
                  className={styles.dropdownButton}
                  onClick={() => toggleDropdown("period")}
                >
                  {dropdownStates.period.selected}
                  <span
                    className={`${styles.dropdownArrow} ${
                      dropdownStates.period.isOpen ? styles.open : ""
                    }`}
                  >
                    <ExpandMore />
                  </span>
                </button>
                {dropdownStates.period.isOpen && (
                  <div className={styles.dropdownMenu}>
                    {dropdownOptions.period.map((option) => (
                      <button
                        key={option}
                        className={styles.dropdownOption}
                        onClick={() => selectOption("period", option)}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className={styles.marketCards}>
            <div className={styles.marketCard}>
              <h4>평균 매출액</h4>
              <p className={styles.marketPeriod}>
                {marketStatusData?.period || "2025년 1월 기준"}
              </p>
              {isLoadingMarketStatus ? (
                <div className={styles.loading}>로딩 중...</div>
              ) : marketStatusData ? (
                <>
                  <div className={styles.marketStats}>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>현재</span>
                      <span className={styles.statValue}>
                        {formatNumber(marketStatusData.averageSales.current)}
                      </span>
                    </div>
                    <div className={styles.statItem}>
                      <span className={styles.statLabel}>전년</span>
                      <span className={styles.statValue}>
                        {formatNumber(marketStatusData.averageSales.previous)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${progressBarWidth}%`,
                        backgroundColor:
                          marketStatusData.averageSales.growthRate > 0
                            ? "#4ECDC4"
                            : "#FF6B6B",
                      }}
                    ></div>
                  </div>
                  <div className={styles.growthRate}>
                    {marketStatusData.averageSales.growthRate > 0 ? (
                      <TrendingUp />
                    ) : (
                      <TrendingDown />
                    )}{" "}
                    {Math.abs(marketStatusData.averageSales.growthRate)}%
                  </div>
                </>
              ) : (
                <div className={styles.error}>데이터를 불러올 수 없습니다</div>
              )}
            </div>

            <div className={styles.marketCard}>
              <h4>주거 인구</h4>
              <p className={styles.marketPeriod}>
                {marketStatusData?.period || "2025년 1월 기준"}
              </p>
              {isLoadingMarketStatus ? (
                <div className={styles.loading}>로딩 중...</div>
              ) : marketStatusData ? (
                <div className={styles.populationChartContainer}>
                  <div className={styles.populationChart}>
                    {marketStatusData.residentialPopulation.map(
                      (district, index) => (
                        <div key={district.name} className={styles.barGroup}>
                          <div className={styles.barContainer}>
                            <div
                              className={styles.bar}
                              style={{
                                height: `${district.percentage}%`,
                              }}
                              onMouseEnter={() => setHoveredBar(district.name)}
                              onMouseLeave={() => setHoveredBar(null)}
                            >
                              {hoveredBar === district.name && (
                                <div className={styles.barValue}>
                                  {(district.population / 10000).toFixed(0)}만
                                </div>
                              )}
                            </div>
                          </div>
                          <span className={styles.barLabel}>
                            {district.name}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                      <div className={styles.legendColor}></div>
                      <span>주거인구 (만명)</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.error}>데이터를 불러올 수 없습니다</div>
              )}
            </div>

            <div className={styles.marketCard}>
              <h4>업소 수</h4>
              <p className={styles.marketPeriod}>
                {marketStatusData?.period || "2025년 1월 기준"}
              </p>
              {isLoadingMarketStatus ? (
                <div className={styles.loading}>로딩 중...</div>
              ) : marketStatusData ? (
                <div className={styles.businessCount}>
                  <span className={styles.countNumber}>
                    {marketStatusData.totalStores.toLocaleString()}
                  </span>
                  <span className={styles.countUnit}>개</span>
                </div>
              ) : (
                <div className={styles.error}>데이터를 불러올 수 없습니다</div>
              )}
            </div>
          </div>
        </section>

        {/* 정책 및 QnA */}
        <section
          ref={bottomSectionRef}
          className={`${styles.bottomSection} ${
            isBottomSectionVisible ? styles.bottomSectionVisible : ""
          }`}
          style={bottomStyle}
        >
          <div className={styles.policyBox}>
            <div className={styles.bottomCardInner}>
              <div className={styles.bottomContent}>
                <h3>나를 위한 맞춤형 정책</h3>
                <p>당신만을 위한 최적의 정책을 찾아드립니다</p>
                <button
                  className={styles.bottomBtn}
                  onClick={() => navigate("/policy/list")}
                >
                  바로가기 <ArrowForward />
                </button>
              </div>
            </div>
            <div className={styles.bottomIcon_policy}>
              <BooksIcon />
            </div>
          </div>
          <div className={styles.helpBox}>
            <div className={styles.bottomContent}>
              <div className={styles.bottomCardInner}>
                <h3>사장님, 도와줘요</h3>
                <p>유사업종 사장님에게 많은 것을 물어보세요</p>
                <button
                  className={styles.bottomBtn}
                  onClick={() => navigate("/damso")}
                >
                  바로가기 <ArrowForward />
                </button>
              </div>
            </div>
            <div className={styles.bottomIcon_help}>
              <ChatIcon />
            </div>
          </div>
        </section>
      </main>

      {/* 사장님 유형 선택 모달 */}
      {showStartupStageModal && (
        <StartupStageModal
          onSelect={handleStartupStageSelect}
          onClose={() => setShowStartupStageModal(false)}
        />
      )}
    </>
  );
};

export default Home;
