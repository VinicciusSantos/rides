import { Metadata } from "next";
import { SignUpForm } from "./sign-up-form";

export const metadata: Metadata = {
  title: "Sign Up | Rides",
  description: "Sign up for a new account",
};

export default function SignUpPage() {
  return <SignUpForm />;
}
