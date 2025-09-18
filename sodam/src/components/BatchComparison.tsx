import React, { useState } from "react";
import {
  scoringAPI,
  BatchScoringRequest,
  BatchScoringResponse,
} from "../api/scoring.ts";
import styles from "./BatchComparison.module.css";

const BUSINESS_TYPES = [
  "카페",
  "베이커리",
  "루프탑 술집",
  "치킨호프",
  "고급 레스토랑",
  "편의점",
  "분식집",
  "중식당",
  "일식집",
  "패스트푸드점",
  "피자집",
  "아이스크림 전문점",
  "술집(일반포차)",
  "와인바",
  "노래방",
  "PC방",
  "코인노래방",
  "오락실",
  "학원(보습/입시)",
  "어린이집",
  "학원(성인/직장인)",
  "체육관(헬스장)",
  "요가/필라테스",
  "뷰티샵(미용실)",
  "네일샵",
  "이발소",
  "안경점",
  "병원(내과/소아과)",
  "치과",
  "약국",
  "세탁소",
  "꽃집",
  "서점",
  "문구점",
  "반려동물샵",
  "가구점",
  "전자제품 매장",
  "전통시장 점포",
  "푸드트럭",
  "중고매장(리세일샵)",
  "골프연습장",
  "클라이밍장",
  "헌책방",
  "사진관",
  "코워킹 스페이스",
  "공유주방",
  "전통찻집",
  "철물점",
  "식료품점",
  "국밥집",
];

const BatchComparison: React.FC = () => {
  const [businessType, setBusinessType] = useState<string>("");
  const [locations, setLocations] = useState<string[]>(["sample_market_1"]);
  const [result, setResult] = useState<BatchScoringResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addLocation = () => {
    const newMarketCode = `sample_market_${locations.length + 1}`;
    setLocations([...locations, newMarketCode]);
  };

  const removeLocation = (index: number) => {
    if (locations.length > 1) {
      setLocations(locations.filter((_, i) => i !== index));
    }
  };

  const updateLocationCode = (index: number, code: string) => {
    const newLocations = [...locations];
    newLocations[index] = code;
    setLocations(newLocations);
  };

  const handleCompare = async () => {
    if (locations.some((loc) => !loc.trim())) {
      setError("모든 상권 코드를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const request: BatchScoringRequest = {
        marketCodes: locations,
        weights: businessType
          ? {
              footTraffic: 0.3,
              sales: 0.2,
              competitors: 0.2,
              businessRates: 0.15,
              dwellTime: 0.15,
            }
          : undefined,
      };
      const response = await scoringAPI.calculateBatchScore(request);
      setResult(response);
    } catch (err: any) {
      setError(err.response?.data?.message || "배치 비교에 실패했습니다.");
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

  return (
    <div className={styles.batchComparison}>
      <div className={styles.header}>
        <h2>상권 배치 비교</h2>
        <p>여러 상권을 한 번에 비교하여 최적의 입지를 찾아보세요</p>
      </div>

      <div className={styles.settingsSection}>
        <div className={styles.businessTypeSection}>
          <label className={styles.label}>
            업종 선택 (선택사항)
            <span className={styles.description}>
              업종을 선택하면 해당 업종에 특화된 점수 계산을 사용합니다
            </span>
          </label>
          <select
            value={businessType}
            onChange={(e) => setBusinessType(e.target.value)}
            className={styles.select}
          >
            <option value="">업종 선택 안함 (기본 점수 계산)</option>
            {BUSINESS_TYPES.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.locationsSection}>
        <div className={styles.sectionHeader}>
          <h3>비교할 상권들</h3>
          <button onClick={addLocation} className={styles.addButton}>
            + 상권 추가
          </button>
        </div>

        <div className={styles.locationsList}>
          {locations.map((location, index) => (
            <div key={index} className={styles.locationCard}>
              <div className={styles.locationHeader}>
                <input
                  type="text"
                  placeholder={`상권 ${index + 1} 코드`}
                  value={location}
                  onChange={(e) => updateLocationCode(index, e.target.value)}
                  className={styles.nameInput}
                />
                {locations.length > 1 && (
                  <button
                    onClick={() => removeLocation(index)}
                    className={styles.removeButton}
                  >
                    삭제
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.actionSection}>
        <button
          className={styles.compareButton}
          onClick={handleCompare}
          disabled={loading}
        >
          {loading ? "비교 중..." : "상권 비교하기"}
        </button>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      {result && (
        <div className={styles.resultsSection}>
          <h3>비교 결과</h3>
          <div className={styles.resultsList}>
            {result.data.results
              .sort((a, b) => b.score - a.score)
              .map((item, index) => (
                <div key={item.marketCode} className={styles.resultCard}>
                  <div className={styles.rankBadge}>{index + 1}위</div>
                  <div className={styles.resultContent}>
                    <div className={styles.resultHeader}>
                      <h4>{item.marketCode}</h4>
                      <div className={styles.scoreDisplay}>
                        <div
                          className={styles.scoreCircle}
                          style={{ borderColor: getScoreColor(item.score) }}
                        >
                          <span className={styles.scoreNumber}>
                            {item.score}
                          </span>
                          <span className={styles.scoreUnit}>점</span>
                        </div>
                        <div className={styles.scoreInfo}>
                          <div className={styles.scoreLabel}>
                            {getScoreLabel(item.score)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className={styles.breakdownSection}>
                      <h5>상세 분석</h5>
                      <div className={styles.breakdownGrid}>
                        {Object.entries(item.breakdown).map(([key, value]) => (
                          <div key={key} className={styles.breakdownItem}>
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
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BatchComparison;
