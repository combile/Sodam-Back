import React, { useState } from "react";
import {
  Close,
  Campaign,
  EmojiEvents,
  Settings,
  Lightbulb,
  ShoppingCart,
  People,
  Assignment,
  Check,
  TipsAndUpdates,
  TrendingUp,
} from "@mui/icons-material";
import styles from "./StrategyCardsPanel.module.css";

interface StrategyCard {
  id: string;
  category: string;
  title: string;
  description: string;
  difficulty: string;
  estimated_time: string;
  success_rate: string;
  checklist: string[];
  tips: string[];
}

interface StrategyCardsPanelProps {
  strategyCards: StrategyCard[];
  riskType?: string;
  marketName?: string;
}

const StrategyCardsPanel: React.FC<StrategyCardsPanelProps> = ({
  strategyCards,
  riskType,
  marketName,
}) => {
  const [selectedCard, setSelectedCard] = useState<StrategyCard | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      낮음: "#28a745",
      중간: "#ffc107",
      높음: "#fd7e14",
      "매우 높음": "#dc3545",
    };
    return colors[difficulty as keyof typeof colors] || "#666";
  };

  const getCategoryIcon = (category: string) => {
    const icons = {
      마케팅: <Campaign style={{ fontSize: "18px" }} />,
      경쟁력: <EmojiEvents style={{ fontSize: "18px" }} />,
      운영: <Settings style={{ fontSize: "18px" }} />,
      혁신: <Lightbulb style={{ fontSize: "18px" }} />,
      채널: <ShoppingCart style={{ fontSize: "18px" }} />,
      고객관리: <People style={{ fontSize: "18px" }} />,
      매출증대: <TrendingUp style={{ fontSize: "18px" }} />,
      고객유치: <People style={{ fontSize: "18px" }} />,
      브랜딩: <EmojiEvents style={{ fontSize: "18px" }} />,
      디지털화: <Settings style={{ fontSize: "18px" }} />,
    };
    return (
      icons[category as keyof typeof icons] || (
        <Assignment style={{ fontSize: "18px" }} />
      )
    );
  };

  const toggleCardExpansion = (cardId: string) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(cardId)) {
      newExpanded.delete(cardId);
    } else {
      newExpanded.add(cardId);
    }
    setExpandedCards(newExpanded);
  };

  const handleCardClick = (card: StrategyCard) => {
    setSelectedCard(card);
  };

  const closeModal = () => {
    setSelectedCard(null);
  };

  return (
    <div className={styles.strategyCardsPanel}>
      <div className={styles.header}>
        <h3 className={styles.title}>맞춤형 전략 카드</h3>
        <div className={styles.contextInfo}>
          {marketName && (
            <span className={styles.marketName}>{marketName}</span>
          )}
          {riskType && <span className={styles.riskType}>{riskType}</span>}
        </div>
      </div>

      <div className={styles.cardsGrid}>
        {strategyCards.map((card) => (
          <div
            key={card.id}
            className={`${styles.strategyCard} ${
              expandedCards.has(card.id) ? styles.expanded : ""
            }`}
            onClick={() => handleCardClick(card)}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardCategory}>
                <span className={styles.categoryIcon}>
                  {getCategoryIcon(card.category)}
                </span>
                <span className={styles.categoryName}>{card.category}</span>
              </div>
              <div className={styles.cardDifficulty}>
                <span
                  className={styles.difficultyBadge}
                  style={{
                    backgroundColor: getDifficultyColor(card.difficulty),
                  }}
                >
                  {card.difficulty}
                </span>
              </div>
            </div>

            <div className={styles.cardContent}>
              <h4 className={styles.cardTitle}>{card.title}</h4>
              <p className={styles.cardDescription}>{card.description}</p>

              <div className={styles.cardMeta}>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>예상 기간</span>
                  <span className={styles.metaValue}>
                    {card.estimated_time}
                  </span>
                </div>
                <div className={styles.metaItem}>
                  <span className={styles.metaLabel}>성공률</span>
                  <span className={styles.metaValue}>{card.success_rate}</span>
                </div>
              </div>

              {expandedCards.has(card.id) && (
                <div className={styles.cardDetails}>
                  <div className={styles.checklist}>
                    <h5 className={styles.detailsTitle}>체크리스트</h5>
                    <ul className={styles.checklistList}>
                      {card.checklist.map((item, index) => (
                        <li key={index} className={styles.checklistItem}>
                          <span className={styles.checkIcon}>
                            <Check style={{ fontSize: "14px" }} />
                          </span>
                          <span className={styles.checkText}>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className={styles.tips}>
                    <h5 className={styles.detailsTitle}>실행 팁</h5>
                    <ul className={styles.tipsList}>
                      {card.tips.map((tip, index) => (
                        <li key={index} className={styles.tipItem}>
                          <span className={styles.tipIcon}>
                            <TipsAndUpdates style={{ fontSize: "14px" }} />
                          </span>
                          <span className={styles.tipText}>{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <button
                className={styles.expandButton}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCardExpansion(card.id);
                }}
              >
                {expandedCards.has(card.id) ? "접기" : "자세히 보기"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 모달 */}
      {selectedCard && (
        <div className={styles.modal} onClick={closeModal}>
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.modalHeader}>
              <h3 className={styles.modalTitle}>{selectedCard.title}</h3>
              <button className={styles.closeButton} onClick={closeModal}>
                <Close fontSize="small" />
              </button>
            </div>

            <div className={styles.modalBody}>
              <div className={styles.modalDescription}>
                {selectedCard.description}
              </div>

              <div className={styles.modalMeta}>
                <div className={styles.modalMetaItem}>
                  <span className={styles.modalMetaLabel}>카테고리</span>
                  <span className={styles.modalMetaValue}>
                    {selectedCard.category}
                  </span>
                </div>
                <div className={styles.modalMetaItem}>
                  <span className={styles.modalMetaLabel}>난이도</span>
                  <span
                    className={styles.modalMetaValue}
                    style={{
                      color: getDifficultyColor(selectedCard.difficulty),
                    }}
                  >
                    {selectedCard.difficulty}
                  </span>
                </div>
                <div className={styles.modalMetaItem}>
                  <span className={styles.modalMetaLabel}>예상 기간</span>
                  <span className={styles.modalMetaValue}>
                    {selectedCard.estimated_time}
                  </span>
                </div>
                <div className={styles.modalMetaItem}>
                  <span className={styles.modalMetaLabel}>성공률</span>
                  <span className={styles.modalMetaValue}>
                    {selectedCard.success_rate}
                  </span>
                </div>
              </div>

              <div className={styles.modalChecklist}>
                <h4 className={styles.modalSectionTitle}>체크리스트</h4>
                <ul className={styles.modalChecklistList}>
                  {selectedCard.checklist.map((item, index) => (
                    <li key={index} className={styles.modalChecklistItem}>
                      <span className={styles.modalCheckIcon}>
                        <Check style={{ fontSize: "16px" }} />
                      </span>
                      <span className={styles.modalCheckText}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.modalTips}>
                <h4 className={styles.modalSectionTitle}>실행 팁</h4>
                <ul className={styles.modalTipsList}>
                  {selectedCard.tips.map((tip, index) => (
                    <li key={index} className={styles.modalTipItem}>
                      <span className={styles.modalTipIcon}>
                        <TipsAndUpdates style={{ fontSize: "16px" }} />
                      </span>
                      <span className={styles.modalTipText}>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={styles.modalActions}>
                <button className={styles.actionButton}>지금 실행하기</button>
                <button className={styles.secondaryButton} onClick={closeModal}>
                  닫기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StrategyCardsPanel;
