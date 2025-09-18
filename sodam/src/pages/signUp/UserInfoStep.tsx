import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSignup } from "../../contexts/SignupContext.tsx";
import { authAPI } from "../../api/auth.ts";
import commonStyles from "./styles/Common.module.css";
import formStyles from "./styles/FormInput.module.css";

const UserInfoStep = ({ onNext }: { onNext: () => void }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [usernameStatus, setUsernameStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: "" });
  const [emailStatus, setEmailStatus] = useState<{
    checking: boolean;
    available: boolean | null;
    message: string;
  }>({ checking: false, available: null, message: "" });
  const { updateSignupData } = useSignup();

  // 디바운스된 아이디 중복 검사
  const checkUsername = useCallback(async (username: string) => {
    if (username.length < 3) {
      setUsernameStatus({
        checking: false,
        available: null,
        message: "아이디는 3자 이상이어야 합니다.",
      });
      return;
    }

    setUsernameStatus({
      checking: true,
      available: null,
      message: "확인 중...",
    });

    try {
      const response = await authAPI.checkUsername(username);
      setUsernameStatus({
        checking: false,
        available: response.data.available,
        message: response.data.message,
      });
    } catch (error: any) {
      setUsernameStatus({
        checking: false,
        available: false,
        message:
          error.response?.data?.error?.message ||
          "아이디 확인 중 오류가 발생했습니다.",
      });
    }
  }, []);

  // 디바운스된 이메일 중복 검사
  const checkEmail = useCallback(async (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setEmailStatus({
        checking: false,
        available: null,
        message: "올바른 이메일 형식이 아닙니다.",
      });
      return;
    }

    setEmailStatus({ checking: true, available: null, message: "확인 중..." });

    try {
      const response = await authAPI.checkEmail(email);
      setEmailStatus({
        checking: false,
        available: response.data.available,
        message: response.data.message,
      });
    } catch (error: any) {
      setEmailStatus({
        checking: false,
        available: false,
        message:
          error.response?.data?.error?.message ||
          "이메일 확인 중 오류가 발생했습니다.",
      });
    }
  }, []);

  // 아이디 입력 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      if (username) {
        checkUsername(username);
      } else {
        setUsernameStatus({ checking: false, available: null, message: "" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [username, checkUsername]);

  // 이메일 입력 디바운스
  useEffect(() => {
    const timer = setTimeout(() => {
      if (email) {
        checkEmail(email);
      } else {
        setEmailStatus({ checking: false, available: null, message: "" });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [email, checkEmail]);

  const isUsernameValid = usernameStatus.available === true;
  const isEmailValid = emailStatus.available === true;
  const isFormValid = isUsernameValid && isEmailValid && name.length > 0;

  const handleNext = () => {
    updateSignupData({ username, email, name });
    onNext();
  };

  return (
    <div className={commonStyles.signupWrapper}>
      <div className={`${commonStyles.loginDeco} ${commonStyles.circle1}`} />
      <div className={`${commonStyles.loginDeco} ${commonStyles.circle2}`} />

      <h2 className={commonStyles.title}>
        소상공인을 담다, <span>소담</span>
      </h2>
      <p className={commonStyles.subtitle}>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>

      <div className={commonStyles.card}>
        <h3 className={commonStyles.stepTitle}>
          서비스 이용을 위한 <br /> 정보를 입력해주세요
        </h3>

        <label className={formStyles.label}>아이디</label>
        <input
          className={`${formStyles.input} ${
            usernameStatus.available === true
              ? formStyles.valid
              : usernameStatus.available === false
              ? formStyles.invalid
              : ""
          }`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디 입력 (3-20자)"
        />
        {usernameStatus.message && (
          <p
            className={
              usernameStatus.available === true
                ? formStyles.validMessage
                : usernameStatus.available === false
                ? formStyles.errorMessage
                : formStyles.helperText
            }
          >
            {usernameStatus.checking ? "⏳ " : ""}
            {usernameStatus.message}
          </p>
        )}

        <label className={formStyles.label}>이메일</label>
        <input
          className={`${formStyles.input} ${
            emailStatus.available === true
              ? formStyles.valid
              : emailStatus.available === false
              ? formStyles.invalid
              : ""
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@sodam.com"
        />
        {emailStatus.message && (
          <p
            className={
              emailStatus.available === true
                ? formStyles.validMessage
                : emailStatus.available === false
                ? formStyles.errorMessage
                : formStyles.helperText
            }
          >
            {emailStatus.checking ? "⏳ " : ""}
            {emailStatus.message}
          </p>
        )}

        <label className={formStyles.label}>이름</label>
        <input
          className={formStyles.input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름 입력"
        />
      </div>

      <button
        className={commonStyles.nextButton}
        onClick={handleNext}
        disabled={!isFormValid}
      >
        다음
      </button>
    </div>
  );
};

export default UserInfoStep;
