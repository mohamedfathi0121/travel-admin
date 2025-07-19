import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  console.log("--- Edge function invoked ---");

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { action, company_id, user_id } = await req.json();

    if (!action || !company_id || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing action, company_id, or user_id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL"),
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    // ✅ Action Handlers
    if (action === "approve" || action === "reject") {
      const newStatus = action === "approve" ? "approved" : "rejected";

      // 1) Update companies table
      const { error: companyError } = await supabase
        .from("companies")
        .update({ status: newStatus })
        .eq("id", company_id);
      if (companyError) throw companyError;

      // 2) Update auth.users.app_metadata
      const { error: authError } = await supabase.auth.admin.updateUserById(
        user_id,
        { app_metadata: { status: newStatus } }
      );
      if (authError) throw authError;
    }

    if (action === "block" || action === "activate") {
      const isBlocked = action === "block";
      const newStatus = isBlocked ? "blocked" : "approved";

      // 1) Update profiles table
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ is_blocked: isBlocked })
        .eq("id", user_id);
      if (profileError) throw profileError;

      // 2) Update auth.users.app_metadata
      const { error: authError } = await supabase.auth.admin.updateUserById(
        user_id,
        { app_metadata: { status: newStatus } }
      );
      if (authError) throw authError;
    }

    return new Response(
      JSON.stringify({ success: true, message: `Action '${action}' applied successfully` }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Edge Function Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
