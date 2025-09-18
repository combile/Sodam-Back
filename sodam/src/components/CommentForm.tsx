import React, { useState } from "react";
import { communityAPI } from "../api/community";
import styles from "./CommentForm.module.css";

interface CommentFormProps {
  postId: number;
  onCommentAdded: () => void;
  placeholder?: string;
}

const CommentForm: React.FC<CommentFormProps> = ({
  postId,
  onCommentAdded,
  placeholder = "답변을 작성해주세요...",
}) => {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim()) {
      setError("답변 내용을 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await communityAPI.createComment(postId, { content });
      if (response.success) {
        setContent("");
        onCommentAdded();
      } else {
        setError(response.message || "답변 작성에 실패했습니다.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "답변 작성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.commentForm}>
      <div className={styles.formGroup}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.textarea}
          disabled={isLoading}
          rows={3}
        />
        <div className={styles.charCount}>
          {content.length}자 (Cmd/Ctrl + Enter로 빠른 등록)
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <div className={styles.formActions}>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={isLoading || !content.trim()}
        >
          {isLoading ? "작성 중..." : "답변 등록"}
        </button>
      </div>
    </form>
  );
};

export default CommentForm;

