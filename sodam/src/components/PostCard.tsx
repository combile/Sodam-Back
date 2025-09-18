import React from "react";
import { Post } from "../api/community";
import styles from "./PostCard.module.css";

interface PostCardProps {
  post: Post;
  onClick?: () => void;
  showAuthor?: boolean;
}

const PostCard: React.FC<PostCardProps> = ({
  post,
  onClick,
  showAuthor = true,
}) => {
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

  const getCategoryClass = (category: string) => {
    return category === "내일 사장"
      ? styles.categoryGreen
      : styles.categoryBlue;
  };

  const getCategoryPrefix = (category: string) => {
    return category === "내일 사장" ? "Q." : "chat";
  };

  return (
    <div className={styles.postCard} onClick={onClick}>
      <div className={styles.postHeader}>
        <span
          className={`${styles.category} ${getCategoryClass(post.category)}`}
        >
          {post.category}
        </span>
        {post.is_solved && <span className={styles.solvedBadge}>해결됨</span>}
      </div>

      <h3 className={styles.postTitle}>
        <span className={styles.postPrefix}>
          {getCategoryPrefix(post.category) === "Q." ? (
            "Q."
          ) : (
            <span className="material-icons">chat</span>
          )}
        </span>
        {post.title}
      </h3>

      <p className={styles.postContent}>
        {post.content.length > 100
          ? `${post.content.substring(0, 100)}...`
          : post.content}
      </p>

      {showAuthor && (
        <div className={styles.postAuthor}>
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
              <div className={styles.authorNameRow}>
                <span className={styles.authorName}>{post.author.name}</span>
                {post.author.level && (
                  <span className={styles.authorLevel}>
                    LV.{post.author.level}
                  </span>
                )}
              </div>
              <span className={styles.authorType}>
                {post.author.businessStage === "STARTUP"
                  ? "오늘도 사장님"
                  : "내일은 사장님"}
              </span>
            </div>
          </div>
          <div className={styles.postMeta}>
            <span className={styles.postDate}>
              {formatDate(post.created_at)}
            </span>
          </div>
        </div>
      )}

      <div className={styles.postStats}>
        <div className={styles.stat}>
          <span className={`${styles.statIcon} material-icons`}>
            visibility
          </span>
          <span>{post.views}</span>
        </div>
        <div className={styles.stat}>
          <span className={`${styles.statIcon} material-icons`}>
            chat_bubble_outline
          </span>
          <span>{post.comments_count}</span>
        </div>
        <div className={styles.stat}>
          <span
            className={`${styles.statIcon} ${styles.likeIcon} material-icons`}
          >
            thumb_up
          </span>
          <span>{post.likes_count}</span>
        </div>
      </div>

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
  );
};

export default PostCard;
