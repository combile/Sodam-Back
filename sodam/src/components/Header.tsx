import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { authAPI } from "../api/auth.ts";
import styles from "./Header.module.css";

import logo from "../assets/logo.png";
import menuIcon from "../assets/icon-menu.svg";
import searchIcon from "../assets/icon-search.svg";
import appleIcon from "../assets/icon-apple.svg";
import userIcon from "../assets/icon-user.svg";
import defaultProfileImage from "../assets/default-profile.png";

import closeIcon from "../assets/icon-close.svg";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuClosing, setIsMenuClosing] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  // 로그인 상태 확인
  useEffect(() => {
    const checkAuthStatus = () => {
      const loggedIn = authAPI.isAuthenticated();
      const currentUser = authAPI.getCurrentUser();
      console.log("Checking auth status:", { loggedIn, currentUser });
      setIsLoggedIn(loggedIn);
      setUser(currentUser);
    };

    checkAuthStatus();

    // 로그인 상태 변경을 감지하기 위한 이벤트 리스너
    const handleAuthStateChange = (event: any) => {
      const { isLoggedIn, user } = event.detail;
      console.log("Auth state changed:", { isLoggedIn, user });
      setIsLoggedIn(isLoggedIn);
      setUser(user);
    };

    const handleStorageChange = () => {
      checkAuthStatus();
    };

    // 커스텀 이벤트와 storage 이벤트 모두 감지
    window.addEventListener("authStateChanged", handleAuthStateChange);
    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("focus", checkAuthStatus);

    return () => {
      window.removeEventListener("authStateChanged", handleAuthStateChange);
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("focus", checkAuthStatus);
    };
  }, []);

  // 로그아웃 함수
  const handleLogout = () => {
    authAPI.logout();
    handleMenuClose();
  };

  // 스크롤 이벤트 핸들러
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // 스크롤 방향에 따라 헤더 표시/숨김
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // 아래로 스크롤하고 100px 이상 스크롤했을 때 헤더 숨김
        setIsHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setIsHeaderVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]);

  // 메뉴 닫기 함수 (애니메이션과 함께)
  const handleMenuClose = () => {
    setIsMenuClosing(true);
    setTimeout(() => {
      setIsMenuOpen(false);
      setIsMenuClosing(false);
    }, 250); // CSS 애니메이션 시간과 맞춤
  };

  // 스크롤 잠금 처리
  useEffect(() => {
    if (isMenuOpen) {
      // 메뉴가 열릴 때
      const scrollY = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      // 메뉴가 닫힐 때
      const scrollY = document.body.style.top;
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";

      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
      }
    }

    // 컴포넌트 언마운트 시 정리
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  // ESC 키로 메뉴 닫기
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isMenuOpen) {
        handleMenuClose();
      }
    };

    if (isMenuOpen) {
      document.addEventListener("keydown", handleEscKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isMenuOpen]);

  return (
    <header
      className={`${styles.header} ${
        !isHeaderVisible ? styles.headerHidden : ""
      }`}
    >
      <div className={`${styles.inner} ${isMenuOpen ? styles.barHidden : ""}`}>
        {/* 왼쪽: 메뉴 아이콘 + 로고 */}
        <div className={styles.left}>
          <div className={styles.logoSection}>
            <Link to="/">
              <img src={logo} alt="소담 로고" className={styles.logo} />
            </Link>
          </div>
        </div>

        {/* 가운데: 검색창 */}
        <div className={styles.searchContainer}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="검색어를 입력하세요"
          />
          <img src={searchIcon} alt="검색" className={styles.searchIcon} />
        </div>

        {/* 오른쪽: 앱스토어 버튼 + 유저 아이콘 */}
        <div className={styles.right}>
          <button className={styles.appStoreButton}>
            <img src={appleIcon} alt="Apple" className={styles.appleIcon} />
            <span>App Store</span>
          </button>

          {isLoggedIn ? (
            <div className={styles.userSection}>
              <Link to="/mypage" className={styles.userNameLink}>
                <span className={styles.userName}>
                  {user?.nickname || user?.name || "사용자"}
                </span>
              </Link>
              <button
                className={styles.menuBtn}
                aria-label="메뉴 열기"
                onClick={() => setIsMenuOpen(true)}
              >
                <img
                  src={user?.profileImage || defaultProfileImage}
                  alt="프로필"
                  className={styles.profileImage}
                />
              </button>
            </div>
          ) : (
            <button
              className={styles.menuBtn}
              aria-label="메뉴 열기"
              onClick={() => setIsMenuOpen(true)}
            >
              <img src={menuIcon} alt="" className={styles.menuIcon} />
            </button>
          )}
        </div>
      </div>

      {/* ====== 전체화면 메뉴 모달 ====== */}
      {isMenuOpen && (
        <div
          className={`${styles.menuOverlay} ${
            isMenuClosing ? styles.closing : ""
          }`}
          onClick={handleMenuClose}
        >
          <div
            className={`${styles.menuSheet} ${
              isMenuClosing ? styles.closing : ""
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.menuHeader}>
              <h2 className={styles.menuTitle}>소담, 소상공인을 담다</h2>
              <button
                className={styles.menuClose}
                onClick={handleMenuClose}
                aria-label="메뉴 닫기"
              >
                <img src={closeIcon} alt="닫기버튼" />
              </button>
            </div>

            {/* 상단 타이틀 + 로그인/사용자 정보 */}
            <div className={styles.menuTop}>
              {isLoggedIn ? (
                <div className={styles.userInfo}>
                  <Link
                    to="/mypage"
                    className={styles.userProfileLink}
                    onClick={handleMenuClose}
                  >
                    <div className={styles.userProfile}>
                      {user?.profileImage ? (
                        <img
                          src={user.profileImage}
                          alt="프로필"
                          className={styles.profileIcon}
                        />
                      ) : (
                        <img
                          src={userIcon}
                          alt="사용자"
                          className={styles.profileIcon}
                        />
                      )}
                      <div className={styles.userDetails}>
                        <h3 className={styles.userName}>
                          {user?.nickname || user?.name || "사용자"}
                        </h3>
                        <p className={styles.userEmail}>{user?.email}</p>
                      </div>
                    </div>
                  </Link>
                  <button className={styles.logoutBtn} onClick={handleLogout}>
                    로그아웃
                  </button>
                </div>
              ) : (
                <button className={styles.loginCta} onClick={handleMenuClose}>
                  <Link to="/login">로그인하기</Link>
                  <span aria-hidden>›</span>
                </button>
              )}
            </div>

            {/* 카테고리 그리드 */}
            <div className={styles.menuGrid}>
              <section className={styles.menuCard}>
                <header className={styles.cardHeader}>
                  <h3>상권 분석</h3>
                </header>
                <ul>
                  <li>
                    <Link to="/market-analysis" onClick={handleMenuClose}>
                      상권 종합 분석
                    </Link>
                  </li>
                </ul>
              </section>

              <section className={styles.menuCard}>
                <header className={styles.cardHeader}>
                  <h3>사장님 !</h3>
                </header>
                <ul>
                  <li>
                    {" "}
                    <Link to="/today-ceo" onClick={handleMenuClose}>
                      오늘도 사장
                    </Link>
                  </li>
                  <li>
                    <Link to="/tomorrow-ceo" onClick={handleMenuClose}>
                      내일은 사장
                    </Link>
                  </li>
                </ul>
              </section>

              <section className={styles.menuCard}>
                <header className={styles.cardHeader}>
                  <h3>지원 도구</h3>
                </header>
                <ul>
                  <li>
                    <Link to="/policy/list" onClick={handleMenuClose}>
                      정책 지원
                    </Link>
                  </li>
                  <li>
                    <Link to="/policy/consult" onClick={handleMenuClose}>
                      전문가 상담
                    </Link>
                  </li>
                  <li>
                    <Link to="/policy/cases" onClick={handleMenuClose}>
                      성공 사례
                    </Link>
                  </li>
                </ul>
              </section>

              <section className={styles.menuCard}>
                <header className={styles.cardHeader}>
                  <h3>커뮤니티</h3>
                </header>
                <ul>
                  <li>
                    <Link to="/damso" onClick={handleMenuClose}>
                      담소
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/damso?tab=내가 쓴 질문"
                      onClick={handleMenuClose}
                    >
                      내가 쓴 질문
                    </Link>
                  </li>
                  <li>
                    <Link to="/damso?tab=대답한 질문" onClick={handleMenuClose}>
                      대답한 질문
                    </Link>
                  </li>
                </ul>
              </section>

              <section className={styles.menuCard}>
                <header className={styles.cardHeader}>
                  <h3>팀 소개</h3>
                </header>
                <ul>
                  <li>
                    <Link to="/about" onClick={handleMenuClose}>
                      소담 소개
                    </Link>
                  </li>
                  <li>
                    <Link to="/about/background" onClick={handleMenuClose}>
                      개발 배경
                    </Link>
                  </li>
                  <li>
                    <Link to="/about/service" onClick={handleMenuClose}>
                      서비스 배경
                    </Link>
                  </li>
                  <li>
                    <Link to="/about/team" onClick={handleMenuClose}>
                      팀 소개
                    </Link>
                  </li>
                </ul>
              </section>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
