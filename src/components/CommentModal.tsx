import { useState, useEffect } from "react";
import Image from "next/image";
import { commentAPI, Comment } from "../../service/api/comment";
import {
  filterProfanity,
  containsProfanity,
  isValidNickname,
  isAuthor,
} from "../utils/contentFilter";

interface CommentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommentModal({ isOpen, onClose }: CommentModalProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [nicknameError, setNicknameError] = useState("");
  const [contentError, setContentError] = useState("");
  // Add reply-related state
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [replyNickname, setReplyNickname] = useState("");
  const [replyNicknameError, setReplyNicknameError] = useState("");
  const [replyContentError, setReplyContentError] = useState("");
  // Load comments list
  const loadComments = async () => {
    try {
      const data = await commentAPI.getComments();
      setComments(data);
    } catch (error) {
      console.error("Failed to load comments:", error);
    }
  };

  const handleReplySubmit = async (parentId: number) => {
    if (!replyContent.trim()) return;

    const finalNickname = replyNickname.trim() || "Anonymous User";

    if (!validateReplyInput(replyNickname, replyContent)) {
      return;
    }

    setLoading(true);
    try {
      const filteredContent = filterProfanity(replyContent.trim());

      await commentAPI.addComment({
        nickname: finalNickname,
        content: filteredContent,
        parentId: parentId,
      });

      setReplyContent("");
      setReplyNickname("");
      setReplyingTo(null);
      setReplyNicknameError("");
      setReplyContentError("");
      await loadComments();
    } catch (error) {
      console.error("Failed to submit reply:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add: validate reply input
  const validateReplyInput = (nickname: string, content: string): boolean => {
    setReplyNicknameError("");
    setReplyContentError("");

    // Validate nickname
    if (nickname.trim()) {
      if (nickname.trim().length > 10) {
        setReplyNicknameError("Nickname cannot exceed 10 characters");
        return false;
      }

      if (!isValidNickname(nickname)) {
        const trimmedNickname = nickname.trim().toLowerCase();
        if (trimmedNickname === "austin") {
          setReplyNicknameError(
            "This nickname is unavailable, please choose another"
          );
        } else if (containsProfanity(nickname)) {
          setReplyNicknameError(
            "Nickname contains inappropriate words, please modify and try again"
          );
        } else {
          setReplyNicknameError(
            "This nickname is unavailable, please choose another"
          );
        }
        return false;
      }
    }

    // Validate content length
    if (content.trim().length > 200) {
      setReplyContentError("Reply content cannot exceed 200 characters");
      return false;
    }

    // Validate content for inappropriate language
    if (containsProfanity(content)) {
      setReplyContentError(
        "Reply contains inappropriate language, please modify and try again"
      );
      return false;
    }

    return true;
  };

  // Handle reply nickname changes
  const handleReplyNicknameChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setReplyNickname(value);

    if (value.trim()) {
      if (value.trim().length > 10) {
        setReplyNicknameError("Nickname cannot exceed 10 characters");
        return;
      }

      if (!isValidNickname(value)) {
        const trimmedNickname = value.trim().toLowerCase();
        if (trimmedNickname === "austin") {
          setReplyNicknameError(
            "This nickname is unavailable, please choose another"
          );
        } else if (containsProfanity(value)) {
          setReplyNicknameError(
            "Nickname contains inappropriate words, please modify and try again"
          );
        } else {
          setReplyNicknameError(
            "This nickname is unavailable, please choose another"
          );
        }
      } else {
        setReplyNicknameError("");
      }
    } else {
      setReplyNicknameError("");
    }
  };

  // Handle reply content changes
  const handleReplyContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const value = e.target.value;
    setReplyContent(value);

    if (value.trim()) {
      if (value.trim().length > 200) {
        setReplyContentError("Reply content cannot exceed 200 characters");
        return;
      }

      if (containsProfanity(value)) {
        setReplyContentError(
          "Reply contains inappropriate language, please modify and try again"
        );
      } else {
        setReplyContentError("");
      }
    } else {
      setReplyContentError("");
    }
  };

  // Recursive component for rendering comments and replies
  const renderComment = (comment: Comment, isReply = false) => {
    const isAuthorComment = isAuthor(comment.nickname || "");

    return (
      <div
        key={comment.id}
        className={`
          ${isReply ? "ml-8 mt-3" : ""}
          bg-white/60 dark:bg-gray-700/60 backdrop-blur-sm
          border border-gray-200/50 dark:border-gray-600/50
          rounded-xl p-4 shadow-sm hover:shadow-md
          transition-all duration-200 hover:bg-white/80 dark:hover:bg-gray-700/80
          animate-fade-in
          ${
            isReply ? "border-l-2 border-l-gray-300 dark:border-l-gray-600" : ""
          }
        `}
      >
        {/* Comment header - nickname and time */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
                isAuthorComment
                  ? "bg-gradient-to-br from-yellow-400 to-orange-500"
                  : "bg-gradient-to-br from-[#1b2c55] to-[#3d85a9]"
              }`}
            >
              {(comment.nickname || "Anonymous").charAt(0).toUpperCase()}
            </div>
            {/* Nickname */}
            <span
              className={`text-sm ${
                isAuthorComment
                  ? "font-bold text-orange-600 dark:text-orange-400"
                  : "font-medium text-gray-900 dark:text-white"
              }`}
            >
              {comment.nickname || "Anonymous"}
              {isAuthorComment && (
                <span className="ml-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-400 px-[0.125rem] py-[0.03125rem] rounded-full">
                  Author
                </span>
              )}
              {isReply && (
                <span className="ml-1 text-xs bg-gray-100 dark:bg-gray-900 text-blue-600 dark:text-blue-400 px-[0.125rem] py-[0.03125rem] rounded-full cursor-pointer hidden sm:inline-block">
                  Reply
                </span>
              )}
            </span>
          </div>
          {/* Time and reply button */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(comment.createdAt).toLocaleString("zh-CN", {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
            {!isReply && (
              <button
                onClick={() => {
                  setReplyingTo(replyingTo === comment.id ? null : comment.id);
                  setReplyContent("");
                  setReplyNickname("");
                  setReplyNicknameError("");
                  setReplyContentError("");
                }}
                className="text-xs text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 px-[0.125rem] py-[0.0625rem] rounded hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors cursor-pointer"
              >
                {replyingTo === comment.id ? "Cancel" : "Reply"}
              </button>
            )}
          </div>
        </div>

        {/* Comment content */}
        <div
          className={`text-sm leading-relaxed pl-11 ${
            isAuthorComment
              ? "font-semibold text-gray-800 dark:text-gray-200"
              : "text-gray-700 dark:text-gray-300"
          }`}
        >
          {comment.content}
        </div>

        {/* Reply input box */}
        {replyingTo === comment.id && (
          <div className="mt-4 pl-11 space-y-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Nickname (optional, default: Anonymous)"
                value={replyNickname}
                onChange={handleReplyNicknameChange}
                disabled={loading}
                maxLength={10}
                className={`w-full px-[0.1875rem] py-[0.125rem] text-sm border rounded-lg bg-white/80 dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  replyNicknameError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-500 focus:ring-blue-500"
                }`}
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {replyNickname.length}/10
              </div>
            </div>
            {replyNicknameError && (
              <p className="text-xs text-red-500">{replyNicknameError}</p>
            )}
            <div className="relative">
              <textarea
                placeholder="Write your reply..."
                value={replyContent}
                onChange={handleReplyContentChange}
                disabled={loading}
                maxLength={200}
                className={`w-full px-[0.1875rem] py-[0.125rem] pr-[1rem] text-sm border rounded-lg bg-white/80 dark:bg-gray-600 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  replyContentError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-500 focus:ring-blue-500"
                }`}
                rows={2}
              />
              <div className="absolute right-6 bottom-3 text-xs text-gray-400">
                {replyContent.length}/200
              </div>
              <button
                onClick={() => handleReplySubmit(comment.id)}
                disabled={
                  loading ||
                  !replyContent.trim() ||
                  replyNicknameError !== "" ||
                  replyContentError !== ""
                }
                className="absolute right-[0.0625rem] top-[0.0625rem] px-[0.125rem] py-[0.0625rem] bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded text-xs font-medium transition-colors disabled:cursor-not-allowed"
              >
                {loading ? "Sending" : "Send"}
              </button>
            </div>
            {replyContentError && (
              <p className="text-xs text-red-500">{replyContentError}</p>
            )}
          </div>
        )}

        {/* Reply list */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="mt-4">
            {comment.replies.map((reply) => renderComment(reply, true))}
          </div>
        )}

        {/* Bottom decorative line */}
        <div className="mt-3 pl-11">
          <div
            className={`h-[0.0625rem] bg-gradient-to-r to-transparent ${
              isAuthorComment
                ? "from-orange-200 dark:from-orange-700"
                : "from-gray-200 dark:from-gray-700"
            }`}
          ></div>
        </div>
      </div>
    );
  };

  // Validate input content
  const validateInput = (nickname: string, content: string): boolean => {
    setNicknameError("");
    setContentError("");

    // Validate nickname
    if (nickname.trim()) {
      // Check nickname length
      if (nickname.trim().length > 10) {
        setNicknameError("Nickname cannot exceed 10 characters");
        return false;
      }

      // Check if nickname is valid
      if (!isValidNickname(nickname)) {
        const trimmedNickname = nickname.trim().toLowerCase();
        if (trimmedNickname === "austin") {
          setNicknameError(
            "This nickname is unavailable, please choose another"
          );
        } else if (containsProfanity(nickname)) {
          setNicknameError(
            "Nickname contains inappropriate words, please modify and try again"
          );
        } else {
          setNicknameError(
            "This nickname is unavailable, please choose another"
          );
        }
        return false;
      }
    }

    // Validate content length
    if (content.trim().length > 200) {
      setContentError("Comment content cannot exceed 200 characters");
      return false;
    }

    // Validate content for inappropriate language
    if (containsProfanity(content)) {
      setContentError(
        "Comment contains inappropriate language, please modify and try again"
      );
      return false;
    }

    return true;
  };

  // Submit comment
  const handleSubmit = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      if (!newComment.trim()) return;

      const finalNickname = nickname.trim() || "Anonymous";

      if (!validateInput(nickname, newComment)) {
        return;
      }

      setLoading(true);
      try {
        // Filter content (double insurance)
        const filteredContent = filterProfanity(newComment.trim());

        await commentAPI.addComment({
          nickname: finalNickname,
          content: filteredContent,
        });

        setNewComment("");
        setNickname("");
        setNicknameError("");
        setContentError("");
        await loadComments();
      } catch (error) {
        console.error("Failed to submit comment:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Submit comment by clicking Send button
  const handleSendClick = async () => {
    if (!newComment.trim()) return;

    const finalNickname = nickname.trim() || "Anonymous";

    if (!validateInput(nickname, newComment)) {
      return;
    }

    setLoading(true);
    try {
      // 过滤内容（双重保险）
      const filteredContent = filterProfanity(newComment.trim());

      await commentAPI.addComment({
        nickname: finalNickname,
        content: filteredContent,
      });

      setNewComment("");
      setNickname("");
      setNicknameError("");
      setContentError("");
      await loadComments();
    } catch (error) {
      console.error("提交评论失败:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle nickname input changes
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);

    // Real-time validate nickname
    if (value.trim()) {
      // Check nickname length
      if (value.trim().length > 10) {
        setNicknameError("Nickname cannot exceed 10 characters");
        return;
      }

      // Check if nickname is valid
      if (!isValidNickname(value)) {
        const trimmedNickname = value.trim().toLowerCase();
        if (trimmedNickname === "austin") {
          setNicknameError(
            "This nickname is unavailable, please choose another"
          );
        } else if (containsProfanity(value)) {
          setNicknameError(
            "Nickname contains inappropriate words, please modify and try again"
          );
        } else {
          setNicknameError(
            "This nickname is unavailable, please choose another"
          );
        }
      } else {
        setNicknameError("");
      }
    } else {
      setNicknameError("");
    }
  };

  // Handle content input changes
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewComment(value);

    // Real-time validate content
    if (value.trim()) {
      // Check content length
      if (value.trim().length > 200) {
        setContentError("Comment content cannot exceed 200 characters");
        return;
      }

      // Check for inappropriate language
      if (containsProfanity(value)) {
        setContentError(
          "Comment contains inappropriate language, please modify and try again"
        );
      } else {
        setContentError("");
      }
    } else {
      setContentError("");
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadComments();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Background overlay */}
      <div
        className={`absolute inset-0 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-50" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer-style comment modal */}
      <div
        className={`
          fixed bottom-0 left-0 right-0 w-full
          bg-white/80 rounded-t-2xl shadow-2xl
          transform transition-transform duration-500 ease-out
          dark:bg-gray-800
          ${isOpen ? "translate-y-0" : "translate-y-full"}
        `}
        style={{ height: "80vh" }}
      >
        {/* Drag indicator */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1 bg-gray-500 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-[0.375rem] py-[0.1875rem] border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-500 dark:text-white">
            Welcome to Comment
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Input area */}
        <div className="px-[0.375rem] py-[0.25rem] border-b border-gray-200 dark:border-gray-700">
          <div className="mb-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Nickname (optional, default: Anonymous)"
                value={nickname}
                onChange={handleNicknameChange}
                disabled={loading}
                maxLength={10}
                className={`w-full px-[0.25rem] py-[0.1875rem] border rounded-xl bg-white/80 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  nicknameError
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 dark:border-gray-600 focus:ring-gray-500"
                }`}
              />
              {/* Nickname character count */}
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400">
                {nickname.length}/10
              </div>
            </div>
            {nicknameError && (
              <p className="mt-1 text-sm text-red-500">{nicknameError}</p>
            )}
          </div>
          <div className="relative">
            <textarea
              placeholder="Write your comment... (Press Enter to Send)"
              value={newComment}
              onChange={handleContentChange}
              onKeyDown={handleSubmit}
              disabled={loading}
              maxLength={200}
              className={`w-full px-[0.25rem] py-[0.1875rem] pr-[1.25rem] border rounded-xl bg-white/80 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent resize-none transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                contentError
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-gray-500"
              }`}
              rows={3}
            />
            {/* Content character count */}
            <div className="absolute right-6 bottom-4 text-xs text-gray-400">
              {newComment.length}/200
            </div>
            {contentError && (
              <p className="mt-1 text-sm text-red-500">{contentError}</p>
            )}
            {/* Send button */}
            <button
              onClick={handleSendClick}
              disabled={
                loading ||
                !newComment.trim() ||
                nicknameError !== "" ||
                contentError !== ""
              }
              className="absolute right-[0.125rem] top-[0.125rem] px-[0.1875rem] py-[0.125rem] bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed flex items-center gap-1"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Sending</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span>Send</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Comment list */}
        <div className="flex-1 overflow-y-auto px-[0.375rem] py-[0.25rem] h-[calc(100%-18.75rem)] custom-scrollbar">
          <div className="space-y-4">
            {comments
              .filter((comment) => !comment.parentId) // Only show top-level comments
              .map((comment, index) => (
                <div
                  key={comment.id}
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "both",
                  }}
                >
                  {renderComment(comment)}
                </div>
              ))}

            {/* Empty state */}
            {comments.filter((comment) => !comment.parentId).length === 0 && (
              <div className="w-full flex-col text-gray-500 dark:text-gray-400 py-16 flex justify-center items-center">
                <div className="mb-6 opacity-80">
                  <Image
                    src="/images/shafa.png"
                    alt=""
                    width={160}
                    height={160}
                  />
                </div>
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">No comments yet</p>
                  <p className="text-sm opacity-75">
                    Be the first to comment and share your thoughts!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
