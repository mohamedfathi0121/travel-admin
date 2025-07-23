import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { FaArrowLeft } from "react-icons/fa";

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase
        .from("userprofiles")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Error fetching user:", error);
      } else {
        setUser(data);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) {
    return (
      <div className="p-6 text-red-500">
        User not found.
        <button
          onClick={() => navigate(-1)}
          className="block mt-2 underline text-button-primary"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10 bg-background min-h-screen text-text-primary">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-button-primary hover:underline"
      >
        <FaArrowLeft /> Back
      </button>

      <div className="bg-input p-6 rounded-2xl shadow-md">
        <div className="flex flex-col md:flex-row gap-6 md:items-center border-b border-header-background pb-6">
          <img
            src={user.avatar_url || "https://via.placeholder.com/150"}
            alt={user.display_name}
            className="w-28 h-28 rounded-full object-cover border shadow"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold mb-1">{user.display_name}</h2>
            <p className="text-sm text-text-secondary">{user.age}</p>
            <p className="text-sm text-text-secondary">{user.gender}</p>
            <p className="text-sm text-text-secondary">{user.date_of_birth}</p>
            <p className="text-sm text-text-secondary">{user.country}</p>
            <p className="text-sm text-text-secondary">{user.city}</p>
            <p className="text-sm text-text-secondary">{user.phone_number}</p>
            
             <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium text-white ${
                user.status === "active" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {user.status?.toUpperCase() || "UNKNOWN"}
            </span>

            <button
              onClick={() => navigate(`/chat/${user.id}`)}
              className="mt-4 px-4 py-2 text-sm font-medium text-button-text bg-button-primary rounded hover:bg-button-primary-hover transition"
            >
              Open Chat
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6">
          <div className="space-y-2">
            <p><span className="text-sm text-text-secondary">Role:</span> <span className="font-medium">{user.role}</span></p>
          </div>
        </div>
          <div className="space-y-2">
            <p><span className="text-sm text-text-secondary">Role:</span> <span className="font-medium">{user.role}</span></p>
          </div>
        </div>
      </div>
    
  );
};

export default UserProfile;
