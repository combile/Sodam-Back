import React, { useState } from "react";
import { Close, ArrowForward } from "@mui/icons-material";
import styles from "./PolicyList.module.css";

interface Policy {
  id: number;
  title: string;
  organization: string;
  category: string;
  supportAmount: string;
  deadline: string;
  status: "진행중" | "마감임박" | "마감";
  description: string;
  eligibility: string[];
  requiredDocuments: string[];
  contactInfo: string;
  applyUrl: string;
}

const PolicyList: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedPolicy, setSelectedPolicy] = useState<Policy | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const itemsPerPage = 5;

  // 모달 열기 함수
  const openModal = (policy: Policy) => {
    setSelectedPolicy(policy);
    setIsModalOpen(true);
    // 모달이 열릴 때 스크롤 방지
    document.body.style.overflow = "hidden";
  };

  // 모달 닫기 함수
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPolicy(null);
    // 모달이 닫힐 때 스크롤 복원
    document.body.style.overflow = "auto";
  };

  // ESC 키로 모달 닫기
  React.useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isModalOpen) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isModalOpen]);

  // 하드코딩된 창업지원정책 데이터
  const policies: Policy[] = [
    {
      id: 1,
      title: "2025년 소상공인 창업지원사업",
      organization: "소상공인시장진흥공단",
      category: "창업지원",
      supportAmount: "최대 1,000만원",
      deadline: "2025-12-31",
      status: "진행중",
      description:
        "소상공인의 창업을 지원하는 사업으로, 창업 준비부터 사업 운영까지 전 과정을 지원합니다.",
      eligibility: [
        "창업 예정자",
        "창업 1년 이내 소상공인",
        "사업자등록 예정자",
      ],
      requiredDocuments: [
        "사업계획서",
        "재무제표",
        "신분증 사본",
        "사업자등록증",
      ],
      contactInfo: "1588-1234",
      applyUrl: "https://www.semas.or.kr",
    },
    {
      id: 2,
      title: "대전시 청년창업 지원사업",
      organization: "대전광역시",
      category: "청년창업",
      supportAmount: "최대 2,000만원",
      deadline: "2025-11-30",
      status: "마감임박",
      description:
        "대전시 거주 청년들의 창업을 지원하는 사업으로, 기술창업과 일반창업을 모두 지원합니다.",
      eligibility: [
        "대전시 거주 청년 (만 18-39세)",
        "창업 예정자",
        "사업계획서 제출자",
      ],
      requiredDocuments: [
        "사업계획서",
        "주민등록등본",
        "재학증명서",
        "창업교육 이수증",
      ],
      contactInfo: "042-123-4567",
      applyUrl: "https://www.daejeon.go.kr",
    },
    {
      id: 3,
      title: "중소기업 창업도약패키지",
      organization: "중소벤처기업부",
      category: "중소기업",
      supportAmount: "최대 5,000만원",
      deadline: "2025-10-15",
      status: "마감",
      description:
        "혁신적인 아이디어를 가진 중소기업의 창업과 성장을 지원하는 패키지 사업입니다.",
      eligibility: ["중소기업", "벤처기업", "기술보유기업", "혁신창업기업"],
      requiredDocuments: [
        "사업계획서",
        "기술보유증명서",
        "재무제표",
        "특허등록증",
      ],
      contactInfo: "02-1234-5678",
      applyUrl: "https://www.mss.go.kr",
    },
    {
      id: 4,
      title: "여성창업가 육성사업",
      organization: "여성가족부",
      category: "여성창업",
      supportAmount: "최대 3,000만원",
      deadline: "2025-12-15",
      status: "진행중",
      description:
        "여성들의 경제적 자립과 창업을 지원하는 사업으로, 멘토링과 자금지원을 제공합니다.",
      eligibility: ["여성 창업 예정자", "여성 소상공인", "여성 기업가"],
      requiredDocuments: [
        "사업계획서",
        "신분증 사본",
        "창업교육 이수증",
        "재정신청서",
      ],
      contactInfo: "02-2100-6000",
      applyUrl: "https://www.mogef.go.kr",
    },
    {
      id: 5,
      title: "ICT 창업 지원사업",
      organization: "정보통신산업진흥원",
      category: "ICT창업",
      supportAmount: "최대 4,000만원",
      deadline: "2025-11-20",
      status: "마감임박",
      description:
        "ICT 분야의 혁신적인 창업 아이디어를 실현할 수 있도록 지원하는 사업입니다.",
      eligibility: [
        "ICT 창업 예정자",
        "소프트웨어 개발자",
        "디지털 콘텐츠 제작자",
      ],
      requiredDocuments: [
        "사업계획서",
        "기술개발계획서",
        "팀 구성원 명단",
        "프로토타입",
      ],
      contactInfo: "02-2188-6000",
      applyUrl: "https://www.nipa.kr",
    },
    {
      id: 6,
      title: "사회적기업 창업 지원",
      organization: "사회적경제진흥원",
      category: "사회적기업",
      supportAmount: "최대 2,500만원",
      deadline: "2025-12-31",
      status: "진행중",
      description:
        "사회적 가치를 추구하는 기업의 창업과 운영을 지원하는 사업입니다.",
      eligibility: [
        "사회적기업 인증 예정자",
        "협동조합",
        "사회적 가치 추구 기업",
      ],
      requiredDocuments: [
        "사회적기업 인증신청서",
        "사업계획서",
        "사회적 가치 증빙서류",
      ],
      contactInfo: "02-6952-0001",
      applyUrl: "https://www.socialenterprise.or.kr",
    },
  ];

  const categories = [
    "전체",
    "창업지원",
    "청년창업",
    "중소기업",
    "여성창업",
    "ICT창업",
    "사회적기업",
  ];

  const filteredPolicies = policies.filter((policy) => {
    const matchesCategory =
      selectedCategory === "전체" || policy.category === selectedCategory;
    const matchesSearch =
      policy.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      policy.organization.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // 페이지네이션 계산
  const totalPages = Math.ceil(filteredPolicies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPolicies = filteredPolicies.slice(startIndex, endIndex);

  // 페이지 변경 시 검색어나 카테고리 변경 시 첫 페이지로 이동
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className={styles.container}>
      {/* 헤더 섹션 */}
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>창업지원정책 모아보기</h1>
          <p className={styles.subtitle}>
            다양한 창업지원정책을 한눈에 확인하고 신청하세요
          </p>
        </div>
      </section>

      {/* 검색 및 필터 섹션 */}
      <section className={styles.searchSection}>
        <div className={styles.searchContent}>
          <div className={styles.searchBox}>
            <input
              type="text"
              placeholder="정책명 또는 기관명으로 검색"
              value={searchTerm}
              onChange={handleSearchChange}
              className={styles.searchInput}
            />
            <button className={styles.searchButton}>검색</button>
          </div>

          <div className={styles.categoryFilter}>
            {categories.map((category) => (
              <button
                key={category}
                className={`${styles.categoryButton} ${
                  selectedCategory === category ? styles.categoryActive : ""
                }`}
                onClick={() => handleCategoryChange(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 정책 목록 섹션 */}
      <section className={styles.policySection}>
        <div className={styles.policyContent}>
          <div className={styles.policyStats}>
            <span>총 {filteredPolicies.length}개의 정책</span>
            <span className={styles.pageInfo}>
              {startIndex + 1}-{Math.min(endIndex, filteredPolicies.length)} /{" "}
              {filteredPolicies.length}
            </span>
          </div>

          <div className={styles.policyGrid}>
            {currentPolicies.map((policy) => (
              <div key={policy.id} className={styles.policyCard}>
                <div className={styles.cardHeader}>
                  <div>
                    <h3 className={styles.policyTitle}>{policy.title}</h3>
                    <p className={styles.organization}>{policy.organization}</p>
                  </div>
                  <div className={styles.supportAmount}>
                    <span className={styles.amountValue}>
                      {policy.supportAmount}
                    </span>
                    <span className={styles.amountLabel}>지원금액</span>
                  </div>
                </div>

                <div className={styles.cardBody}>
                  <div>
                    <p className={styles.description}>{policy.description}</p>
                    <div className={styles.eligibility}>
                      <h4>지원대상</h4>
                      <ul>
                        {policy.eligibility.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className={styles.deadline}>
                    <span className={styles.deadlineLabel}>신청마감</span>
                    <span className={styles.deadlineValue}>
                      {policy.deadline}
                    </span>
                  </div>
                </div>

                <div className={styles.cardFooter}>
                  <button
                    className={styles.detailButton}
                    onClick={() => openModal(policy)}
                  >
                    상세보기
                  </button>
                  <button className={styles.applyButton}>신청하기</button>
                </div>
              </div>
            ))}
          </div>

          {filteredPolicies.length === 0 && (
            <div className={styles.noResults}>
              <p>검색 결과가 없습니다.</p>
              <p>다른 검색어나 카테고리를 시도해보세요.</p>
            </div>
          )}

          {/* 페이지네이션 */}
          {totalPages > 1 && (
            <div className={styles.pagination}>
              <button
                className={`${styles.pageButton} ${
                  currentPage === 1 ? styles.pageButtonDisabled : ""
                }`}
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                이전
              </button>

              <div className={styles.pageNumbers}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <button
                      key={page}
                      className={`${styles.pageNumber} ${
                        currentPage === page ? styles.pageNumberActive : ""
                      }`}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </button>
                  )
                )}
              </div>

              <button
                className={`${styles.pageButton} ${
                  currentPage === totalPages ? styles.pageButtonDisabled : ""
                }`}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                다음
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 상세보기 모달 */}
      {isModalOpen && selectedPolicy && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={closeModal} className={styles.modalCloseButton}>
              <Close fontSize="small" />
            </button>

            <h2>{selectedPolicy.title}</h2>

            {/* 정책 기본 정보 */}
            <div className={styles.modalInfo}>
              <div className={styles.modalInfoItem}>
                <span className={styles.modalInfoLabel}>기관</span>
                <span className={styles.modalInfoValue}>
                  {selectedPolicy.organization}
                </span>
              </div>
              <div className={styles.modalInfoItem}>
                <span className={styles.modalInfoLabel}>카테고리</span>
                <span className={styles.modalInfoValue}>
                  {selectedPolicy.category}
                </span>
              </div>
              <div className={styles.modalInfoItem}>
                <span className={styles.modalInfoLabel}>지원금액</span>
                <span className={styles.modalInfoValue}>
                  {selectedPolicy.supportAmount}
                </span>
              </div>
              <div className={styles.modalInfoItem}>
                <span className={styles.modalInfoLabel}>신청마감</span>
                <span className={styles.modalInfoValue}>
                  {selectedPolicy.deadline}
                </span>
              </div>
              <div className={styles.modalInfoItem}>
                <span className={styles.modalInfoLabel}>상태</span>
                <span
                  className={`${styles.modalStatus} ${
                    styles[selectedPolicy.status]
                  }`}
                >
                  {selectedPolicy.status}
                </span>
              </div>
            </div>

            {/* 상세 설명 */}
            <h3>상세 설명</h3>
            <p>{selectedPolicy.description}</p>

            {/* 지원대상 */}
            <h3>지원대상</h3>
            <ul>
              {selectedPolicy.eligibility.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>

            {/* 필요서류 */}
            <h3>필요서류</h3>
            <ul>
              {selectedPolicy.requiredDocuments.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>

            {/* 연락처 및 신청 */}
            <h3>연락처 및 신청</h3>
            <div className={styles.modalInfo}>
              <div className={styles.modalInfoItem}>
                <span className={styles.modalInfoLabel}>전화번호</span>
                <span className={styles.modalInfoValue}>
                  <a href={`tel:${selectedPolicy.contactInfo}`}>
                    {selectedPolicy.contactInfo}
                  </a>
                </span>
              </div>
              <div className={styles.modalInfoItem}>
                <span className={styles.modalInfoLabel}>신청 링크</span>
                <span className={styles.modalInfoValue}>
                  <a
                    href={selectedPolicy.applyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    신청 페이지로 이동 <ArrowForward />
                  </a>
                </span>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div style={{ marginTop: "32px", textAlign: "center" }}>
              <a
                href={selectedPolicy.applyUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#a9c2cb",
                  color: "white",
                  padding: "16px 32px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "16px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#00205b")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "#a9c2cb")
                }
              >
                정책 신청하기
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PolicyList;
