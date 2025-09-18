import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { communityAPI, Post, Comment } from "../../api/community";
import { authAPI } from "../../api/auth";
import PostCard from "../../components/PostCard";
import CommentCard from "../../components/CommentCard";
import CommentForm from "../../components/CommentForm";
import styles from "./PostDetailPage.module.css";
import defaultProfileImage from "../../assets/default-profile.png";

const PostDetailPage: React.FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const currentUser = authAPI.getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  useEffect(() => {
    if (postId) {
      loadPostDetail();
    }
  }, [postId]);

  const loadPostDetail = async () => {
    if (!postId) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await communityAPI.getPost(parseInt(postId));
      if (response.success) {
        setPost(response.data.post);
        setComments(response.data.comments);

        // 조회수 증가 (중복 방지)
        const viewedPosts = JSON.parse(
          localStorage.getItem("viewedPosts") || "[]"
        );
        if (!viewedPosts.includes(parseInt(postId))) {
          try {
            await communityAPI.incrementPostView(parseInt(postId));
            viewedPosts.push(parseInt(postId));
            localStorage.setItem("viewedPosts", JSON.stringify(viewedPosts));
          } catch (viewErr) {
            console.warn("조회수 증가 실패:", viewErr);
          }
        }
      } else {
        setError(response.message || "게시글을 불러오는데 실패했습니다.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message || "게시글을 불러오는데 실패했습니다."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;

    try {
      const response = await communityAPI.togglePostLike(post.id);
      if (response.success && response.data) {
        setPost((prev) =>
          prev
            ? {
                ...prev,
                likes_count: response.data!.likes_count,
              }
            : null
        );
        setIsLiked(!isLiked);
      }
    } catch (error) {
      console.error("좋아요 실패:", error);
    }
  };

  const handleCommentAdded = () => {
    loadPostDetail(); // 댓글이 추가되면 다시 로드
  };

  const handleCommentLike = (commentId: number, newLikesCount: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? { ...comment, likes_count: newLikesCount }
          : comment
      )
    );
  };

  const handleCommentAccept = (commentId: number) => {
    setComments((prev) =>
      prev.map((comment) => ({
        ...comment,
        is_accepted: comment.id === commentId,
      }))
    );
    if (post) {
      setPost((prev) => (prev ? { ...prev, is_solved: true } : null));
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingState}>게시글을 불러오는 중...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <h3>게시글을 찾을 수 없습니다</h3>
          <p>{error || "존재하지 않는 게시글입니다."}</p>
          <button
            className={styles.backButton}
            onClick={() => navigate("/damso")}
          >
            목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/damso")}
        >
          <span className="material-icons">arrow_back</span>
          목록으로
        </button>
      </div>

      <div className={styles.content}>
        {/* 게시글 상세 */}
        <div className={styles.postSection}>
          <div className={styles.postDetail}>
            <div className={styles.postHeader}>
              <span
                className={`${styles.category} ${
                  post.category === "내일 사장"
                    ? styles.categoryGreen
                    : styles.categoryBlue
                }`}
              >
                {post.category}
              </span>
              {post.is_solved && (
                <span className={styles.solvedBadge}>해결됨</span>
              )}
            </div>

            <h1 className={styles.postTitle}>{post.title}</h1>

            <div className={styles.postMeta}>
              <div className={styles.authorInfo}>
                <div className={styles.authorProfile}>
                  <img
                    src={post.author.profileImage || "/default-profile.png"}
                    alt="프로필"
                    className={styles.authorImage}
                    onError={(e) => {
                      e.currentTarget.src = "/default-profile.png";
                    }}
                  />
                </div>
                <div className={styles.authorDetails}>
                  <span className={styles.authorName}>{post.author.name}</span>
                  <span className={styles.authorType}>
                    {post.author.businessStage === "STARTUP"
                      ? "오늘도 사장님"
                      : "내일은 사장님"}
                  </span>
                </div>
              </div>
              <div className={styles.postStats}>
                <span className={styles.postDate}>
                  {formatDate(post.created_at)}
                </span>
                <span className={styles.views}>
                  <span className="material-icons">visibility</span>
                  {post.views}
                </span>
              </div>
            </div>

            <div className={styles.postContent}>{post.content}</div>

            <div className={styles.postActions}>
              <button
                className={`${styles.likeButton} ${
                  isLiked ? styles.liked : ""
                }`}
                onClick={handleLike}
              >
                <span className="material-icons">thumb_up</span>
                {post.likes_count}
              </button>

              {(post.business_type || post.location) && (
                <div className={styles.postTags}>
                  {post.business_type && (
                    <span className={styles.tag}>#{post.business_type}</span>
                  )}
                  {post.location && (
                    <span className={styles.tag}>#{post.location}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 댓글 섹션 */}
        <div className={styles.commentsSection}>
          <div className={styles.commentsHeader}>
            <h3>답변 {comments.length}개</h3>
            {post.author.id === user?.id && !post.is_solved && (
              <p className={styles.acceptGuide}>
                가장 도움이 된 답변을 채택해주세요!
              </p>
            )}
          </div>

          {/* 댓글 작성 */}
          {user && (
            <CommentForm
              postId={post.id}
              onCommentAdded={handleCommentAdded}
              placeholder="답변을 작성해주세요..."
            />
          )}

          {/* 댓글 목록 */}
          <div className={styles.commentsList}>
            {comments.length === 0 ? (
              <div className={styles.emptyComments}>
                <p>아직 답변이 없습니다.</p>
                <p>첫 번째 답변을 작성해보세요!</p>
              </div>
            ) : (
              comments.map((comment) => (
                <CommentCard
                  key={comment.id}
                  comment={comment}
                  postAuthorId={post.author.id}
                  currentUserId={user?.id}
                  onLike={handleCommentLike}
                  onAccept={handleCommentAccept}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
