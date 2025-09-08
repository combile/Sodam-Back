import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useSignup } from "../../contexts/SignupContext.tsx";
import commonStyles from "./styles/Common.module.css";
import formStyles from "./styles/FormInput.module.css";

const PasswordStep = ({ onNext }: { onNext: () => void }) => {
  const [password, setPassword] = useState("");
  const { updateSignupData } = useSignup();

  const isValidPassword = (pw: string) => {
    const hasMinLength = pw.length >= 8;
    const checks = [/[a-zA-Z]/, /[0-9]/, /[^a-zA-Z0-9]/];
    const passed = checks.filter((regex) => regex.test(pw)).length;
    return hasMinLength && passed >= 2;
  };

  const isValid = isValidPassword(password);

  const handleNext = () => {
    updateSignupData({ password });
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
          서비스 이용을 위해 <br /> 비밀번호를 설정해주세요
        </h3>

        <input
          type="password"
          className={`${formStyles.input} ${isValid ? formStyles.valid : ""}`}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
        />
        <p className={formStyles.helperText}>
          8자리 이상, 문자·숫자·특수문자 중 2가지 이상 포함
        </p>
      </div>

      <button
        className={commonStyles.nextButton}
        onClick={handleNext}
        disabled={!isValid}
      >
        다음
      </button>
    </div>
  );
};

export default PasswordStep;
