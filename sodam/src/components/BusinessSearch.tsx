import React, { useState, useEffect, useCallback } from "react";
import {
  Search,
  Warning,
  Restaurant,
  ContentCut,
  ShoppingBag,
  Science,
  SportsSoccer,
  Business as BusinessIcon,
  Store,
} from "@mui/icons-material";
import { businessInfoAPI, Business } from "../api/businessInfo.ts";
import styles from "./BusinessSearch.module.css";

interface BusinessSearchProps {
  onBusinessSelect?: (business: Business) => void;
  placeholder?: string;
  showResults?: boolean;
}

const BusinessSearch: React.FC<BusinessSearchProps> = ({
  onBusinessSelect,
  placeholder = "업소명을 입력하세요...",
  showResults = true,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // 디바운스된 검색 함수
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout;
      return (term: string) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          if (term.trim().length >= 2) {
            performSearch(term);
          } else {
            setSearchResults([]);
            setShowDropdown(false);
          }
        }, 300);
      };
    })(),
    []
  );

  const performSearch = async (term: string) => {
    try {
      setLoading(true);
      setError(null);

      const response = await businessInfoAPI.searchBusinesses(term, 10);

      if (response.success) {
        setSearchResults(response.data.businesses);
        setShowDropdown(response.data.businesses.length > 0);
      } else {
        setError("검색 중 오류가 발생했습니다.");
        setSearchResults([]);
        setShowDropdown(false);
      }
    } catch (err) {
      console.error("검색 오류:", err);
      setError("검색 중 오류가 발생했습니다.");
      setSearchResults([]);
      setShowDropdown(false);
    } finally {
      setLoading(false);
    }
  };

  // 검색어 변경 시 디바운스된 검색 실행
  useEffect(() => {
    if (searchTerm.trim()) {
      debouncedSearch(searchTerm);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }
  }, [searchTerm, debouncedSearch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleBusinessSelect = (business: Business) => {
    setSearchTerm(business.상호명);
    setShowDropdown(false);
    setSearchResults([]);
    onBusinessSelect?.(business);
  };

  const handleInputFocus = () => {
    if (searchResults.length > 0) {
      setShowDropdown(true);
    }
  };

  const handleInputBlur = () => {
    // 약간의 지연을 두어 클릭 이벤트가 먼저 실행되도록 함
    setTimeout(() => setShowDropdown(false), 150);
  };

  const getIndustryIcon = (industryCode: string) => {
    switch (industryCode) {
      case "I2":
        return <Restaurant style={{ fontSize: "18px" }} />;
      case "S2":
        return <ContentCut style={{ fontSize: "18px" }} />;
      case "G2":
        return <ShoppingBag style={{ fontSize: "18px" }} />;
      case "M1":
        return <Science style={{ fontSize: "18px" }} />;
      case "R1":
        return <SportsSoccer style={{ fontSize: "18px" }} />;
      case "N1":
        return <BusinessIcon style={{ fontSize: "18px" }} />;
      default:
        return <Store style={{ fontSize: "18px" }} />;
    }
  };

  const getIndustryColor = (industryCode: string) => {
    switch (industryCode) {
      case "I2":
        return "#ff6b6b";
      case "S2":
        return "#4ecdc4";
      case "G2":
        return "#45b7d1";
      case "M1":
        return "#96ceb4";
      case "R1":
        return "#feca57";
      case "N1":
        return "#ff9ff3";
      default:
        return "#a4b0be";
    }
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputWrapper}>
        <div className={styles.searchIcon}>
          <span className="material-icons">search</span>
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={styles.searchInput}
        />
        {loading && <div className={styles.loadingSpinner}></div>}
        {error && (
          <div className={styles.errorIcon}>
            <span className="material-icons">warning</span>
          </div>
        )}
      </div>

      {showResults && showDropdown && searchResults.length > 0 && (
        <div className={styles.searchResults}>
          <div className={styles.resultsHeader}>
            <span className={styles.resultsCount}>
              {searchResults.length}개 결과
            </span>
          </div>
          <div className={styles.resultsList}>
            {searchResults.map((business) => (
              <div
                key={business.상가업소번호}
                className={styles.resultItem}
                onClick={() => handleBusinessSelect(business)}
              >
                <div className={styles.resultIcon}>
                  {getIndustryIcon(business.상권업종대분류코드)}
                </div>
                <div className={styles.resultContent}>
                  <div className={styles.resultName}>
                    {business.상호명}
                    {business.지점명 && (
                      <span className={styles.branchName}>
                        ({business.지점명})
                      </span>
                    )}
                  </div>
                  <div className={styles.resultDetails}>
                    <span
                      className={styles.industryBadge}
                      style={{
                        backgroundColor: getIndustryColor(
                          business.상권업종대분류코드
                        ),
                      }}
                    >
                      {business.상권업종대분류명}
                    </span>
                    <span className={styles.location}>
                      {business.시군구명} · {business.행정동명}
                    </span>
                  </div>
                  <div className={styles.resultAddress}>
                    {business.도로명주소}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default BusinessSearch;
