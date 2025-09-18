import React from "react";
import { 
  Close, 
  Restaurant, 
  ContentCut, 
  ShoppingBag, 
  Science, 
  SportsSoccer, 
  Business, 
  Map, 
  ContentCopy 
} from "@mui/icons-material";
import { Business as BusinessType } from "../api/businessInfo.ts";
import styles from "./BusinessInfoModal.module.css";

interface BusinessInfoModalProps {
  business: BusinessType | null;
  isOpen: boolean;
  onClose: () => void;
}

const BusinessInfoModal: React.FC<BusinessInfoModalProps> = ({
  business,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !business) return null;

  const getIndustryIcon = (industryCode: string) => {
    switch (industryCode) {
      case "I2": // 음식
        return <Restaurant style={{ fontSize: "20px" }} />;
      case "S2": // 수리·개인
        return <ContentCut style={{ fontSize: "20px" }} />;
      case "G2": // 소매
        return <ShoppingBag style={{ fontSize: "20px" }} />;
      case "M1": // 과학·기술
        return <Science style={{ fontSize: "20px" }} />;
      case "R1": // 예술·스포츠
        return <SportsSoccer style={{ fontSize: "20px" }} />;
      case "N1": // 시설관리·임대
        return <Business style={{ fontSize: "20px" }} />;
      default:
        return <Business style={{ fontSize: "20px" }} />;
    }
  };

  const getIndustryColor = (industryCode: string) => {
    switch (industryCode) {
      case "I2": // 음식
        return "#ff6b6b";
      case "S2": // 수리·개인
        return "#4ecdc4";
      case "G2": // 소매
        return "#45b7d1";
      case "M1": // 과학·기술
        return "#96ceb4";
      case "R1": // 예술·스포츠
        return "#feca57";
      case "N1": // 시설관리·임대
        return "#ff9ff3";
      default:
        return "#a4b0be";
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.businessTitle}>
            <span className={styles.industryIcon}>
              {getIndustryIcon(business.상권업종대분류코드)}
            </span>
            <h3 className={styles.businessName}>{business.상호명}</h3>
            {business.지점명 && (
              <span className={styles.branchName}>({business.지점명})</span>
            )}
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            <Close fontSize="small" />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.infoSection}>
            <h4 className={styles.sectionTitle}>업종 정보</h4>
            <div className={styles.industryInfo}>
              <div
                className={styles.industryBadge}
                style={{
                  backgroundColor: getIndustryColor(
                    business.상권업종대분류코드
                  ),
                }}
              >
                {business.상권업종대분류명}
              </div>
              <div className={styles.industryDetail}>
                <p className={styles.industryCategory}>
                  {business.상권업종중분류명}
                </p>
                <p className={styles.industrySubCategory}>
                  {business.상권업종소분류명}
                </p>
              </div>
            </div>
          </div>

          <div className={styles.infoSection}>
            <h4 className={styles.sectionTitle}>위치 정보</h4>
            <div className={styles.locationInfo}>
              <div className={styles.locationItem}>
                <span className={styles.locationLabel}>지역구:</span>
                <span className={styles.locationValue}>
                  {business.시군구명}
                </span>
              </div>
              <div className={styles.locationItem}>
                <span className={styles.locationLabel}>행정동:</span>
                <span className={styles.locationValue}>
                  {business.행정동명}
                </span>
              </div>
              <div className={styles.locationItem}>
                <span className={styles.locationLabel}>도로명주소:</span>
                <span className={styles.locationValue}>
                  {business.도로명주소}
                </span>
              </div>
              {business.건물명 && (
                <div className={styles.locationItem}>
                  <span className={styles.locationLabel}>건물명:</span>
                  <span className={styles.locationValue}>
                    {business.건물명}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.infoSection}>
            <h4 className={styles.sectionTitle}>상세 정보</h4>
            <div className={styles.detailInfo}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>상가업소번호:</span>
                <span className={styles.detailValue}>
                  {business.상가업소번호}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>표준산업분류:</span>
                <span className={styles.detailValue}>
                  {business.표준산업분류명}
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>좌표:</span>
                <span className={styles.detailValue}>
                  {business.위도.toFixed(6)}, {business.경도.toFixed(6)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button
            className={styles.mapButton}
            onClick={() => {
              // 카카오맵으로 길찾기 (새 창에서 열기)
              const mapUrl = `https://map.kakao.com/link/to/${business.상호명},${business.위도},${business.경도}`;
              window.open(mapUrl, "_blank");
            }}
          >
            <Map style={{ marginRight: "8px", fontSize: "16px" }} />
            길찾기
          </button>
          <button
            className={styles.copyButton}
            onClick={() => {
              navigator.clipboard.writeText(
                `${business.상호명} - ${business.도로명주소}`
              );
            }}
          >
            <ContentCopy style={{ marginRight: "8px", fontSize: "16px" }} />
            주소 복사
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusinessInfoModal;
