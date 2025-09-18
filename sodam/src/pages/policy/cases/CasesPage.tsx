import React, { useState } from "react";
import styles from "./CasesPage.module.css";

interface SimilarMarketCase {
  id: number;
  title: string;
  businessType: string;
  location: string;
  marketType: string;
  ownerName: string;
  startDate: string;
  investment: string;
  monthlyRevenue: string;
  growthRate: string;
  description: string;
  marketAnalysis: MarketAnalysis;
  challenges: string[];
  solutions: string[];
  keyFactors: string[];
  image: string;
  category: string;
  tags: string[];
  story: string;
  similarMarkets: string[];
}

interface MarketAnalysis {
  footTraffic: string;
  competitionLevel: string;
  targetDemographics: string;
  seasonalFactors: string;
  marketTrend: string;
  riskLevel: string;
}

const CasesPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCase, setSelectedCase] = useState<SimilarMarketCase | null>(
    null
  );
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [userLocation, setUserLocation] = useState<string>("");
  const [userBusinessType, setUserBusinessType] = useState<string>("");

  // 유사 상권 성공 사례 더미데이터
  const similarMarketCases: SimilarMarketCase[] = [
    {
      id: 1,
      title: "대전 유성구 대학가 카페 '커피나무' 성공 스토리",
      businessType: "카페/음료",
      location: "대전 유성구",
      marketType: "대학가 상권",
      ownerName: "김민수",
      startDate: "2023-03-15",
      investment: "5,000만원",
      monthlyRevenue: "800만원",
      growthRate: "60%",
      description:
        "대학가 근처에서 시작한 카페가 1년 만에 지역 최고 인기 카페로 성장한 사례입니다.",
      marketAnalysis: {
        footTraffic: "일평균 2,000명",
        competitionLevel: "높음 (주변 카페 15개)",
        targetDemographics: "대학생 70%, 직장인 20%, 기타 10%",
        seasonalFactors: "학기 중 매출 상승, 방학 중 하락",
        marketTrend: "상승세",
        riskLevel: "보통",
      },
      challenges: [
        "초기 고객 확보 어려움",
        "경쟁 카페 다수",
        "원두 공급업체 선정",
        "계절성 매출 변동",
      ],
      solutions: [
        "SNS 마케팅 집중",
        "특별한 메뉴 개발",
        "로컬 원두 업체와 파트너십",
        "학생 할인 프로그램 운영",
      ],
      keyFactors: [
        "대학생 타겟 마케팅",
        "인스타그래머블 공간 조성",
        "로컬 원두 사용",
        "학생 커뮤니티 구축",
      ],
      image:
        "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop",
      category: "음식점",
      tags: ["카페", "대학가", "SNS마케팅", "로컬원두"],
      story:
        "처음에는 단순히 커피를 좋아해서 시작한 카페였습니다. 하지만 대학가라는 특성상 경쟁이 치열했고, 초기에는 고객 확보가 쉽지 않았습니다. SNS 마케팅에 집중하고, 대학생들이 좋아할 만한 특별한 메뉴를 개발했습니다. 또한 지역 원두 업체와 파트너십을 맺어 신뢰성을 높였고, 인스타그램에 올리기 좋은 공간을 조성했습니다. 1년이 지난 지금은 월 매출 800만원을 달성하고 있습니다.",
      similarMarkets: [
        "대전 중구 대학가",
        "대전 동구 대학가",
        "청주 대학가",
        "천안 대학가",
      ],
    },
    {
      id: 2,
      title: "대전 중구 전통시장 '맛집거리' 성공기",
      businessType: "음식점",
      location: "대전 중구",
      marketType: "전통시장 상권",
      ownerName: "박지영",
      startDate: "2022-09-01",
      investment: "3,000만원",
      monthlyRevenue: "600만원",
      growthRate: "80%",
      description:
        "전통시장 내에서 시작한 음식점이 지역 맛집으로 성장한 사례입니다.",
      marketAnalysis: {
        footTraffic: "일평균 1,500명",
        competitionLevel: "보통 (주변 음식점 8개)",
        targetDemographics: "중년층 50%, 젊은층 30%, 관광객 20%",
        seasonalFactors: "연중 안정적",
        marketTrend: "안정세",
        riskLevel: "낮음",
      },
      challenges: [
        "전통시장 특성상 고객층 한정",
        "위생 관리 중요성",
        "원재료 공급 안정성",
      ],
      solutions: [
        "전통시장 특화 메뉴 개발",
        "위생 관리 시스템 구축",
        "지역 농협과 직거래",
        "관광객 타겟 마케팅",
      ],
      keyFactors: ["전통시장 특화", "위생 관리", "지역 연계", "관광객 유치"],
      image:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      category: "음식점",
      tags: ["전통시장", "맛집", "지역특화", "관광객"],
      story:
        "전통시장의 특성을 활용하여 시작한 음식점입니다. 초기에는 전통시장 특성상 고객층이 한정적이었지만, 전통시장에 특화된 메뉴를 개발하고 위생 관리에 집중했습니다. 지역 농협과 직거래를 통해 원재료의 품질을 보장하고, 관광객을 타겟으로 한 마케팅을 통해 고객층을 확대했습니다. 현재는 월 매출 600만원을 달성하고 있습니다.",
      similarMarkets: [
        "대전 서구 전통시장",
        "대전 동구 전통시장",
        "청주 전통시장",
        "천안 전통시장",
      ],
    },
    {
      id: 3,
      title: "대전 서구 신도시 '편의점 프랜차이즈' 성장기",
      businessType: "편의점",
      location: "대전 서구",
      marketType: "신도시 상권",
      ownerName: "이준호",
      startDate: "2022-06-10",
      investment: "8,000만원",
      monthlyRevenue: "1,200만원",
      growthRate: "120%",
      description:
        "신도시에서 시작한 편의점이 지역 필수 상점으로 성장한 사례입니다.",
      marketAnalysis: {
        footTraffic: "일평균 3,000명",
        competitionLevel: "낮음 (주변 편의점 3개)",
        targetDemographics: "신혼부부 40%, 직장인 35%, 학생 25%",
        seasonalFactors: "연중 안정적",
        marketTrend: "급상승세",
        riskLevel: "낮음",
      },
      challenges: [
        "신도시 특성상 초기 고객 부족",
        "대형마트와의 경쟁",
        "상품 구성 최적화",
      ],
      solutions: [
        "신도시 특화 상품 구성",
        "24시간 운영",
        "배달 서비스 도입",
        "지역 커뮤니티 참여",
      ],
      keyFactors: [
        "신도시 특화",
        "24시간 운영",
        "배달 서비스",
        "커뮤니티 참여",
      ],
      image:
        "https://images.unsplash.com/photo-1518176258766-fc9d55f2b4b3?w=400&h=300&fit=crop",
      category: "유통업",
      tags: ["편의점", "신도시", "24시간운영", "배달서비스"],
      story:
        "신도시의 성장 가능성을 보고 시작한 편의점입니다. 초기에는 신도시 특성상 고객이 부족했지만, 신도시에 특화된 상품을 구성하고 24시간 운영을 통해 차별화했습니다. 배달 서비스를 도입하여 편의성을 높이고, 지역 커뮤니티에 적극 참여하여 신뢰를 쌓았습니다. 현재는 월 매출 1,200만원을 달성하고 있습니다.",
      similarMarkets: [
        "대전 유성구 신도시",
        "대전 동구 신도시",
        "청주 신도시",
        "천안 신도시",
      ],
    },
    {
      id: 4,
      title: "대전 동구 골목상권 '수제맥주 펍' 성공 스토리",
      businessType: "술집/펍",
      location: "대전 동구",
      marketType: "골목상권",
      ownerName: "최수진",
      startDate: "2023-01-20",
      investment: "4,500만원",
      monthlyRevenue: "900만원",
      growthRate: "90%",
      description:
        "골목상권에서 시작한 수제맥주 펍이 지역 대표 술집으로 성장한 사례입니다.",
      marketAnalysis: {
        footTraffic: "일평균 800명",
        competitionLevel: "보통 (주변 술집 6개)",
        targetDemographics: "20-30대 70%, 40대 20%, 기타 10%",
        seasonalFactors: "주말 매출 집중",
        marketTrend: "상승세",
        riskLevel: "보통",
      },
      challenges: [
        "골목상권 특성상 접근성",
        "수제맥주 제조 기술",
        "고객층 확보",
      ],
      solutions: [
        "골목 입구 간판 설치",
        "수제맥주 제조 기술 습득",
        "SNS 마케팅 집중",
        "정기 이벤트 개최",
      ],
      keyFactors: [
        "수제맥주 특화",
        "골목 특성 활용",
        "SNS 마케팅",
        "정기 이벤트",
      ],
      image:
        "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=300&fit=crop",
      category: "음식점",
      tags: ["수제맥주", "골목상권", "SNS마케팅", "정기이벤트"],
      story:
        "골목상권의 특성을 활용하여 시작한 수제맥주 펍입니다. 초기에는 골목상권 특성상 접근성이 어려웠지만, 골목 입구에 눈에 띄는 간판을 설치하고 수제맥주 제조 기술을 습득했습니다. SNS 마케팅에 집중하여 젊은 고객층을 확보하고, 정기적인 이벤트를 개최하여 단골 고객을 만들었습니다. 현재는 월 매출 900만원을 달성하고 있습니다.",
      similarMarkets: [
        "대전 중구 골목상권",
        "대전 서구 골목상권",
        "청주 골목상권",
        "천안 골목상권",
      ],
    },
    {
      id: 5,
      title: "대전 대덕구 공단 '커피카트' 성장기",
      businessType: "음료/카트",
      location: "대전 대덕구",
      marketType: "공단 상권",
      ownerName: "정미영",
      startDate: "2022-11-05",
      investment: "1,500만원",
      monthlyRevenue: "400만원",
      growthRate: "70%",
      description:
        "공단에서 시작한 커피카트가 직장인들의 필수 휴식 공간으로 성장한 사례입니다.",
      marketAnalysis: {
        footTraffic: "일평균 1,200명",
        competitionLevel: "낮음 (주변 카페 2개)",
        targetDemographics: "직장인 90%, 기타 10%",
        seasonalFactors: "연중 안정적",
        marketTrend: "안정세",
        riskLevel: "낮음",
      },
      challenges: [
        "공단 특성상 운영 시간 제한",
        "직장인 타겟 고객층",
        "커피 품질 관리",
      ],
      solutions: [
        "공단 근무시간 맞춤 운영",
        "직장인 특화 메뉴 개발",
        "고품질 원두 사용",
        "배달 서비스 도입",
      ],
      keyFactors: ["공단 특화", "직장인 타겟", "고품질 커피", "배달 서비스"],
      image:
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop",
      category: "음식점",
      tags: ["커피카트", "공단", "직장인타겟", "배달서비스"],
      story:
        "공단의 특성을 활용하여 시작한 커피카트입니다. 초기에는 공단 특성상 운영 시간이 제한적이었지만, 공단 근무시간에 맞춰 운영하고 직장인들에게 특화된 메뉴를 개발했습니다. 고품질 원두를 사용하여 커피의 맛을 보장하고, 배달 서비스를 도입하여 편의성을 높였습니다. 현재는 월 매출 400만원을 달성하고 있습니다.",
      similarMarkets: [
        "대전 유성구 공단",
        "대전 동구 공단",
        "청주 공단",
        "천안 공단",
      ],
    },
    {
      id: 6,
      title: "대전 중구 상가밀집지역 '헬스장' 성공 스토리",
      businessType: "헬스/피트니스",
      location: "대전 중구",
      marketType: "상가밀집지역",
      ownerName: "한동욱",
      startDate: "2023-05-12",
      investment: "6,000만원",
      monthlyRevenue: "800만원",
      growthRate: "100%",
      description:
        "상가밀집지역에서 시작한 헬스장이 지역 대표 피트니스 센터로 성장한 사례입니다.",
      marketAnalysis: {
        footTraffic: "일평균 2,500명",
        competitionLevel: "높음 (주변 헬스장 5개)",
        targetDemographics: "20-40대 80%, 기타 20%",
        seasonalFactors: "연중 안정적",
        marketTrend: "상승세",
        riskLevel: "보통",
      },
      challenges: ["상가밀집지역 임대료 부담", "경쟁 헬스장 다수", "고객 확보"],
      solutions: [
        "상가 특화 프로그램 개발",
        "24시간 운영",
        "개인 트레이닝 서비스",
        "온라인 마케팅 집중",
      ],
      keyFactors: [
        "상가 특화",
        "24시간 운영",
        "개인 트레이닝",
        "온라인 마케팅",
      ],
      image:
        "https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop",
      category: "헬스케어",
      tags: ["헬스장", "상가밀집지역", "24시간운영", "개인트레이닝"],
      story:
        "상가밀집지역의 접근성을 활용하여 시작한 헬스장입니다. 초기에는 상가밀집지역 특성상 임대료 부담이 컸지만, 상가에 특화된 프로그램을 개발하고 24시간 운영을 통해 차별화했습니다. 개인 트레이닝 서비스를 강화하고 온라인 마케팅에 집중하여 고객을 확보했습니다. 현재는 월 매출 800만원을 달성하고 있습니다.",
      similarMarkets: [
        "대전 서구 상가밀집지역",
        "대전 동구 상가밀집지역",
        "청주 상가밀집지역",
        "천안 상가밀집지역",
      ],
    },
  ];

  const filteredCases = similarMarketCases.filter((similarMarketCase) => {
    const matchesSearch =
      similarMarketCase.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      similarMarketCase.businessType
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      similarMarketCase.location
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      similarMarketCase.marketType
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
    const matchesLocation =
      !userLocation || similarMarketCase.location.includes(userLocation);
    const matchesBusinessType =
      !userBusinessType ||
      similarMarketCase.businessType.includes(userBusinessType);

    return matchesSearch && matchesLocation && matchesBusinessType;
  });

  const handleCaseClick = (similarMarketCase: SimilarMarketCase) => {
    setSelectedCase(similarMarketCase);
    setShowDetailModal(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className={styles.container}>
      {/* 헤더 섹션 */}
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>유사 상권 성공 사례</h1>
          <p className={styles.subtitle}>
            비슷한 상권에서 성공한 사례를 통해 창업의 인사이트를 얻어보세요
          </p>
        </div>
      </section>

      {/* 검색 및 필터 섹션 */}
      <section className={styles.searchSection}>
        <div className={styles.searchContent}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="사업 유형, 지역, 상권 유형으로 검색"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>검색</button>
          </div>

          <div className={styles.filterControls}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>내 지역</label>
              <select
                value={userLocation}
                onChange={(e) => setUserLocation(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">전체 지역</option>
                <option value="대전 중구">대전 중구</option>
                <option value="대전 유성구">대전 유성구</option>
                <option value="대전 동구">대전 동구</option>
                <option value="대전 서구">대전 서구</option>
                <option value="대전 대덕구">대전 대덕구</option>
              </select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>내 사업 유형</label>
              <select
                value={userBusinessType}
                onChange={(e) => setUserBusinessType(e.target.value)}
                className={styles.filterSelect}
              >
                <option value="">전체 사업 유형</option>
                <option value="카페">카페</option>
                <option value="음식점">음식점</option>
                <option value="편의점">편의점</option>
                <option value="헬스">헬스</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* 성공 사례 목록 섹션 */}
      <section className={styles.casesSection}>
        <div className={styles.casesContent}>
          <div className={styles.casesStats}>
            <span>총 {filteredCases.length}개의 유사 상권 성공 사례</span>
          </div>

          <div className={styles.casesGrid}>
            {filteredCases.map((similarMarketCase) => (
              <div
                key={similarMarketCase.id}
                className={styles.caseCard}
                onClick={() => handleCaseClick(similarMarketCase)}
              >
                <div className={styles.cardImage}>
                  <img
                    src={similarMarketCase.image}
                    alt={similarMarketCase.title}
                  />
                  <div className={styles.cardOverlay}>
                    <span className={styles.readMore}>자세히 보기</span>
                  </div>
                </div>

                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <h3 className={styles.caseTitle}>
                      {similarMarketCase.title}
                    </h3>
                    <div className={styles.businessInfo}>
                      <span className={styles.businessType}>
                        {similarMarketCase.businessType}
                      </span>
                      <span className={styles.location}>
                        {similarMarketCase.location} -{" "}
                        {similarMarketCase.marketType}
                      </span>
                    </div>
                  </div>

                  <p className={styles.description}>
                    {similarMarketCase.description}
                  </p>

                  <div className={styles.keyMetrics}>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>투자금액</span>
                      <span className={styles.metricValue}>
                        {similarMarketCase.investment}
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>월 매출</span>
                      <span className={styles.metricValue}>
                        {similarMarketCase.monthlyRevenue}
                      </span>
                    </div>
                    <div className={styles.metric}>
                      <span className={styles.metricLabel}>성장률</span>
                      <span
                        className={`${styles.metricValue} ${styles.growth}`}
                      >
                        {similarMarketCase.growthRate}
                      </span>
                    </div>
                  </div>

                  <div className={styles.tags}>
                    {similarMarketCase.tags.map((tag, index) => (
                      <span key={index} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredCases.length === 0 && (
            <div className={styles.noResults}>
              <p>검색 결과가 없습니다.</p>
              <p>다른 검색어나 카테고리를 시도해보세요.</p>
            </div>
          )}
        </div>
      </section>

      {/* 상세 모달 */}
      {showDetailModal && selectedCase && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowDetailModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>유사 상권 성공 사례 상세</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowDetailModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalImage}>
                <img src={selectedCase.image} alt={selectedCase.title} />
              </div>

              <div className={styles.modalContent}>
                <h3 className={styles.modalTitle}>{selectedCase.title}</h3>

                <div className={styles.modalInfo}>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>사업주</span>
                    <span className={styles.infoValue}>
                      {selectedCase.ownerName}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>창업일</span>
                    <span className={styles.infoValue}>
                      {formatDate(selectedCase.startDate)}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>사업 유형</span>
                    <span className={styles.infoValue}>
                      {selectedCase.businessType}
                    </span>
                  </div>
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>상권 유형</span>
                    <span className={styles.infoValue}>
                      {selectedCase.marketType}
                    </span>
                  </div>
                </div>

                <div className={styles.modalMetrics}>
                  <div className={styles.metricCard}>
                    <span className={styles.metricNumber}>
                      {selectedCase.investment}
                    </span>
                    <span className={styles.metricLabel}>초기 투자금액</span>
                  </div>
                  <div className={styles.metricCard}>
                    <span className={styles.metricNumber}>
                      {selectedCase.monthlyRevenue}
                    </span>
                    <span className={styles.metricLabel}>월 매출</span>
                  </div>
                  <div className={styles.metricCard}>
                    <span className={`${styles.metricNumber} ${styles.growth}`}>
                      {selectedCase.growthRate}
                    </span>
                    <span className={styles.metricLabel}>성장률</span>
                  </div>
                </div>

                {/* 상권 분석 섹션 추가 */}
                <div className={styles.marketAnalysisSection}>
                  <h4 className={styles.marketAnalysisTitle}>상권 분석</h4>
                  <div className={styles.marketAnalysisGrid}>
                    <div className={styles.marketAnalysisCard}>
                      <div className={styles.marketAnalysisLabel}>유동인구</div>
                      <div className={styles.marketAnalysisValue}>
                        {selectedCase.marketAnalysis.footTraffic}
                      </div>
                    </div>
                    <div className={styles.marketAnalysisCard}>
                      <div className={styles.marketAnalysisLabel}>경쟁도</div>
                      <div className={styles.marketAnalysisValue}>
                        {selectedCase.marketAnalysis.competitionLevel}
                      </div>
                    </div>
                    <div className={styles.marketAnalysisCard}>
                      <div className={styles.marketAnalysisLabel}>
                        타겟 고객층
                      </div>
                      <div className={styles.marketAnalysisValue}>
                        {selectedCase.marketAnalysis.targetDemographics}
                      </div>
                    </div>
                    <div className={styles.marketAnalysisCard}>
                      <div className={styles.marketAnalysisLabel}>
                        계절성 요인
                      </div>
                      <div className={styles.marketAnalysisValue}>
                        {selectedCase.marketAnalysis.seasonalFactors}
                      </div>
                    </div>
                    <div className={styles.marketAnalysisCard}>
                      <div className={styles.marketAnalysisLabel}>
                        시장 동향
                      </div>
                      <div className={styles.marketAnalysisValue}>
                        {selectedCase.marketAnalysis.marketTrend}
                      </div>
                    </div>
                    <div className={styles.marketAnalysisCard}>
                      <div className={styles.marketAnalysisLabel}>위험도</div>
                      <div className={styles.marketAnalysisValue}>
                        {selectedCase.marketAnalysis.riskLevel}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.modalStory}>
                  <h4>성공 스토리</h4>
                  <p>{selectedCase.story}</p>
                </div>

                <div className={styles.modalDetails}>
                  <div className={styles.detailSection}>
                    <h4>주요 도전 과제</h4>
                    <ul>
                      {selectedCase.challenges.map((challenge, index) => (
                        <li key={index}>{challenge}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.detailSection}>
                    <h4>해결 방안</h4>
                    <ul>
                      {selectedCase.solutions.map((solution, index) => (
                        <li key={index}>{solution}</li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.detailSection}>
                    <h4>성공 요인</h4>
                    <ul>
                      {selectedCase.keyFactors.map((factor, index) => (
                        <li key={index}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* 유사 상권 추천 섹션 추가 */}
                <div className={styles.similarMarketsSection}>
                  <h4 className={styles.similarMarketsTitle}>유사 상권 추천</h4>
                  <div className={styles.similarMarketsList}>
                    {selectedCase.similarMarkets.map((market, index) => (
                      <span key={index} className={styles.similarMarketTag}>
                        {market}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CasesPage;
