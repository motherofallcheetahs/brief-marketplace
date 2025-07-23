import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { Resend } from "npm:resend@1.0.0";
import { createClient } from "npm:@supabase/supabase-js@2.31.0";
serve(async (req)=>{
  try {
    // Parse the request body
    const payload = await req.json();
    // Check if this is an INSERT operation
    if (payload.type !== "INSERT") {
      return new Response("Not an INSERT operation", {
        status: 200
      });
    }
    const message = payload.record;
    // Create Supabase client with service role key for admin access
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase environment variables");
      return new Response("Server configuration error", {
        status: 500
      });
    }
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    // Use a direct SQL query with explicit schema to get thread data
    const { data: threadData, error: threadError } = await supabaseAdmin.rpc('get_thread_data', {
      thread_id: message.thread_id
    });
    if (threadError) {
      console.error("Error fetching thread:", threadError);
      return new Response(`Error fetching thread: ${threadError.message}`, {
        status: 500
      });
    }
    if (!threadData || threadData.length === 0) {
      console.error("Thread not found");
      return new Response("Thread not found", {
        status: 404
      });
    }
    const thread = threadData[0];
    // Only proceed if the sender is the designer
    if (message.sender_id !== thread.designer_id) {
      return new Response("Not a designer message", {
        status: 200
      });
    }
    // Get homeowner's email using the auth admin API
    const { data: userData, error: userError } = await supabaseAdmin.auth.admin.getUserById(thread.homeowner_id);
    if (userError || !userData || !userData.user) {
      console.error("Error fetching homeowner:", userError);
      return new Response(`Error fetching homeowner: ${userError?.message || "User not found"}`, {
        status: 500
      });
    }
    const homeownerEmail = userData.user.email;
    if (!homeownerEmail) {
      console.error("Homeowner email not found");
      return new Response("Homeowner email not found", {
        status: 500
      });
    }
    // Initialize Resend
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("Missing Resend API key");
      return new Response("Email service configuration error", {
        status: 500
      });
    }
    const resend = new Resend(resendApiKey);
    const baseUrl = Deno.env.get("BASE_URL") || "https://yourdomain.com";
    // Send email notification
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: "Ayite Gaba <ayite@updates.assaba.com>",
      to: homeownerEmail,
      subject: "New design inquiry",
      html: `
        <html>
          <body>
            <p>You have a new message. Reply here: <a href="${baseUrl}/threads/${message.thread_id}">${baseUrl}/threads/${message.thread_id}</a></p>
            <p>Message preview: "${message.body.substring(0, 100)}${message.body.length > 100 ? '...' : ''}"</p>
          </body>
        </html>
      `
    });
    if (emailError) {
      console.error("Error sending email:", emailError);
      return new Response(`Error sending email: ${emailError}`, {
        status: 500
      });
    }
    return new Response("Email notification sent successfully", {
      status: 200
    });
  } catch (error) {
    console.error("Function error:", error);
    return new Response(`Error: ${error.message}`, {
      status: 500
    });
  }
});
