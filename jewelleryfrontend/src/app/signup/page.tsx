import { EmailAccess } from "@/components/account/email-access";
export const metadata = { title: "Create an account" };
export default function SignupPage() {
  return <EmailAccess mode="signup" />;
}
