import apiClient from "./client.ts";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: number;
    email: string;
    name: string;
  };
}

export const authAPI = {
  // 로그인
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/api/v1/auth/login", data);
    return response.data;
  },

  // 회원가입
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiClient.post("/api/v1/auth/register", data);
    return response.data;
  },

  // 로그아웃 (클라이언트 사이드)
  logout: () => {
    localStorage.removeItem("access_token");
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
    localStorage.setItem("access_token", token);
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
    return !!localStorage.getItem("access_token");
  },
};
