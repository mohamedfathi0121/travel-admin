import { Link } from "react-router-dom";
import formatDate from "../utils/formatDate";

export default function CustomerTable({ users }) {
  return (
    <div className="overflow-x-auto bg-background text-text-primary p-4 rounded shadow">
      {/* ✅ Table for Desktop / Large Screens */}
      <table className="hidden md:table w-full border-collapse">
        <thead>
          <tr className="bg-header-background text-left text-sm text-text-secondary">
            <th className="p-2">Display Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Country</th>
            <th className="p-2">City</th>
            <th className="p-2">Registered</th>
            <th className="p-2">Avatar</th>
            <th className="p-2">Status</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t border-input">
              <td className="p-2">{user.display_name || "N/A"}</td>
              <td className="p-2">{user.email || "N/A"}</td>
              <td className="p-2">{user.country || "N/A"}</td>
              <td className="p-2">{user.city || "N/A"}</td>
              <td className="p-2">{formatDate(user.created_at) || "N/A"}</td>
              <td className="p-2">
                {user.avatar_url ? (
                  <img
                    src={user.avatar_url}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    {user.display_name
                      ? user.display_name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                )}
              </td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.is_blocked
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {user.is_blocked ? "Blocked" : "Active"}
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

      {/* ✅ Card View for Mobile */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div
            key={user.id}
            className="border border-input rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex items-center space-x-4">
              {user.avatar_url ? (
                <img
                  src={user.avatar_url}
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  {user.display_name
                    ? user.display_name.charAt(0).toUpperCase()
                    : "U"}
                </div>
              )}
              <div>
                <div className="font-semibold text-text-primary">
                  {user.display_name || "N/A"}
                </div>
                <div className="text-sm text-text-secondary">
                  {user.email || "N/A"}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm">
              <div>
                <span className="font-medium">Country:</span> {user.country || "N/A"}
              </div>
              <div className="mt-1">
                <span className="font-medium">Registered:</span>{" "}
                {formatDate(user.created_at) || "N/A"}
              </div>
              <div className="mt-1">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    user.is_blocked
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {user.is_blocked ? "Blocked" : "Active"}
                </span>
              </div>
            </div>

            <div className="mt-3">
              <Link
                to={`/users/${user.id}`}
                className="text-button-primary underline hover:text-button-primary-hover text-sm"
              >
                View Profile
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
