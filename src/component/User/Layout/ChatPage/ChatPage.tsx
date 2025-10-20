import React, { useState, useEffect, useRef } from "react";
import { Send, Image } from "lucide-react";
import APISendMessage from "../../api/user.api";
import { jwtDecode } from "jwt-decode";

interface Message {
  id: number | string;
  sender: "me" | "other";
  content: string;
  time: string;
}

interface TokenPayload {
  userId: string;
  roleId?: string;
}

const ChatPage: React.FC = () => {
  console.log("⚙️ ChatPage rendered");

  const token = localStorage.getItem("token");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const socketRef = useRef<WebSocket | null>(null);

  // ✅ Giải mã token để lấy userId hiện tại
  let currentUserId = "";
  if (token) {
    try {
      const decoded = jwtDecode<TokenPayload>(token);
      console.log("🔍 Token payload đầy đủ:", decoded);
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
    };

    socketRef.current.onclose = () => {
      console.log("❌ WebSocket bị đóng");
    };

    return () => {
      socketRef.current?.close();
    };
  }, [currentUserId]);
  // ✅ Lấy danh sách tin nhắn từ backend
useEffect(() => {
  console.log("⚙️ UseEffect chạy");

  const fetchMessages = async () => {
    try {
      const res = await fetch(APISendMessage.getMessages, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      console.log("📨 Dữ liệu backend trả về:", result);

      // ✅ Dữ liệu thật nằm ở result.data (là 1 mảng)
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
}, [token]);


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
  setMessages((prev) => [...prev, newMessage]);

  try {
    const response = await fetch(APISendMessage.sendMessages, {
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
  } catch (error) {
    console.error("❌ Send failed:", error);
  }
};

  return (
    <div className="flex h-screen bg-[#f5f6fa] text-[#333] font-sans">
      {/* Khung chat */}
      <div className="flex-1 flex flex-col relative">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-gray-200 bg-white shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <img
              src="https://i.pravatar.cc/150?img=12"
              alt="Thủ thư"
              className="w-10 h-10 rounded-full object-cover shadow-sm"
            />
            <div>
              <div className="font-semibold text-[#1e3050]">Thủ thư</div>
              <div className="text-xs text-gray-500">Đang hoạt động</div>
            </div>
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
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-[#4b6cb7] transition"
          >
            <Image size={20} />
          </button>
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
