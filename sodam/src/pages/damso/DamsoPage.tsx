import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import styles from "./DamsoPage.module.css";

// 질문 데이터 타입 정의
interface Question {
  id: number;
  category: "내일 사장" | "오늘 사장"; // 카테고리
  title: string;
  description: string;
  author: {
    title: string; // 직책 (사장, 예비창업자 등)
    level: number;
  };
}

// 하드코딩된 질문 데이터
const questionsData: Question[] = [
  {
    id: 1,
    category: "내일 사장",
    title: "초기 비용이 궁금해요!",
    description: "다들 가게 차리실때 얼마정도 들었는지 공유 가능하심?",
    author: {
      title: "예비창업자",
      level: 8,
    },
  },
  {
    id: 2,
    category: "오늘 사장",
    title: "고양이는 아무래도 렉돌이죠 ?",
    description: "반박은 안받을게요 ㅇㅇ",
    author: {
      title: "사장",
      level: 8,
    },
  },
  {
    id: 3,
    category: "내일 사장",
    title: "한밭대에 볼링장 지으려고하는데",
    description: "사람들이 많이 올깝쇼 ,,, 조금 불안띠에",
    author: {
      title: "예비창업자",
      level: 8,
    },
  },
];

const DamsoPage = () => {
  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState<
    "담소" | "내가 쓴 질문" | "대답한 질문"
  >("담소");

  // URL 파라미터에서 탭 정보를 읽어와서 설정
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "내가 쓴 질문" || tabParam === "대답한 질문") {
      setSelectedTab(tabParam);
    }
  }, [searchParams]);

  // 탭 변경 핸들러
  const handleTabChange = (tab: "담소" | "내가 쓴 질문" | "대답한 질문") => {
    setSelectedTab(tab);
  };

  // 카테고리에 따른 스타일 클래스 반환
  const getCategoryClass = (category: string) => {
    switch (category) {
      case "내일 사장":
        return styles.categoryGreen;
      case "오늘 사장":
        return styles.categoryBlue;
      default:
        return styles.categoryGreen;
    }
  };

  return (
    <div className={styles.container}>
      {/* 메인 컨텐츠 */}
      <div className={styles.mainContent}>
        {/* 왼쪽: 탭 및 질문 리스트 */}
        <div className={styles.leftSection}>
          {/* 탭 네비게이션 */}
          <div className={styles.tabNavigation}>
            <button
              className={`${styles.tabButton} ${
                selectedTab === "담소" ? styles.activeTab : ""
              }`}
              onClick={() => handleTabChange("담소")}
            >
              담소
            </button>
            <button
              className={`${styles.tabButton} ${
                selectedTab === "내가 쓴 질문" ? styles.activeTab : ""
              }`}
              onClick={() => handleTabChange("내가 쓴 질문")}
            >
              내가 쓴 질문
            </button>
            <button
              className={`${styles.tabButton} ${
                selectedTab === "대답한 질문" ? styles.activeTab : ""
              }`}
              onClick={() => handleTabChange("대답한 질문")}
            >
              대답한 질문
            </button>
          </div>

          {/* 질문 리스트 */}
          <div className={styles.questionsList}>
            {questionsData.map((question) => (
              <div key={question.id} className={styles.questionCard}>
                <div className={styles.questionHeader}>
                  <span
                    className={`${styles.category} ${getCategoryClass(
                      question.category
                    )}`}
                  >
                    {question.category}
                  </span>
                </div>
                <h3 className={styles.questionTitle}>
                  <span
                    className={`${styles.questionPrefix} ${getCategoryClass(
                      question.category
                    )}`}
                  >
                    Q.
                  </span>{" "}
                  {question.title}
                </h3>
                <p className={styles.questionDescription}>
                  {question.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 오른쪽: 프로필 섹션 */}
        <div className={styles.rightSection}>
          <div className={styles.profileCard}>
            <div className={styles.profileSection}>
              <div className={styles.profileImageContainer}>
                <div className={styles.profileImage}>
                  {/* 고양이 이미지 자리 */}
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-VbTX0q8kgfmFPdg3im1J8X4ePgH2bwvb4mWKwX9s0m_ko6vS9GAXI2z1LERqXkCQBfI&usqp=CAU"
                    alt="프로필"
                    className={styles.profileImg}
                  />
                </div>
                <button className={styles.newUserButton}>내일 사장</button>
              </div>

              <div className={styles.levelSection}>
                <div className={styles.levelHeader}>
                  <h4 className={styles.levelTitle}>현재 레벨</h4>
                  <span className={styles.levelNumber}>8 LV</span>
                </div>
                <div className={styles.levelProgress}>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                  <div className={styles.levelRange}>
                    <span>Lv.8</span>
                    <span>Lv.9</span>
                  </div>
                </div>
              </div>
            </div>

            <button className={styles.questionButton}>
              <div className={styles.questionButtonContent}>
                <div className={styles.questionButtonText}>
                  <span className={styles.questionButtonTitle}>질문하기</span>
                  <span className={styles.questionButtonSubtitle}>
                    사장님들에게 물어보세요 !
                  </span>
                </div>
                <div className={styles.questionButtonIcon}>
                  <span className={styles.helpIcon}>?</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DamsoPage;
