import { useState, useEffect } from "react";
import supabase from "../utils/supabase";
import UserTable from "../components/UserTable";
import { useLocation } from "react-router-dom";
import ProfilePageSkeleton from "../components/skeleton/ProfilePageSkeleton";

const CompanyPage = () => {
  const location = useLocation();
  const status = location.state?.status || "all"; // Default to 'all'
  const [filter, setFilter] = useState(status);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch companies based on filter rules
  const fetchUsers = async () => {
    setLoading(true);

    let query = supabase.from("companies").select("*");

    if (filter === "new") {
      query = query.eq("status", "pending");
    } else if (filter === "active") {
      query = query.eq("status", "approved").eq("is_blocked", false);
    } else if (filter === "blocked") {
      query = query.eq("status", "approved").eq("is_blocked", true);
    }
    // "all" → no extra filter

    const { data, error } = await query.order("created_at", {
      ascending: false,
    });

    if (error) {
      console.error("❌ Error fetching companies:", error);
    } else {
      setUsers(data || []);
      console.log("✅ Fetched Companies:", data);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();

    // ✅ Setup Realtime Listener for INSERT, UPDATE, DELETE
    const channel = supabase
      .channel("companies-realtime")
      .on(
        "postgres_changes",
        {
          event: "*", // INSERT, UPDATE, DELETE
          schema: "public",
          table: "companies",
        },
        (payload) => {
          console.log("🔄 Realtime change detected:", payload);
          fetchUsers(); // ✅ Refetch list after every change
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
      <h1 className="text-2xl font-bold mb-4">Companies</h1>

      {/* ✅ Filter Buttons */}
      <div className="flex gap-4 mb-6 border-b border-header-background">
        {["all", "new", "active", "blocked"].map((status) => (
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

      {/* ✅ Companies Table */}
      {loading ? (
        <ProfilePageSkeleton />
      ) : users.length === 0 ? (
        <p className="text-text-secondary">No companies found.</p>
      ) : (
        <UserTable users={users} />
      )}
    </div>
  );
};

export default CompanyPage;
