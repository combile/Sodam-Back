import React, { createContext, useContext, useState, ReactNode } from "react";
import { authAPI } from "../api/auth.ts";

interface SignupData {
  email: string;
  password: string;
  name: string;
  nickname?: string;
  profileImage?: string | null;
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
    email: "",
    password: "",
    name: "",
    nickname: "",
    profileImage: null,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData((prev) => ({ ...prev, ...data }));
  };

  const submitSignup = async (): Promise<boolean> => {
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.register({
        email: signupData.email,
        password: signupData.password,
        name: signupData.name,
      });

      // 회원가입 성공 시 토큰 저장
      authAPI.saveToken(response.access_token, response.user);
      return true;
    } catch (err: any) {
      setError(err.response?.data?.message || "회원가입에 실패했습니다.");
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
