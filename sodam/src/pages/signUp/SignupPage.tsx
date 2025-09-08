import React, { useState } from "react";
import AgreementStep from "./AgreementStep.tsx";
import UserInfoStep from "./UserInfoStep.tsx";
import PasswordStep from "./PasswordStep.tsx";
import NicknameProfileStep from "./NicknameProFileStep.tsx";
import SignupCompleteStep from "./SignupCompleteStep.tsx";
import { SignupProvider } from "../../contexts/SignupContext.tsx";
import pageStyles from "./styles/SignupPage.module.css";

const SignupPage = () => {
  const [step, setStep] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = (nextStep: number) => {
    setIsAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setIsAnimating(false);
    }, 300);
  };

  const getProgressWidth = () => {
    const totalSteps = 4;
    const currentProgress = step > totalSteps ? totalSteps : step;
    return `${(currentProgress / totalSteps) * 100}%`;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <AgreementStep onNext={() => handleNext(2)} />;
      case 2:
        return <UserInfoStep onNext={() => handleNext(3)} />;
      case 3:
        return <PasswordStep onNext={() => handleNext(4)} />;
      case 4:
        return <NicknameProfileStep onNext={() => handleNext(5)} />;
      case 5:
        return <SignupCompleteStep />;
      default:
        return <AgreementStep onNext={() => handleNext(2)} />;
    }
  };

  return (
    <SignupProvider>
      <div className={pageStyles.signupContainer}>
        {step < 5 && (
          <div className={pageStyles.progressBar}>
            <div
              className={pageStyles.progressFill}
              style={{ width: getProgressWidth() }}
            />
          </div>
        )}

        <div
          className={`${pageStyles.stepContainer} ${
            isAnimating ? pageStyles.slideOut : pageStyles.slideIn
          }`}
        >
          {renderStep()}
        </div>

        {step < 5 && (
          <div className={pageStyles.stepIndicator}>
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`${pageStyles.indicator} ${
                  step >= stepNum ? pageStyles.activeIndicator : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </SignupProvider>
  );
};

export default SignupPage;
