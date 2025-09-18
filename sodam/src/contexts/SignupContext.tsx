import React, { createContext, useContext, useState, ReactNode } from "react";
import { authAPI } from "../api/auth.ts";

interface SignupData {
  username: string; // 아이디 추가
  email: string;
  password: string;
  name: string;
  nickname?: string;
  profileImage?: string | null;
  userType?: string;
  businessStage?: string;
  phone?: string;
  interestedBusinessTypes?: string[];
  preferredAreas?: string[];
}

interface SignupContextType {
  signupData: SignupData;
  updateSignupData: (data: Partial<SignupData>) => void;
  submitSignup: () => Promise<boolean>;
  loading: boolean;
  error: string;
}

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export const useSignup = () => {
  const context = useContext(SignupContext);
  if (!context) {
    throw new Error("useSignup must be used within a SignupProvider");
  }
  return context;
};

interface SignupProviderProps {
  children: ReactNode;
}

export const SignupProvider: React.FC<SignupProviderProps> = ({ children }) => {
  const [signupData, setSignupData] = useState<SignupData>({
    username: "",
    email: "",
    password: "",
    name: "",
    nickname: "",
    profileImage: null,
    userType: "ENTREPRENEUR",
    businessStage: "",
    phone: "",
    interestedBusinessTypes: [],
    preferredAreas: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData((prev) => {
      const newData = { ...prev, ...data };

      // 닉네임이 입력되면 name 필드도 자동으로 설정 (name이 비어있을 때만)
      if (data.nickname && !newData.name) {
        newData.name = data.nickname;
      }

      return newData;
    });
  };

  const submitSignup = async (): Promise<boolean> => {
    setLoading(true);
    setError("");

    try {
      const registerData = {
        username: signupData.username,
        email: signupData.email,
        password: signupData.password,
        name: signupData.name,
        nickname: signupData.nickname,
        userType: signupData.userType,
        businessStage: signupData.businessStage,
        phone: signupData.phone,
        interestedBusinessTypes: signupData.interestedBusinessTypes,
        preferredAreas: signupData.preferredAreas,
        profileImage: signupData.profileImage,
      };

      console.log("회원가입 데이터:", registerData);

      const response = await authAPI.register(registerData);

      // 회원가입 성공 시 토큰 저장
      authAPI.saveToken(response.data.accessToken, response.data.user);
      return true;
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || "회원가입에 실패했습니다."
      );
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <SignupContext.Provider
      value={{
        signupData,
        updateSignupData,
        submitSignup,
        loading,
        error,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
};
