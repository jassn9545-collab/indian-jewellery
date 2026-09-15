import { EmailAccess } from "@/components/account/email-access";
export const metadata = { title: "Log in" };
export default function LoginPage() {
  return <EmailAccess mode="login" />;
}
