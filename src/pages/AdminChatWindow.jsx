import { useState, useEffect, useRef } from "react";
import dayjs from "dayjs";
import supabase from "../utils/supabase";
import toast from "react-hot-toast";

export default function AdminChatWindow({ chat, adminId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatStatus, setChatStatus] = useState(chat.status);
  const messagesEndRef = useRef(null);

  // ✅ Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // ✅ Fetch initial messages
  const fetchMessages = async () => {
    const { data, error } = await supabase
      .from("chat_messages")
      .select("id, sender_id, message_text, created_at")
      .eq("chat_id", chat.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error(error);
    } else {
      setMessages(data);
    }
  };

  useEffect(() => {
    setChatStatus(chat.status); // Update status when changing chats
    fetchMessages();
  }, [chat.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // ✅ Real-time subscription (prevents duplicates)
  useEffect(() => {
    const channel = supabase
      .channel(`admin_chat_${chat.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `chat_id=eq.${chat.id}`,
        },
        payload => {
          setMessages(prev => {
            const filtered = prev.filter(
              m =>
                !(
                  m.sender_id === payload.new.sender_id &&
                  m.message_text === payload.new.message_text &&
                  m.id.toString().startsWith("temp-")
                )
            );

            if (filtered.find(m => m.id === payload.new.id)) return filtered;
            return [...filtered, payload.new];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [chat.id]);

  // ✅ Send Message via Supabase Edge Function (Optimistic Update)
  const handleSend = async () => {
    if (!input.trim() || chatStatus === "closed") {
      return alert("Chat closed");
    }

    const textToSend = input.trim();
    setInput("");

    // Optimistic message
    const optimisticMsg = {
      id: `temp-${Date.now()}`,
      sender_id: adminId,
      message_text: textToSend,
      created_at: new Date().toISOString(),
      role: "admin",
    };
    setMessages(prev => [...prev, optimisticMsg]);

    const { error } = await supabase.functions.invoke("send-admin-reply", {
      body: {
        admin_id: adminId,
        chat_id: chat.id,
        role: "admin",
        message_text: textToSend,
      },
    });

    if (error) {
      console.error("Failed to send admin message:", error);
      alert("Failed to send message");
      setMessages(prev => prev.filter(m => m.id !== optimisticMsg.id));
    }
  };

  // ✅ Close Chat (Admin Action)
  const handleCloseChat = async () => {
    const { error } = await supabase
      .from("support_chats")
      .update({ status: "closed" })
      .eq("id", chat.id);

    if (error) {
      console.error("Error closing chat:", error);
      alert("Failed to close chat");
    } else {
      setChatStatus("closed");
      toast.success("Chat closed successfully");
    }
  };

  return (
    <div className="h-full flex flex-col bg-background">
      {/* Header */}
      <div className="bg-button-primary text-button-text p-3 flex justify-between items-center">
        <span className="font-bold">
          Chat with{" "}
          {chat.company_id
            ? `Company ${chat.company_id}`
            : `User ${chat.user_id}`}
        </span>
        <div className="flex space-x-2">
          {chatStatus !== "closed" && (
            <button
              onClick={handleCloseChat}
              className="text-sm bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
            >
              Close Chat
            </button>
          )}
          <button onClick={onClose} className="text-sm underline">
            Back
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex ${
              msg.sender_id === adminId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-3 py-2 rounded-lg max-w-xs ${
                msg.sender_id === adminId
                  ? "bg-button-primary text-button-text"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <div>{msg.message_text}</div>
              <div className="text-[10px] mt-1 text-right opacity-70">
                {dayjs(msg.created_at).format("h:mm A")}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t p-2 flex bg-background ">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleSend()}
          placeholder={
            chatStatus === "closed" ? "Chat closed" : "Type a message..."
          }
          disabled={chatStatus === "closed"}
          className="flex-1 text-sm px-2 py-1 rounded border bg-input border-gray-300 disabled:bg-input"
        />
     <button
  onClick={handleSend}
  disabled={!input.trim() || chatStatus === "closed"} // ✅ Disable if input empty or chat closed
  className={`ml-2 px-3 rounded text-sm ${
    !input.trim() || chatStatus === "closed"
      ? "bg-gray-400 text-white cursor-not-allowed" // Disabled style
      : "bg-button-primary text-button-text hover:bg-button-primary-hover" // Active style
  }`}
>
  Send
</button>

      </div>
    </div>
  );
}
