import apiClient from "./client.ts";

export interface LoginRequest {
  username: string; // 아이디로 로그인
  password: string;
}

export interface RegisterRequest {
  username: string; // 아이디
  email: string;
  password: string;
  name: string;
  nickname?: string;
  userType?: string;
  businessStage?: string;
  phone?: string;
  interestedBusinessTypes?: string[];
  preferredAreas?: string[];
  profileImage?: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    accessToken: string;
    user: {
      id: number;
      username: string;
      email: string;
      name: string;
      nickname?: string;
      userType: string;
      businessStage?: string;
      phone?: string;
      preferences: {
        interestedBusinessTypes: string[];
        preferredAreas: string[];
      };
      profileImage?: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
  };
  message: string;
  timestamp: string;
}

export interface CheckResponse {
  success: boolean;
  data: {
    available: boolean;
    message: string;
  };
}

export const authAPI = {
  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/api/v1/sodam/auth/login", data);
    return response.data;
  },

  // 회원가입
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/api/v1/sodam/auth/register", data);
    return response.data;
  },

  // 아이디 중복 검사
  checkUsername: async (username: string): Promise<CheckResponse> => {
    const response = await apiClient.post("/api/v1/sodam/auth/check-username", {
      username,
    });
    return response.data;
  },

  // 이메일 중복 검사
  checkEmail: async (email: string): Promise<CheckResponse> => {
    const response = await apiClient.post("/api/v1/sodam/auth/check-email", {
      email,
    });
    return response.data;
  },

  // 로그아웃 (클라이언트 사이드)
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("access_token"); // 호환성을 위해 둘 다 제거
    localStorage.removeItem("user");
    // 로그아웃 상태 변경 이벤트 발생
    window.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: { isLoggedIn: false, user: null },
      })
    );
  },

  // 토큰 저장
  saveToken: (token: string, user: any) => {
    localStorage.setItem("token", token);
    localStorage.setItem("access_token", token); // 호환성을 위해 둘 다 저장
    localStorage.setItem("user", JSON.stringify(user));
    // 로그인 상태 변경 이벤트 발생
    window.dispatchEvent(
      new CustomEvent("authStateChanged", {
        detail: { isLoggedIn: true, user },
      })
    );
  },

  // 현재 사용자 정보 가져오기
  getCurrentUser: () => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  },

  // 로그인 상태 확인
  isAuthenticated: () => {
    return !!(
      localStorage.getItem("token") || localStorage.getItem("access_token")
    );
  },
};
