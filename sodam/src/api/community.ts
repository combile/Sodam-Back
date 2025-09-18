import { client } from "./client";

// 타입 정의
export interface Post {
  id: number;
  author: {
    id: number;
    username: string;
    name: string;
    nickname?: string;
    userType: string;
    businessStage?: string;
    profileImage?: string;
    level?: number;
    experience?: number;
    levelInfo?: {
      currentLevel: number;
      currentExperience: number;
      currentLevelExp: number;
      nextLevelExp: number;
      progress: number;
      expToNextLevel: number;
    };
  };
  category: "내일 사장" | "오늘 사장";
  title: string;
  content: string;
  views: number;
  likes_count: number;
  comments_count: number;
  is_solved: boolean;
  business_type?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: number;
  post_id: number;
  author: {
    id: number;
    username: string;
    name: string;
    nickname?: string;
    userType: string;
    businessStage?: string;
    profileImage?: string;
    level?: number;
    experience?: number;
    levelInfo?: {
      currentLevel: number;
      currentExperience: number;
      currentLevelExp: number;
      nextLevelExp: number;
      progress: number;
      expToNextLevel: number;
    };
  };
  content: string;
  is_accepted: boolean;
  likes_count: number;
  created_at: string;
  updated_at: string;
}

export interface PostLike {
  id: number;
  post_id: number;
  user_id: number;
  created_at: string;
}

export interface CommentLike {
  id: number;
  comment_id: number;
  user_id: number;
  created_at: string;
}

export interface CreatePostRequest {
  category: "내일 사장" | "오늘 사장";
  title: string;
  content: string;
  business_type?: string;
  location?: string;
}

export interface CreateCommentRequest {
  content: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  category?: "내일 사장" | "오늘 사장";
  business_type?: string;
  location?: string;
}

export interface UpdateCommentRequest {
  content: string;
}

export interface PostsResponse {
  success: boolean;
  data: {
    posts: Post[];
    total: number;
    pages: number;
    current_page: number;
    has_next: boolean;
    has_prev: boolean;
  };
}

export interface PostDetailResponse {
  success: boolean;
  data: {
    post: Post;
    comments: Comment[];
  };
}

export interface CommentsResponse {
  success: boolean;
  data: {
    comments: Comment[];
    total: number;
    pages: number;
    current_page: number;
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// 게시글 관련 API
export const communityAPI = {
  // 게시글 목록 조회
  getPosts: async (params?: {
    page?: number;
    per_page?: number;
    category?: "내일 사장" | "오늘 사장";
    search?: string;
  }): Promise<PostsResponse> => {
    const response = await client.get("/api/community/posts", { params });
    return response.data;
  },

  // 게시글 상세 조회
  getPost: async (postId: number): Promise<PostDetailResponse> => {
    const response = await client.get(`/api/community/posts/${postId}`);
    return response.data;
  },

  // 게시글 조회수 증가
  incrementPostView: async (
    postId: number
  ): Promise<ApiResponse<{ views: number }>> => {
    const response = await client.post(`/api/community/posts/${postId}/view`);
    return response.data;
  },

  // 게시글 작성
  createPost: async (data: CreatePostRequest): Promise<ApiResponse<Post>> => {
    const response = await client.post("/api/community/posts", data);
    return response.data;
  },

  // 게시글 수정
  updatePost: async (
    postId: number,
    data: UpdatePostRequest
  ): Promise<ApiResponse<Post>> => {
    const response = await client.put(`/api/community/posts/${postId}`, data);
    return response.data;
  },

  // 게시글 삭제
  deletePost: async (postId: number): Promise<ApiResponse> => {
    const response = await client.delete(`/api/community/posts/${postId}`);
    return response.data;
  },

  // 댓글 작성
  createComment: async (
    postId: number,
    data: CreateCommentRequest
  ): Promise<ApiResponse<Comment>> => {
    const response = await client.post(
      `/api/community/posts/${postId}/comments`,
      data
    );
    return response.data;
  },

  // 댓글 수정
  updateComment: async (
    commentId: number,
    data: UpdateCommentRequest
  ): Promise<ApiResponse<Comment>> => {
    const response = await client.put(
      `/api/community/comments/${commentId}`,
      data
    );
    return response.data;
  },

  // 댓글 삭제
  deleteComment: async (commentId: number): Promise<ApiResponse> => {
    const response = await client.delete(
      `/api/community/comments/${commentId}`
    );
    return response.data;
  },

  // 댓글 채택
  acceptComment: async (commentId: number): Promise<ApiResponse<Comment>> => {
    const response = await client.post(
      `/api/community/comments/${commentId}/accept`
    );
    return response.data;
  },

  // 게시글 좋아요/취소
  togglePostLike: async (
    postId: number
  ): Promise<ApiResponse<{ likes_count: number }>> => {
    const response = await client.post(`/api/community/posts/${postId}/like`);
    return response.data;
  },

  // 댓글 좋아요/취소
  toggleCommentLike: async (
    commentId: number
  ): Promise<ApiResponse<{ likes_count: number }>> => {
    const response = await client.post(
      `/api/community/comments/${commentId}/like`
    );
    return response.data;
  },

  // 사용자별 게시글 조회
  getUserPosts: async (
    userId: number,
    params?: {
      page?: number;
      per_page?: number;
    }
  ): Promise<PostsResponse> => {
    const response = await client.get(`/api/community/users/${userId}/posts`, {
      params,
    });
    return response.data;
  },

  // 사용자별 댓글 조회
  getUserComments: async (
    userId: number,
    params?: {
      page?: number;
      per_page?: number;
    }
  ): Promise<CommentsResponse> => {
    const response = await client.get(
      `/api/community/users/${userId}/comments`,
      {
        params,
      }
    );
    return response.data;
  },

  // 사용자가 댓글을 작성한 게시글 조회 (대답한 질문)
  getUserAnsweredPosts: async (
    userId: number,
    params?: {
      page?: number;
      per_page?: number;
    }
  ): Promise<PostsResponse> => {
    const response = await client.get(
      `/api/community/users/${userId}/answered-posts`,
      {
        params,
      }
    );
    return response.data;
  },
};
