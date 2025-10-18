import React, { useState, useEffect, useRef } from "react";
import { Search, Send } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import APIMessage from "../../api/librarian.api";
interface TokenPayload {
  userId: string;
  roleId?: string;
}

interface Message {
  id: number;
  sender: "me" | "other";
  content: string;
  time: string;
}

const ChatPage = () => {
  const token = localStorage.getItem("token");
  const [conversations, setConversations] = useState<any[]>([]);
 const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

  // ✅ Giải mã token để lấy userId hiện tại
  let currentUserId = "";
  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      currentUserId = decoded.userId;
      console.log("🪪 ID người dùng từ token:", currentUserId);
    } catch (error) {
      console.warn("⚠️ Token decode failed:", error);
    }
  }
    // ======== 1️⃣ Kết nối WebSocket realtime ========
  useEffect(() => {
    socketRef.current = new WebSocket("ws://localhost:3000"); // đổi theo BE của bạn

    socketRef.current.onopen = () => {
      console.log("✅ Kết nối WebSocket thành công");

      // Gửi đăng ký userId lên server
      socketRef.current?.send(
        JSON.stringify({ type: "register", userId: currentUserId })
      );
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Nhận từ server:", data);
      const msg = data.data;

      if (data.type === "new_message") {
        console.log("New message data:", msg);
        // Nếu là tin nhắn realtime
        setMessages((prev) => [
          ...prev,
          {
            id: msg._id || Date.now(),
            content: msg.content,
            time: new Date(msg.createdAt).toLocaleString(),
            sender: msg.sender_id === currentUserId ? "me" : "other",
          },
        ]);
      }

      if (data.type === "conversationUpdate") {
        // Cập nhật danh sách hội thoại nếu cần
        setConversations(data.conversations);
      }
    };

    socketRef.current.onclose = () => {
      console.log("❌ WebSocket bị đóng");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [currentUserId]);

  // Lấy danh sách cuộc hội thoại từ backend
  useEffect(() => {
    console.log("⚙️ UseEffect chạy");

    const fetchMessages = async () => {
      try {
        const res = await fetch(APIMessage.APIGetConversations, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        console.log("📨 Dữ liệu backend trả về:", result);
        setConversations(result.data || []);
      } catch (error) {
        console.error("❌ Lỗi khi gọi API:", error);
      }
    };

    fetchMessages();
  }, [token]);
  
    // ✅ Lấy danh sách tin nhắn từ backend
useEffect(() => {
  console.log("⚙️ UseEffect chạy", selectedUser?.user_id._id);
if (!selectedUser?.user_id._id) return;
  const fetchMessages = async () => {
    try {
      const res = await fetch(`${APIMessage.APIGetMessage}/${selectedUser.user_id._id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      console.log("📨 Dữ liệu backend trả về:", result);
      if (Array.isArray(result?.data)) {
        const formattedMessages = result.data.map((msg: any, index: number) => ({
          id: msg._id || index,
          content: msg.content,
          time: new Date(msg.createdAt).toLocaleString(),
          sender: msg.sender_id === currentUserId ? "me" : "other", // So sánh ID user hiện tại
        }));

        setMessages(formattedMessages);
        console.log("✅ Tin nhắn đã format:", formattedMessages);
      } else {
        console.warn("⚠️ Không có mảng dữ liệu trong result.data");
      }
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error);
    }
  };

  fetchMessages();
}, [selectedUser]);


  // ✅ Tự động scroll xuống khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Gửi tin nhắn
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (messageInput.trim() === "") return;

    const newMessage: Message = {
      id: Date.now(),
      sender: "me",
      content: messageInput,
      time: new Date().toLocaleString(),
    };
  const msg = {
      type: "new_message",
      toUserId: selectedUser.user_id._id,
      content: messageInput,
      time: new Date().toISOString(),
    };

    // Gửi lên server
    socketRef.current?.send(JSON.stringify(msg));
    setMessages((prev) => [...prev, newMessage]);

    try {
      const response = await fetch(`${APIMessage.APISendMessage}/${selectedUser.user_id._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ contentInput: messageInput }),
      });

      const data = await response.json();
      console.log("📨 Server response:", data);
      setMessageInput("");

      // ✅ Nếu server phản hồi tin nhắn tự động
      if (data?.data?.reply) {
        const replyMessage: Message = {
          id: Date.now() + 1,
          sender: "other",
          content: data.data.reply,
          time: new Date().toLocaleString(),
        };
        setMessages((prev) => [...prev, replyMessage]);
      }
    } catch (error) {
      console.error("❌ Send failed:", error);
    }
  };

  return (
    <div className="flex h-screen bg-[#f5f6fa] text-[#333] font-sans">
      {/* ===== CỘT TRÁI: Danh sách người dùng ===== */}
      <div className="w-80 border-r border-gray-300 bg-white flex flex-col">
        {/* Thanh tìm kiếm */}
        <div className="sticky top-0 bg-white z-10 p-3 border-b border-gray-200">
          <div className="flex items-center bg-[#f1f3f5] rounded-full px-4 py-3 h-10">
            <Search size={18} className="text-gray-500 mr-3" />
            <input
              type="text"
              placeholder="Tìm người dùng..."
              className="bg-transparent outline-none text-[15px] w-full"
            />
          </div>
        </div>

        {/* Danh sách hội thoại */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => {
            const user = conversation.user_id;
            if (!user) return null; // Bỏ qua cuộc hội thoại bị lỗi

            return (
              <div
                key={conversation._id}
                onClick={() => setSelectedUser(conversation)}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-[#f0f4ff] transition ${
                  selectedUser?.id === conversation._id ? "bg-[#e7edff]" : ""
                }`}
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.fullname || "Người dùng"}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm truncate">
                    {user.fullname || "Người dùng ẩn"}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {conversation.lastMessages || ""}
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  {conversation.lastMessagesTime || ""}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ===== KHUNG CHAT ===== */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3 border-b bg-white sticky top-0 z-10 shadow-sm">
          <img
            src={selectedUser?.user_id.avatar}
            alt={selectedUser?.user_id.fullname}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <div className="font-semibold text-[#1e3050]">
              {selectedUser?.user_id.fullname}
            </div>
            <div className="text-xs text-gray-500">Đang hoạt động</div>
          </div>
        </div>

       {/* Nội dung tin nhắn */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-[#f5f6fa]">
          {messages.map((msg) => (
            <div key={msg.id}>
              {/* Tin nhắn của người khác */}
              {msg.sender === "other" && (
                <div className="flex items-end gap-2">
                  <img
                    src="https://i.pravatar.cc/40?img=12"
                    alt="other"
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="bg-gray-200 px-4 py-2 rounded-2xl shadow-md max-w-xs">
                    <p className="text-sm text-gray-800">{msg.content}</p>
                    <span className="text-[10px] text-gray-500 block text-right mt-1">
                      {msg.time}
                    </span>
                  </div>
                </div>
              )}

              {/* Tin nhắn của mình */}
              {msg.sender === "me" && (
                <div className="flex items-end gap-2 justify-end">
                  <div className="bg-blue-600 text-white px-4 py-2 rounded-2xl shadow-md max-w-xs">
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-[10px] text-gray-200 block text-right mt-1">
                      {msg.time}
                    </span>
                  </div>
                  <img
                    src="https://i.pravatar.cc/40?img=3"
                    alt="me"
                    className="w-8 h-8 rounded-full"
                  />
                </div>
              )}
            </div>
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Ô nhập tin nhắn */}
        <form
          onSubmit={sendMessage}
          className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-3 flex items-center gap-3 shadow-md"
        >
          <input
            type="text"
            placeholder="Nhập tin nhắn..."
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4b6cb7]"
          />
          <button
            type="submit"
            className="p-2 bg-gradient-to-r from-[#4b6cb7] to-[#182848] text-white rounded-full hover:opacity-90 transition"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
