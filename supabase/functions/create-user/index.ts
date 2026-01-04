import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CreateUserRequest {
  email?: string;
  teacherId?: string;
  studentId?: string;
  parentId?: string;
  password: string;
  fullName: string;
  role: "student" | "parent" | "teacher" | "school_admin";
  phone?: string;
  // Teacher-specific fields
  subjectIds?: string[];
  classIds?: string[];
  // Student-specific fields
  classId?: string;
  rollNumber?: string;
  parentIds?: string[]; // Parent user IDs to link
  // Parent-specific fields
  occupation?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header to verify the caller
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

    // Create client with user's token to verify permissions
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

    // Get caller's role
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("user_roles")
      .select("role")
      .eq("user_id", callerUser.id)
      .single();

    if (roleError) {
      console.error("Error getting caller role:", roleError);
      return new Response(
        JSON.stringify({ error: "Failed to verify permissions" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const callerRole = roleData?.role;
    
    // Parse request body
    const { 
      email, 
      teacherId, 
      studentId,
      parentId,
      password, 
      fullName, 
      role, 
      phone, 
      subjectIds, 
      classIds,
      classId,
      rollNumber,
      parentIds,
      occupation
    }: CreateUserRequest = await req.json();

    // Permission check based on role being created
    const isSchoolAdmin = callerRole === "school_admin";
    const isTeacher = callerRole === "teacher";

    // School admins can create any user type
    // Teachers can only create students and parents
    if (!isSchoolAdmin && !isTeacher) {
      return new Response(
        JSON.stringify({ error: "You don't have permission to create users" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Teachers can only create students and parents
    if (isTeacher && !["student", "parent"].includes(role)) {
      return new Response(
        JSON.stringify({ error: "Teachers can only create students and parents" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // For teachers creating students, verify they are assigned to that class
    if (isTeacher && role === "student" && classId) {
      const { data: teacherData } = await supabaseAdmin
        .from("teachers")
        .select("id")
        .eq("user_id", callerUser.id)
        .single();

      if (teacherData) {
        const { data: assignment } = await supabaseAdmin
          .from("teacher_assignments")
          .select("id")
          .eq("teacher_id", teacherData.id)
          .eq("class_id", classId)
          .single();

        if (!assignment) {
          return new Response(
            JSON.stringify({ error: "You can only add students to your assigned classes" }),
            { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Determine the email to use based on role
    let userEmail = email;
    if (role === "teacher" && teacherId) {
      userEmail = `${teacherId.toLowerCase().replace(/\s+/g, '')}@school.local`;
    } else if (role === "student" && studentId) {
      userEmail = `${studentId.toLowerCase().replace(/\s+/g, '')}@school.local`;
    } else if (role === "parent" && parentId) {
      userEmail = `${parentId.toLowerCase().replace(/\s+/g, '')}@school.local`;
    }

    // Validate input
    if (!userEmail || !password || !fullName || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Additional validation for students
    if (role === "student" && !classId) {
      return new Response(
        JSON.stringify({ error: "Class assignment is required for students" }),
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
      email_confirm: true,
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
          employee_id: teacherId || null,
        })
        .select()
        .single();
      
      if (teacherError) {
        console.error("Error creating teacher record:", teacherError);
      } else if (teacherData && subjectIds && classIds && subjectIds.length > 0 && classIds.length > 0) {
        const assignments = [];
        for (const cId of classIds) {
          for (const subjectId of subjectIds) {
            assignments.push({
              teacher_id: teacherData.id,
              class_id: cId,
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
      // Get active academic year
      const { data: academicYear } = await supabaseAdmin
        .from("academic_years")
        .select("id")
        .eq("is_active", true)
        .single();

      const { data: studentData, error: studentError } = await supabaseAdmin
        .from("students")
        .insert({
          user_id: newUser.user.id,
          class_id: classId,
          roll_number: rollNumber || null,
          academic_year_id: academicYear?.id || null,
          status: "active",
        })
        .select()
        .single();
      
      if (studentError) {
        console.error("Error creating student record:", studentError);
      } else if (studentData && parentIds && parentIds.length > 0) {
        // Link parents to student
        for (const parentUserId of parentIds) {
          // Get parent record from parents table
          const { data: parentRecord } = await supabaseAdmin
            .from("parents")
            .select("id")
            .eq("user_id", parentUserId)
            .single();

          if (parentRecord) {
            await supabaseAdmin
              .from("student_parents")
              .insert({
                student_id: studentData.id,
                parent_id: parentRecord.id,
                is_primary: parentIds.indexOf(parentUserId) === 0,
              });
          }
        }
      }
    } else if (role === "parent") {
      const { error: parentError } = await supabaseAdmin
        .from("parents")
        .insert({
          user_id: newUser.user.id,
          occupation: occupation || null,
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
