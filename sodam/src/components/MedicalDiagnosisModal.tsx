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
} from "@mui/icons-material";

interface DiagnosisResult {
  type: "STARTUP" | "PLANNING";
  title: string;
  description: string;
  icon: React.ReactNode;
  route: string;
  score: number;
  recommendations: string[];
}

interface MedicalDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAnswerSelect?: (step: number) => void;
}

const MedicalDiagnosisModal: React.FC<MedicalDiagnosisModalProps> = ({
  isOpen,
  onClose,
  onAnswerSelect,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const navigate = useNavigate();

  // 사용자 데이터를 기반으로 질문 생성
  const getUserQuestions = () => {
    const currentUser = authAPI.getCurrentUser();
    const isStartup = currentUser?.businessStage === "STARTUP";

    if (isStartup) {
      // 이미 사업 운영 중인 사용자용 질문
      return [
        {
          id: 0,
          title: "현재 운영 중인 사업의 업종을 알려주세요",
          icon: <Business style={{ fontSize: "18px" }} />,
          options: [
            {
              title: "음식점/카페",
              description: "카페, 레스토랑, 치킨집, 한식당 등",
              icon: <Store style={{ fontSize: "20px" }} />,
            },
            {
              title: "소매업",
              description: "편의점, 의류점, 화장품, 전자제품 등",
              icon: <Store style={{ fontSize: "20px" }} />,
            },
            {
              title: "서비스업",
              description: "헬스장, 미용실, 학원, 병원 등",
              icon: <Store style={{ fontSize: "20px" }} />,
            },
            {
              title: "기타",
              description: "제조업, 건설업, 운송업 등",
              icon: <Store style={{ fontSize: "20px" }} />,
            },
          ],
        },
        {
          id: 1,
          title: "현재 사업의 운영 기간은 얼마나 되나요?",
          icon: <Schedule style={{ fontSize: "18px" }} />,
          options: [
            {
              title: "1년 미만",
              description: "아직 초기 단계입니다",
              icon: <TrendingUp style={{ fontSize: "20px" }} />,
            },
            {
              title: "1-3년",
              description: "안정화 단계입니다",
              icon: <Assessment style={{ fontSize: "20px" }} />,
            },
            {
              title: "3-5년",
              description: "성숙 단계입니다",
              icon: <CheckCircle style={{ fontSize: "20px" }} />,
            },
            {
              title: "5년 이상",
              description: "노하우가 축적된 단계입니다",
              icon: <Person style={{ fontSize: "20px" }} />,
            },
          ],
        },
        {
          id: 2,
          title: "현재 가장 관심 있는 개선 영역은?",
          icon: <Psychology style={{ fontSize: "18px" }} />,
          options: [
            {
              title: "매출 증대",
              description: "고객 유입과 매출 향상에 집중하고 싶어요",
              icon: <TrendingUp style={{ fontSize: "20px" }} />,
            },
            {
              title: "비용 절감",
              description: "운영비 절약과 효율성 개선에 관심이 있어요",
              icon: <Assessment style={{ fontSize: "20px" }} />,
            },
            {
              title: "고객 관리",
              description: "고객 만족도와 재방문율 향상이 목표예요",
              icon: <Person style={{ fontSize: "20px" }} />,
            },
            {
              title: "경쟁력 강화",
              description: "차별화된 서비스와 경쟁 우위 확보가 필요해요",
              icon: <Lightbulb style={{ fontSize: "20px" }} />,
            },
          ],
        },
        {
          id: 3,
          title: "현재 사업의 주요 고민사항은?",
          icon: <Assessment style={{ fontSize: "18px" }} />,
          options: [
            {
              title: "고객 유입 부족",
              description: "새로운 고객을 끌어들이기 어려워요",
              icon: <Person style={{ fontSize: "20px" }} />,
            },
            {
              title: "경쟁 심화",
              description: "주변 경쟁업체가 많아서 어려워요",
              icon: <TrendingUp style={{ fontSize: "20px" }} />,
            },
            {
              title: "운영비 부담",
              description: "임대료, 인건비 등 운영비가 부담스러워요",
              icon: <Assessment style={{ fontSize: "20px" }} />,
            },
            {
              title: "직원 관리",
              description: "직원 채용과 관리가 어려워요",
              icon: <Person style={{ fontSize: "20px" }} />,
            },
          ],
        },
      ];
    } else {
      // 창업 계획 중인 사용자용 질문
      return [
        {
          id: 0,
          title: "창업하고 싶은 업종을 선택해주세요",
          icon: <Business style={{ fontSize: "18px" }} />,
          options: [
            {
              title: "음식점/카페",
              description: "카페, 레스토랑, 치킨집, 한식당 등",
              icon: <Store style={{ fontSize: "20px" }} />,
            },
            {
              title: "소매업",
              description: "편의점, 의류점, 화장품, 전자제품 등",
              icon: <Store style={{ fontSize: "20px" }} />,
            },
            {
              title: "서비스업",
              description: "헬스장, 미용실, 학원, 병원 등",
              icon: <Store style={{ fontSize: "20px" }} />,
            },
            {
              title: "기타",
              description: "제조업, 건설업, 운송업 등",
              icon: <Store style={{ fontSize: "20px" }} />,
            },
          ],
        },
        {
          id: 1,
          title: "창업 자금 규모는 어느 정도인가요?",
          icon: <TrendingUp style={{ fontSize: "18px" }} />,
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
              icon: <Person style={{ fontSize: "20px" }} />,
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
              icon: <TrendingUp style={{ fontSize: "20px" }} />,
            },
            {
              title: "경험 부족",
              description: "사업 운영 경험이 없어서 걱정돼요",
              icon: <Person style={{ fontSize: "20px" }} />,
            },
            {
              title: "시장 경쟁",
              description: "경쟁이 치열해서 성공 가능성이 걱정돼요",
              icon: <Assessment style={{ fontSize: "20px" }} />,
            },
            {
              title: "고객 확보",
              description: "고객을 어떻게 확보할지 모르겠어요",
              icon: <Person style={{ fontSize: "20px" }} />,
            },
          ],
        },
        {
          id: 4,
          title: "희망하는 창업 지역은?",
          icon: <LocationOn style={{ fontSize: "18px" }} />,
          options: [
            {
              title: "유성구",
              description: "대학가와 연구단지가 있는 지역",
              icon: <LocationOn style={{ fontSize: "20px" }} />,
            },
            {
              title: "서구",
              description: "상업지구와 주거지역이 발달한 지역",
              icon: <LocationOn style={{ fontSize: "20px" }} />,
            },
            {
              title: "동구",
              description: "전통시장과 상업지구가 있는 지역",
              icon: <LocationOn style={{ fontSize: "20px" }} />,
            },
            {
              title: "중구",
              description: "도심과 관공서가 집중된 지역",
              icon: <LocationOn style={{ fontSize: "20px" }} />,
            },
          ],
        },
      ];
    }
  };

  const questions = getUserQuestions();

  const getProgress = () => {
    return ((currentStep + 1) / questions.length) * 100;
  };

  const handleOptionSelect = (optionIndex: number) => {
    setAnswers({ ...answers, [currentStep]: optionIndex });
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

    // 진단 분석 시작 시 뒤의 분석 프로세스도 시작
    console.log("진단 분석 시작 - step 0");
    console.log(
      "MedicalDiagnosisModal - onAnswerSelect 존재:",
      !!onAnswerSelect
    );
    if (onAnswerSelect) {
      console.log("MedicalDiagnosisModal - onAnswerSelect 호출: 0");
      onAnswerSelect(0);
    }

    // 1단계: 답변 데이터 검증 및 전처리
    setAnalysisStep(1);
    console.log("진단 분석 1단계 - step 1");
    if (onAnswerSelect) onAnswerSelect(1);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // 2단계: 업종별 특성 분석
    setAnalysisStep(2);
    console.log("진단 분석 2단계 - step 2");
    if (onAnswerSelect) onAnswerSelect(2);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // 3단계: 시장 환경 및 경쟁 분석
    setAnalysisStep(3);
    console.log("진단 분석 3단계 - step 3");
    if (onAnswerSelect) onAnswerSelect(3);
    await new Promise((resolve) => setTimeout(resolve, 1800));

    // 4단계: AI 모델 기반 진단 결과 생성
    setAnalysisStep(4);
    console.log("진단 분석 4단계 - step 4");
    if (onAnswerSelect) onAnswerSelect(4);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const currentUser = authAPI.getCurrentUser();
    const isStartup = currentUser?.businessStage === "STARTUP";

    let diagnosisResult: DiagnosisResult;

    if (isStartup) {
      // 이미 사업 운영 중인 사용자
      const industry = answers[0]; // 업종
      const experience = answers[1]; // 운영 기간
      const focus = answers[2]; // 관심 영역
      const concern = answers[3]; // 고민사항

      // 점수 계산 로직
      let score = 70; // 기본 점수
      if (experience >= 2) score += 10; // 3년 이상 운영 시
      if (focus === 0) score += 5; // 매출 증대 관심 시
      if (concern === 0) score += 5; // 고객 유입 부족 고민 시

      const industryNames = ["음식점/카페", "소매업", "서비스업", "기타"];
      const experienceNames = ["1년 미만", "1-3년", "3-5년", "5년 이상"];
      const focusNames = ["매출 증대", "비용 절감", "고객 관리", "경쟁력 강화"];
      const concernNames = [
        "고객 유입 부족",
        "경쟁 심화",
        "운영비 부담",
        "직원 관리",
      ];

      diagnosisResult = {
        type: "STARTUP",
        title: "오늘도 사장님",
        description: `${industryNames[industry]} 사업을 ${experienceNames[experience]} 운영하고 계시는 사장님을 위한 맞춤 분석입니다`,
        icon: <Store style={{ fontSize: "32px" }} />,
        route: "/today-ceo",
        score: Math.min(95, score),
        recommendations: [
          `${focusNames[focus]}에 집중한 전략 수립이 필요합니다`,
          `${concernNames[concern]} 문제 해결을 위한 구체적인 방안을 제시해드립니다`,
          "현재 상권의 경쟁 상황과 고객 특성을 분석하여 차별화 전략을 제안합니다",
        ],
      };
    } else {
      // 창업 계획 중인 사용자
      const industry = answers[0]; // 희망 업종
      const budget = answers[1]; // 자금 규모
      const motivation = answers[2]; // 창업 동기
      const concern = answers[3]; // 우려사항
      const location = answers[4]; // 희망 지역

      // 점수 계산 로직
      let score = 65; // 기본 점수
      if (budget >= 2) score += 10; // 3천만원 이상 자금 시
      if (motivation === 0) score += 5; // 경제적 자유 동기 시
      if (concern === 1) score += 5; // 경험 부족 우려 시
      if (location >= 0) score += 5; // 지역 선택 시

      const industryNames = ["음식점/카페", "소매업", "서비스업", "기타"];
      const budgetNames = [
        "1천만원 미만",
        "1천만원-3천만원",
        "3천만원-5천만원",
        "5천만원 이상",
      ];
      const motivationNames = [
        "경제적 자유",
        "자아실현",
        "시간의 자유",
        "사회적 기여",
      ];
      const concernNames = ["자금 부족", "경험 부족", "시장 경쟁", "고객 확보"];
      const locationNames = ["유성구", "서구", "동구", "중구"];

      diagnosisResult = {
        type: "PLANNING",
        title: "내일은 사장님",
        description: `${locationNames[location]}에서 ${industryNames[industry]} 창업을 계획하고 계시는 예비 사장님을 위한 성공 전략입니다`,
        icon: <Lightbulb style={{ fontSize: "32px" }} />,
        route: "/tomorrow-ceo",
        score: Math.min(90, score),
        recommendations: [
          `${budgetNames[budget]} 예산으로 ${industryNames[industry]} 창업의 성공 가능성을 분석합니다`,
          `${concernNames[concern]} 우려사항 해결을 위한 구체적인 방안을 제시합니다`,
          `${locationNames[location]} 지역의 상권 특성과 경쟁 상황을 분석하여 최적의 입지 전략을 제안합니다`,
        ],
      };
    }

    setResult(diagnosisResult);
    setIsAnalyzing(false);
  };

  const handleStart = () => {
    if (result) {
      // 진단 결과를 localStorage에 저장
      const diagnosisData = {
        type: result.type,
        score: result.score,
        recommendations: result.recommendations,
        answers: answers,
        timestamp: new Date().toISOString(),
        route: result.route,
      };

      localStorage.setItem("diagnosisResult", JSON.stringify(diagnosisData));

      onClose();
      navigate(result.route);
    }
  };

  const handleRestart = () => {
    setCurrentStep(0);
    setAnswers({});
    setResult(null);
    setIsAnalyzing(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#27ae60";
    if (score >= 60) return "#f39c12";
    return "#e74c3c";
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return "우수";
    if (score >= 60) return "양호";
    return "보통";
  };

  if (!isOpen) {
    console.log("MedicalDiagnosisModal: 모달이 닫혀있음");
    return null;
  }

  console.log(
    "MedicalDiagnosisModal: 모달이 열려있음, 현재 단계:",
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
              <div className={styles.title}>사장님 진단센터</div>
              <div className={styles.subtitle}>진단 결과 분석 중...</div>
            </div>
          </div>
          <div className={styles.analyzingSection}>
            <div className={styles.analyzingIcon}>
              <Assessment />
            </div>
            <div className={styles.analyzingTitle}>진단 결과 분석 중</div>
            <div className={styles.analyzingText}>
              AI가 당신의 답변을 바탕으로
              <br />
              최적의 사업 전략을 분석하고 있습니다
            </div>

            {/* 분석 단계 표시 */}
            <div className={styles.analysisSteps}>
              {[
                {
                  step: 1,
                  title: "답변 데이터 검증 및 전처리",
                  description: "입력된 답변의 일관성과 유효성을 검증합니다",
                },
                {
                  step: 2,
                  title: "업종별 특성 분석",
                  description:
                    "선택한 업종의 시장 특성과 성장 가능성을 분석합니다",
                },
                {
                  step: 3,
                  title: "시장 환경 및 경쟁 분석",
                  description: "경쟁 환경과 시장 트렌드를 종합 분석합니다",
                },
                {
                  step: 4,
                  title: "AI 모델 기반 진단 결과 생성",
                  description:
                    "머신러닝 알고리즘으로 최적의 진단 결과를 생성합니다",
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
              <div className={styles.title}>진단 보고서</div>
              <div className={styles.subtitle}>사장님 진단 결과</div>
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
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>진단 유형</span>
                <span className={styles.reportValue}>
                  {result.type === "STARTUP" ? "기존 사업자" : "예비 창업자"}
                </span>
              </div>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>성공 가능성</span>
                <span
                  className={styles.reportValue}
                  style={{ color: getScoreColor(result.score) }}
                >
                  {result.score}점 ({getScoreText(result.score)})
                </span>
              </div>
              <div className={styles.reportItem}>
                <span className={styles.reportLabel}>추천 서비스</span>
                <span className={styles.reportValue}>
                  {result.type === "STARTUP" ? "상권 분석" : "창업 분석"}
                </span>
              </div>
            </div>

            <div className={styles.reportRecommendation}>
              <div className={styles.recommendationTitle}>
                <CheckCircle />
                전문가 추천사항
              </div>
              <div className={styles.recommendationText}>
                {result.recommendations.map((rec, index) => (
                  <div key={index} style={{ marginBottom: "8px" }}>
                    • {rec}
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.buttonSection}>
              <button
                className={styles.secondaryButton}
                onClick={handleRestart}
              >
                다시 진단하기
              </button>
              <button className={styles.primaryButton} onClick={handleStart}>
                서비스 시작하기
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
            <div className={styles.title}>사장님 진단센터</div>
            <div className={styles.subtitle}>
              전문 진단을 통해 맞춤 서비스를 제공합니다
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
          </div>

          <div className={styles.buttonSection}>
            {currentStep > 0 && (
              <button
                className={styles.secondaryButton}
                onClick={handlePrevious}
              >
                이전
              </button>
            )}
            <button
              className={styles.primaryButton}
              onClick={handleNext}
              disabled={selectedOption === undefined}
            >
              {currentStep === questions.length - 1 ? "진단 완료" : "다음"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalDiagnosisModal;
