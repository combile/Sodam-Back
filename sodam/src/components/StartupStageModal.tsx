import React from "react";
import { ReactComponent as StartupIcon } from "../assets/home/Startup.svg";
import { ReactComponent as PlanningIcon } from "../assets/home/Planning.svg";
import styles from "./StartupStageModal.module.css";

interface StartupStageModalProps {
  onSelect: (stage: "STARTUP" | "PLANNING") => void;
  onClose?: () => void;
}

const StartupStageModal: React.FC<StartupStageModalProps> = ({
  onSelect,
  onClose,
}) => {
  const handleStartupSelect = () => {
    onSelect("STARTUP");
  };

  const handlePlanningSelect = () => {
    onSelect("PLANNING");
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.question}>
          <h1>당신은 어떤분인가요?</h1>
        </div>

        <div className={styles.cardContainer}>
          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.iconContainer}>
                <StartupIcon className={styles.icon} />
              </div>
              <div className={styles.textContainer}>
                <h2 className={styles.cardTitle}>오늘도 사장</h2>
                <p className={styles.cardDescription}>창업자</p>
              </div>
              <button
                className={styles.selectButton}
                onClick={handleStartupSelect}
              >
                선택하기
              </button>
            </div>
          </div>

          <div className={styles.card}>
            <div className={styles.cardContent}>
              <div className={styles.iconContainer}>
                <PlanningIcon className={styles.icon} />
              </div>
              <div className={styles.textContainer}>
                <h2 className={styles.cardTitle}>내일은 사장</h2>
                <p className={styles.cardDescription}>예비창업자</p>
              </div>
              <button
                className={styles.selectButton}
                onClick={handlePlanningSelect}
              >
                선택하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StartupStageModal;
