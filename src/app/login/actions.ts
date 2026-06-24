"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  try {
    // Attempt to sign in and redirect to the home page upon success
    await signIn("credentials", formData, { redirectTo: "/" });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid username or password.";
        default:
          return "Something went wrong.";
      }
    }
    // Required to allow Next.js redirect to work!
    throw error;
  }
}
