import apiClient from "./client.ts";

export interface UserProfile {
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
  createdAt?: string;
  updatedAt?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  nickname?: string;
  businessStage?: string;
  phone?: string;
  profileImage?: string;
  preferences?: {
    interestedBusinessTypes?: string[];
    preferredAreas?: string[];
  };
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  user: UserProfile;
  timestamp: string;
}

export const profileAPI = {
  // 프로필 조회
  getProfile: async (): Promise<ProfileResponse> => {
    const response = await apiClient.get("/api/v1/profile/get");
    return response.data;
  },

  // 프로필 업데이트
  updateProfile: async (
    data: UpdateProfileRequest
  ): Promise<ProfileResponse> => {
    console.log("프로필 업데이트 요청 데이터:", data);

    try {
      const response = await apiClient.put("/api/v1/profile/update", data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("프로필 업데이트 응답:", response.data);
      return response.data;
    } catch (error) {
      console.error("프로필 업데이트 에러:", error);
      throw error;
    }
  },
};
