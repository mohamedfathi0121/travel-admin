import { useState } from "react";
import { users } from "../data/users";
import UserTable from "../components/UserTable";

const UsersPage = () => {
  const [filter, setFilter] = useState("active");
  const filteredUsers = users.filter((user) => user.status === filter);

  return (
    <div className="p-6 bg-background min-h-screen text-text-primary">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <div className="flex gap-4 mb-6 border-b border-header-background">
        <button
          className={`pb-2 font-medium ${
            filter === "active"
              ? "border-b-2 border-green-500 text-green-600"
              : "text-text-secondary"
          }`}
          onClick={() => setFilter("active")}
        >
          Active
        </button>
        <button
          className={`pb-2 font-medium ${
            filter === "blocked"
              ? "border-b-2 border-red-500 text-red-600"
              : "text-text-secondary"
          }`}
          onClick={() => setFilter("blocked")}
        >
          Blocked
        </button>
      </div>
      <UserTable users={filteredUsers} />
    </div>
  );
};

export default UsersPage;
