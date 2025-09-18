import React from "react";
import styles from "./LevelProgress.module.css";

interface LevelInfo {
  currentLevel: number;
  currentExperience: number;
  currentLevelExp: number;
  nextLevelExp: number;
  progress: number;
  expToNextLevel: number;
}

interface LevelProgressProps {
  levelInfo: LevelInfo;
  showDetails?: boolean;
  size?: "small" | "medium" | "large";
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  levelInfo,
  showDetails = true,
  size = "medium",
}) => {
  const getLevelTitle = (level: number) => {
    if (level < 5) return "초보 사장님";
    if (level < 10) return "성장 사장님";
    if (level < 15) return "경험 사장님";
    if (level < 20) return "전문 사장님";
    return "마스터 사장님";
  };

  const getLevelColor = (level: number) => {
    if (level < 5) return "#4CAF50"; // 초록색
    if (level < 10) return "#2196F3"; // 파란색
    if (level < 15) return "#FF9800"; // 주황색
    if (level < 20) return "#9C27B0"; // 보라색
    return "#F44336"; // 빨간색
  };

  const levelTitle = getLevelTitle(levelInfo.currentLevel);
  const levelColor = getLevelColor(levelInfo.currentLevel);

  return (
    <div className={`${styles.levelProgress} ${styles[size]}`}>
      <div className={styles.levelHeader}>
        <div className={styles.levelInfo}>
          <span className={styles.levelNumber} style={{ color: levelColor }}>
            LV.{levelInfo.currentLevel}
          </span>
          <span className={styles.levelTitle}>{levelTitle}</span>
        </div>
        {showDetails && (
          <div className={styles.expInfo}>
            <span className={styles.currentExp}>
              {levelInfo.currentExperience}
            </span>
            <span className={styles.expSeparator}>/</span>
            <span className={styles.nextExp}>{levelInfo.nextLevelExp}</span>
            <span className={styles.expLabel}>EXP</span>
          </div>
        )}
      </div>

      <div className={styles.progressContainer}>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{
              width: `${levelInfo.progress}%`,
              backgroundColor: levelColor,
            }}
          />
        </div>
        {showDetails && (
          <div className={styles.progressText}>
            <span>{Math.round(levelInfo.progress)}%</span>
            <span className={styles.expToNext}>
              ({levelInfo.expToNextLevel} EXP to next level)
            </span>
          </div>
        )}
      </div>

      {showDetails && (
        <div className={styles.levelStats}>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>현재 레벨</span>
            <span className={styles.statValue} style={{ color: levelColor }}>
              {levelInfo.currentLevel}
            </span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statLabel}>다음 레벨까지</span>
            <span className={styles.statValue}>
              {levelInfo.expToNextLevel} EXP
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelProgress;

