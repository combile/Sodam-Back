
import React from 'react';
import styles from './Footer.module.css';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.logo}>소담</div>
        <div className={styles.text}>
          © 2025 소담(SODAM). All rights reserved. <br />
          Designed & Developed by D-CODE Team (한밭대학교) <br />
          데이터 출처: 소상공인시장진흥공단, 통계청, BC카드 외
        </div>
      </div>
    </footer>
  );
};

export default Footer;
