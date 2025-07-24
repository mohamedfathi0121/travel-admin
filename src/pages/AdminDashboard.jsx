import React, { useEffect, useState } from "react";
import supabase from "../utils/supabase";
import AdminDashboardSkeleton from "../components/skeleton/AdminDashboardSkeleton";
import { Link } from "react-router-dom";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    newCompanies: 0,
    activeCompanies: 0,
    blockedCompanies: 0,
    totalCustomers: 0,
    activeCustomers: 0,
    blockedCustomers: 0,
    chatsWithCompanies: 0,
    chatsWithUsers: 0,
  });

  const [loading, setLoading] = useState(true);

  // ✅ Fetch Dashboard Stats
  const fetchStats = async () => {
    try {
      setLoading(true);

      const [
        { count: totalUsers },
        { count: totalCompanies },
        { count: newCompanies },
        { count: activeCompanies },
        { count: blockedCompanies },
        { count: totalCustomers },
        { count: activeCustomers },
        { count: blockedCustomers },
        { count: chatsWithCompanies },
        { count: chatsWithUsers },
      ] = await Promise.all([
        // Users (all users: profiles)
        supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .in("role", ["user", "company_user"]),

        // Companies (total)
        supabase.from("companies").select("*", { count: "exact", head: true }),

        // New Companies (pending)
        supabase
          .from("companies")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"),

        // Active Companies (approved & not blocked)
        supabase
          .from("companies")
          .select("*", { count: "exact", head: true })
          .eq("is_blocked", false)
          .eq("status", "approved"),

        // Blocked Companies (approved & blocked)
        supabase
          .from("companies")
          .select("*", { count: "exact", head: true })
          .eq("is_blocked", true)
          .eq("status", "approved"),

        // Customers (total)
        supabase
          .from("userprofiles")
          .select("*", { count: "exact", head: true }),

        // Active Customers
        supabase
          .from("userprofiles")
          .select("*", { count: "exact", head: true })
          .eq("is_blocked", false),

        // Blocked Customers
        supabase
          .from("userprofiles")
          .select("*", { count: "exact", head: true })
          .eq("is_blocked", true),

        // Chats with Companies
        supabase
          .from("support_chats")
          .select("*", { count: "exact", head: true })
          .eq("role", "company_user")
          .in("status", ["open", "in_progress"])
          .not("last_message_at", "is", null),

        // Chats with Users
        supabase
          .from("support_chats")
          .select("*", { count: "exact", head: true })
          .eq("role", "user")
          .in("status", ["open", "in_progress"])
          .not("last_message_at", "is", null),
      ]);

      setStats({
        totalUsers: totalUsers || 0,
        totalCompanies: totalCompanies || 0,
        newCompanies: newCompanies || 0,
        activeCompanies: activeCompanies || 0,
        blockedCompanies: blockedCompanies || 0,
        totalCustomers: totalCustomers || 0,
        activeCustomers: activeCustomers || 0,
        blockedCustomers: blockedCustomers || 0,
        chatsWithCompanies: chatsWithCompanies || 0,
        chatsWithUsers: chatsWithUsers || 0,
      });
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();

    // ✅ Realtime Listeners for companies, userprofiles & chats
    const companiesChannel = supabase
      .channel("realtime-companies")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "companies" },
        payload => {
          console.log("🔄 Companies changed:", payload);
          fetchStats();
        }
      )
      .subscribe();

    const userProfilesChannel = supabase
      .channel("realtime-userprofiles")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "userprofiles" },
        payload => {
          console.log("🔄 Userprofiles changed:", payload);
          fetchStats();
        }
      )
      .subscribe();

    const chatsChannel = supabase
      .channel("realtime-chats")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "support_chats" },
        payload => {
          console.log("🔄 Chats changed:", payload);
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(companiesChannel);
      supabase.removeChannel(userProfilesChannel);
      supabase.removeChannel(chatsChannel);
    };
  }, []);

  if (loading) return <AdminDashboardSkeleton />;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 text-text-primary">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Total Users */}
      <div className="rounded-lg shadow-lg p-6 w-full max-w-3xl text-center mb-8">
        <h2 className="text-lg font-medium">Total Users</h2>
        <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
      </div>

      {/* Companies */}
      <Section title="Companies">
        <StatLink
          to="/companies"
          state="all"
          title="Total Companies"
          value={stats.totalCompanies}
        />
        <StatLink
          to="/companies"
          state="new"
          title="New Companies"
          value={stats.newCompanies}
        />
        <StatLink
          to="/companies"
          state="active"
          title="Active Companies"
          value={stats.activeCompanies}
        />
        <StatLink
          to="/companies"
          state="blocked"
          title="Blocked Companies"
          value={stats.blockedCompanies}
        />
      </Section>

      {/* Customers */}
      <Section title="Customers">
        <StatLink
          to="/users"
          state="all"
          title="Total Customers"
          value={stats.totalCustomers}
        />
        <StatLink
          to="/users"
          state="active"
          title="Active Customers"
          value={stats.activeCustomers}
        />
        <StatLink
          to="/users"
          state="blocked"
          title="Blocked Customers"
          value={stats.blockedCustomers}
        />
      </Section>

      {/* Chats */}
      <div className="flex flex-wrap gap-4 w-full max-w-3xl mt-8 justify-center">
        <StatLink
          to="/chat-dashboard"
          state="company_user"
          title="Chats with Companies"
          value={stats.chatsWithCompanies}
        />
        <StatLink
          to="/chat-dashboard"
          state="user"
          title="Chats with Users"
          value={stats.chatsWithUsers}
        />
      </div>
    </div>
  );
};

// ✅ Reusable Section Wrapper
const Section = ({ title, children }) => (
  <div className="rounded-lg shadow-lg p-6 mb-6 w-full max-w-3xl">
    <h3 className="text-lg font-bold mb-3 text-center">{title}</h3>
    <div className="flex flex-wrap justify-center gap-4">{children}</div>
  </div>
);

// ✅ Reusable Card Link
const StatLink = ({ to, state, title, value }) => (
  <Link to={to} state={{ status: state }} className="flex-grow-1 flex">
    <div className="rounded-lg shadow-sm p-4 text-center w-40 flex-grow-1">
      <h3 className="text-sm">{title}</h3>
      <p className="text-xl font-bold mt-1">{value}</p>
    </div>
  </Link>
);

export default AdminDashboard;
