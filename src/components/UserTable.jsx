import { Link } from "react-router-dom";

const UserTable = ({ users }) => {
  return (
    <div className="overflow-x-auto bg-background text-text-primary p-4 rounded shadow">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-header-background text-left text-sm text-text-secondary">
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Registration Date</th>
            <th className="p-2">Profile Photo</th>
            <th className="p-2">Status</th>
            <th className="p-2">Role</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-input">
              <td className="p-2">{user.display_name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.created_at?.split('T')[0]}</td>
              <td className="p-2">
                {user.avatar_url ? (
                  <img src={user.avatar_url} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <span className="text-text-secondary italic">No photo</span>
                )}
              </td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.is_blocked === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {user.is_blocked ? "Blocked" : "Active"}
                </span>
              </td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.role === "user"
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.role}
                </span>
              </td>
              <td className="p-2">
                <Link
                  to={`/users/${user.id}`}
                  className="text-button-primary underline hover:text-button-primary-hover transition"
                >
                  View Profile
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
