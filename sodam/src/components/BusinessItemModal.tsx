import React, { useState, useEffect } from "react";
import styles from "./BusinessItemModal.module.css";
import {
  Business,
  LocationOn,
  Edit,
  Check,
  ExpandMore,
} from "@mui/icons-material";

interface BusinessItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: BusinessItemData) => void;
  userType: "STARTUP" | "PLANNING";
  initialData?: BusinessItemData;
}

export interface BusinessItemData {
  industry: string;
  location: {
    district: string;
    dong: string;
    address: string;
  };
}

const BusinessItemModal: React.FC<BusinessItemModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  userType,
  initialData,
}) => {
  const [formData, setFormData] = useState<BusinessItemData>(
    initialData || {
      industry: "",
      location: {
        district: "",
        dong: "",
        address: "",
      },
    }
  );

  const [dropdownStates, setDropdownStates] = useState({
    district: false,
  });

  const [industryInput, setIndustryInput] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 모달이 열릴 때 초기값 설정
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData);
      setIndustryInput(initialData.industry);
    }
  }, [isOpen, initialData]);

  const industryOptions = [
    "음식점업",
    "소매업",
    "서비스업",
    "제조업",
    "숙박업",
    "운수업",
    "건설업",
    "부동산업",
    "교육서비스업",
    "보건업",
    "사회복지서비스업",
    "예술, 스포츠 및 여가관련 서비스업",
    "협회 및 단체, 수리 및 기타 개인서비스업",
  ];

  const districtOptions = ["동구", "중구", "서구", "유성구", "대덕구"];

  const dongOptions: { [key: string]: string[] } = {
    동구: [
      "가양동",
      "가오동",
      "대청동",
      "삼성동",
      "성남동",
      "용운동",
      "이사동",
      "자양동",
      "직동",
      "천동",
      "추동",
      "판암동",
      "하소동",
      "홍도동",
    ],
    중구: [
      "대사동",
      "대흥동",
      "목동",
      "문창동",
      "문화동",
      "부사동",
      "산성동",
      "석교동",
      "선화동",
      "오류동",
      "용두동",
      "유천동",
      "은행동",
      "정동",
      "중촌동",
      "침산동",
      "태평동",
      "호동",
    ],
    서구: [
      "가수원동",
      "가장동",
      "갈마동",
      "관저동",
      "괴정동",
      "내동",
      "도마동",
      "둔산동",
      "만년동",
      "변동",
      "복수동",
      "용문동",
      "우명동",
      "원정동",
      "월평동",
      "장안동",
      "정림동",
      "평촌동",
      "흑석동",
    ],
    유성구: [
      "갑동",
      "계산동",
      "관평동",
      "교촌동",
      "구암동",
      "궁동",
      "금고동",
      "노은동",
      "대정동",
      "덕명동",
      "도룡동",
      "둔곡동",
      "반석동",
      "봉명동",
      "상대동",
      "성북동",
      "세동",
      "송강동",
      "수통동",
      "신동",
      "신봉동",
      "안산동",
      "어은동",
      "용계동",
      "원내동",
      "원신흥동",
      "원촌동",
      "자운동",
      "장대동",
      "전민동",
      "지족동",
      "추목동",
      "학하동",
      "화암동",
    ],
    대덕구: [
      "갈전동",
      "대화동",
      "덕암동",
      "목상동",
      "미호동",
      "부수동",
      "비래동",
      "삼정동",
      "상서동",
      "석봉동",
      "송촌동",
      "신대동",
      "신일동",
      "신탄진동",
      "연축동",
      "오정동",
      "와동",
      "용호동",
      "읍내동",
      "이현동",
      "장동",
      "중리동",
      "평촌동",
      "황호동",
    ],
  };

  useEffect(() => {
    if (isOpen) {
      getCurrentLocation();
    }
  }, [isOpen]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("이 브라우저에서는 위치 정보를 지원하지 않습니다.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          // 대전 지역 확인
          const isInDaejeon =
            latitude >= 36.0 &&
            latitude <= 36.5 &&
            longitude >= 127.0 &&
            longitude <= 127.6;

          if (isInDaejeon) {
            try {
              const response = await fetch(
                `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
                {
                  headers: {
                    "Accept-Language": "ko",
                  },
                }
              );

              if (response.ok) {
                const data = await response.json();
                const address = data.address;

                if (
                  address &&
                  (address.country === "대한민국" ||
                    address.country === "Korea")
                ) {
                  const city = address.city || address.state || "";
                  const districtName = address.county || address.district || "";
                  const dongName =
                    address.suburb || address.neighbourhood || "";

                  if (city.includes("대전") || city.includes("Daejeon")) {
                    setFormData((prev) => ({
                      ...prev,
                      location: {
                        district: districtName,
                        dong: dongName,
                        address: `대전 ${districtName} ${dongName}`,
                      },
                    }));
                    return;
                  }
                }
              }

              // API 실패 시 기본값
              setFormData((prev) => ({
                ...prev,
                location: {
                  district: "유성구",
                  dong: "도안동",
                  address: "대전 유성구 도안동",
                },
              }));
            } catch (error) {
              console.error("주소 변환 실패:", error);
              setFormData((prev) => ({
                ...prev,
                location: {
                  district: "유성구",
                  dong: "도안동",
                  address: "대전 유성구 도안동",
                },
              }));
            }
          } else {
            setError(
              "대전 지역이 아닙니다. 대전 지역에서만 서비스를 이용할 수 있습니다."
            );
          }
        } catch (error) {
          console.error("위치 정보 가져오기 실패:", error);
          setError("위치 정보를 가져올 수 없습니다.");
        }
      },
      (error) => {
        console.error("Geolocation 에러:", error);
        let errorMessage = "위치 정보를 가져올 수 없습니다.";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 정보 접근이 거부되었습니다.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다.";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다.";
            break;
        }

        setError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  const toggleDropdown = (type: "district") => {
    setDropdownStates((prev) => ({
      district: type === "district" ? !prev.district : false,
    }));
  };

  const selectOption = (type: "district", option: string) => {
    if (type === "district") {
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          district: option,
          dong: "", // 동 선택 초기화
          address: `대전 ${option}`,
        },
      }));
    }

    setDropdownStates((prev) => ({
      ...prev,
      [type]: false,
    }));
  };

  const selectDong = (dong: string) => {
    setFormData((prev) => ({
      ...prev,
      location: {
        ...prev.location,
        dong: dong,
        address: `대전 ${prev.location.district} ${dong}`,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!industryInput.trim()) {
      setError("업종을 입력해주세요.");
      return;
    }

    if (!formData.location.district || !formData.location.dong) {
      setError("위치를 선택해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        industry: industryInput.trim(),
      };
      await onSubmit(submitData);
      onClose();
    } catch (error) {
      setError("등록 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      industry: "",
      location: {
        district: "",
        dong: "",
        address: "",
      },
    });
    setIndustryInput("");
    setError(null);
    onClose();
  };

  console.log("BusinessItemModal render - isOpen:", isOpen);
  if (!isOpen) {
    console.log("BusinessItemModal: 모달이 닫혀있어서 null 반환");
    return null;
  }

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>
            {userType === "STARTUP" ? "사업 정보 등록" : "창업 아이템 분석"}
          </h2>
          <p className={styles.subtitle}>
            {userType === "STARTUP"
              ? "현재 운영 중인 사업 정보를 등록해주세요"
              : "창업을 계획하는 아이템 정보를 입력해주세요"}
          </p>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              <Business style={{ marginRight: "8px", fontSize: "18px" }} />
              업종
            </label>
            <input
              type="text"
              className={styles.inputField}
              placeholder="예: 카페, 치킨집, 편의점, 헬스장 등"
              value={industryInput}
              onChange={(e) => setIndustryInput(e.target.value)}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              <LocationOn style={{ marginRight: "8px", fontSize: "18px" }} />
              위치
            </label>
            <div className={styles.dropdown}>
              <button
                type="button"
                className={`${styles.dropdownButton} ${
                  dropdownStates.district ? styles.open : ""
                }`}
                onClick={() => toggleDropdown("district")}
              >
                {formData.location.district || "자치구를 선택해주세요"}
                <span
                  className={`${styles.dropdownArrow} ${
                    dropdownStates.district ? styles.open : ""
                  }`}
                >
                  <ExpandMore />
                </span>
              </button>
              {dropdownStates.district && (
                <div className={styles.dropdownMenu}>
                  {districtOptions.map((option) => (
                    <button
                      key={option}
                      type="button"
                      className={styles.dropdownOption}
                      onClick={() => selectOption("district", option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {formData.location.district && (
              <div className={styles.locationInfo}>
                <div className={styles.locationText}>
                  {formData.location.district}의 동을 선택해주세요:
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {dongOptions[formData.location.district]?.map((dong) => (
                    <button
                      key={dong}
                      type="button"
                      className={styles.locationButton}
                      onClick={() => selectDong(dong)}
                      style={{
                        background:
                          formData.location.dong === dong ? "#5789ff" : "white",
                        color:
                          formData.location.dong === dong ? "white" : "#5789ff",
                        border: "1px solid #5789ff",
                        borderRadius: "6px",
                        padding: "4px 8px",
                        fontSize: "12px",
                      }}
                    >
                      {dong}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.buttonGroup}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={
                isLoading || !industryInput.trim() || !formData.location.dong
              }
            >
              {isLoading ? (
                <div className={styles.loading}>
                  <div className={styles.spinner}></div>
                  등록 중...
                </div>
              ) : (
                <>
                  <Check style={{ marginRight: "8px", fontSize: "18px" }} />
                  등록하기
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusinessItemModal;
