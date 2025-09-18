import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Business, Person, Assignment, Assessment } from "@mui/icons-material";
import styles from "./SupportPanel.module.css";

interface MarketData {
  market_code: string;
  market_name: string;
  city_name: string;
  district_name: string;
  dong_name: string;
  latitude: number;
  longitude: number;
}

interface RiskAnalysis {
  risk_level: string;
  risk_type: string;
  confidence: number;
  analysis_data: any;
  key_indicators: string[];
}

interface SupportPanelProps {
  selectedMarket: MarketData | null;
  riskAnalysis: RiskAnalysis | null;
  selectedIndustry: string;
}

interface SupportCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  distance: string;
  services: string[];
}

interface SuccessCase {
  id: string;
  title: string;
  business_type: string;
  location: string;
  success_factors: string[];
  revenue_increase: string;
  period: string;
  description: string;
}

const SupportPanel: React.FC<SupportPanelProps> = ({
  selectedMarket,
  riskAnalysis,
  selectedIndustry,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"centers" | "cases">("centers");
  const [supportCenters, setSupportCenters] = useState<SupportCenter[]>([]);
  const [successCases, setSuccessCases] = useState<SuccessCase[]>([]);
  const [loading, setLoading] = useState(false);

  // 더미 데이터 로드
  useEffect(() => {
    setLoading(true);

    // 지원센터 데이터
    setSupportCenters([
      {
        id: "SC001",
        name: "대전 소상공인지원센터",
        address: "대전광역시 중구 중앙로 101",
        phone: "042-123-4567",
        distance: "1.2km",
        services: ["창업 컨설팅", "자금 지원", "교육 프로그램"],
      },
      {
        id: "SC002",
        name: "대전 상공회의소",
        address: "대전광역시 서구 둔산로 100",
        phone: "042-234-5678",
        distance: "2.5km",
        services: ["네트워킹", "수출 지원", "기술 개발"],
      },
    ]);

    // 성공 사례 데이터
    setSuccessCases([
      {
        id: "CASE001",
        title: "카페 창업 성공 사례",
        business_type: "카페",
        location: "대전 유성구",
        success_factors: ["위치 선정", "메뉴 차별화", "고객 서비스"],
        revenue_increase: "150%",
        period: "6개월",
        description:
          "대학가 근처에 위치한 카페로 젊은 고객층을 타겟으로 한 성공 사례",
      },
      {
        id: "CASE002",
        title: "온라인 쇼핑몰 성공 사례",
        business_type: "온라인 쇼핑몰",
        location: "대전 서구",
        success_factors: ["디지털 마케팅", "고품질 상품", "빠른 배송"],
        revenue_increase: "200%",
        period: "1년",
        description: "SNS 마케팅을 활용한 온라인 쇼핑몰 성공 사례",
      },
    ]);

    setLoading(false);
  }, []);

  return (
    <div className={styles.supportPanel}>
      <div className={styles.header}>
        <h3 className={styles.title}>실행 지원 도구</h3>
        <p className={styles.subtitle}>
          상권 진단 결과를 바탕으로 실행 가능한 지원 도구를 제공합니다
        </p>
      </div>

      {/* 탭 메뉴 */}
      <div className={styles.tabMenu}>
        <button
          className={`${styles.tab} ${
            activeTab === "centers" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("centers")}
        >
          <span className={styles.tabIcon}>
            <Business style={{ fontSize: "18px" }} />
          </span>
          지원센터
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "experts" ? styles.active : ""
          }`}
          onClick={() => navigate("/policy/consult")}
        >
          <span className={styles.tabIcon}>
            <Person style={{ fontSize: "18px" }} />
          </span>
          전문가 상담
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "policies" ? styles.active : ""
          }`}
          onClick={() => navigate("/policy/list")}
        >
          <span className={styles.tabIcon}>
            <Assignment style={{ fontSize: "18px" }} />
          </span>
          지원 정책
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "cases" ? styles.active : ""
          }`}
          onClick={() => setActiveTab("cases")}
        >
          <span className={styles.tabIcon}>
            <Assessment style={{ fontSize: "18px" }} />
          </span>
          성공 사례
        </button>
      </div>

      {/* 탭 콘텐츠 */}
      <div className={styles.tabContent}>
        {loading ? (
          <div className={styles.loading}>
            <div className={styles.spinner}></div>
            <p>데이터를 불러오는 중...</p>
          </div>
        ) : (
          <>
            {activeTab === "centers" && (
              <div className={styles.centersContent}>
                <h4 className={styles.sectionTitle}>소상공인지원센터</h4>
                <div className={styles.centersList}>
                  {supportCenters.map((center) => (
                    <div key={center.id} className={styles.centerCard}>
                      <div className={styles.centerHeader}>
                        <h5 className={styles.centerName}>{center.name}</h5>
                        <span className={styles.distance}>
                          {center.distance}
                        </span>
                      </div>
                      <div className={styles.centerInfo}>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>주소</span>
                          <span className={styles.infoValue}>
                            {center.address}
                          </span>
                        </div>
                        <div className={styles.infoItem}>
                          <span className={styles.infoLabel}>전화</span>
                          <span className={styles.infoValue}>
                            {center.phone}
                          </span>
                        </div>
                      </div>
                      <div className={styles.services}>
                        <span className={styles.servicesLabel}>
                          제공 서비스
                        </span>
                        <div className={styles.servicesList}>
                          {center.services.map((service, index) => (
                            <span key={index} className={styles.serviceTag}>
                              {service}
                            </span>
                          ))}
                        </div>
                      </div>
                      <button className={styles.contactButton}>연락하기</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "cases" && (
              <div className={styles.casesContent}>
                <h4 className={styles.sectionTitle}>성공 사례</h4>
                <div className={styles.casesList}>
                  {successCases.map((caseItem) => (
                    <div key={caseItem.id} className={styles.caseCard}>
                      <div className={styles.caseHeader}>
                        <h5 className={styles.caseTitle}>{caseItem.title}</h5>
                        <div className={styles.caseMeta}>
                          <span className={styles.businessType}>
                            {caseItem.business_type}
                          </span>
                          <span className={styles.location}>
                            {caseItem.location}
                          </span>
                        </div>
                      </div>
                      <p className={styles.caseDescription}>
                        {caseItem.description}
                      </p>
                      <div className={styles.caseStats}>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>매출 증가율</span>
                          <span className={styles.statValue}>
                            {caseItem.revenue_increase}
                          </span>
                        </div>
                        <div className={styles.statItem}>
                          <span className={styles.statLabel}>성공 기간</span>
                          <span className={styles.statValue}>
                            {caseItem.period}
                          </span>
                        </div>
                      </div>
                      <div className={styles.successFactors}>
                        <span className={styles.factorsLabel}>성공 요인</span>
                        <div className={styles.factorsList}>
                          {caseItem.success_factors.map((factor, index) => (
                            <span key={index} className={styles.factorTag}>
                              {factor}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default SupportPanel;
