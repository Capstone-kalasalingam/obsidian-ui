import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateUserRequest {
  email?: string;
  teacherCode?: string;
  password: string;
  fullName: string;
  role: "student" | "parent" | "teacher" | "school_admin";
  phone?: string;
  // Teacher-specific fields
  employeeId?: string;
  subjectIds?: string[];
  classIds?: string[];
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header to verify the caller is a school admin
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create Supabase client with service role for admin operations
    const supabaseAdmin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    // Create client with user's token to verify they're a school admin
    const supabaseUser = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      {
        global: { headers: { Authorization: authHeader } },
        auth: { autoRefreshToken: false, persistSession: false },
      }
    );

    // Get the current user
    const { data: { user: callerUser }, error: userError } = await supabaseUser.auth.getUser();
    if (userError || !callerUser) {
      console.error("Error getting user:", userError);
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Verify caller is a school admin
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .single();

    if (roleError || roleData?.role !== "school_admin") {
      console.error("User is not a school admin:", roleError);
      return new Response(
        JSON.stringify({ error: "Only school administrators can create users" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Parse request body
    const { email, teacherCode, password, fullName, role, phone, employeeId, subjectIds, classIds }: CreateUserRequest = await req.json();

    // Determine the email to use - for teachers, generate from teacherCode
    let userEmail = email;
    if (role === "teacher" && teacherCode) {
      // Generate email from teacher code (e.g., "TCH001" -> "tch001@school.local")
      userEmail = `${teacherCode.toLowerCase().replace(/\s+/g, '')}@school.local`;
    }

    // Validate input
    if (!userEmail || !password || !fullName || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const validRoles = ["student", "parent", "teacher", "school_admin"];
    if (!validRoles.includes(role)) {
      return new Response(
        JSON.stringify({ error: "Invalid role. Must be one of: student, parent, teacher, school_admin" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log(`Creating user: ${userEmail} with role: ${role}`);

    // Create the user using admin client
    const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email: userEmail,
      password,
      email_confirm: true, // Auto-confirm email
      user_metadata: { full_name: fullName },
    });

    if (createError) {
      console.error("Error creating user:", createError);
      return new Response(
        JSON.stringify({ error: createError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!newUser.user) {
      return new Response(
        JSON.stringify({ error: "Failed to create user" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Update profile with additional info
    const { error: profileError } = await supabaseAdmin
      .from("profiles")
      .update({ 
        full_name: fullName,
        phone: phone || null 
      })
      .eq("id", newUser.user.id);

    if (profileError) {
      console.error("Error updating profile:", profileError);
    }

    // Assign role
    const { error: roleAssignError } = await supabaseAdmin
      .from("user_roles")
      .insert({
        user_id: newUser.user.id,
        role: role,
      });

    if (roleAssignError) {
      console.error("Error assigning role:", roleAssignError);
      // Cleanup: delete the user if role assignment fails
      await supabaseAdmin.auth.admin.deleteUser(newUser.user.id);
      return new Response(
        JSON.stringify({ error: "Failed to assign role. User creation rolled back." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create role-specific record
    if (role === "teacher") {
      const { data: teacherData, error: teacherError } = await supabaseAdmin
        .from("teachers")
        .insert({
          user_id: newUser.user.id,
          employee_id: employeeId || null,
        })
        .select()
        .single();
      
      if (teacherError) {
        console.error("Error creating teacher record:", teacherError);
      } else if (teacherData && subjectIds && classIds && subjectIds.length > 0 && classIds.length > 0) {
        // Create teacher assignments for each class-subject combination
        const assignments = [];
        for (const classId of classIds) {
          for (const subjectId of subjectIds) {
            assignments.push({
              teacher_id: teacherData.id,
              class_id: classId,
              subject_id: subjectId,
              is_class_teacher: false,
            });
          }
        }
        
        if (assignments.length > 0) {
          const { error: assignmentError } = await supabaseAdmin
            .from("teacher_assignments")
            .insert(assignments);
          
          if (assignmentError) {
            console.error("Error creating teacher assignments:", assignmentError);
          }
        }
      }
    } else if (role === "student") {
      // For students, we'd need a class_id which should be passed in
      console.log("Student record creation requires class_id - skipping automatic creation");
    } else if (role === "parent") {
      const { error: parentError } = await supabaseAdmin
        .from("parents")
        .insert({
          user_id: newUser.user.id,
        });
      if (parentError) {
        console.error("Error creating parent record:", parentError);
      }
    }

    console.log(`User created successfully: ${newUser.user.id}`);

    return new Response(
      JSON.stringify({
        success: true,
        user: {
          id: newUser.user.id,
          email: newUser.user.email,
          fullName,
          role,
        },
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
};

serve(handler);
