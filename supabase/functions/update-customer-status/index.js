import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req) => {
  console.log("--- User Edge Function Invoked ---");

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { action, user_id } = await req.json();

    if (!action || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing action or user_id" }),
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

    // ✅ Supported Actions: block / activate
    if (action !== "block" && action !== "activate") {
      return new Response(
        JSON.stringify({
          error: "Invalid action. Allowed: 'block' or 'activate'",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    const isBlocked = action === "block";
    const newStatus = isBlocked ? "blocked" : "active";

    // ✅ 1) Update userprofiles table
    const { error: profileError } = await supabase
      .from("userprofiles")
      .update({ is_blocked: isBlocked })
      .eq("id", user_id);

    if (profileError) throw profileError;

    // ✅ 2) Update auth.users.app_metadata
    const { error: authError } = await supabase.auth.admin.updateUserById(
      user_id,
      { app_metadata: { status: newStatus } }
    );

    if (authError) throw authError;

    return new Response(
      JSON.stringify({
        success: true,
        message: `Action '${action}' applied successfully`,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("❌ Edge Function Error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
