import { Metadata } from "next";
import { SignInForm } from "./sign-in-form";

export const metadata: Metadata = {
  title: "Sign In | Rides",
  description: "Sign in to your account",
};

export default function SigninPage() {
  return <SignInForm />;
}
