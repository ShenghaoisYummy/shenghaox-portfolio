import { useState, useEffect, useRef, useCallback } from "react";
import Head from "next/head";
import Link from "next/link";
import PusherClient, { PresenceChannel } from "pusher-js";
import SvgIcon from "@/components/SvgIcon";
import { useTheme } from "@/contexts/ThemeContext";
import {
  isValidNickname,
  filterProfanity,
  containsProfanity,
} from "@/utils/contentFilter";

interface Message {
  id: string;
  content: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

interface ChatRoom {
  id: string;
  name: string;
  description?: string;
  _count: { messages: number };
}

interface PusherMember {
  id: string;
  info: {
    name: string;
    avatar?: string;
  };
}

interface PusherMembers {
  count: number;
  members: Record<string, PusherMember>;
}

interface PusherAuthResponse {
  auth: string;
  channel_data?: string;
}

interface PusherChannel {
  name: string;
}

export default function ChatPage() {
  const { theme } = useTheme();
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [currentRoom, setCurrentRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userName, setUserName] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [showUserModal, setShowUserModal] = useState(true);
  const [currentUserId, setCurrentUserId] = useState("");
  const [isLoadingRooms, setIsLoadingRooms] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [nicknameError, setNicknameError] = useState("");
  const [messageError, setMessageError] = useState("");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<PusherClient | null>(null);
  const channelRef = useRef<PresenceChannel | null>(null);
  const sendTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [onlineUsers, setOnlineUsers] = useState<number>(0);
  const [onlineUsersList, setOnlineUsersList] = useState<PusherMember[]>([]);
  console.log("🚀 ~ ChatPage ~ onlineUsersList:", onlineUsersList);
  // Scroll to bottom
  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Initialize user information
  useEffect(() => {
    const savedUserName = localStorage.getItem("chatUserName");
    const savedUserId = localStorage.getItem("chatUserId");

    if (savedUserName && savedUserId) {
      setUserName(savedUserName);
      setCurrentUserId(savedUserId);
      setShowUserModal(false);
    } else {
      // Generate new user ID
      const newUserId = `user-${Date.now()}-${Math.random()
        .toString(36)
        .substr(2, 9)}`;
      setCurrentUserId(newUserId);
      localStorage.setItem("chatUserId", newUserId);
    }
  }, []);

  // Initialize Pusher
  useEffect(() => {
    if (!userName) return;

    // If connection exists, clean up first
    if (pusherRef.current) {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        pusherRef.current.unsubscribe(channelRef.current.name);
      }
      pusherRef.current.disconnect();
    }

    pusherRef.current = new PusherClient(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
      forceTLS: true,
      enabledTransports: ["ws", "wss"],
      // Add authentication endpoint
      authorizer: (channel: PusherChannel) => {
        return {
          authorize: (
            socketId: string,
            callback: (
              error: Error | null,
              data: PusherAuthResponse | null
            ) => void
          ) => {
            fetch("/api/pusher/auth", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                socket_id: socketId,
                channel_name: channel.name,
                user_id: currentUserId,
                user_info: {
                  name: userName,
                  avatar: null,
                },
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                callback(null, data);
              })
              .catch((error) => {
                console.error("Auth error:", error);
                callback(error, null);
              });
          },
        };
      },
      activityTimeout: 120000,
      pongTimeout: 30000,
    });

    pusherRef.current.connection.bind("connected", () => {
      console.log(
        "Pusher connected, connection ID:",
        pusherRef.current?.connection.socket_id
      );
      setIsConnected(true);
      // Try to subscribe to current room immediately after connection
      if (currentRoom) {
        subscribeToRoom(currentRoom.id);
        // Add this line: load current room messages after successful connection
        fetchMessages(currentRoom.id);
      }
    });

    pusherRef.current.connection.bind("disconnected", () => {
      console.log("Pusher disconnected");
      setIsConnected(false);
      setOnlineUsers(0);
      setOnlineUsersList([]);
    });

    pusherRef.current.connection.bind("error", (error: Error) => {
      console.error("Pusher connection error:", error);
    });

