import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./TodayCeoPage.module.css";
import BusinessItemModal, {
  BusinessItemData,
} from "../../components/BusinessItemModal";
import MarketAnalysisCard from "../../components/MarketAnalysisCard";
import ScoreCard from "../../components/ScoreCard";
import AnalysisProcess from "../../components/AnalysisProcess";
import MedicalDiagnosisModal from "../../components/MedicalDiagnosisModal";
import DetailedMarketReport from "../../components/DetailedMarketReport";
import ExecutionStrategyPanel from "../../components/ExecutionStrategyPanel";
import { authAPI } from "../../api/auth";
import { profileAPI } from "../../api/profile";
import {
  Business,
  Analytics,
  Description,
  Assessment,
  Search,
  TrendingUp,
  Warning,
  Lightbulb,
} from "@mui/icons-material";

interface MarketAnalysisData {
  footTraffic: number;
  dwellTime: number;
  competition: number;
  businessRates: number;
  cardSales: number;
}

interface ScoreData {
  score: number;
  opinion: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

// CSV 데이터 기반 계산 함수들
const getMarketRankFromScore = (score: number): number => {
  // 점수에 따른 순위 계산 (1-20위)
  if (score >= 95) return 1;
  if (score >= 90) return 2;
  if (score >= 85) return 3;
  if (score >= 80) return 4;
  if (score >= 75) return 5;
  if (score >= 70) return 6;
  if (score >= 65) return 7;
  if (score >= 60) return 8;
  if (score >= 55) return 10;
  if (score >= 50) return 12;
  if (score >= 45) return 15;
  if (score >= 40) return 18;
  return 20;
};

const getChangeRateFromData = (marketData: any, score: number): number => {
  // 점수와 시장 데이터를 기반으로 변화율 계산
  const baseRate = Math.floor(score / 10) - 5; // -5 ~ +5 범위
  const marketFactor = marketData?.footTraffic
    ? Math.floor(marketData.footTraffic / 1000)
    : 0;
  return Math.max(-15, Math.min(15, baseRate + marketFactor));
};

const getCompetitionDataFromCSV = (district: string, industry: string) => {
  // 지역별 지출액 비율 데이터
  const regionalData: { [key: string]: number } = {
    대덕구: 3.6,
    동구: 38.9,
    서구: 16.9,
    유성구: 30.1,
    중구: 10.5,
  };

  // 업종별 지출액 비율 데이터
  const industryData: { [key: string]: number } = {
    쇼핑업: 29.2,
    숙박업: 1.3,
    식음료업: 35.1,
    여가서비스업: 1.6,
    여행업: 0.0,
    운송업: 32.8,
  };

  const regionalScore = regionalData[district] || 10.5;
  const industryScore = industryData[industry] || 20.0;

  return {
    total_businesses: Math.floor(regionalScore * 2) + 50,
    competition_score: Math.floor((regionalScore + industryScore) / 2),
  };
};

const TodayCeoPage: React.FC = () => {
  const navigate = useNavigate();

  // 상권분석 완료 여부 확인 함수
  const checkAnalysisCompletion = (): boolean => {
    // 실제로는 API를 통해 상권분석 완료 여부를 확인해야 함
    // 현재는 mock 데이터로 확인
    const hasAnalysisData =
      marketAnalysisData &&
      marketAnalysisData.footTraffic > 0 &&
      marketAnalysisData.dwellTime > 0;
    return hasAnalysisData;
  };

  const handleDetailedReportClick = () => {
    if (!checkAnalysisCompletion()) {
      setShowAnalysisRequired(true);
      return;
    }
    setShowDetailedReport(true);
  };

  const handleGoToAnalysis = () => {
    navigate("/market-analysis");
    setShowAnalysisRequired(false);
  };

  const handleCloseAnalysisModal = () => {
    setShowAnalysisRequired(false);
  };
  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false); // 진단 모달 상태
  const [businessInfo, setBusinessInfo] = useState<BusinessItemData | null>(
    null
  );
  const [marketAnalysisData, setMarketAnalysisData] =
    useState<MarketAnalysisData | null>(null);
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<any>(null);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [isAnalysisStarted, setIsAnalysisStarted] = useState(false);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [showAnalysisRequired, setShowAnalysisRequired] = useState(false);
  const [diagnosisResult, setDiagnosisResult] = useState<any>(null);
  const [isDiagnosisCompleted, setIsDiagnosisCompleted] = useState(false);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (!currentUser) {
      navigate("/login");
      return;
    }

