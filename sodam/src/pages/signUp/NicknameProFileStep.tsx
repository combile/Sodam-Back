import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSignup } from "../../contexts/SignupContext.tsx";
import commonStyles from "./styles/Common.module.css";
import formStyles from "./styles/FormInput.module.css";
import profileStyles from "./styles/ProfileUpload.module.css";

const NicknameProfileStep = ({ onNext }: { onNext: () => void }) => {
  const [nickname, setNickname] = useState("");
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateSignupData, submitSignup, loading, error } = useSignup();
  const navigate = useNavigate();

  const isNicknameValid = nickname.length >= 2 && nickname.length <= 10;
  const isFormValid = isNicknameValid;

  const handleImageUpload = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleImageUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleImageUpload(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const removeImage = () => {
    setProfileImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async () => {
    // 닉네임과 프로필 이미지 정보를 컨텍스트에 저장
    updateSignupData({ nickname, profileImage });

    // 회원가입 API 호출
    const success = await submitSignup();
    if (success) {
      onNext(); // 성공 시 다음 단계로
    }
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
          나만의 프로필을 <br /> 만들어보세요
        </h3>

        <div className={profileStyles.profileSection}>
          <div
            className={`${profileStyles.profileImageContainer} ${
              isDragging ? profileStyles.dragging : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
          >
            {profileImage ? (
              <div className={profileStyles.profileImageWrapper}>
                <img
                  src={profileImage}
                  alt="프로필"
                  className={profileStyles.profileImage}
                />
                <button
                  className={profileStyles.removeImageBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className={profileStyles.profilePlaceholder}>
                <p className={profileStyles.uploadText}>프로필 사진</p>
                <span className={profileStyles.optionalText}>(선택사항)</span>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className={profileStyles.hiddenInput}
          />
        </div>

        <label className={formStyles.label}>닉네임</label>
        <input
          className={`${formStyles.input} ${
            isNicknameValid
              ? formStyles.valid
              : nickname.length > 0
              ? formStyles.invalid
              : ""
          }`}
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="2-10자 사이로 입력해주세요"
          maxLength={10}
        />

        {nickname.length > 0 && (
          <div className={profileStyles.nicknameStatus}>
            {isNicknameValid ? (
              <p className={formStyles.validMessage}>
                사용 가능한 닉네임입니다
              </p>
            ) : (
              <p className={formStyles.errorMessage}>
                {nickname.length < 2
                  ? "너무 짧습니다 (최소 2자)"
                  : "너무 깁니다 (최대 10자)"}
              </p>
            )}
          </div>
        )}

        <p className={formStyles.helperText}>
          닉네임은 다른 사용자에게 표시되는 이름입니다
        </p>

        {error && <div className={formStyles.errorMessage}>{error}</div>}
      </div>

      <button
        className={commonStyles.nextButton}
        onClick={handleSubmit}
        disabled={!isFormValid || loading}
      >
        {loading ? "회원가입 중..." : "완료"}
      </button>
    </div>
  );
};

export default NicknameProfileStep;
