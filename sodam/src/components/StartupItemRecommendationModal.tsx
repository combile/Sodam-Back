import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./MedicalDiagnosisModal.module.css";
import { authAPI } from "../api/auth";
import {
  LocalHospital,
  Close,
  Business,
  TrendingUp,
  Assessment,
  CheckCircle,
  Schedule,
  Person,
  Store,
  Lightbulb,
  Assignment,
  Psychology,
  LocationOn,
  AttachMoney,
  School,
  Favorite,
  ArrowForward,
  ArrowBack,
  Analytics,
} from "@mui/icons-material";

interface RecommendationResult {
  title: string;
  description: string;
  icon: React.ReactNode;
  recommendedItems: {
    name: string;
    description: string;
    successRate: number;
    investment: string;
    icon: React.ReactNode;
  }[];
  route: string;
}

interface StartupItemRecommendationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const StartupItemRecommendationModal: React.FC<
  StartupItemRecommendationModalProps
> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [textAnswers, setTextAnswers] = useState<{ [key: number]: string }>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<RecommendationResult | null>(null);
  const navigate = useNavigate();

  const questions = [
    {
      id: 0,
      title: "창업하고자 하는 구체적인 아이템을 입력해주세요",
      icon: <Business style={{ fontSize: "18px" }} />,
      inputType: "text",
      placeholder: "예: 스타벅스 스타일 카페, 치킨집, 편의점, 헬스장 등",
    },
    {
      id: 1,
      title: "창업 자금 규모는 어느 정도인가요?",
      icon: <AttachMoney style={{ fontSize: "18px" }} />,
      options: [
        {
          title: "1천만원 미만",
          description: "소규모로 시작하고 싶어요",
          icon: <TrendingUp style={{ fontSize: "20px" }} />,
        },
        {
          title: "1천만원 - 3천만원",
          description: "중소규모로 시작하고 싶어요",
          icon: <Assessment style={{ fontSize: "20px" }} />,
        },
        {
          title: "3천만원 - 5천만원",
          description: "적당한 규모로 시작하고 싶어요",
          icon: <CheckCircle style={{ fontSize: "20px" }} />,
        },
        {
          title: "5천만원 이상",
          description: "대규모로 시작하고 싶어요",
          icon: <Person style={{ fontSize: "20px" }} />,
        },
      ],
    },
    {
      id: 2,
      title: "창업 동기는 무엇인가요?",
      icon: <Psychology style={{ fontSize: "18px" }} />,
      options: [
        {
          title: "경제적 자유",
          description: "안정적인 수익으로 경제적 자유를 얻고 싶어요",
          icon: <TrendingUp style={{ fontSize: "20px" }} />,
        },
        {
          title: "자아실현",
          description: "개인적인 꿈과 목표를 실현하고 싶어요",
          icon: <Lightbulb style={{ fontSize: "20px" }} />,
        },
        {
          title: "시간의 자유",
          description: "자유로운 시간 활용과 일정 관리가 목표예요",
          icon: <Schedule style={{ fontSize: "20px" }} />,
        },
        {
          title: "사회적 기여",
          description: "사회에 도움이 되는 사업을 하고 싶어요",
          icon: <Favorite style={{ fontSize: "20px" }} />,
        },
      ],
    },
    {
      id: 3,
      title: "창업 시 가장 우려되는 부분은?",
      icon: <Assessment style={{ fontSize: "18px" }} />,
      options: [
        {
          title: "자금 부족",
          description: "창업 자금과 운영 자금이 걱정돼요",
          icon: <AttachMoney style={{ fontSize: "20px" }} />,
        },
        {
          title: "경험 부족",
          description: "사업 운영 경험이 없어서 걱정돼요",
          icon: <Person style={{ fontSize: "20px" }} />,
        },
        {
          title: "시장 경쟁",
          description: "경쟁이 치열해서 성공 가능성이 걱정돼요",
          icon: <TrendingUp style={{ fontSize: "20px" }} />,
        },
        {
          title: "고객 확보",
          description: "고객을 어떻게 확보할지 모르겠어요",
          icon: <Person style={{ fontSize: "20px" }} />,
        },
      ],
    },
  ];

  const getProgress = () => {
    return ((currentStep + 1) / questions.length) * 100;
  };

  const handleOptionSelect = (optionIndex: number) => {
    setAnswers({ ...answers, [currentStep]: optionIndex });
  };

  const handleTextInput = (text: string) => {
    setTextAnswers({ ...textAnswers, [currentStep]: text });
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      analyzeResults();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const analyzeResults = async () => {
    setIsAnalyzing(true);
    setAnalysisStep(0);

    // 1단계: 창업 아이템 검증 및 시장성 분석
    setAnalysisStep(1);
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // 2단계: 자금 규모 및 투자 계획 분석
    setAnalysisStep(2);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3단계: 창업 동기 및 목표 설정 분석
    setAnalysisStep(3);
    await new Promise((resolve) => setTimeout(resolve, 1600));

    // 4단계: AI 기반 창업 성공률 예측
    setAnalysisStep(4);
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const userItem = textAnswers[0] || ""; // 사용자가 입력한 창업 아이템
    const budget = answers[1]; // 자금 규모
    const motivation = answers[2]; // 창업 동기
    const concern = answers[3]; // 우려사항

    // 사용자 데이터에서 관심 장소 가져오기
    const currentUser = authAPI.getCurrentUser();
    const userLocation = currentUser?.interestedLocation || "대전 유성구";

    const budgetNames = [
      "1천만원 미만",
      "1천만원-3천만원",
      "3천만원-5천만원",
      "5천만원 이상",
    ];
    const locationNames = ["유성구", "서구", "동구", "중구"];

    // 아이템과 장소에 따른 성공 가능성 분석
    const analyzeItemSuccess = (item: string, location: string) => {
      let successRate = 70; // 기본 성공률
      let analysis = "";
      let strengths: string[] = [];
      let weaknesses: string[] = [];

      // 아이템별 분석
      if (item.includes("카페") || item.includes("커피")) {
        if (location.includes("유성구")) {
          successRate = 85;
          analysis =
            "유성구 대학가 지역은 젊은 층이 많아 카페 사업에 매우 유리합니다.";
          strengths = ["대학생 고객층", "높은 유동인구", "카페 문화 발달"];
          weaknesses = ["높은 임대료", "치열한 경쟁"];
        } else if (location.includes("서구")) {
          successRate = 75;
          analysis =
            "서구 주거지역에서는 가족 단위 고객을 대상으로 한 카페가 성공할 가능성이 높습니다.";
          strengths = ["안정적인 주거지", "가족 고객층"];
          weaknesses = ["낮은 유동인구", "경쟁업체 존재"];
        }
      } else if (item.includes("치킨") || item.includes("음식")) {
        if (location.includes("서구") || location.includes("동구")) {
          successRate = 80;
          analysis = "주거지역에서 치킨집은 높은 성공률을 보입니다.";
          strengths = ["높은 수요", "배달 주문 활발"];
          weaknesses = ["경쟁 심화", "원자재비 상승"];
        }
      } else if (item.includes("편의점")) {
        if (location.includes("중구")) {
          successRate = 85;
          analysis = "중구 도심 지역의 편의점은 높은 성공률을 보입니다.";
          strengths = ["높은 유동인구", "24시간 수요"];
          weaknesses = ["높은 초기 투자비", "프랜차이즈 의존"];
        }
      } else if (item.includes("헬스") || item.includes("운동")) {
        if (location.includes("유성구")) {
          successRate = 78;
          analysis =
            "유성구 대학가와 직장인 밀집 지역에서 헬스장 사업이 유리합니다.";
          strengths = ["건강 관심 증가", "젊은 고객층"];
          weaknesses = ["높은 임대료", "장비 투자비"];
        }
      }

      // 자금 규모에 따른 조정
      if (budget >= 2) successRate += 5; // 충분한 자금
      if (budget === 0) successRate -= 10; // 자금 부족

      return { successRate, analysis, strengths, weaknesses };
    };

    const analysis = analyzeItemSuccess(userItem, userLocation);
    const budgetName = budgetNames[budget];

    const result: RecommendationResult = {
      title: "내일은 사장님",
      description: `${userItem}을 ${userLocation}에서 창업하시려는 예비 사장님을 위한 성공 가능성 분석입니다`,
      icon: <Lightbulb style={{ fontSize: "32px" }} />,
      recommendedItems: [
        {
          name: userItem,
          description: `${userLocation}에서의 ${userItem} 창업 성공 가능성 분석`,
          successRate: analysis.successRate,
          investment: budgetName,
          icon: <Store style={{ fontSize: "20px" }} />,
        },
      ],
      route: "/tomorrow-ceo",
    };

    setResult(result);
    setIsAnalyzing(false);
  };

  const handleStart = () => {
    if (result) {
      onClose();
      navigate(result.route);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setTextAnswers({});
    setResult(null);
    setIsAnalyzing(false);
  };

  if (!isOpen) {
    console.log("StartupItemRecommendationModal: 모달이 닫혀있음");
    return null;
  }

  console.log(
    "StartupItemRecommendationModal: 모달이 열려있음, 현재 단계:",
    currentStep
  );

  if (isAnalyzing) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <div className={styles.hospitalIcon}>
              <LocalHospital />
            </div>
            <div className={styles.headerText}>
              <div className={styles.title}>창업 아이템 추천센터</div>
              <div className={styles.subtitle}>
                최적의 창업 아이템을 분석하고 있습니다...
              </div>
            </div>
          </div>
          <div className={styles.analyzingSection}>
            <div className={styles.analyzingIcon}>
              <Assessment />
            </div>
            <div className={styles.analyzingTitle}>창업 아이템 분석 중</div>
            <div className={styles.analyzingText}>
              AI가 당신의 조건을 바탕으로
              <br />
              최적의 창업 아이템을 분석하고 있습니다
            </div>

            {/* 분석 단계 표시 */}
            <div className={styles.analysisSteps}>
              {[
                {
                  step: 1,
                  title: "창업 아이템 검증 및 시장성 분석",
                  description:
                    "입력된 창업 아이템의 시장성과 경쟁력을 분석합니다",
                },
                {
                  step: 2,
                  title: "자금 규모 및 투자 계획 분석",
                  description: "예산 규모에 따른 최적의 사업 모델을 검토합니다",
                },
                {
                  step: 3,
                  title: "창업 동기 및 목표 설정 분석",
                  description:
                    "창업 목표와 동기를 바탕으로 성공 전략을 수립합니다",
                },
                {
                  step: 4,
                  title: "AI 기반 창업 성공률 예측",
                  description: "머신러닝 모델로 창업 성공 가능성을 예측합니다",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`${styles.analysisStep} ${
                    analysisStep >= item.step ? styles.active : ""
                  }`}
                >
                  <div className={styles.stepNumber}>{item.step}</div>
                  <div className={styles.stepContent}>
                    <div className={styles.stepTitle}>{item.title}</div>
                    <div className={styles.stepDescription}>
                      {item.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.analyzingProgress}>
              <div
                className={styles.analyzingProgressFill}
                style={{ width: `${(analysisStep / 4) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result) {
    return (
      <div className={styles.overlay}>
        <div className={styles.modal}>
          <div className={styles.header}>
            <div className={styles.hospitalIcon}>
              <Assignment />
            </div>
            <div className={styles.headerText}>
              <div className={styles.title}>창업 아이템 추천서</div>
              <div className={styles.subtitle}>내일은 사장님 맞춤 추천</div>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              <Close />
            </button>
          </div>
          <div className={styles.reportSection}>
            <div className={styles.reportIcon}>{result.icon}</div>
            <div className={styles.reportTitle}>{result.title}</div>
            <div className={styles.reportSubtitle}>{result.description}</div>

            <div className={styles.reportContent}>
              <div style={{ marginBottom: "24px" }}>
                <h3
                  style={{
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#2c3e50",
                    marginBottom: "16px",
                  }}
                >
                  추천 창업 아이템
                </h3>
                {result.recommendedItems.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      background: "#f8f9fa",
                      border: "1px solid #e1e8ed",
                      borderRadius: "12px",
                      padding: "20px",
                      marginBottom: "16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "16px",
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        background:
                          "linear-gradient(135deg, #2c5aa0 0%, #1e3a8a 100%)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "white",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "16px",
                          fontWeight: "600",
                          color: "#2c3e50",
                          marginBottom: "4px",
                        }}
                      >
                        {item.name}
                      </div>
                      <div
                        style={{
                          fontSize: "14px",
                          color: "#7f8c8d",
                          marginBottom: "8px",
                        }}
                      >
                        {item.description}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          gap: "16px",
                          fontSize: "14px",
                        }}
                      >
                        <span style={{ color: "#27ae60", fontWeight: "600" }}>
                          성공률: {item.successRate}%
                        </span>
                        <span style={{ color: "#2c5aa0", fontWeight: "600" }}>
                          투자금액: {item.investment}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.reportRecommendation}>
              <div className={styles.recommendationTitle}>
                <CheckCircle />
                전문가 조언
              </div>
              <div className={styles.recommendationText}>
                • 상세한 시장 조사와 경쟁사 분석을 통해 최적의 입지를 선택하세요
                <br />
                • 창업 전 충분한 사업계획서 작성을 통해 리스크를 최소화하세요
                <br />• 단계별 목표 설정과 지속적인 고객 피드백 수집이
                중요합니다
              </div>
            </div>

            <div className={styles.buttonSection}>
              <button
                className={styles.secondaryButton}
                onClick={handleRestart}
              >
                <Assessment style={{ fontSize: "18px" }} />
                다시 진단하기
              </button>
              <button className={styles.primaryButton} onClick={handleStart}>
                <TrendingUp style={{ fontSize: "18px" }} />
                상세 분석 보기
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentStep];
  const selectedOption = answers[currentStep];

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.hospitalIcon}>
            <LocalHospital />
          </div>
          <div className={styles.headerText}>
            <div className={styles.title}>아이템 진단센터</div>
            <div className={styles.subtitle}>
              당신의 아이템은 이곳에서 통할까요 ?
            </div>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <Close />
          </button>
        </div>

        <div className={styles.content}>
          <div className={styles.progressSection}>
            <div className={styles.progressHeader}>
              <span className={styles.progressTitle}>진단 진행률</span>
              <span className={styles.progressText}>
                {currentStep + 1} / {questions.length}
              </span>
            </div>
            <div className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
          </div>

          <div className={styles.questionSection}>
            <div className={styles.questionHeader}>
              <div className={styles.questionIcon}>{currentQuestion.icon}</div>
              <div className={styles.questionTitle}>
                {currentQuestion.title}
              </div>
              <div className={styles.questionNumber}>Q{currentStep + 1}</div>
            </div>

            {currentQuestion.inputType === "text" ? (
              <div style={{ marginTop: "20px" }}>
                <input
                  type="text"
                  placeholder={currentQuestion.placeholder}
                  value={textAnswers[currentStep] || ""}
                  onChange={(e) => handleTextInput(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "16px",
                    border: "2px solid #e1e8ed",
                    borderRadius: "12px",
                    background: "white",
                    fontSize: "16px",
                    color: "#2c3e50",
                    transition: "all 0.2s ease",
                  }}
                />
              </div>
            ) : (
              <div className={styles.options}>
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`${styles.option} ${
                      selectedOption === index ? styles.selected : ""
                    }`}
                    onClick={() => handleOptionSelect(index)}
                  >
                    <div className={styles.optionIcon}>{option.icon}</div>
                    <div className={styles.optionText}>
                      <div className={styles.optionTitle}>{option.title}</div>
                      <div className={styles.optionDescription}>
                        {option.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className={styles.buttonSection}>
            {currentStep > 0 && (
              <button
                className={styles.secondaryButton}
                onClick={handlePrevious}
              >
                <ArrowBack style={{ fontSize: "18px" }} />
                이전
              </button>
            )}
            <button
              className={styles.primaryButton}
              onClick={handleNext}
              disabled={
                currentQuestion.inputType === "text"
                  ? !textAnswers[currentStep]?.trim()
                  : selectedOption === undefined
              }
            >
              {currentStep === questions.length - 1 ? (
                <>
                  <Analytics style={{ fontSize: "18px" }} />
                  분석 시작
                </>
              ) : (
                <>
                  다음
                  <ArrowForward style={{ fontSize: "18px" }} />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupItemRecommendationModal;
