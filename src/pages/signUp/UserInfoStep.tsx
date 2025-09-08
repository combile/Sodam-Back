import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSignup } from "../../contexts/SignupContext.tsx";
import commonStyles from "./styles/Common.module.css";
import formStyles from "./styles/FormInput.module.css";

const UserInfoStep = ({ onNext }: { onNext: () => void }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { updateSignupData } = useSignup();

  const isUsernameValid = username.length >= 4;
  const isEmailValid = email.includes("@") && email.includes(".");
  const isFormValid = isUsernameValid && isEmailValid && name.length > 0;

  const handleNext = () => {
    updateSignupData({ email, name });
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
            isUsernameValid ? formStyles.valid : ""
          }`}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="아이디 입력"
        />
        {isUsernameValid && (
          <p className={formStyles.validMessage}>사용 가능한 아이디입니다.</p>
        )}

        <label className={formStyles.label}>이메일</label>
        <input
          className={`${formStyles.input} ${
            !isEmailValid ? formStyles.invalid : ""
          }`}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@sodam.com"
        />
        {!isEmailValid && (
          <p className={formStyles.errorMessage}>이미 존재하는 이메일입니다.</p>
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
