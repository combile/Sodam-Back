import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import { authAPI } from "../api/auth.ts";

import kakaoIcon from "../assets/icon-kakao.svg";
import naverIcon from "../assets/icon-naver.svg";

const Login = () => {
  const [username, setUsername] = useState(""); // 아이디로 변경
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await authAPI.login({ username, password });
      authAPI.saveToken(response.data.accessToken, response.data.user);
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error?.message || "로그인에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={`${styles.loginDeco} ${styles.circle1}`}></div>
      <div className={`${styles.loginDeco} ${styles.circle2}`}></div>

      <div className={styles.container}>
        <h2 className={styles.title}>
          소상공인을 담다, <span>소담</span>
        </h2>
        <p className={styles.signup}>
          계정이 없으신가요? <Link to="/signup">회원가입</Link>
        </p>

        <button className={styles.kakaoLogin}>
          <img src={kakaoIcon} alt="카카오" />
          카카오로 시작하기
        </button>

        <button className={styles.naverLogin}>
          <img src={naverIcon} alt="네이버" />
          네이버로 로그인
        </button>

        <div className={styles.separator}>또는</div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <input
          type="text"
          placeholder="아이디를 입력해주세요"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          disabled={loading}
        />
        <input
          type="password"
          placeholder="비밀번호를 입력해주세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          disabled={loading}
        />

        <button
          className={styles.loginButton}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? "로그인 중..." : "로그인"}
        </button>

        <Link to="/forgot" className={styles.forgotPassword}>
          비밀번호를 잊으셨나요 ?
        </Link>
      </div>
    </div>
  );
};

export default Login;
