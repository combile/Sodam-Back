import axios from "axios";

// API 기본 URL 설정
const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "https://port-0-sodam-back-lyo9x8ghce54051e.sel5.cloudtype.app";

// axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT 토큰 유효성 검사 함수
const isValidJWT = (token: string): boolean => {
  if (!token || typeof token !== "string") {
    return false;
  }

  // JWT는 3개의 세그먼트로 구성 (header.payload.signature)
  const segments = token.split(".");
  if (segments.length !== 3) {
    return false;
  }

  // 각 세그먼트가 비어있지 않은지 확인
  return segments.every((segment) => segment.length > 0);
};

// 요청 인터셉터 - 토큰 자동 추가
apiClient.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || localStorage.getItem("access_token");

    if (token && isValidJWT(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (token) {
      // 유효하지 않은 토큰인 경우 제거
      console.warn("유효하지 않은 JWT 토큰을 발견했습니다. 토큰을 제거합니다.");
      localStorage.removeItem("token");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 - 토큰 만료 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // JWT 관련 오류 처리
    if (error.response?.status === 401 || error.response?.status === 422) {
      const errorMessage =
        error.response?.data?.msg || error.response?.data?.message;

      if (
        errorMessage &&
        (errorMessage.includes("Not enough segments") ||
          errorMessage.includes("jwt") ||
          errorMessage.includes("token") ||
          errorMessage.includes("Invalid token") ||
          errorMessage.includes("Token has expired") ||
          errorMessage.includes("expired"))
      ) {
        console.warn("JWT 토큰 오류 감지:", errorMessage);
        localStorage.removeItem("token");
        localStorage.removeItem("access_token");
        localStorage.removeItem("user");

        // 로그인 페이지로 리다이렉트
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { apiClient as client };
