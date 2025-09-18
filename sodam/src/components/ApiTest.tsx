import React, { useState, useEffect } from "react";
import { commonAPI, Industry, Region } from "../api/common.ts";

const ApiTest: React.FC = () => {
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 업종 정보와 지역 정보를 병렬로 로드
      const [industriesResponse, regionsResponse] = await Promise.all([
        commonAPI.getSupportedIndustries(),
        commonAPI.getSupportedRegions(),
      ]);

      setIndustries(industriesResponse.data.industries);
      setRegions(regionsResponse.data.regions);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "데이터를 불러오는데 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem", textAlign: "center" }}>
        <div>API 테스트 중...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "2rem" }}>
        <div style={{ color: "red", marginBottom: "1rem" }}>오류: {error}</div>
        <button onClick={loadData}>다시 시도</button>
      </div>
    );
  }

  return (
    <div style={{ padding: "2rem" }}>
      <h2>백엔드 API 연동 테스트</h2>

      <div style={{ marginBottom: "2rem" }}>
        <h3>지원 업종 ({industries.length}개)</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
          }}
        >
          {industries.map((industry) => (
            <div
              key={industry.code}
              style={{
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <div style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>
                {industry.icon}
              </div>
              <div style={{ fontWeight: "bold", marginBottom: "0.25rem" }}>
                {industry.name}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#666",
                  marginBottom: "0.25rem",
                }}
              >
                {industry.description}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#999" }}>
                {industry.category}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3>지원 지역 ({regions.length}개)</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "1rem",
          }}
        >
          {regions.map((region) => (
            <div
              key={region.code}
              style={{
                padding: "1rem",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f0f8ff",
              }}
            >
              <div style={{ fontWeight: "bold", marginBottom: "0.5rem" }}>
                {region.full_name}
              </div>
              <div
                style={{
                  fontSize: "0.875rem",
                  color: "#666",
                  marginBottom: "0.25rem",
                }}
              >
                {region.description}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#999" }}>
                인구: {region.population.toLocaleString()}명 | 면적:{" "}
                {region.area_km2}km² | 상권: {region.market_count}개
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApiTest;
