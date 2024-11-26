"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/game");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  console.log("Attempting signup with:", data.email);

  const { data: authData, error: signUpError } = await supabase.auth.signUp(
    data
  );

  console.log("Signup response:", { authData, signUpError });

  if (signUpError || !authData.user) {
    console.error("Signup error:", signUpError);
    redirect("/error");
  }

  try {
    console.log("Creating profile for user:", authData.user.id);
    const { error: profileError } = await supabase.from("users").insert({
      id: authData.user.id,
      email: data.email,
      username: data.email.split("@")[0],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });

    if (profileError) {
      console.error("Profile creation error:", profileError);
    }

    console.log("Profile created successfully");
  } catch (error) {
    console.error("Unexpected error:", error);
  }

  revalidatePath("/", "layout");
  redirect("/");
}
