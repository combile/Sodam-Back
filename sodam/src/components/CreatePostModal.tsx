import React, { useState } from "react";
import { communityAPI, CreatePostRequest } from "../api/community";
import styles from "./CreatePostModal.module.css";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialCategory?: "내일 사장" | "오늘 사장";
}

const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialCategory = "내일 사장",
}) => {
  const [formData, setFormData] = useState<CreatePostRequest>({
    category: initialCategory,
    title: "",
    content: "",
    business_type: "",
    location: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      setError("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await communityAPI.createPost(formData);
      if (response.success) {
        onSuccess();
        onClose();
        // 폼 초기화
        setFormData({
          category: initialCategory,
          title: "",
          content: "",
          business_type: "",
          location: "",
        });
      } else {
        setError(response.message || "게시글 작성에 실패했습니다.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "게시글 작성에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setError(null);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>질문하기</h2>
          <button
            className={styles.closeButton}
            onClick={handleClose}
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="category">카테고리</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={styles.select}
              disabled={isLoading}
            >
              <option value="내일 사장">내일 사장</option>
              <option value="오늘 사장">오늘 사장</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title">제목 *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="질문 제목을 입력해주세요"
              className={styles.input}
              disabled={isLoading}
              maxLength={200}
            />
            <div className={styles.charCount}>{formData.title.length}/200</div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="business_type">관련 업종 (선택사항)</label>
            <input
              type="text"
              id="business_type"
              name="business_type"
              value={formData.business_type}
              onChange={handleInputChange}
              placeholder="예: 카페, 음식점, 쇼핑몰 등"
              className={styles.input}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="location">관련 지역 (선택사항)</label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="예: 대전 중구, 유성구 등"
              className={styles.input}
              disabled={isLoading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="content">내용 *</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleInputChange}
              placeholder="질문 내용을 자세히 작성해주세요"
              className={styles.textarea}
              disabled={isLoading}
              rows={6}
            />
          </div>

          {error && <div className={styles.errorMessage}>{error}</div>}

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={handleClose}
              className={styles.cancelButton}
              disabled={isLoading}
            >
              취소
            </button>
            <button
              type="submit"
              className={styles.submitButton}
              disabled={
                isLoading || !formData.title.trim() || !formData.content.trim()
              }
            >
              {isLoading ? "작성 중..." : "질문 등록"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePostModal;

