import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { authAPI } from "../../api/auth";
import { communityAPI, Post } from "../../api/community";
import PostCard from "../../components/PostCard";
import CreatePostModal from "../../components/CreatePostModal";
import LevelProgress from "../../components/LevelProgress";
import styles from "./DamsoPage.module.css";
import defaultProfileImage from "../../assets/default-profile.png";

const DamsoPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState<
    "담소" | "내가 쓴 질문" | "대답한 질문"
  >("담소");
  const [user, setUser] = useState<any>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // URL 파라미터에서 탭 정보를 읽어와서 설정
  useEffect(() => {
    const tabParam = searchParams.get("tab");
    if (tabParam === "내가 쓴 질문" || tabParam === "대답한 질문") {
      setSelectedTab(tabParam);
    }
  }, [searchParams]);

  // 사용자 정보 가져오기
  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  // 게시글 목록 로드
  const loadPosts = async (page: number = 1, reset: boolean = false) => {
    if (isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const params: any = {
        page,
        per_page: 10,
      };

      // 탭에 따른 필터링
      if (selectedTab === "내가 쓴 질문" && user) {
        // 사용자별 게시글 조회
        const response = await communityAPI.getUserPosts(user.id, params);
        if (response.success) {
          const newPosts = response.data.posts;
          if (reset) {
            setPosts(newPosts);
          } else {
            setPosts((prev) => [...prev, ...newPosts]);
          }
          setHasMore(response.data.has_next);
        }
      } else if (selectedTab === "대답한 질문" && user) {
        // 사용자가 댓글을 작성한 게시글 조회
        const response = await communityAPI.getUserAnsweredPosts(
          user.id,
          params
        );
        if (response.success) {
          const newPosts = response.data.posts;
          if (reset) {
            setPosts(newPosts);
          } else {
            setPosts((prev) => [...prev, ...newPosts]);
          }
          setHasMore(response.data.has_next);
        }
      } else {
        // 일반 게시글 조회
        const response = await communityAPI.getPosts(params);
        if (response.success) {
          const newPosts = response.data.posts;
          if (reset) {
            setPosts(newPosts);
          } else {
            setPosts((prev) => [...prev, ...newPosts]);
          }
          setHasMore(response.data.has_next);
        }
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "게시글을 불러오는데 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 탭 변경 시 게시글 다시 로드
  useEffect(() => {
    setCurrentPage(1);
    setPosts([]);
    setHasMore(true);
    loadPosts(1, true);
  }, [selectedTab, user]);

  // 탭 변경 핸들러
  const handleTabChange = (tab: "담소" | "내가 쓴 질문" | "대답한 질문") => {
    setSelectedTab(tab);
    // URL 파라미터 업데이트
    if (tab === "담소") {
      navigate("/damso");
    } else {
      navigate(`/damso?tab=${encodeURIComponent(tab)}`);
    }
  };

  // 게시글 작성 성공 핸들러
  const handlePostCreated = () => {
    setCurrentPage(1);
    setPosts([]);
    setHasMore(true);
    loadPosts(1, true);
  };

  // 더 많은 게시글 로드
  const loadMorePosts = () => {
    if (hasMore && !isLoading) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      loadPosts(nextPage, false);
    }
  };

  // 게시글 클릭 핸들러 (상세 페이지로 이동)
  const handlePostClick = (post: Post) => {
    navigate(`/damso/posts/${post.id}`);
  };

  return (
    <div className={styles.container}>
      {/* 메인 컨텐츠 */}
      <div className={styles.mainContent}>
        {/* 왼쪽: 탭 및 질문 리스트 */}
        <div className={styles.leftSection}>
          {/* 탭 네비게이션 */}
          <div className={styles.tabNavigation}>
            <button
              className={`${styles.tabButton} ${
                selectedTab === "담소" ? styles.activeTab : ""
              }`}
              onClick={() => handleTabChange("담소")}
            >
              담소
            </button>
            <button
              className={`${styles.tabButton} ${
                selectedTab === "내가 쓴 질문" ? styles.activeTab : ""
              }`}
              onClick={() => handleTabChange("내가 쓴 질문")}
            >
              내가 쓴 질문
            </button>
            <button
              className={`${styles.tabButton} ${
                selectedTab === "대답한 질문" ? styles.activeTab : ""
              }`}
              onClick={() => handleTabChange("대답한 질문")}
            >
              대답한 질문
            </button>
          </div>

          {/* 게시글 리스트 */}
          <div className={styles.questionsList}>
            {error && <div className={styles.errorMessage}>{error}</div>}

            {posts.length === 0 && !isLoading && (
              <div className={styles.emptyState}>
                {selectedTab === "담소" && (
                  <>
                    <p>아직 게시글이 없습니다.</p>
                    <p>첫 번째 질문을 작성해보세요!</p>
                  </>
                )}
                {selectedTab === "내가 쓴 질문" && (
                  <>
                    <p>작성한 질문이 없습니다.</p>
                    <p>첫 번째 질문을 작성해보세요!</p>
                  </>
                )}
                {selectedTab === "대답한 질문" && (
                  <>
                    <p>답변한 질문이 없습니다.</p>
                    <p>다른 사장님들의 질문에 답변해보세요!</p>
                  </>
                )}
              </div>
            )}

            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onClick={() => handlePostClick(post)}
              />
            ))}

            {isLoading && (
              <div className={styles.loadingState}>게시글을 불러오는 중...</div>
            )}

            {hasMore && !isLoading && posts.length > 0 && (
              <button className={styles.loadMoreButton} onClick={loadMorePosts}>
                더 보기
              </button>
            )}
          </div>
        </div>

        {/* 오른쪽: 프로필 섹션 */}
        <div className={styles.rightSection}>
          <div className={styles.profileCard}>
            <div className={styles.profileSection}>
              <div className={styles.profileImageContainer}>
                <div className={styles.profileImage}>
                  <img
                    src={user?.profileImage || defaultProfileImage}
                    alt="프로필"
                    className={styles.profileImg}
                  />
                </div>
                <button className={styles.newUserButton}>
                  {user?.businessStage === "STARTUP"
                    ? "오늘도 사장님"
                    : "내일은 사장님"}
                </button>
              </div>

              {user?.levelInfo && (
                <LevelProgress
                  levelInfo={user.levelInfo}
                  showDetails={true}
                  size="medium"
                />
              )}
            </div>

            <button
              className={styles.questionButton}
              onClick={() => setShowCreateModal(true)}
            >
              <div className={styles.questionButtonContent}>
                <div className={styles.questionButtonText}>
                  <span className={styles.questionButtonTitle}>질문하기</span>
                  <span className={styles.questionButtonSubtitle}>
                    사장님들에게 물어보세요 !
                  </span>
                </div>
                <div className={styles.questionButtonIcon}>
                  <span className={styles.helpIcon}>?</span>
                </div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 게시글 작성 모달 */}
      <CreatePostModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSuccess={handlePostCreated}
        initialCategory="내일 사장"
      />
    </div>
  );
};

export default DamsoPage;
