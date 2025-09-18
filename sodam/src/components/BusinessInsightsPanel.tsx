import React, { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Warning,
  CheckCircle,
  Business,
  AttachMoney,
  People,
  Store,
  Schedule,
  Lightbulb,
  Assessment,
} from "@mui/icons-material";
import styles from "./BusinessInsightsPanel.module.css";

interface BusinessInsightsProps {
  marketData: any;
  industryData: any[];
  competitionData: any;
}

const BusinessInsightsPanel: React.FC<BusinessInsightsProps> = ({
  marketData,
  industryData,
  competitionData,
}) => {
  const [activeInsight, setActiveInsight] = useState<string>("overview");

  const getBusinessRecommendations = () => {
    const recommendations = {
      highCompetition: [
        {
          title: "차별화 전략 수립",
          description:
            "경쟁이 치열한 환경에서는 고유한 가치 제안이 필수입니다.",
          actions: [
            "고객 세분화를 통한 니치 마켓 공략",
            "브랜드 스토리텔링을 통한 감정적 연결",
            "프리미엄 서비스나 상품 라인 도입",
            "고객 경험(CX) 혁신을 통한 차별화",
          ],
          priority: "높음",
          timeline: "1-3개월",
          investment: "중간",
        },
        {
          title: "고객 충성도 프로그램",
          description:
            "기존 고객의 재방문율을 높이는 것이 신규 고객 유치보다 효율적입니다.",
          actions: [
            "멤버십 프로그램 도입",
            "개인화된 추천 시스템 구축",
            "고객 피드백 시스템 강화",
            "로열티 포인트 제도 운영",
          ],
          priority: "높음",
          timeline: "2-4개월",
          investment: "낮음",
        },
      ],
      lowCompetition: [
        {
          title: "시장 선점 전략",
          description:
            "경쟁이 적은 환경에서는 빠른 시장 진입과 브랜드 구축이 중요합니다.",
          actions: [
            "선도적 마케팅을 통한 브랜드 인지도 확산",
            "고객 교육을 통한 시장 확대",
            "파트너십을 통한 네트워크 구축",
            "혁신적 서비스 모델 도입",
          ],
          priority: "높음",
          timeline: "3-6개월",
          investment: "높음",
        },
      ],
      growthMarket: [
        {
          title: "확장 전략",
          description: "성장하는 시장에서는 적극적인 투자와 확장이 필요합니다.",
          actions: [
            "추가 매장 오픈 검토",
            "온라인 채널 확장",
            "프랜차이즈 모델 개발",
            "신제품/서비스 라인 확장",
          ],
          priority: "중간",
          timeline: "6-12개월",
          investment: "높음",
        },
      ],
    };

    return recommendations;
  };

  const getMarketOpportunities = () => {
    const opportunities = [
      {
        category: "디지털 전환",
        title: "온라인 사업 확장",
        description:
          "코로나19 이후 온라인 소비가 급증하고 있어 디지털 채널 확장이 필요합니다.",
        impact: "높음",
        effort: "중간",
        timeline: "3-6개월",
        roi: "200-300%",
      },
      {
        category: "고객 경험",
        title: "개인화 서비스",
        description:
          "고객 데이터를 활용한 맞춤형 서비스로 고객 만족도와 재방문율을 높일 수 있습니다.",
        impact: "높음",
        effort: "높음",
        timeline: "6-12개월",
        roi: "150-250%",
      },
      {
        category: "운영 효율",
        title: "자동화 시스템",
        description:
          "반복 업무 자동화를 통해 운영 비용을 절감하고 서비스 품질을 향상시킬 수 있습니다.",
        impact: "중간",
        effort: "높음",
        timeline: "4-8개월",
        roi: "100-200%",
      },
      {
        category: "마케팅",
        title: "소셜미디어 마케팅",
        description:
          "젊은 고객층을 타겟으로 한 소셜미디어 마케팅으로 브랜드 인지도를 높일 수 있습니다.",
        impact: "중간",
        effort: "낮음",
        timeline: "1-3개월",
        roi: "120-180%",
      },
    ];

    return opportunities;
  };

  const getRiskMitigation = () => {
    const risks = [
      {
        risk: "경쟁업체 증가",
        probability: "높음",
        impact: "높음",
        mitigation: [
          "차별화된 서비스 개발",
          "고객 충성도 프로그램 도입",
          "비용 경쟁력 확보",
          "브랜드 강화",
        ],
      },
      {
        risk: "소비 패턴 변화",
        probability: "중간",
        impact: "높음",
        mitigation: [
          "시장 트렌드 모니터링",
          "유연한 사업 모델 구축",
          "다양한 수익원 개발",
          "고객 피드백 시스템 강화",
        ],
      },
      {
        risk: "임대료 상승",
        probability: "중간",
        impact: "중간",
        mitigation: [
          "장기 임대 계약 체결",
          "운영 효율성 개선",
          "온라인 채널 확대",
          "대안 입지 검토",
        ],
      },
    ];

    return risks;
  };

  const recommendations = getBusinessRecommendations();
  const opportunities = getMarketOpportunities();
  const risks = getRiskMitigation();

  return (
    <div className={styles.insightsPanel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>
          <Lightbulb />
          비즈니스 인사이트
        </h2>
        <p className={styles.panelSubtitle}>
          데이터 기반의 실용적인 사업 전략과 실행 방안을 제시합니다
        </p>
      </div>

      <div className={styles.insightsTabs}>
        <button
          className={`${styles.tab} ${
            activeInsight === "overview" ? styles.active : ""
          }`}
          onClick={() => setActiveInsight("overview")}
        >
          <Assessment />
          개요
        </button>
        <button
          className={`${styles.tab} ${
            activeInsight === "recommendations" ? styles.active : ""
          }`}
          onClick={() => setActiveInsight("recommendations")}
        >
          <CheckCircle />
          권장사항
        </button>
        <button
          className={`${styles.tab} ${
            activeInsight === "opportunities" ? styles.active : ""
          }`}
          onClick={() => setActiveInsight("opportunities")}
        >
          <TrendingUp />
          기회
        </button>
        <button
          className={`${styles.tab} ${
            activeInsight === "risks" ? styles.active : ""
          }`}
          onClick={() => setActiveInsight("risks")}
        >
          <Warning />
          리스크
        </button>
      </div>

      <div className={styles.insightsContent}>
        {activeInsight === "overview" && (
          <div className={styles.overviewSection}>
            <div className={styles.overviewCards}>
              <div className={styles.overviewCard}>
                <div className={styles.cardIcon}>
                  <Store />
                </div>
                <div className={styles.cardContent}>
                  <h3>시장 현황</h3>
                  <p>
                    {marketData?.name} 상권은 {marketData?.rank}위를 차지하며,
                    {marketData?.changeRate > 0 ? "상승" : "하락"} 추세를 보이고
                    있습니다.
                  </p>
                </div>
              </div>

              <div className={styles.overviewCard}>
                <div className={styles.cardIcon}>
                  <People />
                </div>
                <div className={styles.cardContent}>
                  <h3>경쟁 환경</h3>
                  <p>
                    총 {competitionData?.total_businesses || 0}개의 사업체가
                    운영 중이며, 경쟁 점수는{" "}
                    {competitionData?.competition_score || 0}/100점입니다.
                  </p>
                </div>
              </div>

              <div className={styles.overviewCard}>
                <div className={styles.cardIcon}>
                  <AttachMoney />
                </div>
                <div className={styles.cardContent}>
                  <h3>수익성</h3>
                  <p>
                    {industryData[0]?.상권업종대분류명} 업종이 주를 이루며,
                    {marketData?.changeRate > 0
                      ? "성장 가능성이 높은"
                      : "안정적인"}{" "}
                    시장입니다.
                  </p>
                </div>
              </div>
            </div>

            <div className={styles.executiveSummary}>
              <h3>경영진 요약</h3>
              <div className={styles.summaryContent}>
                <p>
                  <strong>핵심 메시지:</strong> {marketData?.name} 상권은
                  {marketData?.rank <= 5
                    ? "우수한 성과를 보이는 상권"
                    : marketData?.rank <= 10
                    ? "안정적인 성장을 보이는 상권"
                    : "성장 잠재력이 있는 상권"}
                  으로 평가됩니다.
                </p>
                <p>
                  <strong>주요 기회:</strong>{" "}
                  {marketData?.changeRate > 0
                    ? "상승 추세를 활용한 적극적인 투자와 확장이 필요합니다."
                    : "시장 안정화를 통한 차별화 전략 수립이 중요합니다."}
                </p>
                <p>
                  <strong>핵심 과제:</strong> 경쟁 심화에 대비한 차별화 전략과
                  고객 충성도 향상 프로그램 도입이 시급합니다.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeInsight === "recommendations" && (
          <div className={styles.recommendationsSection}>
            <h3>전략적 권장사항</h3>
            <div className={styles.recommendationsGrid}>
              {recommendations.highCompetition.map((rec, index) => (
                <div key={index} className={styles.recommendationCard}>
                  <div className={styles.recommendationHeader}>
                    <h4>{rec.title}</h4>
                    <div className={styles.recommendationMeta}>
                      <span
                        className={`${styles.priority} ${styles[rec.priority]}`}
                      >
                        {rec.priority}
                      </span>
                      <span className={styles.timeline}>{rec.timeline}</span>
                    </div>
                  </div>
                  <p className={styles.recommendationDescription}>
                    {rec.description}
                  </p>
                  <div className={styles.actionsList}>
                    <h5>실행 방안:</h5>
                    <ul>
                      {rec.actions.map((action, actionIndex) => (
                        <li key={actionIndex}>{action}</li>
                      ))}
                    </ul>
                  </div>
                  <div className={styles.investmentInfo}>
                    <span className={styles.investmentLabel}>투자 수준:</span>
                    <span className={styles.investmentValue}>
                      {rec.investment}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeInsight === "opportunities" && (
          <div className={styles.opportunitiesSection}>
            <h3>시장 기회 분석</h3>
            <div className={styles.opportunitiesGrid}>
              {opportunities.map((opp, index) => (
                <div key={index} className={styles.opportunityCard}>
                  <div className={styles.opportunityHeader}>
                    <div className={styles.opportunityCategory}>
                      {opp.category}
                    </div>
                    <h4>{opp.title}</h4>
                  </div>
                  <p className={styles.opportunityDescription}>
                    {opp.description}
                  </p>
                  <div className={styles.opportunityMetrics}>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>영향도:</span>
                      <span
                        className={`${styles.metricValue} ${
                          styles[opp.impact]
                        }`}
                      >
                        {opp.impact}
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>투자 수준:</span>
                      <span
                        className={`${styles.metricValue} ${
                          styles[opp.effort]
                        }`}
                      >
                        {opp.effort}
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>예상 기간:</span>
                      <span className={styles.metricValue}>{opp.timeline}</span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>예상 ROI:</span>
                      <span className={`${styles.metricValue} ${styles.roi}`}>
                        {opp.roi}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeInsight === "risks" && (
          <div className={styles.risksSection}>
            <h3>리스크 관리</h3>
            <div className={styles.risksGrid}>
              {risks.map((risk, index) => (
                <div key={index} className={styles.riskCard}>
                  <div className={styles.riskHeader}>
                    <h4>{risk.risk}</h4>
                    <div className={styles.riskMatrix}>
                      <div className={styles.riskProbability}>
                        <span className={styles.riskLabel}>발생 확률:</span>
                        <span
                          className={`${styles.riskValue} ${
                            styles[risk.probability]
                          }`}
                        >
                          {risk.probability}
                        </span>
                      </div>
                      <div className={styles.riskImpact}>
                        <span className={styles.riskLabel}>영향도:</span>
                        <span
                          className={`${styles.riskValue} ${
                            styles[risk.impact]
                          }`}
                        >
                          {risk.impact}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className={styles.mitigationStrategies}>
                    <h5>완화 전략:</h5>
                    <ul>
                      {risk.mitigation.map((strategy, strategyIndex) => (
                        <li key={strategyIndex}>{strategy}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BusinessInsightsPanel;
