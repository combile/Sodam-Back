import React, { useState } from "react";
import { Comment } from "../api/community";
import { communityAPI } from "../api/community";
import { authAPI } from "../api/auth";
import styles from "./CommentCard.module.css";

interface CommentCardProps {
  comment: Comment;
  postAuthorId?: number;
  currentUserId?: number;
  onLike?: (commentId: number, newLikesCount: number) => void;
  onAccept?: (commentId: number) => void;
}

const CommentCard: React.FC<CommentCardProps> = ({
  comment,
  postAuthorId,
  currentUserId,
  onLike,
  onAccept,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes_count);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
      return `${diffInHours}시간 전`;
    } else if (diffInDays < 7) {
      return `${diffInDays}일 전`;
    } else {
      return date.toLocaleDateString("ko-KR");
    }
  };

  const handleLike = async () => {
    try {
      const response = await communityAPI.toggleCommentLike(comment.id);
      if (response.success && response.data) {
        setLikesCount(response.data.likes_count);
        setIsLiked(!isLiked);
        onLike?.(comment.id, response.data.likes_count);
      }
    } catch (error) {
      console.error("댓글 좋아요 실패:", error);
    }
  };

  const handleAccept = async () => {
    try {
      const response = await communityAPI.acceptComment(comment.id);
      if (response.success) {
        onAccept?.(comment.id);
      }
    } catch (error) {
      console.error("답변 채택 실패:", error);
    }
  };

  const canAccept = postAuthorId === currentUserId && !comment.is_accepted;

  return (
    <div
      className={`${styles.commentCard} ${
        comment.is_accepted ? styles.acceptedComment : ""
      }`}
    >
      {comment.is_accepted && (
        <div className={styles.acceptedBadge}>
          <span className="material-icons">check_circle</span>
          채택된 답변
        </div>
      )}

      <div className={styles.commentContent}>{comment.content}</div>

      <div className={styles.commentFooter}>
        <div className={styles.commentAuthor}>
          <div className={styles.authorProfile}>
            <img
              src={comment.author.profileImage || "/default-profile.png"}
              alt="프로필"
              className={styles.authorImage}
              onError={(e) => {
                e.currentTarget.src = "/default-profile.png";
              }}
            />
          </div>
          <div className={styles.authorDetails}>
            <div className={styles.authorNameRow}>
              <span className={styles.authorName}>{comment.author.name}</span>
              {comment.author.level && (
                <span className={styles.authorLevel}>
                  LV.{comment.author.level}
                </span>
              )}
            </div>
            <span className={styles.authorType}>
              {comment.author.businessStage === "STARTUP"
                ? "오늘도 사장님"
                : "내일은 사장님"}
            </span>
          </div>
        </div>

        <div className={styles.commentActions}>
          <button
            className={`${styles.likeButton} ${isLiked ? styles.liked : ""}`}
            onClick={handleLike}
          >
            <span className="material-icons">thumb_up</span>
            {likesCount}
          </button>

          {canAccept && (
            <button className={styles.acceptButton} onClick={handleAccept}>
              답변 채택
            </button>
          )}

          <span className={styles.commentDate}>
            {formatDate(comment.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CommentCard;
