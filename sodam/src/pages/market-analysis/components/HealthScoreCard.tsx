import React from "react";
import {
  Lightbulb,
  Warning,
  TrendingUp,
  Assessment,
  Star,
  Rocket,
  EmojiEvents,
  Public,
  People,
  AttachMoney,
  Gavel,
} from "@mui/icons-material";
import styles from "./HealthScoreCard.module.css";

interface DiagnosisData {
  footTraffic: any;
  cardSales: any;
  sameIndustry: any;
  businessRates: any;
  dwellTime: any;
  healthScore: number;
}

interface HealthScoreCardProps {
  healthScore: number;
  diagnosisData: DiagnosisData;
}

const HealthScoreCard: React.FC<HealthScoreCardProps> = ({
  healthScore,
  diagnosisData,
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#28a745"; // 우수
    if (score >= 60) return "#ffc107"; // 양호
    if (score >= 40) return "#fd7e14"; // 보통
    return "#dc3545"; // 주의
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "우수";
    if (score >= 60) return "양호";
    if (score >= 40) return "보통";
    return "주의";
  };

  const getScoreDescription = (score: number) => {
    if (score >= 80) return "매우 좋은 상권 환경입니다";
    if (score >= 60) return "양호한 상권 환경입니다";
    if (score >= 40) return "보통 수준의 상권 환경입니다";
    return "주의가 필요한 상권 환경입니다";
  };

  return (
    <div className={styles.healthScoreCard}>
      <div className={styles.header}>
        <h3 className={styles.title}>상권 건강 점수</h3>
        <div className={styles.scoreContainer}>
          <div
            className={styles.score}
            style={{ color: getScoreColor(healthScore) }}
          >
            {healthScore}
          </div>
          <div className={styles.scoreLabel}>{getScoreLabel(healthScore)}</div>
        </div>
      </div>

      <div className={styles.description}>
        {getScoreDescription(healthScore)}
      </div>

      <div className={styles.indicators}>
        <div className={styles.indicator}>
          <div className={styles.indicatorLabel}>유동인구</div>
          <div className={styles.indicatorValue}>
            {diagnosisData.footTraffic?.score || 0}점
          </div>
          <div className={styles.indicatorBar}>
            <div
              className={styles.indicatorFill}
              style={{
                width: `${diagnosisData.footTraffic?.score || 0}%`,
                backgroundColor: getScoreColor(
                  diagnosisData.footTraffic?.score || 0
                ),
              }}
            />
          </div>
        </div>

        <div className={styles.indicator}>
          <div className={styles.indicatorLabel}>카드매출</div>
          <div className={styles.indicatorValue}>
            {diagnosisData.cardSales?.score || 0}점
          </div>
          <div className={styles.indicatorBar}>
            <div
              className={styles.indicatorFill}
              style={{
                width: `${diagnosisData.cardSales?.score || 0}%`,
                backgroundColor: getScoreColor(
                  diagnosisData.cardSales?.score || 0
                ),
              }}
            />
          </div>
        </div>

        <div className={styles.indicator}>
          <div className={styles.indicatorLabel}>경쟁도</div>
          <div className={styles.indicatorValue}>
            {diagnosisData.sameIndustry?.score || 0}점
          </div>
          <div className={styles.indicatorBar}>
            <div
              className={styles.indicatorFill}
              style={{
                width: `${diagnosisData.sameIndustry?.score || 0}%`,
                backgroundColor: getScoreColor(
                  diagnosisData.sameIndustry?.score || 0
                ),
              }}
            />
          </div>
        </div>

        <div className={styles.indicator}>
          <div className={styles.indicatorLabel}>창업·폐업률</div>
          <div className={styles.indicatorValue}>
            {diagnosisData.businessRates?.score || 0}점
          </div>
          <div className={styles.indicatorBar}>
            <div
              className={styles.indicatorFill}
              style={{
                width: `${diagnosisData.businessRates?.score || 0}%`,
                backgroundColor: getScoreColor(
                  diagnosisData.businessRates?.score || 0
                ),
              }}
            />
          </div>
        </div>

        <div className={styles.indicator}>
          <div className={styles.indicatorLabel}>체류시간</div>
          <div className={styles.indicatorValue}>
            {diagnosisData.dwellTime?.score || 0}점
          </div>
          <div className={styles.indicatorBar}>
            <div
              className={styles.indicatorFill}
              style={{
                width: `${diagnosisData.dwellTime?.score || 0}%`,
                backgroundColor: getScoreColor(
                  diagnosisData.dwellTime?.score || 0
                ),
              }}
            />
          </div>
        </div>
      </div>

      <div className={styles.summary}>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>강점:</span>
          <span className={styles.summaryValue}>
            {healthScore >= 80
              ? "유입·소비력 높음, 경쟁 적음"
              : healthScore >= 60
              ? "유입·소비력 보통, 경쟁 낮음"
              : healthScore >= 40
              ? "유입·소비력 보통, 경쟁 보통"
              : "유입·소비력 낮음, 경쟁 높음"}
          </span>
        </div>
      </div>

      {/* 개선 권장사항 */}
      <div className={styles.recommendations}>
        <h4 className={styles.recommendationsTitle}>
          <Lightbulb style={{ fontSize: "16px", marginRight: "8px" }} />
          개선 권장사항
        </h4>
        <div className={styles.recommendationsList}>
          {healthScore < 40 && (
            <>
              <div className={styles.recommendationItem}>
                <span className={styles.recommendationIcon}>
                  <Warning style={{ fontSize: "16px" }} />
                </span>
                <span className={styles.recommendationText}>
                  <strong>긴급 개선 필요:</strong> 유동인구 증가를 위한 마케팅
                  강화가 필요합니다.
                </span>
              </div>
              <div className={styles.recommendationItem}>
                <span className={styles.recommendationIcon}>
                  <TrendingUp style={{ fontSize: "16px" }} />
                </span>
                <span className={styles.recommendationText}>
                  <strong>매출 증대:</strong> 차별화된 상품/서비스 개발로 경쟁
                  우위를 확보하세요.
                </span>
              </div>
            </>
          )}
          {healthScore >= 40 && healthScore < 60 && (
            <>
              <div className={styles.recommendationItem}>
                <span className={styles.recommendationIcon}>
                  <Assessment style={{ fontSize: "16px" }} />
                </span>
                <span className={styles.recommendationText}>
                  <strong>안정화 전략:</strong> 현재 수준을 유지하면서 점진적
                  개선을 추진하세요.
                </span>
              </div>
              <div className={styles.recommendationItem}>
                <span className={styles.recommendationIcon}>
                  <Gavel style={{ fontSize: "16px" }} />
                </span>
                <span className={styles.recommendationText}>
                  <strong>타겟 고객:</strong> 고객 세분화를 통한 맞춤형 서비스를
                  제공하세요.
                </span>
              </div>
            </>
          )}
          {healthScore >= 60 && healthScore < 80 && (
            <>
              <div className={styles.recommendationItem}>
                <span className={styles.recommendationIcon}>
                  <Star style={{ fontSize: "16px" }} />
                </span>
                <span className={styles.recommendationText}>
                  <strong>성장 가속화:</strong> 브랜드 강화와 고객 충성도 향상에
                  집중하세요.
                </span>
              </div>
              <div className={styles.recommendationItem}>
                <span className={styles.recommendationIcon}>
                  <Rocket style={{ fontSize: "16px" }} />
                </span>
                <span className={styles.recommendationText}>
                  <strong>확장 기회:</strong> 새로운 서비스나 상품 라인을
                  검토해보세요.
                </span>
              </div>
            </>
          )}
          {healthScore >= 80 && (
            <>
              <div className={styles.recommendationItem}>
                <span className={styles.recommendationIcon}>
                  <EmojiEvents style={{ fontSize: "16px" }} />
                </span>
                <span className={styles.recommendationText}>
                  <strong>우수 상태 유지:</strong> 현재의 우수한 성과를
                  지속적으로 관리하세요.
                </span>
              </div>
              <div className={styles.recommendationItem}>
                <span className={styles.recommendationIcon}>
                  <Public style={{ fontSize: "16px" }} />
                </span>
                <span className={styles.recommendationText}>
                  <strong>확장 전략:</strong> 다른 지역이나 온라인 채널로 사업을
                  확장해보세요.
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* 상세 분석 인사이트 */}
      <div className={styles.insights}>
        <h4 className={styles.insightsTitle}>
          <Assessment style={{ fontSize: "16px", marginRight: "8px" }} />
          상세 분석 인사이트
        </h4>
        <div className={styles.insightsGrid}>
          <div className={styles.insightCard}>
            <div className={styles.insightHeader}>
              <span className={styles.insightIcon}>
                <People style={{ fontSize: "20px" }} />
              </span>
              <span className={styles.insightLabel}>유동인구</span>
            </div>
            <div className={styles.insightValue}>
              {diagnosisData.footTraffic?.score || 0}점
            </div>
            <div className={styles.insightDescription}>
              {diagnosisData.footTraffic?.score >= 70
                ? "우수한 유동인구를 보유하고 있습니다"
                : diagnosisData.footTraffic?.score >= 50
                ? "보통 수준의 유동인구입니다"
                : "유동인구 증가가 필요합니다"}
            </div>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightHeader}>
              <span className={styles.insightIcon}>
                <AttachMoney style={{ fontSize: "20px" }} />
              </span>
              <span className={styles.insightLabel}>매출</span>
            </div>
            <div className={styles.insightValue}>
              {diagnosisData.cardSales?.score || 0}점
            </div>
            <div className={styles.insightDescription}>
              {diagnosisData.cardSales?.score >= 70
                ? "매출이 안정적으로 유지되고 있습니다"
                : diagnosisData.cardSales?.score >= 50
                ? "보통 수준의 매출을 기록하고 있습니다"
                : "매출 증대 방안이 필요합니다"}
            </div>
          </div>

          <div className={styles.insightCard}>
            <div className={styles.insightHeader}>
              <span className={styles.insightIcon}>
                <Gavel style={{ fontSize: "20px" }} />
              </span>
              <span className={styles.insightLabel}>경쟁도</span>
            </div>
            <div className={styles.insightValue}>
              {diagnosisData.sameIndustry?.score || 0}점
            </div>
            <div className={styles.insightDescription}>
              {diagnosisData.sameIndustry?.score >= 70
                ? "경쟁이 적어 안정적입니다"
                : diagnosisData.sameIndustry?.score >= 50
                ? "보통 수준의 경쟁입니다"
                : "경쟁이 치열하니 차별화가 필요합니다"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthScoreCard;
