import { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import { useLocation } from "react-router-dom";
import ProfilePageSkeleton from "../components/skeleton/ProfilePageSkeleton";
import CustomerTable from "../components/CustomerTable";

const CompanyPage = () => {
  const location = useLocation();
  const status = location.state?.status || "all";
  const [filter, setFilter] = useState(status);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch users from `userprofiles`
  const fetchUsers = async () => {
    setLoading(true);

    let query = supabase.from("userprofiles").select("*");

    if (filter === "new") {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.gte("created_at", sevenDaysAgo.toISOString());
    } else if (filter === "active") {
      query = query.eq("is_blocked", false);
    } else if (filter === "blocked") {
      query = query.eq("is_blocked", true);
    }

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("❌ Error fetching users:", error);
    } else {
      setUsers(data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();

    // ✅ Setup Realtime Listener for INSERT, UPDATE, DELETE
    const channel = supabase
      .channel("userprofiles-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to INSERT, UPDATE, DELETE
          schema: "public",
          table: "userprofiles",
        },
        (payload) => {
          console.log("🔄 Realtime change detected:", payload);
          fetchUsers(); // ✅ Refresh list after every change
        }
      )
      .subscribe((status) =>
        console.log("✅ Realtime subscription status:", status)
      );

    return () => {
      supabase.removeChannel(channel);
    };
  }, [filter]);

  return (
    <div className="p-6 bg-background min-h-[calc(100vh-130px)] text-text-primary">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* ✅ Filter Buttons */}
      <div className="flex gap-4 mb-6 border-b border-header-background">
        {["all", "active", "blocked"].map((status) => (
          <button
            key={status}
            className={`pb-2 font-medium ${
              filter === status
                ? status === "blocked"
                  ? "border-b-2 border-red-500 text-red-600"
                  : "border-b-2 border-green-500 text-green-600"
                : "text-text-secondary"
            }`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* ✅ Users Table */}
      {loading ? (
        <ProfilePageSkeleton />
      ) : users.length === 0 ? (
        <p className="text-text-secondary">No users found.</p>
      ) : (
        <CustomerTable users={users} />
      )}
    </div>
  );
};

export default CompanyPage;
