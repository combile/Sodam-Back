import React, { useEffect, useMemo, useState } from 'react';
import styles from './SplashScreen.module.css';

type SplashScreenProps = {
  onDone?: () => void;
  duration?: number;
  text?: string;
  subtitle?: string;
};

const SplashScreen: React.FC<SplashScreenProps> = ({
  onDone,
  duration = 4000,
  text = '소담',
  subtitle = '당신의 이야기를 담아드립니다',
}) => {
  const [showOnce, setShowOnce] = useState(false);           // 등장 1회용
  const [themeLight, setThemeLight] = useState(false);       // 색상/배경 전환용 (텍스트 클래스 건드리지 않음)

  // ✅ 렌더마다 새 배열 만들지 않도록 메모
  const characters = useMemo(() => text.split(''), [text]);
  const delays = useMemo(() => characters.map((_, i) => i * 100), [characters]);

  useEffect(() => {
    const textTimer = setTimeout(() => setShowOnce(true), 500);

    // 배경 + 색상 전환: 래퍼 data-attribute만 바꿈
    const themeAt = Math.max(900, Math.floor(duration * 0.55));
    const themeTimer = setTimeout(() => setThemeLight(true), themeAt);

    const doneTimer = setTimeout(() => onDone?.(), duration);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(themeTimer);
      clearTimeout(doneTimer);
    };
  }, [duration, onDone]);

  return (
    <div
      className={styles.wrap}
      data-theme={themeLight ? 'light' : 'dark'}  // ✅ 텍스트는 건드리지 않고 래퍼만
      role="status"
      aria-live="polite"
    >
      <div className={styles.container}>
        <h1 className={styles.title}>
          {characters.map((char, index) => (
            <span
              key={index}
              className={[
                styles.character,
                showOnce && styles.reveal,  // ✅ 등장(타이핑/슬라이드)은 1회만
              ].filter(Boolean).join(' ')}
              style={{
                // 등장 시에만 지연 적용, 이후에도 값은 변해도 animation은 다시 선언되지 않음
                transitionDelay: showOnce ? `${delays[index]}ms` : '0ms',
                animationDelay: showOnce ? `${index * 0.1}s` : '0s',
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        <div className={[styles.subtitle, showOnce && styles.subtitleReveal].filter(Boolean).join(' ')}>
          {subtitle}
        </div>

        <div className={[styles.loadingContainer, showOnce && styles.loadingShow].filter(Boolean).join(' ')}>
          <div className={styles.dots}>
            <div className={styles.dot} />
            <div className={styles.dot} />
            <div className={styles.dot} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
