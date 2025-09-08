import React, { useState, useEffect } from "react";
import { recommendationsAPI, SampleData } from "../api/recommendations";
import styles from "./MarketComparison.module.css";

const MarketComparison: React.FC = () => {
  const [sampleData, setSampleData] = useState<SampleData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    try {
      setLoading(true);
      const response = await recommendationsAPI.getSampleData();
      setSampleData(response.items);
    } catch (err: any) {
      setError(err.response?.data?.error || "샘플 데이터를 불러오는데 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "#28a745";
    if (score >= 60) return "#ffc107";
    if (score >= 40) return "#fd7e14";
    return "#dc3545";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "매우 좋음";
    if (score >= 60) return "좋음";
    if (score >= 40) return "보통";
    return "주의 필요";
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>샘플 데이터를 불러오는 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={loadSampleData} className={styles.retryButton}>
          다시 시도
        </button>
      </div>
    );
  }

  return (
    <div className={styles.comparison}>
      <div className={styles.header}>
        <h2>상권 비교</h2>
        <p>실제 상권 데이터를 기반으로 한 점수 비교</p>
      </div>

      <div className={styles.comparisonGrid}>
        {sampleData.map((item) => (
          <div key={item.area_id} className={styles.comparisonCard}>
            <div className={styles.cardHeader}>
              <h3>{item.area_name}</h3>
              <div 
                className={styles.scoreBadge}
                style={{ backgroundColor: getScoreColor(item.score) }}
              >
                {item.score}점
              </div>
            </div>

            <div className={styles.scoreInfo}>
              <div className={styles.scoreLabel}>{getScoreLabel(item.score)}</div>
            </div>

            <div className={styles.featuresSection}>
              <h4>상권 특성</h4>
              <div className={styles.featuresGrid}>
                <div className={styles.featureItem}>
                  <span className={styles.featureLabel}>보행량</span>
                  <div className={styles.featureBar}>
                    <div 
                      className={styles.featureFill}
                      style={{ width: `${item.features.foot_traffic * 100}%` }}
                    ></div>
                  </div>
                  <span className={styles.featureValue}>
                    {Math.round(item.features.foot_traffic * 100)}%
                  </span>
                </div>

                <div className={styles.featureItem}>
                  <span className={styles.featureLabel}>경쟁업체</span>
                  <div className={styles.featureBar}>
                    <div 
                      className={styles.featureFill}
                      style={{ width: `${item.features.competitors_500m * 100}%` }}
                    ></div>
                  </div>
                  <span className={styles.featureValue}>
                    {Math.round(item.features.competitors_500m * 100)}%
                  </span>
                </div>

                <div className={styles.featureItem}>
                  <span className={styles.featureLabel}>평균 소득</span>
                  <div className={styles.featureBar}>
                    <div 
                      className={styles.featureFill}
                      style={{ width: `${item.features.avg_income * 100}%` }}
                    ></div>
                  </div>
                  <span className={styles.featureValue}>
                    {Math.round(item.features.avg_income * 100)}%
                  </span>
                </div>

                <div className={styles.featureItem}>
                  <span className={styles.featureLabel}>임대료</span>
                  <div className={styles.featureBar}>
                    <div 
                      className={styles.featureFill}
                      style={{ width: `${item.features.rent_cost * 100}%` }}
                    ></div>
                  </div>
                  <span className={styles.featureValue}>
                    {Math.round(item.features.rent_cost * 100)}%
                  </span>
                </div>

                <div className={styles.featureItem}>
                  <span className={styles.featureLabel}>20대 비율</span>
                  <div className={styles.featureBar}>
                    <div 
                      className={styles.featureFill}
                      style={{ width: `${item.features.age_20s_ratio * 100}%` }}
                    ></div>
                  </div>
                  <span className={styles.featureValue}>
                    {Math.round(item.features.age_20s_ratio * 100)}%
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.breakdownSection}>
              <h4>점수 분석</h4>
              <div className={styles.breakdownList}>
                {Object.entries(item.breakdown).map(([key, data]) => (
                  <div key={key} className={styles.breakdownItem}>
                    <span className={styles.breakdownLabel}>
                      {key === 'foot_traffic' ? '보행량' :
                       key === 'competitors_500m' ? '경쟁업체' :
                       key === 'avg_income' ? '평균 소득' :
                       key === 'rent_cost' ? '임대료' :
                       key === 'age_20s_ratio' ? '20대 비율' : key}
                    </span>
                    <span className={styles.breakdownValue}>
                      {data.contrib > 0 ? '+' : ''}{data.contrib.toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketComparison;
