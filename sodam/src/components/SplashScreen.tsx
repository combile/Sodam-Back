import React, { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

type SplashScreenProps = {
  onDone?: () => void;
  duration?: number;
};

const SplashScreen: React.FC<SplashScreenProps> = ({
  onDone,
  duration = 3000,
}) => {
  const [showText, setShowText] = useState(false);
  const [lightTheme, setLightTheme] = useState(false);
  const [textStep] = useState(0); // 0: 당신만을 위한, 1: 소담, 2: 소상공인을 담다
  const [showParticles, setShowParticles] = useState(false);
  const [expandBackground, setExpandBackground] = useState(false);

  useEffect(() => {
    // 0단계: 배경 확장 애니메이션 시작
    const expandTimer = setTimeout(() => setExpandBackground(true), 50);

    const particleTimer = setTimeout(() => setShowParticles(true), 500);
    const firstTextTimer = setTimeout(() => setShowText(true), 0);

    // 5단계: 테마 전환 (어두움 -> 밝음)
    const themeTimer = setTimeout(() => setLightTheme(true), duration * 0.02);

    // 6단계: 완료 콜백
    const doneTimer = setTimeout(() => onDone?.(), duration * 0.25);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(particleTimer);
      clearTimeout(firstTextTimer);
      clearTimeout(themeTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onDone]);

  return (
    <div
      className={styles.wrapper}
      data-theme={lightTheme ? "light" : "dark"}
      role="status"
      aria-live="polite"
    >
      {/* 배경 원형 확장 애니메이션 */}
      <div
        className={`${styles.backgroundCircle} ${
          expandBackground ? styles.expand : ""
        }`}
      />

      {/* 파티클 효과 */}
      {showParticles && (
        <div className={styles.particles}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className={styles.particle}
              style={
                {
                  animationDelay: `${i * 0.1}s`,
                  "--angle": `${i * 30}deg`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* 그라데이션 오버레이 */}
      <div className={styles.gradientOverlay} />

      <div className={styles.container}>
        {textStep === 0 && (
          // 첫 번째 단계: "당신만을 위한"
          <div className={styles.titleWrapper}>
            <h1
              className={`${styles.title} ${styles.subtitle} ${
                showText ? styles.show : ""
              }`}
            >
              당신만을 위한
            </h1>
          </div>
        )}
      </div>
    </div>
  );
};

export default SplashScreen;
