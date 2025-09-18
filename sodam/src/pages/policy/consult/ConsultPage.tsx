import React, { useState } from "react";
import { ArrowBack } from "@mui/icons-material";
import styles from "./ConsultPage.module.css";

interface SupportCenter {
  id: number;
  name: string;
  location: string;
  address: string;
  phone: string;
  email: string;
  services: string[];
  experts: Expert[];
  image: string;
  operatingHours: string;
  description: string;
}

interface Expert {
  id: number;
  name: string;
  specialty: string;
  experience: string;
  availableSlots: string[];
  description: string;
  image: string;
  consultationFee: string;
  consultationType: string[];
}

interface UserCondition {
  businessType: string[];
  industry: string[];
  location: string[];
  consultationType: string[];
  urgency: string[];
}

const ConsultPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [userCondition, setUserCondition] = useState<UserCondition>({
    businessType: [],
    industry: [],
    location: [],
    consultationType: [],
    urgency: [],
  });
  const [matchedCenters, setMatchedCenters] = useState<SupportCenter[]>([]);
  const [selectedCenter, setSelectedCenter] = useState<SupportCenter | null>(
    null
  );
  const [selectedExpert, setSelectedExpert] = useState<Expert | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<string>("");

  // 소상공인지원센터 더미데이터
  const supportCenters: SupportCenter[] = [
    {
      id: 1,
      name: "대전소상공인지원센터",
      location: "대전 중구",
      address: "대전광역시 중구 중앙로 123",
      phone: "042-123-4567",
      email: "daejeon@smba.or.kr",
      services: ["창업상담", "자금지원", "교육프로그램", "마케팅지원"],
      experts: [
        {
          id: 1,
          name: "김창업",
          specialty: "창업 전략 및 비즈니스 모델",
          experience: "15년",
          availableSlots: ["09:00", "10:00", "14:00", "15:00", "16:00"],
          description:
            "소상공인 창업 전략 전문가로, 다양한 업종의 창업 성공 사례를 보유하고 있습니다.",
          image:
            "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
          consultationFee: "무료",
          consultationType: ["1:1 상담", "그룹 상담", "온라인 상담"],
        },
        {
          id: 2,
          name: "이자금",
          specialty: "자금 조달 및 지원 정책",
          experience: "12년",
          availableSlots: ["11:00", "13:00", "14:00", "16:00", "17:00"],
          description:
            "소상공인 자금 지원 정책 전문가로, 다양한 지원 프로그램을 안내해드립니다.",
          image:
            "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
          consultationFee: "무료",
          consultationType: ["1:1 상담", "정책 안내"],
        },
      ],
      image:
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=300&fit=crop",
      operatingHours: "평일 09:00-18:00",
      description: "대전 지역 소상공인을 위한 종합 지원 센터입니다.",
    },
    {
      id: 2,
      name: "대전유성구소상공인지원센터",
      location: "대전 유성구",
      address: "대전광역시 유성구 대학로 456",
      phone: "042-234-5678",
      email: "yuseong@smba.or.kr",
      services: ["창업상담", "기술지원", "네트워킹", "홍보지원"],
      experts: [
        {
          id: 3,
          name: "박기술",
          specialty: "기술 개발 및 IT 전략",
          experience: "14년",
          availableSlots: ["09:00", "10:00", "13:00", "14:00", "17:00"],
          description:
            "소상공인 기술 개발 지원 전문가로, 디지털 전환을 도와드립니다.",
          image:
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
          consultationFee: "무료",
          consultationType: ["1:1 상담", "기술 컨설팅"],
        },
      ],
      image:
        "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop",
      operatingHours: "평일 09:00-18:00",
      description: "유성구 지역 소상공인을 위한 특화 지원 센터입니다.",
    },
    {
      id: 3,
      name: "대전동구소상공인지원센터",
      location: "대전 동구",
      address: "대전광역시 동구 동대전로 789",
      phone: "042-345-6789",
      email: "donggu@smba.or.kr",
      services: ["창업상담", "마케팅지원", "교육프로그램", "네트워킹"],
      experts: [
        {
          id: 4,
          name: "최마케팅",
          specialty: "디지털 마케팅 및 브랜딩",
          experience: "12년",
          availableSlots: ["10:00", "11:00", "14:00", "15:00", "16:00"],
          description:
            "소상공인 마케팅 전략 전문가로, 온라인 마케팅과 브랜딩을 지원합니다.",
          image:
            "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
          consultationFee: "무료",
          consultationType: ["1:1 상담", "마케팅 컨설팅"],
        },
      ],
      image:
        "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop",
      operatingHours: "평일 09:00-18:00",
      description: "동구 지역 소상공인을 위한 맞춤형 지원 센터입니다.",
    },
  ];

  // 소상공인에 맞는 실제 상담 분야들
  const businessTypes = [
    "신규 창업",
    "기존 사업 확장",
    "사업 전환",
    "경영 개선",
    "디지털 전환",
    "수출/해외진출",
  ];

  const industries = [
    "음식점업",
    "소매업",
    "서비스업",
    "제조업",
    "도소매업",
    "숙박업",
    "운송업",
    "IT/온라인",
    "미용/헬스케어",
    "교육/문화",
    "건설/인테리어",
    "기타",
  ];

  const locations = [
    "대전 중구",
    "대전 유성구",
    "대전 동구",
    "대전 서구",
    "대전 대덕구",
  ];

  const consultationTypes = [
    "창업 상담",
    "자금 지원 상담",
    "마케팅 상담",
    "기술 개발 상담",
    "경영 진단",
    "정책 안내",
    "교육 프로그램",
    "네트워킹",
  ];

  const urgencyLevels = [
    "긴급 (1주일 내)",
    "보통 (1개월 내)",
    "여유 (시기 상관없음)",
  ];

  const handleCheckboxChange = (field: keyof UserCondition, value: string) => {
    setUserCondition((prev) => {
      const currentValues = prev[field];
      const newValues = currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...prev,
        [field]: newValues,
      };
    });
  };

  const findMatchingCenters = () => {
    const matched = supportCenters.filter((center) => {
      // 지역 매칭
      const locationMatch =
        userCondition.location.length === 0 ||
        userCondition.location.includes(center.location);

      // 서비스 매칭 (간단한 로직)
      const serviceMatch =
        userCondition.businessType.length === 0 ||
        center.services.some((service) =>
          userCondition.businessType.some(
            (type) => service.includes(type) || type.includes(service)
          )
        );

      return locationMatch && serviceMatch;
    });

    // 매칭 점수 계산 및 정렬
    const scoredCenters = matched.map((center) => {
      let score = 0;

      // 지역 매칭
      if (
        userCondition.location.length > 0 &&
        userCondition.location.includes(center.location)
      ) {
        score += 3;
      }

      // 서비스 매칭
      if (userCondition.businessType.length > 0) {
        const matchingServices = center.services.filter((service) =>
          userCondition.businessType.some(
            (type) => service.includes(type) || type.includes(service)
          )
        );
        score += matchingServices.length * 2;
      }

      // 전문가 수 반영
      score += center.experts.length;

      return { ...center, matchScore: score };
    });

    // 점수순으로 정렬
    scoredCenters.sort((a, b) => (b as any).matchScore - (a as any).matchScore);

    setMatchedCenters(scoredCenters.map(({ matchScore, ...center }) => center));
    setStep(2);
  };

  const handleCenterSelect = (center: SupportCenter) => {
    setSelectedCenter(center);
    setStep(3);
  };

  const handleExpertSelect = (expert: Expert) => {
    setSelectedExpert(expert);
    setShowBookingModal(true);
  };

  const handleConfirmBooking = () => {
    if (selectedSlot && selectedExpert && selectedCenter) {
      alert(
        `${selectedCenter.name}의 ${selectedExpert.name} 전문가와 ${selectedSlot}에 상담이 예약되었습니다.\n\n예약 확인은 ${selectedCenter.phone}로 연락주세요.`
      );
      setShowBookingModal(false);
      setSelectedSlot("");
      setSelectedExpert(null);
      setSelectedCenter(null);
      setStep(1);
    } else {
      alert("상담 시간을 선택해주세요.");
    }
  };

  const renderStep1 = () => (
    <div className={styles.conditionForm}>
      <div className={styles.formHeader}>
        <h2>소상공인지원센터 상담 예약</h2>
        <p>조건에 맞는 최적의 지원센터를 찾아 전문가 상담을 받아보세요</p>
      </div>

      <div className={styles.formGrid}>
        <div className={styles.formGroup}>
          <label>상담 분야 (복수 선택 가능)</label>
          <div className={styles.checkboxGroup}>
            {businessTypes.map((type) => (
              <label key={type} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={userCondition.businessType.includes(type)}
                  onChange={() => handleCheckboxChange("businessType", type)}
                />
                <span className={styles.checkboxLabel}>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>업종 (복수 선택 가능)</label>
          <div className={styles.checkboxGroup}>
            {industries.map((industry) => (
              <label key={industry} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={userCondition.industry.includes(industry)}
                  onChange={() => handleCheckboxChange("industry", industry)}
                />
                <span className={styles.checkboxLabel}>{industry}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>희망 지역 (복수 선택 가능)</label>
          <div className={styles.checkboxGroup}>
            {locations.map((location) => (
              <label key={location} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={userCondition.location.includes(location)}
                  onChange={() => handleCheckboxChange("location", location)}
                />
                <span className={styles.checkboxLabel}>{location}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>상담 유형 (복수 선택 가능)</label>
          <div className={styles.checkboxGroup}>
            {consultationTypes.map((type) => (
              <label key={type} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={userCondition.consultationType.includes(type)}
                  onChange={() =>
                    handleCheckboxChange("consultationType", type)
                  }
                />
                <span className={styles.checkboxLabel}>{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label>상담 시급성 (복수 선택 가능)</label>
          <div className={styles.checkboxGroup}>
            {urgencyLevels.map((level) => (
              <label key={level} className={styles.checkboxItem}>
                <input
                  type="checkbox"
                  checked={userCondition.urgency.includes(level)}
                  onChange={() => handleCheckboxChange("urgency", level)}
                />
                <span className={styles.checkboxLabel}>{level}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.formActions}>
        <button className={styles.findButton} onClick={findMatchingCenters}>
          맞춤 지원센터 찾기
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className={styles.matchingResults}>
      <div className={styles.resultsHeader}>
        <h2>조건에 맞는 지원센터</h2>
        <p>총 {matchedCenters.length}개의 지원센터가 매칭되었습니다</p>
        <button className={styles.backButton} onClick={() => setStep(1)}>
          <ArrowBack /> 조건 다시 설정하기
        </button>
      </div>

      <div className={styles.consultantList}>
        {matchedCenters.map((center, index) => (
          <div key={center.id} className={styles.consultantItem}>
            <div className={styles.rankBadge}>{index + 1}</div>

            <div className={styles.consultantInfo}>
              <img
                src={center.image}
                alt={center.name}
                className={styles.consultantImage}
              />
              <div className={styles.consultantDetails}>
                <h3>{center.name}</h3>
                <p className={styles.specialty}>{center.location}</p>
                <div className={styles.rating}>
                  <span>{center.phone}</span>
                </div>
                <div className={styles.tags}>
                  {center.services.slice(0, 3).map((service, idx) => (
                    <span key={idx} className={styles.tag}>
                      {service}
                    </span>
                  ))}
                </div>
                <p
                  style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}
                >
                  {center.description}
                </p>
              </div>
            </div>

            <div className={styles.consultantActions}>
              <div className={styles.price}>
                전문가 {center.experts.length}명
              </div>
              <button
                className={styles.bookButton}
                onClick={() => handleCenterSelect(center)}
              >
                센터 선택
              </button>
            </div>
          </div>
        ))}
      </div>

      {matchedCenters.length === 0 && (
        <div className={styles.noResults}>
          <p>조건에 맞는 지원센터가 없습니다.</p>
          <p>조건을 조정해보세요.</p>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className={styles.matchingResults}>
      <div className={styles.resultsHeader}>
        <h2>{selectedCenter?.name} 전문가 목록</h2>
        <p>상담을 원하는 전문가를 선택해주세요</p>
        <button className={styles.backButton} onClick={() => setStep(2)}>
          <ArrowBack /> 지원센터 목록으로
        </button>
      </div>

      <div className={styles.consultantList}>
        {selectedCenter?.experts.map((expert, index) => (
          <div key={expert.id} className={styles.consultantItem}>
            <div className={styles.rankBadge}>{index + 1}</div>

            <div className={styles.consultantInfo}>
              <img
                src={expert.image}
                alt={expert.name}
                className={styles.consultantImage}
              />
              <div className={styles.consultantDetails}>
                <h3>{expert.name}</h3>
                <p className={styles.specialty}>{expert.specialty}</p>
                <div className={styles.rating}>
                  <span>경력: {expert.experience}</span>
                </div>
                <div className={styles.tags}>
                  {expert.consultationType.map((type, idx) => (
                    <span key={idx} className={styles.tag}>
                      {type}
                    </span>
                  ))}
                </div>
                <p
                  style={{ fontSize: "14px", color: "#666", marginTop: "8px" }}
                >
                  {expert.description}
                </p>
              </div>
            </div>

            <div className={styles.consultantActions}>
              <div className={styles.price}>{expert.consultationFee}</div>
              <button
                className={styles.bookButton}
                onClick={() => handleExpertSelect(expert)}
              >
                상담 예약
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {/* 헤더 섹션 */}
      <section className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>소상공인지원센터 전문가 상담</h1>
          <p className={styles.subtitle}>
            소상공인지원센터의 전문가와 1:1 상담을 받아보세요
          </p>
        </div>
      </section>

      {/* 메인 콘텐츠 */}
      <section className={styles.mainContent}>
        <div className={styles.contentWrapper}>
          {step === 1
            ? renderStep1()
            : step === 2
            ? renderStep2()
            : renderStep3()}
        </div>
      </section>

      {/* 예약 모달 */}
      {showBookingModal && selectedExpert && selectedCenter && (
        <div
          className={styles.modalOverlay}
          onClick={() => setShowBookingModal(false)}
        >
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>상담 예약</h2>
              <button
                className={styles.closeButton}
                onClick={() => setShowBookingModal(false)}
              >
                ×
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.consultantSummary}>
                <img
                  src={selectedExpert.image}
                  alt={selectedExpert.name}
                  className={styles.modalImage}
                />
                <div>
                  <h3>{selectedExpert.name}</h3>
                  <p>{selectedExpert.specialty}</p>
                  <p className={styles.modalPrice}>
                    {selectedExpert.consultationFee}
                  </p>
                  <p style={{ fontSize: "14px", color: "#666" }}>
                    {selectedCenter.name}
                  </p>
                </div>
              </div>

              <div className={styles.timeSelection}>
                <h4>상담 시간 선택</h4>
                <div className={styles.timeSlots}>
                  {selectedExpert.availableSlots.map((slot) => (
                    <button
                      key={slot}
                      className={`${styles.timeSlot} ${
                        selectedSlot === slot ? styles.timeSlotSelected : ""
                      }`}
                      onClick={() => setSelectedSlot(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className={styles.modalFooter}>
              <button
                className={styles.cancelButton}
                onClick={() => setShowBookingModal(false)}
              >
                취소
              </button>
              <button
                className={styles.confirmButton}
                onClick={handleConfirmBooking}
              >
                예약 확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsultPage;
