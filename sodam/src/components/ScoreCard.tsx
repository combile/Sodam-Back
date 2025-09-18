import React from "react";
import {
  Lightbulb,
  Check,
  Warning,
  Policy,
  ArrowForward,
} from "@mui/icons-material";
import styles from "./ScoreCard.module.css";

interface ScoreData {
  score: number;
  opinion: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

interface ScoreCardProps {
  data?: ScoreData;
  isLoading?: boolean;
  error?: string | null;
  title?: string;
  subtitle?: string;
  userIndustry?: string;
  userLocation?: string;
}

const ScoreCard: React.FC<ScoreCardProps> = ({
  data,
  isLoading = false,
  error = null,
  title = "종합의견 및 점수",
  subtitle = "AI가 분석한 결과입니다",
  userIndustry = "",
  userLocation = "",
}) => {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#27ae60"; // 녹색
    if (score >= 60) return "#f39c12"; // 주황색
    return "#e74c3c"; // 빨간색
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "우수";
    if (score >= 60) return "보통";
    return "개선 필요";
  };

  // 하드코딩된 정책 데이터
  const policies = [
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
      contactInfo: "042-123-4567",
      applyUrl: "https://www.daejeon.go.kr",
    },
    {
      id: 3,
      title: "중소기업 창업도약패키지",
      organization: "중소벤처기업부",
      category: "기술창업",
      supportAmount: "최대 3,000만원",
      deadline: "2025-10-31",
      status: "진행중",
      description:
        "기술기반 창업을 지원하는 사업으로, R&D비용과 마케팅비를 지원합니다.",
      eligibility: ["기술기반 창업자", "특허 보유자", "대학 연구원"],
      contactInfo: "02-1234-5678",
      applyUrl: "https://www.mss.go.kr",
    },
    {
      id: 4,
      title: "시설관리·임대업 창업지원",
      organization: "대전시청",
      category: "업종별지원",
      supportAmount: "최대 500만원",
      deadline: "2025-12-15",
      status: "진행중",
      description: "시설관리 및 임대업 창업을 위한 특별 지원사업입니다.",
      eligibility: ["시설관리업 창업자", "임대업 창업자", "대전시 거주자"],
      contactInfo: "042-123-4567",
      applyUrl: "https://www.daejeon.go.kr",
    },
  ];

  // 사용자 업종과 지역에 맞는 정책 필터링
  const getRelevantPolicies = () => {
    return policies
      .filter((policy) => {
        // 업종별 정책 매칭
        if (
          userIndustry &&
          policy.title.toLowerCase().includes(userIndustry.toLowerCase())
        ) {
          return true;
        }
        // 지역별 정책 매칭
        if (
          userLocation &&
          policy.title.toLowerCase().includes(userLocation.toLowerCase())
        ) {
          return true;
        }
        // 일반적인 창업지원 정책
        if (policy.category === "창업지원" || policy.category === "청년창업") {
          return true;
        }
        return false;
      })
      .slice(0, 2); // 최대 2개만 표시
  };

  if (isLoading) {
    return (
      <div className={styles.card}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <div className={styles.loadingText}>분석 결과를 생성 중입니다...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.card}>
        <div className={styles.error}>{error}</div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className={styles.card}>
        <div className={styles.empty}>분석 결과가 없습니다</div>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>

      <div className={styles.scoreSection}>
        <div className={styles.scoreCircle}>
          <div
            className={styles.scoreCircleInner}
            style={{
              background: `conic-gradient(from 0deg, ${getScoreColor(
                data.score
              )} 0deg, ${getScoreColor(data.score)} ${
                (data.score / 100) * 360
              }deg, #e1e8ed ${(data.score / 100) * 360}deg, #e1e8ed 360deg)`,
            }}
          >
            <div className={styles.scoreText}>{data.score}</div>
          </div>
        </div>
        <div className={styles.scoreLabel}>{getScoreLabel(data.score)}</div>
      </div>

      <div className={styles.opinionSection}>
        <div className={styles.opinionTitle}>
          <div className={styles.opinionIcon}>
            <Lightbulb style={{ fontSize: "18px" }} />
          </div>
          종합의견
        </div>
        <div className={styles.opinionText}>{data.opinion}</div>
      </div>

      <div className={styles.strengthsWeaknesses}>
        <div className={styles.strengthSection}>
          <div className={styles.sectionTitle}>
            <div className={`${styles.sectionIcon} ${styles.strengthIcon}`}>
              <Check style={{ fontSize: "14px" }} />
            </div>
            강점
          </div>
          <div className={styles.itemList}>
            {data.strengths.map((strength, index) => (
              <div key={index} className={styles.item}>
                <div className={`${styles.itemIcon} ${styles.positive}`}>
                  <Check style={{ fontSize: "12px" }} />
                </div>
                <span>{strength}</span>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.weaknessSection}>
          <div className={styles.sectionTitle}>
            <div className={`${styles.sectionIcon} ${styles.weaknessIcon}`}>
              <Warning style={{ fontSize: "10px" }} />
            </div>
            개선점
          </div>
          <div className={styles.itemList}>
            {data.weaknesses.map((weakness, index) => (
              <div key={index} className={styles.item}>
                <div className={`${styles.itemIcon} ${styles.negative}`}>
                  <Warning style={{ fontSize: "8px" }} />
                </div>
                <span>{weakness}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.recommendations}>
        <div className={styles.recommendationTitle}>
          <div className={styles.recommendationIcon}>
            <Lightbulb style={{ fontSize: "14px" }} />
          </div>
          추천사항
        </div>
        <div className={styles.recommendationList}>
          {data.recommendations.map((recommendation, index) => (
            <div key={index} className={styles.recommendationItem}>
              <div className={styles.recommendationIcon}>{index + 1}</div>
              <div className={styles.recommendationText}>{recommendation}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 당신을 위한 정책 섹션 */}
      <div className={styles.policySection}>
        <div className={styles.policyTitle}>
          <div className={styles.policyIcon}>
            <Policy style={{ fontSize: "18px" }} />
          </div>
          당신을 위한 정책
        </div>
        <div className={styles.policyList}>
          {getRelevantPolicies().map((policy) => (
            <div key={policy.id} className={styles.policyItem}>
              <div className={styles.policyHeader}>
                <div className={styles.policyTitleText}>{policy.title}</div>
                <div
                  className={`${styles.policyStatus} ${
                    styles[policy.status.replace("임박", "")]
                  }`}
                >
                  {policy.status}
                </div>
              </div>
              <div className={styles.policyOrganization}>
                {policy.organization}
              </div>
              <div className={styles.policyDescription}>
                {policy.description}
              </div>
              <div className={styles.policyDetails}>
                <div className={styles.policyAmount}>
                  <strong>지원금액:</strong> {policy.supportAmount}
                </div>
                <div className={styles.policyDeadline}>
                  <strong>신청마감:</strong> {policy.deadline}
                </div>
              </div>
              <div className={styles.policyActions}>
                <a
                  href={policy.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.policyButton}
                >
                  신청하기
                  <ArrowForward style={{ fontSize: "16px" }} />
                </a>
                <div className={styles.policyContact}>
                  문의: {policy.contactInfo}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ScoreCard;
