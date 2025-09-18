import React, { useState } from "react";
import { scoringAPI, ScoringRequest, ScoringResponse } from "../api/scoring.ts";
import styles from "./MarketScoreCalculator.module.css";

interface MarketScoreCalculatorProps {
  onScoreCalculated?: (score: ScoringResponse) => void;
}

const MarketScoreCalculator: React.FC<MarketScoreCalculatorProps> = ({
  onScoreCalculated,
}) => {
  const [features, setFeatures] = useState({
    foot_traffic: 0.5,
    competitors_500m: 0.3,
    avg_income: 0.6,
    rent_cost: 0.4,
    age_20s_ratio: 0.7,
  });

  const [result, setResult] = useState<ScoringResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const featureLabels = {
    foot_traffic: "보행량",
    competitors_500m: "경쟁업체 수",
    avg_income: "평균 소득",
    rent_cost: "임대료",
    age_20s_ratio: "20대 비율",
  };

  const featureDescriptions = {
    foot_traffic: "해당 지역의 보행량 (높을수록 좋음)",
    competitors_500m: "500m 내 경쟁업체 수 (낮을수록 좋음)",
    avg_income: "지역 평균 소득 수준 (높을수록 좋음)",
    rent_cost: "임대료 수준 (낮을수록 좋음)",
    age_20s_ratio: "20대 인구 비율 (높을수록 좋음)",
  };

  const handleFeatureChange = (key: keyof typeof features, value: number) => {
    setFeatures((prev) => ({
      ...prev,
      [key]: Math.max(0, Math.min(1, value)),
    }));
  };

  const handleCalculate = async () => {
    setLoading(true);
    setError(null);

    try {
      const request: ScoringRequest = {
        marketCode: "sample_market", // 샘플 상권 코드
        weights: {
          footTraffic: features.foot_traffic,
          sales: features.avg_income,
          competitors: features.competitors_500m,
          businessRates: 0.5,
          dwellTime: features.age_20s_ratio,
        },
      };
      const response = await scoringAPI.calculateScore(request);
      setResult(response);
      onScoreCalculated?.(response);
    } catch (err: any) {
      setError(err.response?.data?.message || "점수 계산에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#28a745"; // 녹색
    if (score >= 60) return "#ffc107"; // 노란색
    if (score >= 40) return "#fd7e14"; // 주황색
    return "#dc3545"; // 빨간색
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "매우 좋음";
    if (score >= 60) return "좋음";
    if (score >= 40) return "보통";
    return "주의 필요";
  };

  return (
    <div className={styles.calculator}>
      <div className={styles.header}>
        <h2>상권 점수 계산기</h2>
        <p>상권 특성을 입력하여 점수를 계산해보세요</p>
      </div>

      <div className={styles.inputSection}>
        <h3>상권 특성 입력</h3>
        <div className={styles.featureGrid}>
          {Object.entries(features).map(([key, value]) => (
            <div key={key} className={styles.featureItem}>
              <label className={styles.featureLabel}>
                {featureLabels[key as keyof typeof featureLabels]}
                <span className={styles.description}>
                  {featureDescriptions[key as keyof typeof featureDescriptions]}
                </span>
              </label>
              <div className={styles.sliderContainer}>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={value}
                  onChange={(e) =>
                    handleFeatureChange(
                      key as keyof typeof features,
                      parseFloat(e.target.value)
                    )
                  }
                  className={styles.slider}
                />
                <span className={styles.value}>{Math.round(value * 100)}%</span>
              </div>
            </div>
          ))}
        </div>

        <button
          className={styles.calculateButton}
          onClick={handleCalculate}
          disabled={loading}
        >
          {loading ? "계산 중..." : "점수 계산하기"}
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {result && (
        <div className={styles.resultSection}>
          <h3>계산 결과</h3>
          <div className={styles.scoreCard}>
            <div className={styles.scoreDisplay}>
              <div
                className={styles.scoreCircle}
                style={{ borderColor: getScoreColor(result.data.score) }}
              >
                <span className={styles.scoreNumber}>{result.data.score}</span>
                <span className={styles.scoreUnit}>점</span>
              </div>
              <div className={styles.scoreInfo}>
                <div className={styles.scoreLabel}>
                  {getScoreLabel(result.data.score)}
                </div>
                <div className={styles.scoreDescription}>
                  상권 건강도 점수입니다
                </div>
              </div>
            </div>
          </div>

          <div className={styles.breakdownSection}>
            <h4>상세 분석</h4>
            <div className={styles.breakdownGrid}>
              {Object.entries(result.data.breakdown).map(([key, value]) => (
                <div key={key} className={styles.breakdownItem}>
                  <div className={styles.breakdownHeader}>
                    <span className={styles.breakdownLabel}>
                      {key === "footTraffic"
                        ? "유동인구"
                        : key === "sales"
                        ? "매출"
                        : key === "competitors"
                        ? "경쟁업체"
                        : key === "businessRates"
                        ? "사업비율"
                        : key === "dwellTime"
                        ? "체류시간"
                        : key}
                    </span>
                    <span className={styles.breakdownValue}>
                      {Math.round(value * 100)}점
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MarketScoreCalculator;
