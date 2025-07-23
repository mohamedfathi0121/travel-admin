import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import UserTable from "../components/UserTable";

const UsersPage = () => {
  const [filter, setFilter] = useState("active");
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.error("Error fetching users:", error);
      } else {
        setUsers(data);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    filter === "active" ? user.role === "user" : user.role !== "user"
  );

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const start = (currentPage - 1) * usersPerPage;
  const currentUsers = filteredUsers.slice(start, start + usersPerPage);

  return (
    <div className="p-6 bg-background min-h-screen text-text-primary">
      <h1 className="text-2xl font-bold mb-4">Users</h1>

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 border-b border-header-background">
        <button
          className={`pb-2 font-medium ${
            filter === "active"
              ? "border-b-2 border-green-500 text-green-600"
              : "text-text-secondary"
          }`}
          onClick={() => {
            setFilter("active");
            setCurrentPage(1);
          }}
        >
          Active
        </button>
        <button
          className={`pb-2 font-medium ${
            filter === "blocked"
              ? "border-b-2 border-red-500 text-red-600"
              : "text-text-secondary"
          }`}
          onClick={() => {
            setFilter("blocked");
            setCurrentPage(1);
          }}
        >
          Blocked
        </button>
      </div>

      {/* User Table */}
      <UserTable users={currentUsers} />

      {/* Pagination */}
      <div className="mt-6 flex justify-center gap-2">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {i + 1}
          </button>
        ))}

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default UsersPage;
