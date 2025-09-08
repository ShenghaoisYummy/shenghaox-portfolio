import { useState } from 'react';

interface UseModalsReturn {
  isCommentsModalOpen: boolean;
  isReactionsModalOpen: boolean;
  isChatModalOpen: boolean;
  isFloatingReactionsVisible: boolean;
  openCommentsModal: () => void;
  closeCommentsModal: () => void;
  openReactionsModal: () => void;
  closeReactionsModal: () => void;
  openChatModal: () => void;
  closeChatModal: () => void;
  showFloatingReactions: () => void;
  hideFloatingReactions: () => void;
}

export const useModals = (): UseModalsReturn => {
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);
  const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [isFloatingReactionsVisible, setIsFloatingReactionsVisible] = useState(false);

  const openCommentsModal = () => setIsCommentsModalOpen(true);
  const closeCommentsModal = () => setIsCommentsModalOpen(false);

  const openReactionsModal = () => setIsReactionsModalOpen(true);
  const closeReactionsModal = () => setIsReactionsModalOpen(false);

  const openChatModal = () => setIsChatModalOpen(true);
  const closeChatModal = () => setIsChatModalOpen(false);

  const showFloatingReactions = () => setIsFloatingReactionsVisible(true);
  const hideFloatingReactions = () => setIsFloatingReactionsVisible(false);

  return {
    isCommentsModalOpen,
    isReactionsModalOpen,
    isChatModalOpen,
    isFloatingReactionsVisible,
    openCommentsModal,
    closeCommentsModal,
    openReactionsModal,
    closeReactionsModal,
    openChatModal,
    closeChatModal,
    showFloatingReactions,
    hideFloatingReactions,
  };
};