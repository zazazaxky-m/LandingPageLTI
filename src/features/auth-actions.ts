"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";

import { signIn, signOut } from "@/lib/auth";

export type LoginActionState = {
  error?: string;
};

export async function loginAction(_state: LoginActionState, formData: FormData): Promise<LoginActionState> {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirect: false
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        error: "Invalid email or password."
      };
    }

    throw error;
  }

  redirect("/admin");
}

export async function logoutAction() {
  await signOut({ redirectTo: "/admin/login" });
}
