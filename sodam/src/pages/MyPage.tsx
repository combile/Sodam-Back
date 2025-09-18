import React, { useState, useEffect } from "react";
import { authAPI } from "../api/auth.ts";
import {
  businessInfoAPI,
  IndustryCategory,
  District,
  LocationSearchResult,
} from "../api/businessInfo.ts";
import {
  profileAPI,
  UpdateProfileRequest,
  UserProfile as APIUserProfile,
} from "../api/profile.ts";
import styles from "./MyPage.module.css";
import defaultProfileImage from "../assets/default-profile.png";

interface UserProfile {
  id: number;
  username: string;
  email: string;
  name: string;
  nickname?: string;
  userType: string;
  businessStage?: string;
  phone?: string;
  preferences: {
    interestedBusinessTypes: string[];
    preferredAreas: string[];
  };
  profileImage?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const MyPage: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingProfile, setEditingProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    businessStage: "",
    interestedBusinessTypes: "",
    preferredAreas: "",
    phone: "",
    marketingPush: true,
  });

  // 새로운 상태들
  const [industryCategories, setIndustryCategories] = useState<
    IndustryCategory[]
  >([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [locationSearchResults, setLocationSearchResults] = useState<
    LocationSearchResult[]
  >([]);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showIndustryDropdown, setShowIndustryDropdown] = useState(false);
  const [showBusinessStageDropdown, setShowBusinessStageDropdown] =
    useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    null
  );
  const [currentLocation, setCurrentLocation] =
    useState<string>("위치 정보 로딩 중...");
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
    loadIndustryCategories();
    loadDistricts();
    loadKakaoMapAPI();
  }, []);

  // 유저 프로필 로드 함수
  const loadUserProfile = async () => {
    try {
      // 최신 유저 프로필 데이터를 서버에서 가져오기
      const response = await profileAPI.getProfile();
      if (response.success) {
        const userData = response.user;
        setUser(userData as UserProfile);
        setFormData({
          name: userData.name || "",
          nickname: userData.nickname || "",
          businessStage: userData.businessStage || "",
          interestedBusinessTypes:
            userData.preferences?.interestedBusinessTypes?.join(", ") || "",
          preferredAreas:
            userData.preferences?.preferredAreas?.join(", ") || "",
          phone: userData.phone || "",
          marketingPush: true,
        });

        // 로컬 스토리지도 업데이트
        localStorage.setItem("user", JSON.stringify(userData));
      }
    } catch (error) {
      console.error("프로필 로드 실패:", error);
      // API 실패 시 로컬 스토리지에서 가져오기
      const currentUser = authAPI.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
        setFormData({
          name: currentUser.name || "",
          nickname: currentUser.nickname || "",
          businessStage: currentUser.businessStage || "",
          interestedBusinessTypes:
            currentUser.preferences?.interestedBusinessTypes?.join(", ") || "",
          preferredAreas:
            currentUser.preferences?.preferredAreas?.join(", ") || "",
          phone: currentUser.phone || "",
          marketingPush: true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // 카카오맵 API 로드 및 현재 위치 가져오기
  const loadKakaoMapAPI = () => {
    if (typeof window === "undefined") return;

    // 이미 로드된 경우
    if ((window as any).kakao && (window as any).kakao.maps) {
      getCurrentLocation();
      return;
    }

    // 이미 스크립트가 있는지 확인
    const existingScript = document.querySelector(
      'script[src*="dapi.kakao.com"]'
    );
    if (existingScript) {
      // 스크립트가 있으면 로드 완료 대기
      const checkAPI = () => {
        if ((window as any).kakao && (window as any).kakao.maps) {
          getCurrentLocation();
        } else {
          setTimeout(checkAPI, 100);
        }
      };
      checkAPI();
    } else {
      // 스크립트가 없으면 새로 로드
      const script = document.createElement("script");
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.REACT_APP_KAKAO_MAP_API_KEY}&autoload=false&libraries=services`;
      script.async = true;

      script.onload = () => {
        if ((window as any).kakao) {
          (window as any).kakao.maps.load(() => {
            getCurrentLocation();
          });
        }
      };

      script.onerror = () => {
        console.error("카카오맵 스크립트 로드 실패");
        setCurrentLocation("지도 서비스 로드 실패");
        setLocationError("지도 서비스 로드 실패");
      };

      document.head.appendChild(script);
    }
  };

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest(`.${styles.dropdownContainer}`)) {
        setShowIndustryDropdown(false);
        setShowLocationDropdown(false);
        setShowBusinessStageDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 페이지 포커스 시 최신 데이터 로드
  useEffect(() => {
    const handleFocus = () => {
      // 페이지가 다시 포커스를 받을 때 최신 프로필 데이터 로드
      loadUserProfile();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // 페이지가 다시 보여질 때 최신 프로필 데이터 로드
        loadUserProfile();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const loadIndustryCategories = async () => {
    try {
      const response = await businessInfoAPI.getIndustryCategories();
      if (response.success) {
        setIndustryCategories(response.categories);
      } else {
        // API 실패 시 더미 데이터로 테스트
        setIndustryCategories([
          { code: "I2", name: "음식" },
          { code: "G2", name: "소매" },
          { code: "S2", name: "수리·개인" },
          { code: "R1", name: "예술·스포츠" },
          { code: "M1", name: "과학·기술" },
        ]);
      }
    } catch (error) {
      console.error("업종 카테고리 로드 실패:", error);
      // 에러 시에도 더미 데이터 사용
      setIndustryCategories([
        { code: "I2", name: "음식" },
        { code: "G2", name: "소매" },
        { code: "S2", name: "수리·개인" },
        { code: "R1", name: "예술·스포츠" },
        { code: "M1", name: "과학·기술" },
      ]);
    }
  };

  const loadDistricts = async () => {
    try {
      const response = await businessInfoAPI.getDistricts();
      if (response.success) {
        setDistricts(response.districts);
      }
    } catch (error) {
      console.error("지역 데이터 로드 실패:", error);
    }
  };

  const handleLocationSearch = async (searchTerm: string) => {
    if (searchTerm.length < 2) {
      setLocationSearchResults([]);
      setShowLocationDropdown(false);
      return;
    }

    try {
      const response = await businessInfoAPI.searchLocations(searchTerm);
      if (response.success) {
        setLocationSearchResults(response.locations);
        setShowLocationDropdown(true);
      }
    } catch (error) {
      console.error("지역 검색 실패:", error);
    }
  };

  const handleLocationSelect = (location: LocationSearchResult) => {
    setFormData((prev) => ({
      ...prev,
      preferredAreas: location.full_name,
    }));
    setShowLocationDropdown(false);
  };

  const handleIndustrySelect = (category: IndustryCategory) => {
    setFormData((prev) => ({
      ...prev,
      interestedBusinessTypes: category.name,
    }));
    setShowIndustryDropdown(false);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSaveProfile = async () => {
    try {
      console.log("프로필 저장 시작:", formData);

      // JWT 토큰 확인
      const token = localStorage.getItem("token");
      console.log("JWT 토큰:", token ? "존재함" : "없음");

      if (!token) {
        alert("로그인이 필요합니다. 먼저 로그인해주세요.");
        return;
      }

      // 실제 프로필 업데이트 API 호출
      // 프로필 이미지 처리
      let profileImageData = null;
      if (profileImageFile) {
        // FileReader를 Promise로 래핑하여 동기적으로 처리
        profileImageData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(profileImageFile);
        });
      }

      const updateData: UpdateProfileRequest = {
        name: formData.name,
        nickname: formData.nickname,
        businessStage: formData.businessStage,
        phone: formData.phone,
        profileImage:
          profileImageData ||
          (profileImagePreview ? profileImagePreview : undefined),
        preferences: {
          interestedBusinessTypes: formData.interestedBusinessTypes
            ? [formData.interestedBusinessTypes]
            : [],
          preferredAreas: formData.preferredAreas
            ? [formData.preferredAreas]
            : [],
        },
      };

      const response = await profileAPI.updateProfile(updateData);

      if (response.success) {
        // 업데이트된 사용자 정보로 상태 업데이트
        setUser(response.user as UserProfile);

        // 로컬 스토리지에 업데이트된 사용자 정보 저장
        localStorage.setItem("user", JSON.stringify(response.user));

        // 프로필 이미지 상태 초기화
        setProfileImageFile(null);
        setProfileImagePreview(null);

        // 성공 알림
        alert("프로필이 성공적으로 업데이트되었습니다!");

        console.log("프로필 업데이트 완료:", response.user);
      } else {
        alert("프로필 업데이트에 실패했습니다.");
      }

      setEditingProfile(false);
      setShowIndustryDropdown(false);
      setShowLocationDropdown(false);
      setShowBusinessStageDropdown(false);
    } catch (error) {
      console.error("프로필 저장 실패:", error);
      alert("프로필 저장 중 오류가 발생했습니다.");
    }
  };

  const handleWithdraw = () => {
    if (window.confirm("정말로 회원 탈퇴를 하시겠습니까?")) {
      // 회원 탈퇴 로직
      console.log("회원 탈퇴");
      // TODO: 실제 회원 탈퇴 API 호출
    }
  };

  // 사장님 유형 옵션들
  const businessStageOptions = [
    { value: "PLANNING", label: "내일은 사장님 (예비창업자)" },
    { value: "STARTUP", label: "오늘도 사장님 (창업자)" },
    { value: "OPERATING", label: "운영 중" },
  ];

  const getBusinessStageText = (stage?: string) => {
    switch (stage) {
      case "PLANNING":
        return "내일은 사장님";
      case "STARTUP":
        return "오늘도 사장님";
      case "OPERATING":
        return "운영 중";
      default:
        return "내일은 사장님";
    }
  };

  const handleBusinessStageSelect = (option: {
    value: string;
    label: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      businessStage: option.value,
    }));
    setShowBusinessStageDropdown(false);
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);

      // 미리보기 생성
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImageFile(null);
    setProfileImagePreview(null);
  };

  const calculateAge = (birthYear?: number) => {
    if (!birthYear) return "21세"; // 기본값
    const currentYear = new Date().getFullYear();
    return `${currentYear - birthYear}세`;
  };

  // 현재 위치 가져오기
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setCurrentLocation("위치 서비스가 지원되지 않습니다");
      setLocationError("브라우저가 위치 서비스를 지원하지 않습니다");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        // 카카오맵 역지오코딩 API를 사용하여 주소 변환
        try {
          if (
            (window as any).kakao &&
            (window as any).kakao.maps &&
            (window as any).kakao.maps.services
          ) {
            const geocoder = new (window as any).kakao.maps.services.Geocoder();

            geocoder.coord2Address(
              longitude,
              latitude,
              (result: any, status: any) => {
                if (status === (window as any).kakao.maps.services.Status.OK) {
                  const address = result[0].address;
                  if (address) {
                    // 대전시인지 확인
                    if (address.region_1depth_name === "대전광역시") {
                      setCurrentLocation(
                        `${address.region_2depth_name} ${address.region_3depth_name}`
                      );
                    } else {
                      setCurrentLocation(
                        `${address.region_1depth_name} ${address.region_2depth_name} ${address.region_3depth_name}`
                      );
                    }
                    setLocationError(null);
                  } else {
                    setCurrentLocation("주소 정보를 찾을 수 없습니다");
                    setLocationError("주소 정보를 찾을 수 없습니다");
                  }
                } else {
                  setCurrentLocation("주소 변환에 실패했습니다");
                  setLocationError("주소 변환에 실패했습니다");
                }
              }
            );
          } else {
            // 카카오맵 API가 로드되지 않은 경우 좌표만 표시
            setCurrentLocation(
              `위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)}`
            );
            setLocationError(
              "지도 서비스가 로드되지 않았습니다. 좌표만 표시됩니다."
            );
          }
        } catch (error) {
          console.error("지오코딩 오류:", error);
          setCurrentLocation(
            `위도: ${latitude.toFixed(4)}, 경도: ${longitude.toFixed(4)}`
          );
          setLocationError("지오코딩 서비스 오류가 발생했습니다");
        }
      },
      (error) => {
        let errorMessage = "위치 정보를 가져올 수 없습니다";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "위치 접근 권한이 거부되었습니다";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "위치 정보를 사용할 수 없습니다";
            break;
          case error.TIMEOUT:
            errorMessage = "위치 정보 요청 시간이 초과되었습니다";
            break;
        }
        setCurrentLocation(errorMessage);
        setLocationError(errorMessage);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5분
      }
    );
  };

  // 위치 새로고침 함수
  const refreshLocation = () => {
    setCurrentLocation("위치 정보 로딩 중...");
    setLocationError(null);
    getCurrentLocation();
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>로딩 중...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className={styles.errorContainer}>
        <p>로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* 메인 콘텐츠 */}
      <div className={styles.mainContent}>
        {/* 좌측 프로필 정보 */}
        <div className={styles.leftColumn}>
          <div className={styles.profileSection}>
            {/* 프로필 이미지 */}
            <div className={styles.profileImage}>
              {editingProfile ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageChange}
                    style={{ display: "none" }}
                    id="profile-image-upload"
                  />
                  <label
                    htmlFor="profile-image-upload"
                    className={styles.profileImageClickable}
                  >
                    <img
                      src={
                        profileImagePreview ||
                        user.profileImage ||
                        defaultProfileImage
                      }
                      alt="프로필"
                    />
                    <div className={styles.profileImageOverlay}>
                      <span className={styles.uploadIcon}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"
                            fill="white"
                          />
                        </svg>
                      </span>
                      <span className={styles.uploadText}>사진 변경</span>
                    </div>
                  </label>
                  {(profileImagePreview || user.profileImage) && (
                    <button
                      type="button"
                      onClick={removeProfileImage}
                      className={styles.removeButton}
                    >
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z"
                          fill="white"
                        />
                      </svg>
                    </button>
                  )}
                </>
              ) : (
                <img
                  src={
                    profileImagePreview ||
                    user.profileImage ||
                    defaultProfileImage
                  }
                  alt="프로필"
                />
              )}
            </div>

            {/* 사용자 정보 */}
            <div className={styles.userInfo}>
              <h2 className={styles.userName}>{user.name}</h2>
              <p className={styles.userAge}>{calculateAge()}</p>
              <div className={styles.location}>
                <span className={styles.locationIcon}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                      fill="#A2A2A2"
                    />
                  </svg>
                </span>
                <span className={styles.currentLocation}>
                  {currentLocation}
                </span>
                {locationError && (
                  <button
                    className={styles.refreshLocationButton}
                    onClick={refreshLocation}
                    title="위치 새로고침"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                        fill="#007bff"
                      />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* 프로필 수정 버튼 */}
            <button
              className={styles.editButton}
              onClick={() => setEditingProfile(!editingProfile)}
            >
              프로필 정보 수정
            </button>

            {/* 사장님 유형 */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>사장님 유형</h3>
              {editingProfile ? (
                <div className={styles.dropdownContainer}>
                  <input
                    type="text"
                    name="businessStage"
                    value={
                      businessStageOptions.find(
                        (option) => option.value === formData.businessStage
                      )?.label || ""
                    }
                    onClick={() => {
                      setShowBusinessStageDropdown(!showBusinessStageDropdown);
                      setShowIndustryDropdown(false); // 다른 드롭다운 닫기
                      setShowLocationDropdown(false); // 다른 드롭다운 닫기
                    }}
                    className={styles.input}
                    placeholder="사장님 유형을 선택하세요"
                    readOnly
                  />
                  {showBusinessStageDropdown && (
                    <div className={styles.dropdown}>
                      {businessStageOptions.map((option) => (
                        <div
                          key={option.value}
                          className={styles.dropdownItem}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleBusinessStageSelect(option);
                          }}
                        >
                          {option.label}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={getBusinessStageText(user.businessStage)}
                  disabled
                  className={styles.input}
                />
              )}
            </div>

            {/* 관심 분야 */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>관심 분야</h3>
              {editingProfile ? (
                <div className={styles.dropdownContainer}>
                  <input
                    type="text"
                    name="interestedBusinessTypes"
                    value={formData.interestedBusinessTypes}
                    onChange={handleInputChange}
                    onClick={() => {
                      setShowIndustryDropdown(!showIndustryDropdown);
                      setShowLocationDropdown(false); // 다른 드롭다운 닫기
                    }}
                    className={styles.input}
                    placeholder="업종을 선택하세요"
                    readOnly
                  />
                  {showIndustryDropdown && (
                    <div className={styles.dropdown}>
                      {industryCategories.map((category) => (
                        <div
                          key={category.code}
                          className={styles.dropdownItem}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleIndustrySelect(category);
                          }}
                        >
                          {category.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <input
                  type="text"
                  value={
                    user.preferences?.interestedBusinessTypes?.join(", ") || ""
                  }
                  disabled
                  className={styles.input}
                  placeholder="관심 업종이 없습니다"
                />
              )}
            </div>

            {/* 관심 상권 */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>관심 상권</h3>
              {editingProfile ? (
                <div className={styles.infoMessage}>
                  <p className={styles.infoText}>
                    관심 상권은 상권분석 페이지에서 등록할 수 있습니다.
                  </p>
                  <button
                    className={styles.goToAnalysisButton}
                    onClick={() => (window.location.href = "/market-analysis")}
                  >
                    상권분석으로 이동
                  </button>
                </div>
              ) : (
                <div className={styles.favoriteMarketsContainer}>
                  <input
                    type="text"
                    value={user.preferences?.preferredAreas?.join(", ") || ""}
                    disabled
                    className={styles.input}
                    placeholder="관심 상권이 없습니다"
                  />
                  <button
                    className={styles.refreshMarketsButton}
                    onClick={loadUserProfile}
                    title="관심상권 새로고침"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"
                        fill="#007bff"
                      />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {editingProfile && (
              <div className={styles.editActions}>
                <button
                  className={styles.saveButton}
                  onClick={handleSaveProfile}
                >
                  저장
                </button>
                <button
                  className={styles.cancelButton}
                  onClick={() => {
                    // 원래 사용자 데이터로 복원
                    if (user) {
                      setFormData({
                        name: user.name || "",
                        nickname: user.nickname || "",
                        businessStage: user.businessStage || "",
                        interestedBusinessTypes:
                          user.preferences?.interestedBusinessTypes?.join(
                            ", "
                          ) || "",
                        preferredAreas:
                          user.preferences?.preferredAreas?.join(", ") || "",
                        phone: user.phone || "",
                        marketingPush: true,
                      });
                    }
                    setEditingProfile(false);
                    setShowIndustryDropdown(false);
                    setShowLocationDropdown(false);
                  }}
                >
                  취소
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 우측 회원정보 */}
        <div className={styles.rightColumn}>
          <div className={styles.membershipSection}>
            <h2 className={styles.sectionTitle}>회원정보</h2>

            {/* 아이디 */}
            <div className={styles.field}>
              <label className={styles.label}>아이디</label>
              <input
                type="text"
                value={user.username}
                disabled
                className={styles.input}
              />
            </div>

            {/* 이메일 */}
            <div className={styles.field}>
              <label className={styles.label}>이메일</label>
              <input
                type="email"
                value={user.email}
                disabled
                className={styles.input}
              />
            </div>

            {/* 마케팅 푸쉬 동의 */}
            <div className={styles.field}>
              <label className={styles.label}>마케팅 푸쉬 동의</label>
              <div className={styles.radioGroup}>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="marketingPush"
                    checked={formData.marketingPush}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, marketingPush: true }))
                    }
                    className={styles.radio}
                  />
                  <span className={styles.radioText}>동의</span>
                </label>
                <label className={styles.radioLabel}>
                  <input
                    type="radio"
                    name="marketingPush"
                    checked={!formData.marketingPush}
                    onChange={() =>
                      setFormData((prev) => ({ ...prev, marketingPush: false }))
                    }
                    className={styles.radio}
                  />
                  <span className={styles.radioText}>미동의</span>
                </label>
              </div>
            </div>

            {/* 탈퇴 안내 */}
            <div className={styles.field}>
              <p className={styles.withdrawNotice}>
                탈퇴를 원하시는 경우 회원 탈퇴 버튼을 눌러주세요
              </p>
            </div>

            {/* 회원 탈퇴 버튼 */}
            <button className={styles.withdrawButton} onClick={handleWithdraw}>
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
