import { Link } from "react-router-dom";
import formatDate from "../utils/formatDate";

const UserTable = ({ users }) => {
  return (
    <div className="overflow-x-auto bg-background text-text-primary p-4 rounded shadow">
      {/* ✅ Table for Desktop / Large Screens */}
      <table className="hidden md:table w-full border-collapse">
        <thead>
          <tr className="bg-header-background text-left text-sm text-text-secondary">
            <th className="p-2">Company Name</th>
            <th className="p-2">Contact Email</th>
            <th className="p-2">Registration Date</th>
            <th className="p-2">Logo</th>
            <th className="p-2">Status</th>
            <th className="p-2">Role</th>
            <th className="p-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="border-t border-input">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.date}</td>
              <td className="p-2">
                {user.photo ? (
                  <img src={user.photo} alt="profile" className="w-10 h-10 rounded-full object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    {user.c_name.charAt(0).toUpperCase()}
                  </div>
                )}
              </td>
              <td className="p-2">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    user.status === "active"
                      ? "bg-green-100 text-green-700"
                      : user.status === "approved" && user.is_blocked === true
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.status}
                </span>
              </td>
              <td className="p-2">
                <Link
                  to={`/companies/${user.id}`}
                  className="text-button-primary underline hover:text-button-primary-hover transition "
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
        {users.map(user => (
          <div
            key={user.id}
            className="border border-input rounded-lg p-4 bg-white shadow-sm"
          >
            <div className="flex items-center space-x-4">
              {user.logo_url ? (
                <img
                  src={user.logo_url}
                  alt="logo"
                  className="w-12 h-12 rounded-full object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                  {user.c_name.charAt(0).toUpperCase()}
                </div>
              )}
              <div>
                <div className="font-semibold text-text-primary">
                  {user.c_name}
                </div>
                <div className="text-sm text-text-secondary">
                  {user.contact_email}
                </div>
              </div>
            </div>

            <div className="mt-3 text-sm">
              <div>
                <span className="font-medium">Registered:</span>{" "}
                {formatDate(user.created_at) || "N/A"}
              </div>
              <div className="mt-1">
                <span className="font-medium">Status:</span>{" "}
                <span
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    user.status === "pending"
                      ? "bg-yellow-100 text-yellow-600"
                      : user.status === "approved" && user.is_blocked === false
                      ? "bg-green-100 text-green-700"
                      : user.status === "approved" && user.is_blocked === true
                      ? "bg-red-100 text-red-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {user.status === "approved" && user.is_blocked === false
                    ? "active"
                    : user.status === "approved" && user.is_blocked === true
                    ? "Blocked"
                    : "Pending"}
                </span>
              </div>
            </div>

            <div className="mt-3">
              <Link
                to={`/companies/${user.id}`}
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
};

export default UserTable;
