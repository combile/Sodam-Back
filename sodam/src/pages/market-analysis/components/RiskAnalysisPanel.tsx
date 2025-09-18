import React from "react";
import {
  TrendingDown,
  Gavel,
  AttachMoney,
  Eco,
  Help,
  Warning,
} from "@mui/icons-material";
import styles from "./RiskAnalysisPanel.module.css";

interface RiskAnalysis {
  risk_type: string;
  risk_score: number;
  health_score: number;
  confidence: number;
  analysis_data: any;
  key_indicators: string[];
}

interface DiagnosisData {
  footTraffic: any;
  cardSales: any;
  sameIndustry: any;
  businessRates: any;
  dwellTime: any;
  healthScore: number;
}

interface RiskAnalysisPanelProps {
  riskAnalysis: RiskAnalysis;
  diagnosisData: DiagnosisData | null;
}

const RiskAnalysisPanel: React.FC<RiskAnalysisPanelProps> = ({
  riskAnalysis,
  diagnosisData,
}) => {
  const getRiskTypeInfo = (riskType: string) => {
    const riskTypes = {
      "유입 저조형": {
        color: "#ff6b6b",
        icon: <TrendingDown style={{ fontSize: "20px" }} />,
        description: "유동인구와 매출 증가율이 낮아 상권 활성화가 저조한 상태",
        recommendations: [
          "마케팅 강화를 통한 유동인구 증가",
          "이벤트 개최로 상권 활성화",
          "접근성 개선을 통한 유입 증대",
        ],
      },
      "과포화 경쟁형": {
        color: "#ffa726",
        icon: <Gavel style={{ fontSize: "20px" }} />,
        description: "동일업종 사업체가 과도하게 많아 경쟁이 치열한 상태",
        recommendations: [
          "차별화된 상품/서비스 개발",
          "고객 충성도 향상 프로그램",
          "가치 기반 마케팅 전략",
        ],
      },
      "소비력 약형": {
        color: "#ab47bc",
        icon: <AttachMoney style={{ fontSize: "20px" }} />,
        description: "지역 소비력이 부족하여 매출 창출이 어려운 상태",
        recommendations: [
          "소득 수준에 맞는 가격 정책",
          "온라인 판매 채널 구축",
          "외부 고객 유치 전략",
        ],
      },
      "성장 잠재형": {
        color: "#26a69a",
        icon: <Eco style={{ fontSize: "20px" }} />,
        description: "성장 잠재력이 제한적이어서 장기적 발전이 어려운 상태",
        recommendations: [
          "혁신적 비즈니스 모델 도입",
          "지역 상생 프로그램 참여",
          "인프라 개선 요구",
        ],
      },
    };

    return (
      riskTypes[riskType as keyof typeof riskTypes] || {
        color: "#666",
        icon: <Help style={{ fontSize: "20px" }} />,
        description: "알 수 없는 리스크 유형",
        recommendations: [],
      }
    );
  };

  const getRiskLevel = (score: number) => {
    if (score >= 80) return { level: "매우 높음", color: "#dc3545" };
    if (score >= 60) return { level: "높음", color: "#fd7e14" };
    if (score >= 40) return { level: "보통", color: "#ffc107" };
    return { level: "낮음", color: "#28a745" };
  };

  const riskInfo = getRiskTypeInfo(riskAnalysis.risk_type);
  const riskLevel = getRiskLevel(riskAnalysis.risk_score);

  return (
    <div className={styles.riskAnalysisPanel}>
      <div className={styles.header}>
        <h3 className={styles.title}>리스크 분석</h3>
        <div className={styles.riskType}>
          <span className={styles.riskIcon}>{riskInfo.icon}</span>
          <span className={styles.riskTypeName}>{riskAnalysis.risk_type}</span>
        </div>
      </div>

      <div className={styles.riskScore}>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>리스크 점수</span>
          <span
            className={styles.scoreValue}
            style={{ color: riskLevel.color }}
          >
            {riskAnalysis.risk_score.toFixed(1)}
          </span>
          <span
            className={styles.scoreLevel}
            style={{ backgroundColor: riskLevel.color }}
          >
            {riskLevel.level}
          </span>
        </div>
        <div className={styles.scoreItem}>
          <span className={styles.scoreLabel}>신뢰도</span>
          <span className={styles.scoreValue}>
            {(riskAnalysis.confidence * 100).toFixed(0)}%
          </span>
        </div>
      </div>

      <div className={styles.description}>{riskInfo.description}</div>

      <div className={styles.keyIndicators}>
        <h4 className={styles.sectionTitle}>주요 지표</h4>
        <div className={styles.indicatorsList}>
          {riskAnalysis.key_indicators.map((indicator, index) => (
            <div key={index} className={styles.indicatorItem}>
              <span className={styles.indicatorIcon}>
                <Warning style={{ fontSize: "16px" }} />
              </span>
              <span className={styles.indicatorText}>{indicator}</span>
            </div>
          ))}
        </div>
      </div>

      {diagnosisData && (
        <div className={styles.analysisData}>
          <h4 className={styles.sectionTitle}>상세 분석</h4>
          <div className={styles.dataGrid}>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>유동인구 변화</span>
              <span className={styles.dataValue}>
                {diagnosisData.footTraffic?.trend || "데이터 없음"}
              </span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>매출 추이</span>
              <span className={styles.dataValue}>
                {diagnosisData.cardSales?.trend || "데이터 없음"}
              </span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>경쟁 밀도</span>
              <span className={styles.dataValue}>
                {diagnosisData.sameIndustry?.density || "데이터 없음"}
              </span>
            </div>
            <div className={styles.dataItem}>
              <span className={styles.dataLabel}>창업률</span>
              <span className={styles.dataValue}>
                {diagnosisData.businessRates?.startup_rate || "데이터 없음"}%
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={styles.recommendations}>
        <h4 className={styles.sectionTitle}>개선 권장사항</h4>
        <div className={styles.recommendationsList}>
          {riskInfo.recommendations.map((recommendation, index) => (
            <div key={index} className={styles.recommendationItem}>
              <span className={styles.recommendationNumber}>{index + 1}</span>
              <span className={styles.recommendationText}>
                {recommendation}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RiskAnalysisPanel;
