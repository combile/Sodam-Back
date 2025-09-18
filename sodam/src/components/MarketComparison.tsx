import React, { useState, useEffect } from "react";
import { marketDiagnosisAPI, Market } from "../api/marketDiagnosis.ts";
import styles from "./MarketComparison.module.css";

const MarketComparison: React.FC = () => {
  const [sampleData, setSampleData] = useState<Market[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSampleData();
  }, []);

  const loadSampleData = async () => {
    try {
      setLoading(true);
      const response = await marketDiagnosisAPI.getMarkets();
      setSampleData(response.data);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "상권 데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
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
          <div key={item.id} className={styles.comparisonCard}>
            <div className={styles.cardHeader}>
              <h3>{item.name}</h3>
              <div className={styles.areaBadge}>{item.area}</div>
            </div>

            <div className={styles.marketInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>상권 코드</span>
                <span className={styles.infoValue}>{item.code}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>지역</span>
                <span className={styles.infoValue}>{item.area}</span>
              </div>
            </div>

            <div className={styles.actionSection}>
              <button
                className={styles.detailButton}
                onClick={() => {
                  // 상권 상세 정보 조회 로직
                  console.log("상권 상세 정보 조회:", item.code);
                }}
              >
                상세 분석 보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketComparison;
