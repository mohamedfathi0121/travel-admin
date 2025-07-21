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

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);

        /** ✅ Example Queries - Update table names as per your schema **/

        // 1. Total Users
        const { count: totalUsers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .in("role", ["user", "company_user"]);

        // 2. Companies
        const { count: totalCompanies } = await supabase
          .from("companies")
          .select("*", { count: "exact", head: true });

        const { count: newCompanies } = await supabase
          .from("companies")
          .select("*", { count: "exact", head: true })
          .eq("status", "pending"); // last 30 days
       
          const { count: activeCompanies } = await supabase
          .from("companies")
          .select("*", { count: "exact", head: true })
          .eq("is_blocked", false)
          .eq("status", "approved");

        const { count: blockedCompanies } = await supabase
      .from("companies")
          .select("*", { count: "exact", head: true })
          .eq("is_blocked", true)
          .eq("status", "approved");

        // 3. Customers
        const { count: totalCustomers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "user");

        const { count: activeCustomers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "user")
          .eq("is_blocked", "false");

        const { count: blockedCustomers } = await supabase
          .from("profiles")
          .select("*", { count: "exact", head: true })
          .eq("role", "user")
          .eq("is_blocked", "true");

        // 4. Chats
        const { count: chatsWithCompanies } = await supabase
          .from("support_chats")
          .select("*", { count: "exact", head: true })
          .eq("role", "company_user");

        const { count: chatsWithUsers } = await supabase
          .from("support_chats")
          .select("*", { count: "exact", head: true })
          .eq("role", "user")
          .in("status", ["open", "in_progress"]);

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
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 text-text-primary">
      {/* Title */}
      <h1 className="text-3xl font-bold text-text-primary mb-8">
        Admin Dashboard
      </h1>

      {/* Total Users */}
      <div className="rounded-lg shadow-lg shadow-text-secondary p-6 w-full max-w-3xl text-center mb-8">
        <h2 className="text-lg font-medium text-text-primary">Total Users</h2>
        <p className="text-3xl font-bold text-text-primary mt-2">
          {stats.totalUsers}
        </p>
      </div>

      {/* Companies */}
   
        <div className="rounded-lg shadow-lg shadow-text-secondary p-6 mb-6 w-full max-w-3xl">
          <h3 className="text-lg font-bold mb-3 text-center">Companies</h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/companies"
              state={{ status: "all" }}
              className="flex-grow-1 flex"
            >
              {" "}
              <Card title="Total Companies" value={stats.totalCompanies} />
            </Link>
            <Link
              to="/companies"
              state={{ status: "new" }}
              className="flex-grow-1 flex"
            >
              {" "}
              <Card title="New Companies" value={stats.newCompanies} />
            </Link>
            <Link
              to="/companies"
              state={{ status: "active" }}
              className="flex-grow-1 flex"
            >
              {" "}
            <Card title="Active Companies" value={stats.activeCompanies} />
            </Link>
            <Link
              to="/companies"
              state={{ status: "blocked" }}
              className="flex-grow-1 flex"
            >
              {" "}
            <Card title="Blocked Companies" value={stats.blockedCompanies} />
            </Link>

          </div>
        </div>
      
      {/* Customers */}
      <div className="rounded-lg shadow-lg shadow-text-secondary p-6 mb-6 w-full max-w-3xl">
        <h3 className="text-lg font-bold mb-3 text-center">Customers</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <Card title="Total Customers" value={stats.totalCustomers} />
          <Card title="Active Customers" value={stats.activeCustomers} />
          <Card title="Blocked Customers" value={stats.blockedCustomers} />
        </div>
      </div>

      {/* Chats */}
      <div className="flex flex-wrap  gap-4 w-full max-w-3xl mt-8 justify-center">
        <Link
          to="/chat-dashboard"
          state={{ role: "company_user" }}
          className="flex-grow-1 flex "
        >
          <Card title="Chats with Companies" value={stats.chatsWithCompanies} />
        </Link>
        <Link
          to="/chat-dashboard"
          state={{ role: "user" }}
          className="flex-grow-1 flex"
        >
          <Card title="Chats with Users" value={stats.chatsWithUsers} />
        </Link>
      </div>
    </div>
  );
};

// ✅ Reusable Card Component
const Card = ({ title, value }) => (
  <div className="rounded-lg shadow-sm shadow-text-secondary p-4 text-center w-40 flex-grow-1">
    <h3 className="text-sm">{title}</h3>
    <p className="text-xl font-bold mt-1">{value}</p>
  </div>
);

export default AdminDashboard;