    pusherRef.current.connection.bind(
      "state_change",
      (states: { previous: string; current: string }) => {
        console.log(
          "Pusher state change:",
          states.previous,
          "→",
          states.current
        );
      }
    );

    return () => {
      if (channelRef.current) {
        channelRef.current.unbind_all();
        pusherRef.current?.unsubscribe(channelRef.current.name);
        channelRef.current = null;
      }
      if (pusherRef.current) {
        pusherRef.current.disconnect();
        pusherRef.current = null;
      }
    };
  }, [userName, currentUserId]);

  const subscribeToRoom = useCallback((roomId: string) => {
    if (!pusherRef.current) {
      console.warn("Pusher client not initialized");
      return;
    }

    // Cancel previous subscription
    if (channelRef.current) {
      console.log(
        "Unsubscribing from previous channel:",
        channelRef.current.name
      );
      channelRef.current.unbind_all();
      pusherRef.current.unsubscribe(channelRef.current.name);
    }

    // Subscribe to new room
    const channelName = `presence-chat-room-${roomId}`;
    console.log("Subscribing to presence channel:", channelName);
    channelRef.current = pusherRef.current.subscribe(
      channelName
    ) as PresenceChannel;

    channelRef.current.bind("new-message", (data: Message) => {
      console.log("Received new message:", data);
      setMessages((prev) => {
        // Prevent duplicate messages
        const exists = prev.some((msg) => msg.id === data.id);
        if (exists) {
          console.log("Message already exists, skipping:", data.id);
          return prev;
        }
        return [...prev, data];
      });

      // Update message count for current room in room list
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === currentRoom?.id
            ? { ...room, _count: { messages: room._count.messages + 1 } }
            : room
        )
      );
    });

    // Listen for online user changes
    channelRef.current.bind(
      "pusher:subscription_succeeded",
      (members: PusherMembers) => {
        console.log(
          "Successfully subscribed to presence channel:",
          channelName
        );
        console.log("Current members:", members);
        setOnlineUsers(members.count);
        setOnlineUsersList(Object.values(members.members));
      }
    );

    channelRef.current.bind("pusher:member_added", (member: PusherMember) => {
      console.log("Member added:", member);
      setOnlineUsers((prev) => prev + 1);
      setOnlineUsersList((prev) => [...prev, member]);
    });

    channelRef.current.bind("pusher:member_removed", (member: PusherMember) => {
      console.log("Member removed:", member);
      setOnlineUsers((prev) => Math.max(0, prev - 1));
      setOnlineUsersList((prev) =>
        prev.filter((user) => user.id !== member.id)
      );
    });

    channelRef.current.bind("pusher:subscription_succeeded", () => {
      console.log("Successfully subscribed to channel:", channelName);
    });

    channelRef.current.bind("pusher:subscription_error", (error: Error) => {
      console.error("Subscription error for channel", channelName, ":", error);
    });
  }, []);

  // Load chat room list
  useEffect(() => {
    fetchRooms();
  }, []);

  // Subscribe to current room
  useEffect(() => {
    if (
      !currentRoom ||
      !pusherRef.current ||
      pusherRef.current.connection.state !== "connected"
    ) {
      return;
    }

    // If Pusher is connected, subscribe immediately
    if (pusherRef.current?.connection.state === "connected") {
      subscribeToRoom(currentRoom.id);
    }

    // Load historical messages
    fetchMessages(currentRoom.id);
  }, [currentRoom, subscribeToRoom]);

  const fetchRooms = async () => {
    try {
      setIsLoadingRooms(true);
      const response = await fetch("/api/chat/rooms");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setRooms(data);
        if (data.length > 0 && !currentRoom) {
          setCurrentRoom(data[0]);
        }
      } else {
        console.error("API returned non-array data:", data);
        setRooms([]);
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
      setRooms([]);
    } finally {
      setIsLoadingRooms(false);
    }
  };

  const fetchMessages = async (roomId: string) => {
    try {
      setIsLoadingMessages(true);
      const response = await fetch(`/api/chat/messages?roomId=${roomId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (Array.isArray(data)) {
        setMessages(data);
      } else {
        console.error("Messages API returned non-array data:", data);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      setMessages([]);
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const debouncedSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !currentRoom || !userName || isSending) return;

    // Check Pusher connection status
    if (!isConnected || pusherRef.current?.connection.state !== "connected") {
      setMessageError(
        "Connection lost, please wait for reconnection and try again"
      );
      setTimeout(() => setMessageError(""), 3000);
      return;
    }

    // Check message content
    if (containsProfanity(newMessage)) {
      setMessageError(
        "Message contains inappropriate content, please re-enter"
      );
      setTimeout(() => setMessageError(""), 3000);
      return;
    }

    setIsSending(true);
    setMessageError("");

    try {
      // Filter message content
      const filteredContent = filterProfanity(newMessage);

      const response = await fetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: filteredContent,
          userId: currentUserId,
          userName,
          roomId: currentRoom.id,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Message sent successfully:", result);

      // Update message count for current room in room list
      setRooms((prevRooms) =>
        prevRooms.map((room) =>
          room.id === currentRoom.id
            ? { ...room, _count: { messages: room._count.messages + 1 } }
            : room
        )
      );

      setNewMessage("");
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = "auto";
      }
    } catch (error) {
      console.error("Failed to send message:", error);
      setMessageError(
        "Failed to send message, please check network connection"
      );
      setTimeout(() => setMessageError(""), 3000);
    } finally {
      setIsSending(false);
    }
  }, [newMessage, currentRoom, userName, currentUserId, isSending]);

  const sendMessage = () => {
    // Clear previous timer
    if (sendTimeoutRef.current) {
      clearTimeout(sendTimeoutRef.current);
    }

    // Set debounce delay
    sendTimeoutRef.current = setTimeout(() => {
      debouncedSendMessage();
    }, 300);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (pusherRef.current) {
        const state = pusherRef.current.connection.state;
        console.log("Current Pusher state:", state);

        // If disconnected and user is logged in, try to reconnect
        if (state === "disconnected" && userName && !isConnected) {
          console.log("Attempting to reconnect...");
          pusherRef.current.connect();
        }
      }
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, [userName, isConnected]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Auto-adjust textarea height
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setNewMessage(value);

    // Clear previous error messages
    if (messageError) {
      setMessageError("");
    }

    // Auto-adjust height
    const textarea = e.target;
    textarea.style.height = "auto";
    const scrollHeight = textarea.scrollHeight;
    const maxHeight = 120; // Maximum height
    textarea.style.height = `${Math.min(scrollHeight, maxHeight)}px`;
  };

  // Validate nickname
  const validateNickname = (nickname: string) => {
    if (!nickname.trim()) {
      setNicknameError("Please enter a nickname");
      return false;
    }

    if (!isValidNickname(nickname)) {
      if (nickname.toLowerCase().trim() === "austin") {
        setNicknameError(
          "This nickname is not available, please choose another"
        );
      } else {
        setNicknameError(
          "Nickname contains inappropriate content, please re-enter"
        );
      }
      return false;
    }

    setNicknameError("");
    return true;
  };

  const handleUserNameSubmit = () => {
    if (validateNickname(userName)) {
      localStorage.setItem("chatUserName", userName.trim());
      setShowUserModal(false);
    }
  };

  // Handle nickname input changes
  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setUserName(value);

    // Real-time validation
    if (value.trim()) {
      validateNickname(value);
    } else {
      setNicknameError("");
    }
  };

  // Select room and close sidebar on mobile
  const selectRoom = (room: ChatRoom) => {
    setCurrentRoom(room);
    setIsMobileSidebarOpen(false);
  };

  useEffect(() => {
    return () => {
      if (sendTimeoutRef.current) {
        clearTimeout(sendTimeoutRef.current);
      }
    };
  }, []);

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("zh-CN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getThemeClasses = () => {
    const isDark = theme === "dark";
    return {
      // Main container
      mainContainer: isDark ? "bg-gray-900" : "bg-gray-100",
      // Sidebar
      sidebar: isDark
        ? "bg-gray-800 border-gray-700"
        : "bg-white border-gray-200",
      sidebarBorder: isDark ? "border-gray-700" : "border-gray-200",
      // Text colors
      primaryText: isDark ? "text-white" : "text-gray-900",
      secondaryText: isDark ? "text-gray-400" : "text-gray-500",
      // Hover effects
      hoverBg: isDark ? "hover:bg-gray-700" : "hover:bg-gray-50",
      // Selected state
      selectedBg: isDark
        ? "bg-gradient-to-r from-[#213C61] to-[#4C638C]"
        : "bg-gradient-to-r from-[#213C61] to-[#496189]",
      // Input box
      inputBg: isDark
        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
        : "bg-white border-gray-300 text-gray-900 placeholder-gray-500",
      // Modal
      modalBg: isDark
        ? "bg-gradient-to-r from-[#213C61] to-[#4C638C]"
        : "bg-gradient-to-r from-gray-200 to-gray-300",
      // Message bubble
      messageBg: isDark
        ? "bg-gradient-to-r from-[#213C61] to-[#4C638C]"
        : "bg-gradient-to-r from-gray-200 to-gray-300",
    };
  };

  const themeClasses = getThemeClasses();

  // Chat room skeleton component
  const RoomSkeleton = () => (
    <div className="p-2 animate-pulse">
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="p-3 border-b border-gray-200 dark:border-gray-700 mb-2"
        >
          <div className="flex items-center justify-between">
            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-6"></div>
          </div>
          <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-32 mt-2"></div>
        </div>
      ))}
    </div>
  );

  // Message skeleton component
  const MessageSkeleton = () => (
    <div className="p-4 space-y-4 animate-pulse">
      {[...Array(5)].map((_, index) => (
        <div
          key={index}
          className={`flex items-start space-x-3 ${
            index % 2 === 0 ? "" : "flex-row-reverse space-x-reverse"
          }`}
        >
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex-shrink-0"></div>
          <div
            className={`flex-1 max-w-xs lg:max-w-md ${
              index % 2 === 0 ? "" : "flex flex-col justify-end items-end"
            }`}
          >
            <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-16 mb-2"></div>
            <div
              className={`h-10 bg-gray-300 dark:bg-gray-600 rounded-lg w-${
                index % 2 === 0 ? "32" : "24"
              }`}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );

  // Sidebar component
  const Sidebar = ({ className = "" }: { className?: string }) => (
    <div
      className={`${themeClasses.sidebar} border-r flex flex-col ${className}`}
    >
      {/* Fixed header */}
      <div
        className={`px-4 py-2 border-b ${themeClasses.sidebarBorder} flex-shrink-0`}
      >
        <div className="flex items-center justify-between">
          <h1
            className={`text-lg md:text-xl font-bold ${themeClasses.primaryText}`}
          >
            Chat Rooms
          </h1>
          <div className="flex items-center space-x-2">
            {/* Mobile navigation buttons */}
            <div className="flex md:hidden items-center ">
              <Link
                href="/blog"
                className={`p-2 ${themeClasses.hoverBg} rounded`}
              >
                <SvgIcon
                  name="docs"
                  className="w-5 h-5"
                  lightColor="#6b7280"
                  darkColor="#9ca3af"
                />
              </Link>
              <Link href="/" className={`p-2 ${themeClasses.hoverBg} rounded`}>
                <SvgIcon
                  name="home"
                  className="w-5 h-5"
                  lightColor="#6b7280"
                  darkColor="#9ca3af"
                />
              </Link>
            </div>
            <div
              className={`w-3 h-3 rounded-full ${
                isConnected ? "bg-green-500" : "bg-red-500"
              }`}
              title={isConnected ? "Connected" : "Disconnected"}
            />
            {/* Mobile close button */}
            <button
              onClick={() => setIsMobileSidebarOpen(false)}
              className={`md:hidden p-1 ${themeClasses.hoverBg} rounded`}
            >
              <SvgIcon
                name="close"
                className="w-5 h-5"
                lightColor="#6b7280"
                darkColor="#9ca3af"
              />
            </button>
          </div>
        </div>
        <p className={`text-sm ${themeClasses.secondaryText} mt-1`}>
          Welcome, {userName}
        </p>
      </div>

      {/* Scrollable room list */}
      <div className="flex-1 overflow-y-auto">
        {isLoadingRooms ? (
          <RoomSkeleton />
        ) : (
          <div className="p-2">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => selectRoom(room)}
                className={`p-3 cursor-pointer border-b rounded-lg mb-1 transition-colors ${
                  themeClasses.sidebarBorder
                } ${themeClasses.hoverBg} ${
                  currentRoom?.id === room.id ? themeClasses.selectedBg : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3
                    className={`font-medium text-sm md:text-base ${
                      themeClasses.primaryText
                    } ${currentRoom?.id === room.id ? "text-white" : ""}`}
                  >
                    {room.name}
                  </h3>
                  <span
                    className={`text-xs md:text-sm ${
                      themeClasses.secondaryText
                    } ${currentRoom?.id === room.id ? "text-white" : ""}`}
                  >
                    {room._count.messages}
                  </span>
                </div>
                {room.description && (
                  <p
                    className={`text-xs md:text-sm ${
                      themeClasses.secondaryText
                    } mt-1 ${currentRoom?.id === room.id ? "text-white" : ""}`}
                  >
                    {room.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (showUserModal) {
    return (
      <>
        <Head>
          <title>Chat Room - austin&rsquo;s web</title>
        </Head>
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`${themeClasses.modalBg} rounded-lg p-6 w-full max-w-md mx-4`}
          >
            <h2 className={`text-[16px] mb-4 ${themeClasses.primaryText}`}>
              Please enter your chat nickname
            </h2>
            <div className="mb-4">
              <input
                type="text"
                value={userName}
                onChange={handleNicknameChange}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleUserNameSubmit();
                  }
                }}
                placeholder="Please enter nickname"
                className={`w-full p-3 outline-none rounded-lg text-base ${
                  themeClasses.inputBg
                } ${nicknameError ? "border-red-500" : ""}`}
                maxLength={20}
                autoFocus
              />
              {nicknameError && (
                <p className="text-red-500 text-sm mt-2">{nicknameError}</p>
              )}
            </div>
            <button
              type="button"
              onClick={handleUserNameSubmit}
              disabled={!userName.trim() || !!nicknameError}
              className={`w-full text-white p-3 rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed text-base ${themeClasses.selectedBg} cursor-pointer`}
            >
              Enter Chat Room
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Chat Room - austin&rsquo;s web</title>
      </Head>
      <div className="h-screen flex flex-col md:justify-center md:items-center">
        {/* Navigation buttons - Desktop */}
        <div className="hidden md:flex fixed top-4 left-4 z-10 gap-2">
          <Link
            href="/blog"
            className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-2 text-white backdrop-blur-sm"
          >
            <SvgIcon name="left" width={16} height={16} color="#fff" />
            <span className="text-sm">Articles</span>
          </Link>
          <Link
            href="/"
            className="bg-[rgba(0,0,0,.5)] hover:bg-[rgba(0,0,0,.7)] rounded-[5px] p-[8px] cursor-pointer transition-all duration-200 flex items-center gap-2 text-white backdrop-blur-sm"
          >
            <SvgIcon name="home" width={16} height={16} color="#fff" />
            <span className="text-sm">Home</span>
          </Link>
        </div>

        <div
          className={`flex h-full md:h-[80vh] w-full md:w-[90vw] lg:w-[80vw] ${themeClasses.mainContainer} md:rounded-[10px] md:p-[10px]`}
        >
          {/* Desktop sidebar */}
          <Sidebar className="hidden md:flex w-80 rounded-l-[10px]" />

          {/* Mobile sidebar overlay */}
          {isMobileSidebarOpen && (
            <div
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileSidebarOpen(false)}
            />
          )}

          {/* Mobile sidebar drawer */}
          <div
            className={`fixed top-0 left-0 h-full w-80 max-w-[85vw] z-50 transform transition-transform duration-300 md:hidden ${
              isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
            }`}
          >
            <Sidebar className="h-full" />
          </div>

          {/* Main chat area */}
          <div className="flex-1 flex flex-col">
            {currentRoom ? (
              <>
                {/* Chat header */}
                <div
                  className={`px-4 py-[10px] ${themeClasses.sidebar} border-b ${themeClasses.sidebarBorder} flex items-center justify-between rounded-r-[10px] flex-shrink-0`}
                >
                  <div className="flex items-center space-x-3 relative w-full pt-safe-top">
                    {/* Mobile menu button */}
                    <button
                      onClick={() => setIsMobileSidebarOpen(true)}
                      className={`md:hidden p-2 ${themeClasses.hoverBg} rounded`}
                    >
                      <SvgIcon
                        name="menu"
                        className="w-5 h-5"
                        lightColor="#6b7280"
                        darkColor="#9ca3af"
                      />
                    </button>
                    <div>
                      <div
                        className={`text-base flex gap-[20px] md:text-lg font-semibold ${themeClasses.primaryText}`}
                      >
                        {currentRoom.name}

                        {/* Online user count display */}
                        <div className="flex items-center space-x-2 font-normal">
                          <div className="flex items-center space-x-1">
                            <span
                              className={`text-xs md:text-sm ${themeClasses.secondaryText}`}
                            >
                              Current online users: {onlineUsers}
                            </span>
                          </div>
                        </div>
                      </div>
                      {currentRoom.description && (
                        <p
                          className={`text-xs md:text-sm ${themeClasses.secondaryText}`}
                        >
                          {currentRoom.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Message list */}
                <div className="flex-1 overflow-y-auto px-3 md:px-4 py-2 md:py-4 space-y-3 md:space-y-4 custom-scrollbar">
                  {isLoadingMessages ? (
                    <MessageSkeleton />
                  ) : (
                    <>
                      {messages.map((message) => {
                        const isMyMessage = message.userId === currentUserId;
                        return (
                          <div
                            key={message.id}
                            className={`flex items-start space-x-2 md:space-x-3 ${
                              isMyMessage
                                ? "flex-row-reverse space-x-reverse"
                                : ""
                            }`}
                          >
                            <div
                              className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-medium flex-shrink-0 ${themeClasses.selectedBg}`}
                            >
                              {message.userName.charAt(0).toUpperCase()}
                            </div>
                            <div
                              className={`flex-1 max-w-[75%] md:max-w-xs lg:max-w-md ${
                                isMyMessage ? "text-right md:mr-[10px]" : ""
                              }`}
                            >
                              <div
                                className={`flex items-center space-x-2 mb-1 ${
                                  isMyMessage
                                    ? "flex-row-reverse space-x-reverse"
                                    : ""
                                }`}
                              >
                                <span
                                  className={`text-xs ${themeClasses.secondaryText}`}
                                >
                                  {message.userName}
                                </span>
                                <span
                                  className={`text-xs ${themeClasses.secondaryText}`}
                                >
                                  {formatTime(message.createdAt)}
                                </span>
                              </div>
                              <div
                                className={`px-3 py-2 text-[14px] rounded-lg w-fit break-word ${
                                  isMyMessage
                                    ? "bg-gray-500 text-white ml-auto text-left"
                                    : themeClasses.messageBg
                                }`}
                              >
                                {message.content}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </>
                  )}
                </div>

                {/* Input area */}
                <div
                  className={`p-3 md:p-4 border-t rounded-b-[10px] ${themeClasses.sidebarBorder} ${themeClasses.sidebar}`}
                >
                  {messageError && (
                    <div className="mb-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                      {messageError}
                    </div>
                  )}
                  <div className="flex items-end space-x-2 md:space-x-3">
                    <textarea
                      ref={textareaRef}
                      value={newMessage}
                      onChange={handleTextareaChange}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter message..."
                      className={`flex-1 p-2 border rounded-lg resize-none text-base ${themeClasses.inputBg} focus:outline-none focus:ring-2 focus:ring-gray-500 custom-scrollbar`}
                      rows={1}
                      style={{ minHeight: "44px", maxHeight: "120px" }}
                    />
                    <button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || isSending}
                      className={`text-white px-4 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[60px] h-[44px] transition-colors ${themeClasses.selectedBg}`}
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <span className="text-sm md:text-base">Send</span>
                      )}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div
                className={`flex-1 flex items-center justify-center ${themeClasses.primaryText}`}
              >
                <p className="text-lg">Please select a chat room</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
