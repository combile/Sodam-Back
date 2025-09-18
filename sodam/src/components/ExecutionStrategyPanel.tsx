import React, { useState } from "react";
import { TrendingUp, Business, Schedule } from "@mui/icons-material";
import styles from "./ExecutionStrategyPanel.module.css";

interface ExecutionStrategyProps {
  marketData: {
    name: string;
    rank: number;
    changeRate: number;
  };
  industryData: any[];
  competitionData: any;
}

const ExecutionStrategyPanel: React.FC<ExecutionStrategyProps> = ({
  marketData,
  industryData,
  competitionData,
}) => {
  const [activeStrategy, setActiveStrategy] = useState<string>("immediate");

  const getExecutionStrategies = () => {
    const isHighCompetition = (competitionData?.competition_score || 0) >= 70;
    const isGrowingMarket = marketData.changeRate > 0;
    const isTopRank = marketData.rank <= 5;

    return {
      immediate: [
        {
          id: "market-research",
          title: "시장 조사 및 분석",
          description:
            "현재 시장 상황을 정확히 파악하고 경쟁사 분석을 진행합니다.",
          duration: "1-2주",
          priority: "높음",
          status: "ready",
          tasks: [
            "주변 경쟁업체 현황 파악",
            "고객층 분석 및 타겟 설정",
            "가격대 조사 및 포지셔닝 분석",
            "운영시간 및 서비스 차별점 파악",
          ],
          expectedResult: "시장 진입 전략 수립 완료",
          investment: "낮음",
          roi: "높음",
        },
        {
          id: "brand-positioning",
          title: "브랜드 포지셔닝 전략",
          description: "경쟁사와 차별화된 브랜드 아이덴티티를 구축합니다.",
          duration: "2-3주",
          priority: "높음",
          status: "ready",
          tasks: [
            "브랜드 컨셉 및 메시지 개발",
            "로고 및 비주얼 아이덴티티 제작",
            "고객 경험 설계",
            "차별화 포인트 명확화",
          ],
          expectedResult: "차별화된 브랜드 아이덴티티 완성",
          investment: "중간",
          roi: "높음",
        },
        {
          id: "location-optimization",
          title: "입지 최적화",
          description: "현재 위치의 장단점을 분석하고 개선 방안을 마련합니다.",
          duration: "1주",
          priority: "중간",
          status: "ready",
          tasks: [
            "유동인구 패턴 분석",
            "접근성 및 가시성 평가",
            "임대료 대비 효율성 검토",
            "대안 입지 검토",
          ],
          expectedResult: "입지 최적화 방안 도출",
          investment: "낮음",
          roi: "중간",
        },
      ],
      shortTerm: [
        {
          id: "digital-marketing",
          title: "디지털 마케팅 구축",
          description: "온라인 채널을 통한 고객 유치 시스템을 구축합니다.",
          duration: "3-4주",
          priority: "높음",
          status: "ready",
          tasks: [
            "웹사이트 및 SNS 계정 개설",
            "구글 마이 비즈니스 등록",
            "온라인 리뷰 관리 시스템 구축",
            "디지털 광고 캠페인 기획",
          ],
          expectedResult: "디지털 마케팅 인프라 완성",
          investment: "중간",
          roi: "높음",
        },
        {
          id: "customer-acquisition",
          title: "고객 유치 프로그램",
          description: "신규 고객 확보를 위한 다양한 프로그램을 운영합니다.",
          duration: "4-6주",
          priority: "높음",
          status: "ready",
          tasks: [
            "오픈 이벤트 기획 및 실행",
            "할인 쿠폰 및 프로모션 제작",
            "추천인 프로그램 도입",
            "지역 커뮤니티 참여",
          ],
          expectedResult: "초기 고객층 확보",
          investment: "중간",
          roi: "높음",
        },
        {
          id: "operational-efficiency",
          title: "운영 효율성 개선",
          description:
            "비용 절감과 서비스 품질 향상을 위한 시스템을 구축합니다.",
          duration: "2-3주",
          priority: "중간",
          status: "ready",
          tasks: [
            "재고 관리 시스템 도입",
            "직원 교육 프로그램 운영",
            "비용 구조 최적화",
            "품질 관리 체계 구축",
          ],
          expectedResult: "운영 효율성 20% 향상",
          investment: "낮음",
          roi: "중간",
        },
      ],
      longTerm: [
        {
          id: "business-expansion",
          title: "사업 확장 전략",
          description:
            "성공적인 초기 운영 후 사업 확장을 위한 전략을 수립합니다.",
          duration: "3-6개월",
          priority: "중간",
          status: "ready",
          tasks: [
            "프랜차이즈 모델 개발",
            "신규 지점 입지 선정",
            "투자 유치 계획 수립",
            "파트너십 구축",
          ],
          expectedResult: "사업 확장 로드맵 완성",
          investment: "높음",
          roi: "높음",
        },
        {
          id: "technology-innovation",
          title: "기술 혁신 도입",
          description: "디지털 기술을 활용한 서비스 혁신을 추진합니다.",
          duration: "6-12개월",
          priority: "낮음",
          status: "ready",
          tasks: [
            "모바일 앱 개발",
            "AI 기반 고객 서비스 도입",
            "자동화 시스템 구축",
            "데이터 분석 플랫폼 구축",
          ],
          expectedResult: "디지털 전환 완료",
          investment: "높음",
          roi: "중간",
        },
      ],
    };
  };

  const strategies = getExecutionStrategies();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ready":
        return <span className={styles.statusIcon}>시작</span>;
      case "in-progress":
        return <span className={styles.statusIcon}>진행중</span>;
      case "completed":
        return <span className={styles.statusIcon}>완료</span>;
      default:
        return <span className={styles.statusIcon}>시작</span>;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "높음":
        return "#ff4757";
      case "중간":
        return "#ffa502";
      case "낮음":
        return "#2ed573";
      default:
        return "#747d8c";
    }
  };

  return (
    <div className={styles.executionStrategyPanel}>
      <div className={styles.panelHeader}>
        <h2 className={styles.panelTitle}>실행 전략</h2>
        <p className={styles.panelSubtitle}>
          단계별로 실행 가능한 구체적인 전략을 제시합니다
        </p>
      </div>

      <div className={styles.strategyTabs}>
        <button
          className={`${styles.tab} ${
            activeStrategy === "immediate" ? styles.active : ""
          }`}
          onClick={() => setActiveStrategy("immediate")}
        >
          즉시 실행 (1개월)
        </button>
        <button
          className={`${styles.tab} ${
            activeStrategy === "shortTerm" ? styles.active : ""
          }`}
          onClick={() => setActiveStrategy("shortTerm")}
        >
          단기 전략 (3개월)
        </button>
        <button
          className={`${styles.tab} ${
            activeStrategy === "longTerm" ? styles.active : ""
          }`}
          onClick={() => setActiveStrategy("longTerm")}
        >
          장기 전략 (1년)
        </button>
      </div>

      <div className={styles.strategyContent}>
        {activeStrategy === "immediate" && (
          <div className={styles.strategySection}>
            <h3 className={styles.sectionTitle}>즉시 실행 가능한 전략</h3>
            <p className={styles.sectionDescription}>
              사업 시작과 동시에 바로 실행할 수 있는 핵심 전략들입니다.
            </p>
            <div className={styles.strategyCards}>
              {strategies.immediate.map((strategy) => (
                <div key={strategy.id} className={styles.strategyCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      {getStatusIcon(strategy.status)}
                      <h4>{strategy.title}</h4>
                    </div>
                    <div className={styles.cardMeta}>
                      <span
                        className={styles.priority}
                        style={{ color: getPriorityColor(strategy.priority) }}
                      >
                        {strategy.priority}
                      </span>
                      <span className={styles.duration}>
                        {strategy.duration}
                      </span>
                    </div>
                  </div>
                  <p className={styles.cardDescription}>
                    {strategy.description}
                  </p>
                  <div className={styles.cardDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>예상 결과:</span>
                      <span className={styles.detailValue}>
                        {strategy.expectedResult}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>투자 수준:</span>
                      <span className={styles.detailValue}>
                        {strategy.investment}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>ROI:</span>
                      <span className={styles.detailValue}>{strategy.roi}</span>
                    </div>
                  </div>
                  <div className={styles.taskList}>
                    <h5>주요 작업:</h5>
                    <ul>
                      {strategy.tasks.map((task, index) => (
                        <li key={index}>{task}</li>
                      ))}
                    </ul>
                  </div>
                  <button className={styles.executeButton}>실행 시작</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStrategy === "shortTerm" && (
          <div className={styles.strategySection}>
            <h3 className={styles.sectionTitle}>단기 성장 전략</h3>
            <p className={styles.sectionDescription}>
              3개월 내에 시장에서 안정적인 위치를 확보하기 위한 전략들입니다.
            </p>
            <div className={styles.strategyCards}>
              {strategies.shortTerm.map((strategy) => (
                <div key={strategy.id} className={styles.strategyCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      {getStatusIcon(strategy.status)}
                      <h4>{strategy.title}</h4>
                    </div>
                    <div className={styles.cardMeta}>
                      <span
                        className={styles.priority}
                        style={{ color: getPriorityColor(strategy.priority) }}
                      >
                        {strategy.priority}
                      </span>
                      <span className={styles.duration}>
                        {strategy.duration}
                      </span>
                    </div>
                  </div>
                  <p className={styles.cardDescription}>
                    {strategy.description}
                  </p>
                  <div className={styles.cardDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>예상 결과:</span>
                      <span className={styles.detailValue}>
                        {strategy.expectedResult}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>투자 수준:</span>
                      <span className={styles.detailValue}>
                        {strategy.investment}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>ROI:</span>
                      <span className={styles.detailValue}>{strategy.roi}</span>
                    </div>
                  </div>
                  <div className={styles.taskList}>
                    <h5>주요 작업:</h5>
                    <ul>
                      {strategy.tasks.map((task, index) => (
                        <li key={index}>{task}</li>
                      ))}
                    </ul>
                  </div>
                  <button className={styles.executeButton}>실행 시작</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeStrategy === "longTerm" && (
          <div className={styles.strategySection}>
            <h3 className={styles.sectionTitle}>장기 성장 전략</h3>
            <p className={styles.sectionDescription}>
              1년 후 사업 확장과 지속적인 성장을 위한 전략들입니다.
            </p>
            <div className={styles.strategyCards}>
              {strategies.longTerm.map((strategy) => (
                <div key={strategy.id} className={styles.strategyCard}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardTitle}>
                      {getStatusIcon(strategy.status)}
                      <h4>{strategy.title}</h4>
                    </div>
                    <div className={styles.cardMeta}>
                      <span
                        className={styles.priority}
                        style={{ color: getPriorityColor(strategy.priority) }}
                      >
                        {strategy.priority}
                      </span>
                      <span className={styles.duration}>
                        {strategy.duration}
                      </span>
                    </div>
                  </div>
                  <p className={styles.cardDescription}>
                    {strategy.description}
                  </p>
                  <div className={styles.cardDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>예상 결과:</span>
                      <span className={styles.detailValue}>
                        {strategy.expectedResult}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>투자 수준:</span>
                      <span className={styles.detailValue}>
                        {strategy.investment}
                      </span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>ROI:</span>
                      <span className={styles.detailValue}>{strategy.roi}</span>
                    </div>
                  </div>
                  <div className={styles.taskList}>
                    <h5>주요 작업:</h5>
                    <ul>
                      {strategy.tasks.map((task, index) => (
                        <li key={index}>{task}</li>
                      ))}
                    </ul>
                  </div>
                  <button className={styles.executeButton}>실행 시작</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExecutionStrategyPanel;