    // 관심 지역 정보 파싱
    const preferredAreas = currentUser.preferences?.preferredAreas;
    if (!preferredAreas || preferredAreas.length === 0) {
      alert("관심 사업 지역을 먼저 등록해주세요");
      navigate("/market-analysis");
      return;
    }

    // 첫 번째 관심 지역 파싱 (예: "중구 태평2동" -> district: "중구", dong: "태평2동")
    const firstArea = preferredAreas[0];
    const areaParts = firstArea.split(" ");
    if (areaParts.length < 2) {
      alert(
        "관심 지역 정보가 올바르지 않습니다. 마이페이지에서 다시 설정해주세요."
      );
      navigate("/mypage");
      return;
    }

    const district = areaParts[0];
    const dong = areaParts.slice(1).join(" "); // "태평2동" 또는 "태평 2동" 등 처리

    setUser(currentUser);
  }, [navigate]);

  // user가 설정된 후에 loadBusinessInfo 호출
  useEffect(() => {
    if (user) {
      loadBusinessInfo();
    }
  }, [user]);

  const loadBusinessInfo = async () => {
    try {
      // 진단 결과가 있는지 확인
      const diagnosisResult = localStorage.getItem("diagnosisResult");

      if (diagnosisResult) {
        const diagnosis = JSON.parse(diagnosisResult);

        // 진단 결과에서 업종 정보 추출
        const industryNames = ["음식점/카페", "소매업", "서비스업", "기타"];
        const selectedIndustry = industryNames[diagnosis.answers[0]] || "";

        // 진단 결과에서 지역 정보도 추출 (질문 4번이 지역 관련)
        const locationNames = ["유성구", "서구", "동구", "중구"];
        const selectedLocation =
          locationNames[diagnosis.answers[4]] || "유성구";

        // 유저의 관심 지역 정보 사용 (진단 결과가 없으면 유저 선호도 사용)
        let district = selectedLocation;
        let dong = "궁동"; // 기본값

        if (user && user.preferences?.preferredAreas?.length > 0) {
          const firstArea = user.preferences.preferredAreas[0];
          const areaParts = firstArea.split(" ");
          district = areaParts[0] || selectedLocation;
          dong = areaParts.slice(1).join(" ") || "궁동";
        }

        const businessInfo: BusinessItemData = {
          industry: selectedIndustry,
          location: {
            district: district,
            dong: dong,
            address: `대전 ${district} ${dong}`,
          },
        };
        setBusinessInfo(businessInfo);

        // 진단 결과도 상태에 저장
        setDiagnosisResult(diagnosis);
        setIsDiagnosisCompleted(true);
      } else {
        // 기존 로직 (진단 결과가 없는 경우)
        localStorage.removeItem("businessInfo");

        if (user && user.preferences?.preferredAreas?.length > 0) {
          const firstArea = user.preferences.preferredAreas[0];
          const areaParts = firstArea.split(" ");
          const district = areaParts[0];
          const dong = areaParts.slice(1).join(" ");

          const defaultIndustry =
            user.preferences?.interestedBusinessTypes?.[0] || "";

          const defaultBusinessInfo: BusinessItemData = {
            industry: defaultIndustry,
            location: {
              district: district,
              dong: dong,
              address: `대전 ${district} ${dong}`,
            },
          };
          setBusinessInfo(defaultBusinessInfo);
        }
      }
    } catch (error) {
      console.error("사업 정보 로드 실패:", error);
    }
  };

  const handleBusinessSubmit = async (data: BusinessItemData) => {
    try {
      // 실제로는 API에 사업 정보를 저장해야 함
      localStorage.setItem("businessInfo", JSON.stringify(data));
      setBusinessInfo(data);
      setShowBusinessModal(false);

      // 진단 완료 상태에서만 분석 시작
      if (isDiagnosisCompleted) {
        startAnalysis(data);
      }
    } catch (error) {
      console.error("사업 정보 저장 실패:", error);
      throw error;
    }
  };

  const startAnalysis = async (businessData: BusinessItemData) => {
    setIsLoading(true);
    setIsAnalysisStarted(true);
    setError(null);
    setAnalysisStep(0);

    try {
      // 각 단계를 순차적으로 실행
      await runAnalysisStep(1, 2000);
      await runAnalysisStep(2, 2500);

      // 시뮬레이션된 상권 분석 데이터
      const mockMarketData: MarketAnalysisData = {
        footTraffic: Math.floor(Math.random() * 10000) + 5000,
        dwellTime: Math.floor(Math.random() * 30) + 60,
        competition: Math.floor(Math.random() * 40) + 30,
        businessRates: Math.floor(Math.random() * 20) + 70,
        cardSales: Math.floor(Math.random() * 25) + 75,
      };

      setMarketAnalysisData(mockMarketData);

      await runAnalysisStep(3, 2000);
      await runAnalysisStep(4, 1500);

      // 진단 결과를 기반으로 점수 데이터 생성
      let baseScore = 70; // 기본 점수

      if (diagnosisResult) {
        // 진단 결과의 점수를 기반으로 조정
        baseScore = diagnosisResult.score;
        // 약간의 랜덤 요소 추가 (±5점)
        baseScore += Math.floor(Math.random() * 10) - 5;
        baseScore = Math.max(60, Math.min(95, baseScore)); // 60-95점 범위 제한
      } else {
        // 진단 결과가 없으면 기존 로직
        baseScore = Math.floor(Math.random() * 40) + 60;
      }

      const mockScoreData: ScoreData = generateScoreData(
        baseScore,
        businessData,
        diagnosisResult
      );
      setScoreData(mockScoreData);
    } catch (error) {
      setError("분석 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 각 분석 단계를 실행하는 헬퍼 함수
  const runAnalysisStep = async (step: number, duration: number) => {
    return new Promise<void>((resolve) => {
      setAnalysisStep(step);
      setTimeout(() => {
        resolve();
      }, duration);
    });
  };

  const generateScoreData = (
    score: number,
    businessData: BusinessItemData,
    diagnosisData?: any
  ): ScoreData => {
    // 진단 결과가 있으면 진단 결과의 추천사항을 활용
    let opinions = [
      "현재 위치에서 선택하신 업종으로 사업을 운영하기에 적합한 환경입니다. 유동인구와 체류시간이 양호하여 안정적인 매출을 기대할 수 있습니다.",
      "선택하신 지역의 상권 환경이 우수합니다. 경쟁업체 대비 차별화된 전략을 수립한다면 성공적인 사업 운영이 가능할 것으로 판단됩니다.",
      "현재 상권 상황이 양호하지만, 일부 개선이 필요한 부분이 있습니다. 마케팅 강화와 고객 서비스 개선을 통해 경쟁력을 높일 수 있습니다.",
      "선택하신 업종과 지역의 매칭도가 높습니다. 다만 경쟁이 치열한 편이므로 차별화된 서비스와 마케팅 전략이 필요합니다.",
    ];

    // 진단 결과가 있으면 진단 결과의 추천사항을 의견에 포함
    if (diagnosisData && diagnosisData.recommendations) {
      opinions = [
        ...diagnosisData.recommendations,
        ...opinions.slice(0, 2), // 기존 의견 2개만 추가
      ];
    }

    const strengths = [
      "유동인구 증가",
      "체류시간 양호",
      "카드매출 증가",
      "사업률 상승",
      "접근성 우수",
    ];

    const weaknesses = [
      "경쟁업체 증가",
      "임대료 상승",
      "유동인구 감소",
      "카드매출 감소",
      "체류시간 단축",
    ];

    const recommendations = [
      "마케팅 강화",
      "차별화 전략 수립",
      "고객 서비스 개선",
      "온라인 채널 확대",
      "비용 최적화",
    ];

    // 점수에 따른 의견 선택
    let selectedOpinion = opinions[0];
    if (score < 70) selectedOpinion = opinions[2];
    else if (score < 80) selectedOpinion = opinions[3];
    else if (score < 90) selectedOpinion = opinions[1];
    else selectedOpinion = opinions[0];

    // 랜덤하게 강점, 약점, 추천사항 선택
    const selectedStrengths = strengths.slice(
      0,
      Math.floor(Math.random() * 3) + 2
    );
    const selectedWeaknesses = weaknesses.slice(
      0,
      Math.floor(Math.random() * 2) + 1
    );
    const selectedRecommendations = recommendations.slice(
      0,
      Math.floor(Math.random() * 3) + 2
    );

    return {
      score,
      opinion: selectedOpinion,
      strengths: selectedStrengths,
      weaknesses: selectedWeaknesses,
      recommendations: selectedRecommendations,
    };
  };

  const handleEditBusiness = () => {
    setShowBusinessModal(true);
  };

  const handleAnalyzeMarket = () => {
    if (businessInfo) {
      startAnalysis(businessInfo);
    }
  };

  if (!user) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <div className={styles.loadingText}>로딩 중...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>오늘도 사장</h1>
        <p className={styles.subtitle}>
          현재 운영 중인 사업의 상권 분석 결과를 확인하세요
        </p>
      </div>

      <div className={styles.userInfo}>
        <div className={styles.userAvatar}>
          {user.nickname ? user.nickname.charAt(0) : "U"}
        </div>
        <div className={styles.userDetails}>
          <div className={styles.userName}>{user.nickname || "사용자"}</div>
          <div className={styles.userType}>
            {user.businessStage === "STARTUP"
              ? "현재 사장님"
              : user.businessStage === "PLANNING"
              ? "예비 창업자 (현재 사장님 페이지)"
              : "사장님 유형 미설정"}
          </div>
        </div>
        <button
          className={styles.diagnosisButton}
          onClick={() => {
            // 항상 진단 모달 열기 (진단 완료 여부와 관계없이)
            setShowDiagnosisModal(true);
            // 분석 상태 초기화
            setIsAnalysisStarted(false);
            setAnalysisStep(0);
          }}
        >
          {isDiagnosisCompleted ? "분석 시작하기" : "사업 진단 시작"}
        </button>
      </div>

      {/* 페이지 내용 */}
      <div className={styles.businessInfo}>
        <div className={styles.businessHeader}>
          <div className={styles.businessTitle}>
            <div className={styles.businessIcon}>
              <Business style={{ fontSize: "16px" }} />
            </div>
            사업 정보
          </div>
          {businessInfo && (
            <button className={styles.editButton} onClick={handleEditBusiness}>
              수정
            </button>
          )}
        </div>

        {businessInfo ? (
          <div className={styles.businessDetails}>
            <div className={styles.businessItem}>
              <div className={styles.businessLabel}>업종</div>
              <div className={styles.businessValue}>
                {businessInfo.industry}
              </div>
            </div>
            <div className={styles.businessItem}>
              <div className={styles.businessLabel}>위치</div>
              <div className={styles.businessValue}>
                {businessInfo.location.address}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.noBusinessInfo}>
            <div className={styles.noBusinessTitle}>사업 정보가 없습니다</div>
            <div className={styles.noBusinessText}>
              상권 분석을 위해 현재 운영 중인 사업 정보를 등록해주세요
            </div>
            <button
              className={styles.registerButton}
              onClick={() => setShowBusinessModal(true)}
            >
              사업 정보 등록
            </button>
          </div>
        )}
      </div>

      {businessInfo && (
        <div className={styles.content}>
          <div className={styles.analysisSection}>
            <div className={styles.sectionTitle}>
              <div className={styles.sectionIcon}>
                <Analytics style={{ fontSize: "18px" }} />
              </div>
              상권 분석
            </div>

            {isLoading ? (
              <>
                <AnalysisProcess
                  currentStep={analysisStep}
                  businessInfo={businessInfo}
                />
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  <div className={styles.loadingText}>
                    상권을 분석하고 있습니다...
                  </div>
                </div>
              </>
            ) : error ? (
              <div className={styles.error}>
                {error}
                <button
                  className={styles.registerButton}
                  onClick={handleAnalyzeMarket}
                  style={{ marginTop: "16px" }}
                >
                  다시 분석하기
                </button>
              </div>
            ) : (
              <>
                {/* 진단 모달이 열려있을 때도 분석 프로세스 표시 */}
                {(isDiagnosisCompleted || showDiagnosisModal) && (
                  <>
                    <AnalysisProcess
                      currentStep={isAnalysisStarted ? analysisStep : 0}
                      businessInfo={businessInfo}
                    />
                    {isAnalysisStarted && analysisStep >= 2 && (
                      <MarketAnalysisCard
                        data={marketAnalysisData || undefined}
                        location={businessInfo.location.address}
                        onAnalyze={handleAnalyzeMarket}
                      />
                    )}

                    {isAnalysisStarted && analysisStep >= 4 && (
                      <ScoreCard
                        data={scoreData || undefined}
                        title="종합의견 및 점수"
                        subtitle="현재 사업 운영 상황에 대한 AI 분석 결과입니다"
                        userIndustry={businessInfo?.industry}
                        userLocation={businessInfo?.location?.address}
                      />
                    )}

                    {/* 상세 보고서 버튼 - 분석 완료 후에만 표시 */}
                    {isAnalysisStarted && analysisStep >= 4 && (
                      <div className={styles.reportSection}>
                        <button
                          className={styles.reportButton}
                          onClick={handleDetailedReportClick}
                        >
                          <Assessment
                            style={{ fontSize: "18px", marginRight: "8px" }}
                          />
                          상세 분석 보고서 보기
                        </button>
                        <p className={styles.reportDescription}>
                          전문적인 상권 분석 보고서를 PDF로 다운로드하고,
                          실용적인 사업 전략을 확인해보세요.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* 진단 모달이 닫혀있고 진단도 완료되지 않은 경우에만 안내 메시지 */}
                {!isDiagnosisCompleted && !showDiagnosisModal && (
                  <div className={styles.diagnosisPrompt}>
                    <div className={styles.promptIcon}>
                      <Assessment style={{ fontSize: "48px" }} />
                    </div>
                    <h3>사업 진단을 시작해보세요</h3>
                    <p>
                      먼저 사업 진단을 통해 현재 상황을 파악하고, 맞춤형 분석
                      결과를 받아보세요.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      <BusinessItemModal
        isOpen={showBusinessModal}
        onClose={() => setShowBusinessModal(false)}
        onSubmit={handleBusinessSubmit}
        userType="STARTUP"
        initialData={businessInfo}
      />

      <MedicalDiagnosisModal
        isOpen={showDiagnosisModal}
        onClose={() => setShowDiagnosisModal(false)}
        onAnswerSelect={(step) => {
          console.log("오늘도 사장 - 분석 단계 업데이트:", step);
          setAnalysisStep(step);
          setIsAnalysisStarted(true);
          console.log("오늘도 사장 - analysisStep 상태:", analysisStep);
          // 분석 시작 시 startAnalysis 호출하여 데이터 생성
          if (businessInfo && step === 0) {
            startAnalysis(businessInfo);
          }
        }}
      />

      {/* 상세 보고서 모달 */}
      {showDetailedReport && businessInfo && (
        <div className={styles.reportModal}>
          <div className={styles.reportModalContent}>
            <div className={styles.reportModalHeader}>
              <h2>상세 분석 보고서</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowDetailedReport(false)}
              >
                ×
              </button>
            </div>
            <div className={styles.reportModalBody}>
              <DetailedMarketReport
                marketData={{
                  name: `${businessInfo.industry} 사업`,
                  region: "대전광역시",
                  district: businessInfo.location.district,
                  rank: getMarketRankFromScore(scoreData?.score || 75),
                  value: marketAnalysisData?.footTraffic || 0,
                  changeRate: getChangeRateFromData(
                    marketAnalysisData,
                    scoreData?.score || 75
                  ),
                  category: businessInfo.industry,
                }}
                industryData={[
                  {
                    상권업종대분류명: businessInfo.industry,
                    count: 50,
                    percentage: 35.5,
                  },
                  {
                    상권업종대분류명: "수리·개인",
                    count: 30,
                    percentage: 21.3,
                  },
                  { 상권업종대분류명: "소매", count: 25, percentage: 17.7 },
                  {
                    상권업종대분류명: "과학·기술",
                    count: 20,
                    percentage: 14.2,
                  },
                  {
                    상권업종대분류명: "예술·스포츠",
                    count: 16,
                    percentage: 11.3,
                  },
                ]}
                regionalData={{}}
                competitionAnalysis={{
                  total_businesses: Math.floor(Math.random() * 100) + 50,
                  competition_score: Math.floor(Math.random() * 40) + 30,
                  industry_breakdown: [
                    {
                      상권업종대분류명: businessInfo.industry,
                      상권업종중분류명: "일반",
                      count: 25,
                    },
                    {
                      상권업종대분류명: "수리·개인",
                      상권업종중분류명: "이용·미용",
                      count: 15,
                    },
                    {
                      상권업종대분류명: "소매",
                      상권업종중분류명: "의류",
                      count: 10,
                    },
                  ],
                }}
                riskAnalysis={{
                  risk_type:
                    scoreData?.score && scoreData.score >= 80
                      ? "성장 잠재형"
                      : scoreData?.score && scoreData.score >= 60
                      ? "안정형"
                      : "주의형",
                  risk_score: scoreData ? 100 - scoreData.score : 50,
                  health_score: scoreData?.score || 75,
                  confidence: 0.85,
                  key_indicators: scoreData?.weaknesses || [
                    "경쟁업체 증가",
                    "임대료 상승",
                  ],
                }}
                actualScore={scoreData?.score}
              />
              <div className={styles.insightsSection}>
                <ExecutionStrategyPanel
                  marketData={{
                    name: `${businessInfo.industry} 사업`,
                    rank: getMarketRankFromScore(scoreData?.score || 75),
                    changeRate: getChangeRateFromData(
                      marketAnalysisData,
                      scoreData?.score || 75
                    ),
                  }}
                  industryData={[
                    {
                      상권업종대분류명: businessInfo.industry,
                      count: 50,
                      percentage: 35.5,
                    },
                  ]}
                  competitionData={getCompetitionDataFromCSV(
                    businessInfo.location.district,
                    businessInfo.industry
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 상권분석 안내 모달 */}
      {showAnalysisRequired && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>상권분석이 필요합니다</h2>
              <button
                className={styles.closeButton}
                onClick={handleCloseAnalysisModal}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.iconContainer}>
                <div className={styles.analysisIcon}>
                  <Assessment style={{ fontSize: "48px" }} />
                </div>
              </div>

              <p className={styles.modalMessage}>
                상세한 분석 보고서를 보려면 먼저 상권분석을 완료해주세요.
              </p>

              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>
                    <Search style={{ fontSize: "20px" }} />
                  </span>
                  <span>상권 현황 분석</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>
                    <TrendingUp style={{ fontSize: "20px" }} />
                  </span>
                  <span>경쟁 환경 분석</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>
                    <Warning style={{ fontSize: "20px" }} />
                  </span>
                  <span>리스크 분석</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>
                    <Lightbulb style={{ fontSize: "20px" }} />
                  </span>
                  <span>전략 제안</span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={handleCloseAnalysisModal}
              >
                나중에 하기
              </button>
              <button
                className={styles.analysisButton}
                onClick={handleGoToAnalysis}
              >
                상권분석 시작하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodayCeoPage;
