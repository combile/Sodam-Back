import React from "react";
import styles from "./AnalysisProcess.module.css";
import {
  Analytics,
  LocationOn,
  TrendingUp,
  Assessment,
  Check,
  Schedule,
} from "@mui/icons-material";

interface AnalysisProcessProps {
  currentStep: number;
  businessInfo?: {
    industry: string;
    location: {
      address: string;
    };
  };
}

const AnalysisProcess: React.FC<AnalysisProcessProps> = ({
  currentStep,
  businessInfo,
}) => {
  const steps = [
    {
      id: 1,
      title: "기본 정보 수집 및 검증",
      description:
        "창업 아이템, 희망 위치, 자금 규모 등 기본 정보를 수집하고 검증합니다",
      icon: <LocationOn style={{ fontSize: "14px" }} />,
      details: [
        "창업 아이템의 시장성 검토",
        "희망 지역의 상권 특성 파악",
        "예상 투자 규모 및 운영비 산정",
        "법적 규제 및 허가 요건 확인",
      ],
    },
    {
      id: 2,
      title: "상권 데이터 심층 분석",
      description:
        "유동인구, 체류시간, 경쟁업체 현황, 임대료 등 상권 데이터를 종합 분석합니다",
      icon: <Analytics style={{ fontSize: "14px" }} />,
      details: [
        "일평균 유동인구 및 시간대별 분포 분석",
        "고객 체류시간 및 소비 패턴 조사",
        "반경 500m 내 경쟁업체 현황 및 경쟁도 측정",
        "임대료 수준 및 상권 활성도 평가",
      ],
    },
    {
      id: 3,
      title: "시장 트렌드 및 경쟁 환경 분석",
      description: "업종별 성장률, 시장 전망, 경쟁 우위 요소를 분석합니다",
      icon: <TrendingUp style={{ fontSize: "14px" }} />,
      details: [
        "업종별 시장 규모 및 성장률 분석",
        "소비 트렌드 및 고객 니즈 변화 파악",
        "경쟁업체 대비 차별화 포인트 도출",
        "시장 진입 장벽 및 리스크 요소 평가",
      ],
    },
    {
      id: 4,
      title: "AI 기반 종합 성공률 산출",
      description:
        "머신러닝 알고리즘을 활용하여 창업 성공률과 수익성을 예측합니다",
      icon: <Assessment style={{ fontSize: "14px" }} />,
      details: [
        "다차원 데이터 기반 성공률 모델링",
        "예상 매출 및 손익분기점 계산",
        "리스크 요소별 영향도 분석",
        "최적화된 창업 전략 및 실행 방안 제시",
      ],
    },
  ];

  const getStepStatus = (stepId: number) => {
    if (stepId < currentStep) return "completed";
    if (stepId === currentStep) return "current";
    return "pending";
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <Check style={{ fontSize: "12px" }} />;
      case "current":
        return <Schedule style={{ fontSize: "12px" }} />;
      default:
        return null;
    }
  };

  const getProgressPercentage = () => {
    if (currentStep === 0) return 0;
    return (currentStep / 4) * 100;
  };

  return (
    <div className={styles.processContainer}>
      <div className={styles.processTitle}>
        <div className={styles.processIcon}>
          <Analytics style={{ fontSize: "14px" }} />
        </div>
        분석 진행 상황
        <div className={styles.progressPercentage}>
          {Math.round(getProgressPercentage())}%
        </div>
      </div>

      {/* 진행률 바 */}
      <div className={styles.progressBar}>
        <div
          className={styles.progressFill}
          style={{ width: `${getProgressPercentage()}%` }}
        />
      </div>

      <div className={styles.processSteps}>
        {steps.map((step) => {
          const status = getStepStatus(step.id);
          const isCurrentOrCompleted =
            status === "current" || status === "completed";
          return (
            <div
              key={step.id}
              className={`${styles.processStep} ${styles[status]}`}
            >
              <div className={styles.stepNumber}>{step.id}</div>
              <div className={styles.stepContent}>
                <div className={styles.stepTitle}>{step.title}</div>
                <div className={styles.stepDescription}>{step.description}</div>
                {isCurrentOrCompleted && step.details && (
                  <div className={styles.stepDetails}>
                    {step.details.map((detail, index) => (
                      <div key={index} className={styles.detailItem}>
                        <span className={styles.detailBullet}>•</span>
                        <span className={styles.detailText}>{detail}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className={`${styles.stepStatus} ${styles[status]}`}>
                {getStatusIcon(status)}
              </div>
            </div>
          );
        })}
      </div>

      {businessInfo && (
        <div className={styles.analysisDetails}>
          <div className={styles.detailsTitle}>분석 대상 정보</div>
          <div className={styles.detailsGrid}>
            <div className={styles.analysisDetailItem}>
              <div className={styles.detailIcon}>
                <Analytics style={{ fontSize: "14px" }} />
              </div>
              <div className={styles.analysisDetailText}>
                업종: {businessInfo.industry}
              </div>
            </div>
            <div className={styles.analysisDetailItem}>
              <div className={styles.detailIcon}>
                <LocationOn style={{ fontSize: "14px" }} />
              </div>
              <div className={styles.analysisDetailText}>
                위치: {businessInfo.location.address}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisProcess;
