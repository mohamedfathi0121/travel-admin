import { useState, useEffect } from "react";
import {
  FaCheck,
  FaBan,
  FaUnlock,
  FaMapMarkerAlt,
  FaTimes,
} from "react-icons/fa";
import dayjs from "dayjs";
import { useParams } from "react-router-dom";
import supabase from "../utils/supabase";

export default function CompanyProfile() {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // ✅ Fetch Company Data by ID (Initial Load)
  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("❌ Error fetching company:", error);
      } else {
        setCompany(data);
      }
      setLoading(false);
    };

    fetchCompany();
  }, [id]);

  // ✅ Real-time Listener for Status and is_blocked Changes
  useEffect(() => {
    if (!id) return;

    const channel = supabase
      .channel(`company-status-${id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "companies",
          filter: `id=eq.${id}`,
        },
        payload => {
          console.log("🔄 Realtime update received:", payload.new);
          setCompany(payload.new); // ✅ Update the entire company object
        }
      )
      .subscribe(status => console.log("✅ Realtime Subscribed:", status));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id]);

  if (loading) return <p className="text-center py-10">Loading...</p>;
  if (!company)
    return (
      <p className="text-center text-red-500 min-h-[calc(100vh-130px)] flex justify-center items-center">
        Company not found.
      </p>
    );

  const fullAddress = `${company.city || ""}, ${company.country || ""}`;

  // ✅ Fix PDF URL
  const getCleanPdfUrl = url => {
    if (!url) return "";
    let cleanUrl = url;
    if (Array.isArray(cleanUrl)) cleanUrl = cleanUrl[0];
    if (typeof cleanUrl === "string" && cleanUrl.startsWith("[")) {
      try {
        const parsed = JSON.parse(cleanUrl);
        cleanUrl = Array.isArray(parsed) ? parsed[0] : parsed;
      } catch {
        const match = cleanUrl.match(/\["([^"]+)"/);
        if (match) cleanUrl = match[1];
      }
    }
    return cleanUrl.replace(/["'\]]+$/, "");
  };

  const pdfUrl = getCleanPdfUrl(company.verification_document_url);

  // ✅ Update Status Logic using Edge Function
  const handleStatusChange = async action => {
    if (!company) return;
    setUpdating(true);

    try {
      const { data, error } = await supabase.functions.invoke(
        "update-company-status",
        {
          body: {
            action,
            company_id: company.id,
            user_id: company.id,
          },
        }
      );

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // ✅ No need to manually update; Realtime will handle UI update
    } catch (err) {
      console.error("❌ Error updating status:", err);
      alert("❌ Failed to update status.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text-primary rounded-xl shadow-lg p-6 space-y-6 max-w-4xl mx-auto m-5">
      {/* ✅ Header */}
      <div className="flex items-center gap-4 border-b border-text-secondary pb-4">
        <img
          src={company.logo_url || "/default-avatar.png"}
          alt="Logo"
          className="w-20 h-20 rounded-full object-cover border border-text-secondary"
        />
        <div>
          <h2 className="text-2xl font-bold">{company.c_name}</h2>
          <p className="text-sm text-text-secondary">ID: {company.id}</p>
        </div>
      </div>

      {/* ✅ Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-text-secondary">Email</p>
          <p>{company.contact_email}</p>
        </div>
        <div>
          <p className="text-sm text-text-secondary">Phone</p>
          <p>{company.phone_numbers}</p>
        </div>
        <div className="md:col-span-2">
          <p className="text-sm text-text-secondary">Address</p>
          <p>{fullAddress}</p>
        </div>
        <div className="md:col-span-2">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              fullAddress
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline flex items-center gap-2 mt-1"
          >
            <FaMapMarkerAlt /> View on Map
          </a>
        </div>
      </div>

      {/* ✅ PDF Viewer */}
      {pdfUrl && (
        <div>
          <h3 className="text-lg font-bold mb-2">Uploaded Document</h3>
          <div className="rounded border border-text-secondary shadow-lg">
            <iframe
              src={pdfUrl}
              title="PDF Document"
              className="w-full h-[750px]"
              style={{ border: "none" }}
            />
          </div>
          <div className="mt-2 text-center">
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline text-sm"
            >
              Open in new tab
            </a>
          </div>
        </div>
      )}

      {/* ✅ Created At */}
      <div>
        <p className="text-sm text-text-secondary">Created At</p>
        <p>{dayjs(company.created_at).format("MMMM D, YYYY h:mm A")}</p>
      </div>

      {/* ✅ Status */}
      <div>
        <p className="text-sm text-text-secondary">Status</p>
        <p
          className={`font-semibold ${
            company.status === "approved" && company.is_blocked === false
              ? "text-green-600"
              : company.status === "approved" && company.is_blocked === true
              ? "text-red-600"
              : company.status === "rejected"
              ? "text-gray-600"
              : "text-yellow-600"
          }`}
        >
          {company.status === "approved" && company.is_blocked === false
            ? "Approved"
            : company.status === "approved" && company.is_blocked === true
            ? "Blocked"
            : company.status === "rejected"
            ? "Rejected"
            : "Pending"}
        </p>
      </div>

      {/* ✅ Action Buttons */}
      <div className="pt-4 flex gap-3 flex-wrap">
        {company.status === "pending" && (
          <>
            <button
              disabled={updating}
              onClick={() => handleStatusChange("approve")}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              <FaCheck /> Approve
            </button>
            <button
              disabled={updating}
              onClick={() => handleStatusChange("reject")}
              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              <FaTimes /> Reject
            </button>
          </>
        )}
        {company.status === "approved" && company.is_blocked === false && (
          <button
            disabled={updating}
            onClick={() => handleStatusChange("block")}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            <FaBan /> Block
          </button>
        )}
        {company.status === "approved" && company.is_blocked === true && (
          <button
            disabled={updating}
            onClick={() => handleStatusChange("activate")}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            <FaUnlock /> Activate
          </button>
        )}
      </div>
    </div>
  );
}
