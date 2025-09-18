import React from "react";
import { LocationOn } from "@mui/icons-material";
import styles from "./MarketAnalysisCard.module.css";

interface MarketAnalysisData {
  footTraffic: number;
  dwellTime: number;
  competition: number;
  businessRates: number;
  cardSales: number;
}

interface MarketAnalysisCardProps {
  data?: MarketAnalysisData;
  isLoading?: boolean;
  error?: string | null;
  onAnalyze?: () => void;
  location?: string;
}

const MarketAnalysisCard: React.FC<MarketAnalysisCardProps> = ({
  data,
  isLoading = false,
  error = null,
  onAnalyze,
  location = "현재 위치",
}) => {
  const formatValue = (
    value: number,
    type: "percentage" | "number" = "number"
  ) => {
    if (type === "percentage") {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
  };

  const getValueClass = (
    value: number,
    type: "positive" | "negative" | "neutral" = "neutral"
  ) => {
    if (type === "positive") {
      return value > 0 ? styles.positive : styles.negative;
    }
    if (type === "negative") {
      return value < 0 ? styles.positive : styles.negative;
    }
    return styles.neutral;
  };

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={`${styles.icon} ${styles.iconMap}`}>
            <LocationOn style={{ fontSize: "20px" }} />
          </div>
          <h3 className={styles.title}>내 근처 상권분석</h3>
        </div>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          상권 데이터를 분석 중입니다...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={`${styles.icon} ${styles.iconMap}`}>
            <LocationOn style={{ fontSize: "20px" }} />
          </div>
          <h3 className={styles.title}>내 근처 상권분석</h3>
        </div>
        <div className={styles.error}>{error}</div>
        {onAnalyze && (
          <button className={styles.button} onClick={onAnalyze}>
            다시 분석하기
          </button>
        )}
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={`${styles.icon} ${styles.iconMap}`}>
            <LocationOn style={{ fontSize: "20px" }} />
          </div>
          <h3 className={styles.title}>내 근처 상권분석</h3>
        </div>
        <div className={styles.empty}>상권 분석을 시작해보세요</div>
        {onAnalyze && (
          <button className={styles.button} onClick={onAnalyze}>
            상권 분석 시작
          </button>
        )}
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={`${styles.icon} ${styles.iconMap}`}>
          <LocationOn style={{ fontSize: "20px" }} />
        </div>
        <h3 className={styles.title}>내 근처 상권분석</h3>
      </div>

      <div className={styles.content}>
        <div className={styles.locationInfo}>
          <div className={styles.locationTitle}>분석 위치</div>
          <div className={styles.locationText}>{location}</div>
        </div>

        <div className={styles.analysisGrid}>
          <div className={styles.analysisItem}>
            <div className={styles.analysisLabel}>유동인구</div>
            <div
              className={`${styles.analysisValue} ${getValueClass(
                data.footTraffic,
                "positive"
              )}`}
            >
              {formatValue(data.footTraffic)}
            </div>
          </div>

          <div className={styles.analysisItem}>
            <div className={styles.analysisLabel}>체류시간</div>
            <div
              className={`${styles.analysisValue} ${getValueClass(
                data.dwellTime,
                "positive"
              )}`}
            >
              {formatValue(data.dwellTime, "percentage")}
            </div>
          </div>

          <div className={styles.analysisItem}>
            <div className={styles.analysisLabel}>경쟁도</div>
            <div
              className={`${styles.analysisValue} ${getValueClass(
                data.competition,
                "negative"
              )}`}
            >
              {formatValue(data.competition, "percentage")}
            </div>
          </div>

          <div className={styles.analysisItem}>
            <div className={styles.analysisLabel}>사업률</div>
            <div
              className={`${styles.analysisValue} ${getValueClass(
                data.businessRates,
                "positive"
              )}`}
            >
              {formatValue(data.businessRates, "percentage")}
            </div>
          </div>

          <div className={styles.analysisItem}>
            <div className={styles.analysisLabel}>카드매출</div>
            <div
              className={`${styles.analysisValue} ${getValueClass(
                data.cardSales,
                "positive"
              )}`}
            >
              {formatValue(data.cardSales, "percentage")}
            </div>
          </div>
        </div>

        {onAnalyze && (
          <button className={styles.button} onClick={onAnalyze}>
            상세 분석 보기
          </button>
        )}
      </div>
    </div>
  );
};

export default MarketAnalysisCard;
