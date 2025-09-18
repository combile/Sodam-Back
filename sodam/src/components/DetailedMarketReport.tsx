import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Download,
  Print,
  Share,
  Assessment,
  Search,
  TrendingUp,
  Warning,
  Lightbulb,
} from "@mui/icons-material";
import styles from "./DetailedMarketReport.module.css";

interface MarketData {
  name: string;
  region: string;
  district: string;
  rank: number;
  value: number;
  changeRate: number;
  category: string;
  // 추가 상세 정보
  totalStores?: number;
  avgSales?: number;
  footTraffic?: number;
  residentPopulation?: number;
  businessDensity?: number;
  avgRent?: number;
  ageGroup20s?: number;
  ageGroup30s?: number;
  ageGroup40s?: number;
  ageGroup50s?: number;
}

interface DetailedReportProps {
  marketData: MarketData;
  industryData: any[];
  regionalData: any;
  competitionAnalysis: any;
  riskAnalysis: any;
  actualScore?: number; // 실제 종합 점수
}

const DetailedMarketReport: React.FC<DetailedReportProps> = ({
  marketData,
  industryData,
  regionalData,
  competitionAnalysis,
  riskAnalysis,
  actualScore,
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [showAnalysisRequired, setShowAnalysisRequired] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // 상권분석 완료 여부 확인 함수
  const checkAnalysisCompletion = (): boolean => {
    // 실제로는 API를 통해 상권분석 완료 여부를 확인해야 함
    // 현재는 mock 데이터로 확인
    const hasAnalysisData =
      marketData && marketData.rank > 0 && marketData.changeRate !== 0;
    return hasAnalysisData;
  };

  const handleAnalysisRequired = () => {
    setShowAnalysisRequired(true);
  };

  const handleGoToAnalysis = () => {
    navigate("/market-analysis");
    setShowAnalysisRequired(false);
  };

  const handleCloseAnalysisModal = () => {
    setShowAnalysisRequired(false);
  };

  const handlePDFExport = async () => {
    setIsGeneratingPDF(true);
    try {
      // html2canvas와 jsPDF를 사용하여 모달 내용을 PDF로 변환
      const { default: html2canvas } = await import("html2canvas");
      const { jsPDF } = await import("jspdf");

      const reportElement = reportRef.current;
      if (!reportElement) {
        throw new Error("보고서 요소를 찾을 수 없습니다.");
      }

      // html2canvas로 모달 내용을 캡처
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        width: reportElement.scrollWidth,
        height: reportElement.scrollHeight,
        logging: false, // 콘솔 로그 비활성화
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 첫 페이지 추가
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 추가 페이지가 필요한 경우
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDF 다운로드
      const fileName = `${marketData.name}_상권분석보고서_${
        new Date().toISOString().split("T")[0]
      }.pdf`;
      pdf.save(fileName);

      // 성공 메시지
      alert("PDF 다운로드가 완료되었습니다!");
    } catch (error) {
      console.error("PDF 생성 실패:", error);
      alert("PDF 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const getMarketScore = (rank: number, changeRate: number) => {
    // 순위와 변화율을 기반으로 점수 계산 (100점 만점)
    let baseScore = 100;

    // 순위에 따른 점수 차감
    if (rank <= 3) baseScore -= 0;
    else if (rank <= 5) baseScore -= 10;
    else if (rank <= 10) baseScore -= 20;
    else if (rank <= 20) baseScore -= 35;
    else baseScore -= 50;

    // 변화율에 따른 점수 조정
    if (changeRate > 10) baseScore += 10;
    else if (changeRate > 5) baseScore += 5;
    else if (changeRate > 0) baseScore += 2;
    else if (changeRate > -5) baseScore -= 5;
    else baseScore -= 15;

    // 점수 범위 제한
    const finalScore = Math.max(0, Math.min(100, baseScore));

    // 점수에 따른 색상과 텍스트
    let color = "#dc3545"; // 빨강
    let text = "주의";

    if (finalScore >= 90) {
      color = "#28a745";
      text = "최우수";
    } else if (finalScore >= 80) {
      color = "#20c997";
      text = "우수";
    } else if (finalScore >= 70) {
      color = "#17a2b8";
      text = "양호";
    } else if (finalScore >= 60) {
      color = "#ffc107";
      text = "보통";
    }

    return { score: Math.round(finalScore), color, text };
  };

  // 실제 점수가 있으면 사용하고, 없으면 계산된 점수 사용
  const finalScore =
    actualScore || getMarketScore(marketData.rank, marketData.changeRate).score;

  const marketScore = {
    score: finalScore,
    color:
      finalScore >= 90
        ? "#28a745"
        : finalScore >= 80
        ? "#20c997"
        : finalScore >= 70
        ? "#17a2b8"
        : finalScore >= 60
        ? "#ffc107"
        : "#dc3545",
    text:
      finalScore >= 90
        ? "최우수"
        : finalScore >= 80
        ? "우수"
        : finalScore >= 70
        ? "양호"
        : finalScore >= 60
        ? "보통"
        : "주의",
  };

  return (
    <div className={styles.reportContainer} ref={reportRef}>
      {/* 보고서 헤더 */}
      <div className={styles.reportHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.reportTitle}>상권 분석 보고서</h1>
          <div className={styles.marketInfo}>
            <h2 className={styles.marketName}>{marketData.name}</h2>
            <div className={styles.marketMeta}>
              <span className={styles.location}>
                {marketData.region} {marketData.district}
              </span>
              <span className={styles.analysisDate}>
                분석 일시: {new Date().toLocaleDateString("ko-KR")}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.headerActions}>
          <button
            className={styles.actionButton}
            onClick={handlePDFExport}
            disabled={isGeneratingPDF}
          >
            <Download style={{ fontSize: "18px", marginRight: "8px" }} />
            {isGeneratingPDF ? "PDF 생성 중..." : "PDF 다운로드"}
          </button>
          <button className={styles.actionButton}>
            <Print style={{ fontSize: "18px", marginRight: "8px" }} />
            인쇄
          </button>
          <button className={styles.actionButton}>
            <Share style={{ fontSize: "18px", marginRight: "8px" }} />
            공유
          </button>
        </div>
      </div>

      {/* 상권 점수 */}
      <div className={styles.scoreSection}>
        <div className={styles.scoreCard}>
          <div className={styles.scoreContent}>
            <div className={styles.scoreLabel}>상권 점수</div>
            <div
              className={styles.scoreValue}
              style={{ color: marketScore.color }}
            >
              {marketScore.score}점
            </div>
            <div className={styles.scoreText}>{marketScore.text}</div>
          </div>
        </div>
        <div className={styles.rankInfo}>
          <div className={styles.rankItem}>
            <span className={styles.rankLabel}>순위</span>
            <span className={styles.rankValue}>{marketData.rank}위</span>
          </div>
          <div className={styles.rankItem}>
            <span className={styles.rankLabel}>변화율</span>
            <span
              className={`${styles.rankValue} ${
                marketData.changeRate > 0 ? styles.positive : styles.negative
              }`}
            >
              {marketData.changeRate > 0 ? "+" : ""}
              {marketData.changeRate}%
            </span>
          </div>
        </div>
      </div>

      {/* 상세 분석 섹션 */}
      <div className={styles.analysisSections}>
        {/* 1. 상권 개요 */}
        <section className={styles.analysisSection}>
          <h3 className={styles.sectionTitle}>상권 개요</h3>
          <div className={styles.sectionContent}>
            <p className={styles.reportText}>
              <strong>{marketData.name}</strong>은(는) {marketData.region}{" "}
              {marketData.district}에 위치한 상권으로, 현재 전체 상권 중{" "}
              <strong>{marketData.rank}위</strong>를 차지하고 있습니다. 전분기
              대비{" "}
              <strong>{marketData.changeRate > 0 ? "증가" : "감소"}</strong>{" "}
              추세를 보이며, 변화율은{" "}
              <strong>{Math.abs(marketData.changeRate)}%</strong>입니다.
            </p>

            {/* 상세 통계 정보 */}
            <div className={styles.detailedStats}>
              <div className={styles.statGrid}>
                <div className={styles.statCard}>
                  <h4 className={styles.statTitle}>사업체 현황</h4>
                  <div className={styles.statValue}>
                    {marketData.totalStores?.toLocaleString() || "N/A"}개
                  </div>
                  <div className={styles.statLabel}>총 사업체 수</div>
                </div>
                <div className={styles.statCard}>
                  <h4 className={styles.statTitle}>평균 매출</h4>
                  <div className={styles.statValue}>
                    {marketData.avgSales?.toLocaleString() || "N/A"}원
                  </div>
                  <div className={styles.statLabel}>월 평균 매출</div>
                </div>
                <div className={styles.statCard}>
                  <h4 className={styles.statTitle}>유동인구</h4>
                  <div className={styles.statValue}>
                    {marketData.footTraffic?.toLocaleString() || "N/A"}명
                  </div>
                  <div className={styles.statLabel}>일 평균 유동인구</div>
                </div>
                <div className={styles.statCard}>
                  <h4 className={styles.statTitle}>거주인구</h4>
                  <div className={styles.statValue}>
                    {marketData.residentPopulation?.toLocaleString() || "N/A"}명
                  </div>
                  <div className={styles.statLabel}>상권 내 거주인구</div>
                </div>
                <div className={styles.statCard}>
                  <h4 className={styles.statTitle}>사업체 밀도</h4>
                  <div className={styles.statValue}>
                    {marketData.businessDensity?.toLocaleString() || "N/A"}
                    개/km²
                  </div>
                  <div className={styles.statLabel}>단위면적당 사업체</div>
                </div>
                <div className={styles.statCard}>
                  <h4 className={styles.statTitle}>평균 임대료</h4>
                  <div className={styles.statValue}>
                    {marketData.avgRent?.toLocaleString() || "N/A"}원
                  </div>
                  <div className={styles.statLabel}>월 평균 임대료</div>
                </div>
              </div>
            </div>

            <p className={styles.reportText}>
              이 상권은 {marketData.category} 업종이 주를 이루고 있으며,
              {marketData.rank <= 5
                ? "상위권에 속하는 우수한 상권"
                : marketData.rank <= 10
                ? "중상위권의 안정적인 상권"
                : "성장 잠재력이 있는 상권"}
              으로 평가됩니다.
            </p>

            {/* 연령대별 인구 분포 */}
            {marketData.ageGroup20s && (
              <div className={styles.ageDistribution}>
                <h4 className={styles.subsectionTitle}>연령대별 인구 분포</h4>
                <div className={styles.ageStats}>
                  <div className={styles.ageItem}>
                    <span className={styles.ageLabel}>20대</span>
                    <span className={styles.ageValue}>
                      {marketData.ageGroup20s}%
                    </span>
                  </div>
                  <div className={styles.ageItem}>
                    <span className={styles.ageLabel}>30대</span>
                    <span className={styles.ageValue}>
                      {marketData.ageGroup30s}%
                    </span>
                  </div>
                  <div className={styles.ageItem}>
                    <span className={styles.ageLabel}>40대</span>
                    <span className={styles.ageValue}>
                      {marketData.ageGroup40s}%
                    </span>
                  </div>
                  <div className={styles.ageItem}>
                    <span className={styles.ageLabel}>50대+</span>
                    <span className={styles.ageValue}>
                      {marketData.ageGroup50s}%
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 2. 시장 환경 분석 */}
        <section className={styles.analysisSection}>
          <h3 className={styles.sectionTitle}>시장 환경 분석</h3>
          <div className={styles.sectionContent}>
            <div className={styles.industryAnalysis}>
              <h4 className={styles.subsectionTitle}>업종별 분포 현황</h4>
              <p className={styles.reportText}>
                해당 상권의 업종 분포를 분석한 결과, 다음과 같은 특징을
                보입니다:
              </p>
              <ul className={styles.analysisList}>
                {industryData.slice(0, 5).map((industry, index) => (
                  <li key={index} className={styles.analysisItem}>
                    <strong>{industry.상권업종대분류명}</strong>:{" "}
                    {industry.count}개 업소가 운영 중이며, 전체의{" "}
                    {industry.percentage}%를 차지합니다.
                    {index === 0 &&
                      " 이는 해당 상권의 주요 업종으로, 상권 특성을 대표합니다."}
                  </li>
                ))}
              </ul>
            </div>

            <div className={styles.marketTrends}>
              <h4 className={styles.subsectionTitle}>시장 트렌드 분석</h4>
              <p className={styles.reportText}>
                최근 시장 동향을 분석한 결과,{" "}
                {industryData[0]?.상권업종대분류명} 업종이 가장 활발한 성장세를
                보이고 있습니다. 이는 지역 특성과 소비자 수요 변화에 따른
                자연스러운 현상으로 판단됩니다.
              </p>
              <p className={styles.reportText}>
                특히 {marketData.changeRate > 0 ? "상승" : "하락"} 추세는
                {marketData.changeRate > 0
                  ? "지역 경제 활성화와 소비 증가를 의미하며, 향후 지속적인 성장이 기대됩니다."
                  : "시장 경쟁 심화나 소비 패턴 변화의 영향으로 보이며, 차별화 전략이 필요합니다."}
              </p>
            </div>
          </div>
        </section>

        {/* 3. 경쟁 환경 분석 */}
        <section className={styles.analysisSection}>
          <h3 className={styles.sectionTitle}>경쟁 환경 분석</h3>
          <div className={styles.sectionContent}>
            <p className={styles.reportText}>
              경쟁 분석 결과, 해당 상권에는 총{" "}
              <strong>{competitionAnalysis?.total_businesses || 0}개</strong>의
              사업체가 운영 중이며, 경쟁 점수는{" "}
              <strong>{competitionAnalysis?.competition_score || 0}/100</strong>
              점입니다.
            </p>

            <div className={styles.competitionDetails}>
              <h4 className={styles.subsectionTitle}>경쟁 밀도 분석</h4>
              <p className={styles.reportText}>
                {competitionAnalysis?.competition_score >= 70
                  ? "경쟁이 매우 치열한 환경으로, 차별화된 서비스와 강력한 브랜딩이 필수적입니다."
                  : competitionAnalysis?.competition_score >= 50
                  ? "보통 수준의 경쟁 환경으로, 적절한 차별화 전략으로 경쟁 우위를 확보할 수 있습니다."
                  : "경쟁이 상대적으로 적은 환경으로, 시장 진입 기회가 양호한 편입니다."}
              </p>

              <h4 className={styles.subsectionTitle}>경쟁업체 특성</h4>
              <ul className={styles.analysisList}>
                {competitionAnalysis?.industry_breakdown
                  ?.slice(0, 3)
                  .map((item: any, index: number) => (
                    <li key={index} className={styles.analysisItem}>
                      <strong>{item.상권업종대분류명}</strong> 중{" "}
                      <strong>{item.상권업종중분류명}</strong>이{item.count}개로
                      가장 많아, 이 분야의 경쟁이 치열할 것으로 예상됩니다.
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 4. 리스크 분석 */}
        <section className={styles.analysisSection}>
          <h3 className={styles.sectionTitle}>리스크 분석</h3>
          <div className={styles.sectionContent}>
            <div className={styles.riskSummary}>
              <p className={styles.reportText}>
                리스크 분석 결과, 해당 상권은{" "}
                <strong>{riskAnalysis?.risk_type || "분석 중"}</strong> 유형으로
                분류되며, 리스크 점수는{" "}
                <strong>{riskAnalysis?.risk_score || 0}/100</strong>점입니다.
              </p>
            </div>

            <div className={styles.riskFactors}>
              <h4 className={styles.subsectionTitle}>주요 리스크 요인</h4>
              <ul className={styles.analysisList}>
                {riskAnalysis?.key_indicators?.map(
                  (indicator: string, index: number) => (
                    <li key={index} className={styles.analysisItem}>
                      {indicator}
                    </li>
                  )
                ) ||
                  [
                    "유동인구 감소 가능성",
                    "경쟁업체 증가로 인한 시장 포화",
                    "소비 패턴 변화에 따른 매출 변동성",
                  ].map((indicator, index) => (
                    <li key={index} className={styles.analysisItem}>
                      {indicator}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </section>

        {/* 5. 투자 권장사항 */}
        <section className={styles.analysisSection}>
          <h3 className={styles.sectionTitle}>투자 권장사항</h3>
          <div className={styles.sectionContent}>
            <div className={styles.recommendations}>
              <h4 className={styles.subsectionTitle}>전략적 제안</h4>
              <p className={styles.reportText}>
                종합적인 분석 결과를 바탕으로 다음과 같은 투자 전략을
                제안합니다:
              </p>

              <div className={styles.recommendationCards}>
                <div className={styles.recommendationCard}>
                  <h5 className={styles.recommendationTitle}>
                    단기 전략 (3-6개월)
                  </h5>
                  <ul className={styles.recommendationList}>
                    <li>차별화된 상품/서비스 개발을 통한 경쟁 우위 확보</li>
                    <li>고객 세분화를 통한 맞춤형 마케팅 전략 수립</li>
                    <li>디지털 마케팅 채널 확대 및 온라인 고객 유치</li>
                  </ul>
                </div>

                <div className={styles.recommendationCard}>
                  <h5 className={styles.recommendationTitle}>
                    중기 전략 (6-12개월)
                  </h5>
                  <ul className={styles.recommendationList}>
                    <li>브랜드 강화를 통한 고객 충성도 향상</li>
                    <li>운영 효율성 개선 및 비용 최적화</li>
                    <li>새로운 수익원 발굴 및 사업 다각화</li>
                  </ul>
                </div>

                <div className={styles.recommendationCard}>
                  <h5 className={styles.recommendationTitle}>
                    장기 전략 (1-2년)
                  </h5>
                  <ul className={styles.recommendationList}>
                    <li>지역 내 확장 또는 프랜차이즈 진출 검토</li>
                    <li>온라인 사업 확장 및 O2O 서비스 구축</li>
                    <li>지속가능한 성장을 위한 시스템 구축</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className={styles.investmentAdvice}>
              <h4 className={styles.subsectionTitle}>투자 조언</h4>
              <p className={styles.reportText}>
                {marketScore.score >= 80
                  ? "해당 상권은 우수한 성과를 보이고 있어 적극적인 투자를 권장합니다. 다만 지속적인 모니터링과 혁신을 통해 경쟁 우위를 유지해야 합니다."
                  : marketScore.score >= 60
                  ? "보통 수준의 상권으로, 신중한 투자 검토가 필요합니다. 차별화 전략과 함께 단계적인 투자를 고려해보시기 바랍니다."
                  : "주의가 필요한 상권으로, 상세한 사전 조사와 리스크 관리가 필수적입니다. 투자 전 충분한 검토를 권장합니다."}
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 보고서 푸터 */}
      <div className={styles.reportFooter}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            본 보고서는 대전광역시 상권 데이터를 기반으로 작성되었으며, 투자
            결정 시 추가적인 현장 조사와 전문가 상담을 권장합니다.
          </p>
          <p className={styles.footerText}>
            보고서 생성일: {new Date().toLocaleString("ko-KR")} | 데이터 기준일:
            2024년 4분기
          </p>
        </div>
      </div>

      {/* 상권분석 안내 모달 */}
      {showAnalysisRequired && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContainer}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>상권분석이 필요합니다</h2>
              <button
                className={styles.closeButton}
                onClick={handleCloseAnalysisModal}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.iconContainer}>
                <div className={styles.analysisIcon}>
                  <Assessment style={{ fontSize: "48px" }} />
                </div>
              </div>

              <p className={styles.modalMessage}>
                상세한 분석 보고서를 PDF로 다운로드하려면 먼저 상권분석을
                완료해주세요.
              </p>

              <div className={styles.featureList}>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>
                    <Search style={{ fontSize: "20px" }} />
                  </span>
                  <span>상권 현황 분석</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>
                    <TrendingUp style={{ fontSize: "20px" }} />
                  </span>
                  <span>경쟁 환경 분석</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>
                    <Warning style={{ fontSize: "20px" }} />
                  </span>
                  <span>리스크 분석</span>
                </div>
                <div className={styles.featureItem}>
                  <span className={styles.featureIcon}>
                    <Lightbulb style={{ fontSize: "20px" }} />
                  </span>
                  <span>전략 제안</span>
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={handleCloseAnalysisModal}
              >
                나중에 하기
              </button>
              <button
                className={styles.analysisButton}
                onClick={handleGoToAnalysis}
              >
                상권분석 시작하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailedMarketReport;
