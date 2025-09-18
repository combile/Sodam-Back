import React, { useState } from "react";
import { Icon } from "@iconify/react";
import { ArrowForward } from "@mui/icons-material";
import styles from "./sodam.module.css";

const SodamIntro: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqData = [
    {
      question: "데이터 신뢰성은 어떻게 보장되나요?",
      answer:
        "공공데이터포털과 공식 기관의 데이터를 기반으로 하며, 지속적인 검증을 통해 신뢰성을 확보합니다.",
    },
    {
      question: "어느 지역에서 사용할 수 있나요?",
      answer:
        "현재는 대전 지역을 중심으로 서비스를 제공하며, 점진적으로 전국으로 확대할 예정입니다.",
    },
    {
      question: "유료화 계획이 있나요?",
      answer:
        "기본 기능은 무료로 제공하며, 고급 분석 기능은 프리미엄 서비스로 제공할 예정입니다.",
    },
    {
      question: "개인정보는 어떻게 보호되나요?",
      answer:
        "개인정보보호법을 준수하며, 사용자의 개인정보는 암호화하여 안전하게 보관합니다.",
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className={styles.container}>
      {/* 0) Hero Section - 건드리지 않음 */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>"Sodam"</h1>
          <p className={styles.heroSubtitle}>
            소담은 상권을 진단하고, 문제를 파악해, 실행까지 연결하는 통합형
            앱·웹 플랫폼입니다
          </p>
        </div>
      </section>

      {/* 1) 소담 소개 - 현대적인 비대칭 레이아웃 */}
      <section className={styles.intro}>
        <div className={styles.sectionContent}>
          <div className={styles.introLayout}>
            <div className={styles.introLeft}>
              <div className={styles.sectionNumber}>01</div>
              <h2 className={styles.sectionTitle}>소담은 무엇인가요?</h2>
              <p className={styles.sectionSubtitle}>
                공공데이터 기반의 과학적 상권 분석으로 창업 성공률을 높입니다
              </p>
              <div className={styles.introDescription}>
                <p>
                  소담은 예비창업자와 소상공인을 위한 상권 분석 플랫폼입니다.
                  복잡한 데이터를 직관적인 카드형 UI로 제공하여, 사용자가 해석
                  부담 없이 빠른 의사결정을 할 수 있도록 돕습니다.
                </p>
              </div>
            </div>

            <div className={styles.introRight}>
              <div className={styles.featureShowcase}>
                <div className={styles.featureCardLarge}>
                  <div className={styles.featureIcon}>
                    <Icon icon="mdi:chart-line" className={styles.iconText} />
                  </div>
                  <h3>상권 진단</h3>
                  <p>
                    유동인구, 카드매출, 업종밀도, 창업·폐업, 체류시간, 건강점수
                  </p>
                </div>

                <div className={styles.featureCardSmall}>
                  <div className={styles.featureIcon}>
                    <Icon icon="mdi:alert-circle" className={styles.iconText} />
                  </div>
                  <h4>리스크 분석</h4>
                </div>

                <div className={styles.featureCardSmall}>
                  <div className={styles.featureIcon}>
                    <Icon icon="mdi:target" className={styles.iconText} />
                  </div>
                  <h4>맞춤 전략</h4>
                </div>

                <div className={styles.featureCardSmall}>
                  <div className={styles.featureIcon}>
                    <Icon
                      icon="mdi:rocket-launch"
                      className={styles.iconText}
                    />
                  </div>
                  <h4>실행 지원</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2) 개발 배경 - 인터랙티브한 통계 섹션 */}
      <section className={styles.background}>
        <div className={styles.sectionContent}>
          <div className={styles.backgroundHeader}>
            <div className={styles.sectionNumber}>02</div>
            <h2 className={styles.sectionTitle}>왜 소담을 만들었나요?</h2>
            <p className={styles.sectionSubtitle}>
              대한민국 창업 생존율 33.8%의 현실, 그리고 그 뒤에 숨겨진 진짜 문제
            </p>
          </div>

          <div className={styles.statsHero}>
            <div className={styles.statHero}>
              <div className={styles.statNumberLarge}>
                33.8<span className={styles.statUnit}>%</span>
              </div>
              <div className={styles.statLabelLarge}>5년 생존율</div>
              <div className={styles.statDescriptionLarge}>
                신생 기업의 현실
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  64.8<span className={styles.statUnit}>%</span>
                </div>
                <div className={styles.statLabel}>1년 생존율</div>
                <div className={styles.statDescription}>창업 1년차 현실</div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statNumber}>
                  50<span className={styles.statUnit}>%</span>
                </div>
                <div className={styles.statLabel}>폐업률</div>
                <div className={styles.statDescription}>2025년 7월 기준</div>
              </div>
            </div>
          </div>

          <div className={styles.problemSection}>
            <div className={styles.problemHeader}>
              <h3>주요 문제점들</h3>
              <p>창업자들이 겪는 실제 어려움들</p>
            </div>

            <div className={styles.problemLayout}>
              <div className={styles.problemMain}>
                <div className={styles.problemItemLarge}>
                  <div className={styles.problemIcon}>
                    <Icon icon="mdi:chart-timeline-variant" />
                  </div>
                  <h4>데이터 과부하</h4>
                  <p>평균 15개 기관에서 데이터 수집해야 하는 복잡한 과정</p>
                  <div className={styles.problemHighlight}>15개 기관</div>
                </div>
              </div>

              <div className={styles.problemSide}>
                <div className={styles.problemItem}>
                  <div className={styles.problemIcon}>
                    <Icon icon="mdi:clock-outline" />
                  </div>
                  <h4>정보 분산</h4>
                  <p>평균 3-5일 정보 수집 시간</p>
                </div>

                <div className={styles.problemItem}>
                  <div className={styles.problemIcon}>
                    <Icon icon="mdi:close-circle" />
                  </div>
                  <h4>잘못된 판단</h4>
                  <p>80% 창업 실패율</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3) 서비스 배경 - 시각적 프로세스 플로우 */}
      <section className={styles.service}>
        <div className={styles.sectionContent}>
          <div className={styles.serviceHeader}>
            <div className={styles.sectionNumber}>03</div>
            <h2 className={styles.sectionTitle}>소담은 어떻게 작동하나요?</h2>
            <p className={styles.sectionSubtitle}>
              간단한 3단계 프로세스로 복잡한 상권 분석을 쉽게
            </p>
          </div>

          <div className={styles.processVisual}>
            <div className={styles.processStep}>
              <div className={styles.stepVisual}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepIcon}>
                  <Icon icon="mdi:chart-box" />
                </div>
              </div>
              <h3>분석</h3>
              <p>상권 데이터 종합 분석</p>
            </div>

            <div className={styles.processConnector}>
              <div className={styles.connectorLine}></div>
              <div className={styles.connectorArrow}>
                <Icon icon="mdi:arrow-right" />
              </div>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepVisual}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepIcon}>
                  <Icon icon="mdi:lightbulb" />
                </div>
              </div>
              <h3>전략 제안</h3>
              <p>맞춤형 전략 카드 제공</p>
            </div>

            <div className={styles.processConnector}>
              <div className={styles.connectorLine}></div>
              <div className={styles.connectorArrow}>
                <Icon icon="mdi:arrow-right" />
              </div>
            </div>

            <div className={styles.processStep}>
              <div className={styles.stepVisual}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepIcon}>
                  <Icon icon="mdi:rocket-launch" />
                </div>
              </div>
              <h3>실행</h3>
              <p>구체적 실행 방안 제시</p>
            </div>
          </div>

          <div className={styles.dataSection}>
            <div className={styles.dataHeader}>
              <h3>신뢰할 수 있는 데이터 기반</h3>
              <p>공공기관과 민간기업의 검증된 데이터를 활용합니다</p>
            </div>

            <div className={styles.dataShowcase}>
              <div className={styles.dataCardMain}>
                <div className={styles.dataIcon}>
                  <Icon icon="mdi:office-building" />
                </div>
                <h4>소상공인시장진흥공단</h4>
                <p>상권정보(유형/매출/업종/유동인구)</p>
                <div className={styles.dataBadge}>주요 데이터</div>
              </div>

              <div className={styles.dataCardsSide}>
                <div className={styles.dataCard}>
                  <div className={styles.dataIcon}>
                    <Icon icon="mdi:chart-box" />
                  </div>
                  <h4>통계청·통신사</h4>
                  <p>체류·이동 데이터</p>
                </div>

                <div className={styles.dataCard}>
                  <div className={styles.dataIcon}>
                    <Icon icon="mdi:credit-card" />
                  </div>
                  <h4>카드사</h4>
                  <p>연령대별 매출 데이터</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4) 팀 소개 - 인터랙티브한 팀 그리드 */}
      <section className={styles.team}>
        <div className={styles.sectionContent}>
          <div className={styles.teamHeader}>
            <div className={styles.sectionNumber}>04</div>
            <h2 className={styles.sectionTitle}>소담에는 누가있나요?</h2>
            <p className={styles.sectionSubtitle}>확실한 데이터로 승부합니다</p>
          </div>

          <div className={styles.teamShowcase}>
            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                <Icon icon="mdi:web" />
              </div>
              <h3>Frontend Web</h3>
              <p>React 기반 웹 플랫폼 개발</p>
              <div className={styles.memberSkills}>
                <span>React</span>
                <span>TypeScript</span>
                <span>CSS3</span>
              </div>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                <Icon icon="mdi:cellphone" />
              </div>
              <h3>iOS Developer</h3>
              <p>SwiftUI 기반 모바일 앱 개발</p>
              <div className={styles.memberSkills}>
                <span>SwiftUI</span>
                <span>iOS</span>
                <span>Xcode</span>
              </div>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                <Icon icon="mdi:cog" />
              </div>
              <h3>Backend Developer 1</h3>
              <p>API 및 데이터베이스 설계</p>
              <div className={styles.memberSkills}>
                <span>Flask</span>
                <span>Database</span>
                <span>API</span>
              </div>
            </div>

            <div className={styles.teamMember}>
              <div className={styles.memberAvatar}>
                <Icon icon="mdi:wrench" />
              </div>
              <h3>Backend Developer 2</h3>
              <p>시스템 아키텍처 및 인프라</p>
              <div className={styles.memberSkills}>
                <span>Architecture</span>
                <span>Infrastructure</span>
                <span>DevOps</span>
              </div>
            </div>
          </div>

          <div className={styles.workProcess}>
            <div className={styles.processHeader}>
              <h3>작업 방식</h3>
              <p>사용자 중심의 반복적 개선 프로세스</p>
            </div>

            <div className={styles.processTimeline}>
              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>
                  <Icon icon="mdi:account-group" />
                </div>
                <span className={styles.timelinePhase}>사용자 인터뷰</span>
              </div>

              <div className={styles.timelineConnector}>
                <div className={styles.connectorLine}></div>
                <div className={styles.connectorDot}></div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>
                  <Icon icon="mdi:palette" />
                </div>
                <span className={styles.timelinePhase}>프로토타입</span>
              </div>

              <div className={styles.timelineConnector}>
                <div className={styles.connectorLine}></div>
                <div className={styles.connectorDot}></div>
              </div>

              <div className={styles.timelineItem}>
                <div className={styles.timelineIcon}>
                  <Icon icon="mdi:test-tube" />
                </div>
                <span className={styles.timelinePhase}>파일럿 테스트</span>
                <span className={styles.timelineDesc}>(대전 지역부터)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5) 기대효과 섹션 */}
      <section className={styles.effect}>
        <div className={styles.sectionContent}>
          <div className={styles.effectHeader}>
            <div className={styles.sectionNumber}>05</div>
            <h2 className={styles.sectionTitle}>소담을 왜 사용해야하나요 ?</h2>
            <p className={styles.sectionSubtitle}>
              분석을 넘어 실행 중심의 설계로 창업 성공률 향상
            </p>
          </div>

          <div className={styles.effectHero}>
            <div className={styles.effectMain}>
              <div className={styles.effectCardLarge}>
                <div className={styles.effectIcon}>
                  <Icon icon="mdi:lightning-bolt" />
                </div>
                <h3>90% 시간 단축</h3>
                <p>
                  복잡한 데이터 수집 과정을 간소화하여 창업 준비 시간을 대폭
                  단축
                </p>
                <div className={styles.effectHighlight}>90%</div>
              </div>
            </div>

            <div className={styles.effectGrid}>
              <div className={styles.effectCard}>
                <div className={styles.effectIcon}>
                  <Icon icon="mdi:refresh" />
                </div>
                <h3>3단계 간편한 프로세스</h3>
                <p>
                  분석
                  <ArrowForward />
                  전략
                  <ArrowForward />
                  실행
                </p>
              </div>

              <div className={styles.effectCard}>
                <div className={styles.effectIcon}>
                  <Icon icon="mdi:target" />
                </div>
                <h3>실행 중심 UX</h3>
                <p>해석 부담 없이 판단과 실행에 집중</p>
              </div>
            </div>
          </div>

          <div className={styles.differentiation}>
            <div className={styles.diffContent}>
              <div className={styles.diffHeader}>
                <h3>"분석을 넘어 실행 중심의 설계"</h3>
                <p>카드형 UI와 지금 실행하기 버튼 중심의 직관적인 UX</p>
              </div>

              <div className={styles.diffFeatures}>
                <div className={styles.diffFeature}>
                  <Icon icon="mdi:cards" />
                  <span>카드형 UI</span>
                </div>
                <div className={styles.diffFeature}>
                  <Icon icon="mdi:play-circle" />
                  <span>실행 중심</span>
                </div>
                <div className={styles.diffFeature}>
                  <Icon icon="mdi:eye" />
                  <span>직관적 UX</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 마무리 블록들 */}
      <section className={styles.cta}>
        <div className={styles.sectionContent}>
          <div className={styles.ctaContent}>
            <h2>내 상권, 지금 진단하기</h2>
            <p>소담과 함께 창업 성공의 첫걸음을 시작하세요</p>
            <div className={styles.emailCapture}>
              <input
                type="email"
                placeholder="이메일을 입력하세요"
                className={styles.emailInput}
              />
              <button className={styles.ctaButton}>
                <Icon icon="mdi:rocket-launch" />
                진단 시작하기
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.faq}>
        <div className={styles.sectionContent}>
          <div className={styles.faqHeader}>
            <h2>자주 묻는 질문</h2>
            <p>소담에 대해 궁금한 점들을 확인해보세요</p>
          </div>

          <div className={styles.faqList}>
            {faqData.map((faq, index) => (
              <div
                key={index}
                className={`${styles.faqItem} ${
                  openFaq === index ? styles.faqOpen : ""
                }`}
              >
                <div
                  className={styles.faqQuestion}
                  onClick={() => toggleFaq(index)}
                >
                  <h3>{faq.question}</h3>
                  <span
                    className={`${styles.faqIcon} ${
                      openFaq === index ? styles.faqIconOpen : ""
                    }`}
                  >
                    {openFaq === index ? "−" : "+"}
                  </span>
                </div>
                <div className={styles.faqAnswer}>
                  <p>{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default SodamIntro;
