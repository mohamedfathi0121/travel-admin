import { useState, useEffect } from "react";
import { FaBan, FaUnlock, FaMapMarkerAlt } from "react-icons/fa";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import supabase from "../utils/supabase";
import toast from "react-hot-toast";

export default function UserProfile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch User Data by ID
  const fetchUser = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("userprofiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error("❌ Error fetching user:", error);
      toast.error("Failed to load user profile.");
    } else {
      setUser(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  // ✅ Real-time Listener for ANY Changes on This User
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`user-status-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all changes (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "userprofiles",
          filter: `id=eq.${id}`,
        },
        (payload) => {
          console.log("🔄 Realtime update received:", payload.new);
          if (payload.eventType === "DELETE") {
            toast.error("This user has been deleted.");
            setUser(null);
          } else {
            setUser(payload.new);
          }
        }
      )
      .subscribe((status) => console.log("✅ Realtime Subscribed:", status));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  // ✅ Handle Block / Unblock User via Edge Function
  const toggleBlockStatus = async () => {
    if (!user) return;
    setUpdating(true);

    try {
      const action = user.is_blocked ? "activate" : "block";

      const { data, error } = await supabase.functions.invoke(
        "update-customer-status",
        {
          body: { action, user_id: user.id },
        }
      );

      if (error || data?.error) {
        console.error("❌ Error updating status:", error || data.error);
        toast.error(data?.error || "Failed to update user status.");
        return;
      }

      toast.success(
        `User ${action === "block" ? "blocked" : "activated"} successfully`
      );
      // ✅ UI will auto-update via realtime listener
    } catch (err) {
      console.error("❌ Unexpected error:", err);
      toast.error("Something went wrong.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading)
    return <p className="text-center py-10">Loading...</p>;
  if (!user)
    return (
      <p className="text-center text-red-500 min-h-[calc(100vh-130px)] flex justify-center items-center">
        User not found.
      </p>
    );

  const fullAddress = `${user.city || ""}, ${user.country || ""}`;

  return (
    <div className="min-h-screen bg-background text-text-primary rounded-xl shadow-lg p-6 space-y-6 max-w-3xl mx-auto m-5">
      {/* ✅ Header */}
      <div className="flex items-center gap-4 border-b border-text-secondary pb-4">
        <img
          src={user.avatar_url || "/default-avatar.png"}
          alt="Avatar"
          className="w-20 h-20 rounded-full object-cover border border-text-secondary"
        />
        <div>
          <h2 className="text-2xl font-bold">
            {user.display_name || "Unnamed"}
          </h2>
          <p className="text-sm text-text-secondary">ID: {user.id}</p>
          <p className="text-sm text-text-secondary">{user.email}</p>
        </div>
      </div>

      {/* ✅ Basic Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-text-secondary">Age</p>
          <p>{user.age || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Gender</p>
          <p>{user.gender || "N/A"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-text-secondary">Phone</p>
          <p>{user.phone_number || "N/A"}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-text-secondary">Address</p>
          <p>{fullAddress}</p>
        </div>
        <div className="md:col-span-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              fullAddress
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center gap-2 mt-1"
          >
            <FaMapMarkerAlt /> View on Map
          </a>
        </div>
      </div>

      {/* ✅ Date of Birth & Created At */}
      <div>
        <p className="text-sm text-text-secondary">Date of Birth</p>
        <p>
          {user.date_of_birth
            ? dayjs(user.date_of_birth).format("MMMM D, YYYY")
            : "N/A"}
        </p>
      </div>
      <div>
        <p className="text-sm text-text-secondary">Created At</p>
        <p>{dayjs(user.created_at).format("MMMM D, YYYY h:mm A")}</p>
      </div>

      {/* ✅ Status */}
      <div>
        <p className="text-sm text-text-secondary">Status</p>
        <p
          className={`font-semibold ${
            user.is_blocked ? "text-red-600" : "text-green-600"
          }`}
        >
          {user.is_blocked ? "Blocked" : "Active"}
        </p>
      </div>

      {/* ✅ Action Button */}
      <div className="pt-4">
        <button
          disabled={updating}
          onClick={toggleBlockStatus}
          className={`flex items-center gap-2 ${
            user.is_blocked
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          } text-white px-4 py-2 rounded`}
        >
          {user.is_blocked ? <FaUnlock /> : <FaBan />}
          {user.is_blocked ? "Unblock User" : "Block User"}
        </button>
      </div>
    </div>
  );
}
