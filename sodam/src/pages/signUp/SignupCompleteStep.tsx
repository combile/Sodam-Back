import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Check, RadioButtonUnchecked } from "@mui/icons-material";
import commonStyles from "./styles/Common.module.css";
import completeStyles from "./styles/SignupComplete.module.css";

const SignupCompleteStep = () => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const completionSteps = [
    "계정이 생성되었습니다",
    "프로필이 설정되었습니다",
    "환영합니다!",
  ];

  useEffect(() => {
    setShowConfetti(true);

    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < completionSteps.length - 1) {
          return prev + 1;
        }
        clearInterval(stepInterval);
        return prev;
      });
    }, 800);

    return () => clearInterval(stepInterval);
  }, [completionSteps.length]);

  return (
    <div className={commonStyles.signupCompleteWrapper}>
      <div
        className={`${commonStyles.loginDeco} ${commonStyles.circle1} ${completeStyles.celebrationFloat}`}
      />
      <div
        className={`${commonStyles.loginDeco} ${commonStyles.circle2} ${completeStyles.celebrationFloat}`}
      />

      {showConfetti && (
        <div className={completeStyles.confettiContainer}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={completeStyles.confetti}
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                backgroundColor: ["#7DDB69", "#579DB7", "#5FC24A", "#F4FFF1"][
                  Math.floor(Math.random() * 4)
                ],
              }}
            />
          ))}
        </div>
      )}

      <div className={completeStyles.completeContainer}>
        <div className={completeStyles.successIconContainer}>
          <div className={completeStyles.successIcon}>✓</div>
          <div className={completeStyles.successRipple}></div>
        </div>

        <h2 className={completeStyles.completeTitle}>
          회원가입이 <br />
          <span className={completeStyles.completeHighlight}>
            완료되었습니다!
          </span>
        </h2>

        <div className={completeStyles.completionSteps}>
          {completionSteps.map((step, index) => (
            <div
              key={index}
              className={`${completeStyles.completionStep} ${
                index <= currentStep ? completeStyles.completionStepActive : ""
              }`}
            >
              <div className={completeStyles.stepCheckmark}>
                {index <= currentStep ? <Check /> : <RadioButtonUnchecked />}
              </div>
              <span>{step}</span>
            </div>
          ))}
        </div>

        <div className={completeStyles.welcomeMessage}>
          <p className={completeStyles.welcomeText}>
            소상공인을 위한 든든한 동반자 <strong>소담</strong>에 오신 것을
            환영합니다!
          </p>
          <p className={completeStyles.welcomeSubText}>
            이제 다양한 서비스를 이용해보세요
          </p>
        </div>

        <div className={completeStyles.actionButtons}>
          <Link to="/" className={completeStyles.primaryButton}>
            서비스 시작하기
          </Link>
          <Link to="/mypage" className={completeStyles.secondaryButton}>
            프로필 수정하기
          </Link>
        </div>

        <div className={completeStyles.additionalInfo}>
          <p className={completeStyles.infoText}>
            궁금한 점이 있으시면{" "}
            <a href="/help" className={completeStyles.helpLink}>
              도움말
            </a>
            을 확인해보세요
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupCompleteStep;
