import { useState, useEffect } from "react";
import dayjs from "dayjs";
import supabase from "../utils/supabase";
import AdminChatWindow from "./AdminChatWindow";
import { useAuth } from "../hooks/useAuth";
import { useLocation } from "react-router-dom";

export default function AdminDashboard() {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [statusFilter, setStatusFilter] = useState("open");
  const { user } = useAuth();
  const location = useLocation();
  const role = location.state?.status || "company_user"; // Default to company_user if not provided

  console.log("Role:", role);
  console.log("User:", location.state);

  // ✅ Fetch chats by status
  const fetchChats = async () => {
    const { data, error } = await supabase
      .from("support_chats")
      .select("id, user_id, admin_id, status, last_message_text, last_message_at")
      .eq("status", statusFilter)
      .eq("role", role)
      .order("last_message_at", { ascending: false });

    if (error) {
      console.error("Error fetching chats:", error);
    } else {
      setChats(data);
    }
  };

  useEffect(() => {
    fetchChats();
  }, [statusFilter, role]);

  // ✅ Real-time updates for chat changes
  useEffect(() => {
    const channel = supabase
      .channel("realtime-support-chats")
      .on(
        "postgres_changes",
        {
          event: "*", // listen to INSERT, UPDATE, DELETE
          schema: "public",
          table: "support_chats",
          filter: `role=eq.${role}`, // only listen to relevant role
        },
        (payload) => {
          console.log("🔄 Chat updated:", payload);

          setChats((prevChats) => {
            let updatedChats = [...prevChats];

            if (payload.eventType === "INSERT") {
              // ✅ Add new chat if it matches the current filter
              if (payload.new.status === statusFilter) {
                updatedChats = [payload.new, ...updatedChats];
              }
            }

            if (payload.eventType === "UPDATE") {
              const index = updatedChats.findIndex((c) => c.id === payload.new.id);

              // ✅ Update chat if it exists in the list
              if (index !== -1) {
                if (payload.new.status === statusFilter) {
                  updatedChats[index] = { ...updatedChats[index], ...payload.new };
                  updatedChats = [...updatedChats].sort(
                    (a, b) => new Date(b.last_message_at) - new Date(a.last_message_at)
                  );
                } else {
                  // ✅ Remove if status changed and no longer matches filter
                  updatedChats.splice(index, 1);
                }
              } else if (payload.new.status === statusFilter) {
                // ✅ Add if it wasn't in the list but now matches the filter
                updatedChats = [payload.new, ...updatedChats];
              }
            }

            if (payload.eventType === "DELETE") {
              updatedChats = updatedChats.filter((c) => c.id !== payload.old.id);
            }

            return updatedChats;
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [statusFilter, role]);

  return (
    <div className="flex flex-col md:flex-row h-screen bg-background text-text-primary">
      {/* Sidebar - Chat List */}
      <div
        className={`${
          selectedChat ? "hidden md:block" : "block"
        } w-full md:w-1/3 border-r p-4 overflow-y-auto`}
      >
        <h2 className="text-xl font-bold mb-4">Chats</h2>

        {/* Filter Buttons */}
        <div className="flex flex-wrap md:flex-nowrap space-x-2 mb-4">
          {["open", "in_progress", "waiting", "closed"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-2 py-1 rounded text-sm mb-2 md:mb-0 ${
                statusFilter === status
                  ? "bg-button-primary text-button-primary-text"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Chat List */}
        {chats.map((chat) => (
          <div
            key={chat.id}
            onClick={() => setSelectedChat(chat)}
            className="p-3 mb-2 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <div className="text-sm font-semibold">
              {role === "company_user" ? `Company User: ${chat.user_id}` : `User: ${chat.user_id}`}
            </div>
            <div className="text-xs text-gray-600 truncate">
              {chat.last_message_text || "No messages yet"}
            </div>
            <div className="text-xs text-gray-400">
              {chat.last_message_at
                ? dayjs(chat.last_message_at).format("MMM D, h:mm A")
                : ""}
            </div>
          </div>
        ))}
        {chats.length === 0 && (
          <div className="flex justify-center items-center h-[calc(100vh-200px)] text-text-secondary mt-4">
            <p>No chats available</p>
          </div>
        )}
      </div>

      {/* Main Chat Window */}
      <div className="flex-1">
        {selectedChat ? (
          <AdminChatWindow
            chat={selectedChat}
            adminId={user.id}
            onClose={() => setSelectedChat(null)}
          />
        ) : (
          <div className="flex justify-center items-center h-full text-gray-500">
            Select a chat to view messages
          </div>
        )}
      </div>
    </div>
  );
}
