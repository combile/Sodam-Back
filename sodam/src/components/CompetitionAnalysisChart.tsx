import React from "react";
import { 
  Store, 
  EmojiEvents, 
  BarChart, 
  Lightbulb, 
  TrendingUp, 
  GpsFixed, 
  Business 
} from "@mui/icons-material";
import { CompetitionAnalysis } from "../api/businessInfo.ts";
import styles from "./CompetitionAnalysisChart.module.css";

interface CompetitionAnalysisChartProps {
  analysis: CompetitionAnalysis;
  selectedIndustry?: string;
}

const CompetitionAnalysisChart: React.FC<CompetitionAnalysisChartProps> = ({
  analysis,
  selectedIndustry,
}) => {
  const getIndustryColor = (index: number) => {
    const colors = [
      "#ff6b6b",
      "#4ecdc4",
      "#45b7d1",
      "#96ceb4",
      "#feca57",
      "#ff9ff3",
      "#a4b0be",
      "#74b9ff",
      "#fd79a8",
      "#fdcb6e",
      "#6c5ce7",
      "#00b894",
    ];
    return colors[index % colors.length];
  };

  const getCompetitionLevel = (score: number) => {
    if (score === 0)
      return {
        level: "없음",
        color: "#28a745",
        description: "경쟁 업소가 없습니다",
      };
    if (score <= 5)
      return {
        level: "낮음",
        color: "#17a2b8",
        description: "경쟁이 적은 편입니다",
      };
    if (score <= 15)
      return {
        level: "보통",
        color: "#ffc107",
        description: "적당한 경쟁 수준입니다",
      };
    if (score <= 30)
      return {
        level: "높음",
        color: "#fd7e14",
        description: "경쟁이 치열한 편입니다",
      };
    return {
      level: "매우 높음",
      color: "#dc3545",
      description: "매우 치열한 경쟁입니다",
    };
  };

  const competitionLevel = getCompetitionLevel(analysis.competition_score);
  const maxCount = Math.max(
    ...analysis.industry_breakdown.map((item) => item.count),
    1
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>경쟁 업소 분석</h3>
        <p className={styles.subtitle}>
          {analysis.market_name} 상권의 업종별 경쟁 현황
        </p>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>
            <Store style={{ fontSize: "24px" }} />
          </div>
          <div className={styles.cardContent}>
            <div className={styles.cardNumber}>{analysis.total_businesses}</div>
            <div className={styles.cardLabel}>총 업소 수</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>
            <EmojiEvents style={{ fontSize: "24px" }} />
          </div>
          <div className={styles.cardContent}>
            <div
              className={styles.cardNumber}
              style={{ color: competitionLevel.color }}
            >
              {analysis.competition_score}
            </div>
            <div className={styles.cardLabel}>경쟁 업소 수</div>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.cardIcon}>
            <BarChart style={{ fontSize: "24px" }} />
          </div>
          <div className={styles.cardContent}>
            <div
              className={styles.cardLevel}
              style={{ backgroundColor: competitionLevel.color }}
            >
              {competitionLevel.level}
            </div>
            <div className={styles.cardLabel}>경쟁 수준</div>
          </div>
        </div>
      </div>

      <div className={styles.competitionDescription}>
        <div className={styles.descriptionIcon}>
          <Lightbulb style={{ fontSize: "20px" }} />
        </div>
        <p className={styles.descriptionText}>
          {competitionLevel.description}
          {selectedIndustry &&
            ` 현재 선택한 업종은 ${analysis.competition_score}개의 경쟁 업소가 있습니다.`}
        </p>
      </div>

      <div className={styles.industryBreakdown}>
        <h4 className={styles.breakdownTitle}>업종별 업소 분포</h4>
        <div className={styles.breakdownList}>
          {analysis.industry_breakdown.slice(0, 8).map((item, index) => (
            <div
              key={`${item.상권업종대분류명}-${item.상권업종중분류명}`}
              className={styles.breakdownItem}
            >
              <div className={styles.industryInfo}>
                <div
                  className={styles.industryColor}
                  style={{ backgroundColor: getIndustryColor(index) }}
                ></div>
                <div className={styles.industryDetails}>
                  <div className={styles.industryMain}>
                    {item.상권업종대분류명}
                  </div>
                  <div className={styles.industrySub}>
                    {item.상권업종중분류명}
                  </div>
                </div>
              </div>
              <div className={styles.countInfo}>
                <div className={styles.countNumber}>{item.count}</div>
                <div className={styles.countBar}>
                  <div
                    className={styles.countBarFill}
                    style={{
                      width: `${(item.count / maxCount) * 100}%`,
                      backgroundColor: getIndustryColor(index),
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {analysis.industry_breakdown.length > 8 && (
          <div className={styles.moreInfo}>
            <p className={styles.moreText}>
              외 {analysis.industry_breakdown.length - 8}개 업종 더 있음
            </p>
          </div>
        )}
      </div>

      <div className={styles.insights}>
        <h4 className={styles.insightsTitle}>분석 인사이트</h4>
        <div className={styles.insightsList}>
          <div className={styles.insightItem}>
            <div className={styles.insightIcon}>
              <TrendingUp style={{ fontSize: "20px" }} />
            </div>
            <p className={styles.insightText}>
              가장 많은 업소를 보유한 업종은{" "}
              <strong>
                {analysis.industry_breakdown[0]?.상권업종대분류명}
              </strong>
              입니다.
            </p>
          </div>
          <div className={styles.insightItem}>
            <div className={styles.insightIcon}>
              <GpsFixed style={{ fontSize: "20px" }} />
            </div>
            <p className={styles.insightText}>
              상권 내 업소 밀도는 {analysis.total_businesses}개로,
              {analysis.total_businesses > 100
                ? " 높은 편"
                : analysis.total_businesses > 50
                ? " 보통 수준"
                : " 낮은 편"}
              입니다.
            </p>
          </div>
          <div className={styles.insightItem}>
            <div className={styles.insightIcon}>
              <Business style={{ fontSize: "20px" }} />
            </div>
            <p className={styles.insightText}>
              업종 다양성은 {analysis.industry_breakdown.length}개로,
              {analysis.industry_breakdown.length > 8
                ? " 매우 다양"
                : analysis.industry_breakdown.length > 5
                ? " 적당히 다양"
                : " 제한적"}
              합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetitionAnalysisChart;
