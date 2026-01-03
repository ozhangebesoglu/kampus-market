import { Metadata } from "next";
import { RegisterForm } from "@/components/auth/register-form";

export const metadata: Metadata = {
  title: "Kayıt Ol",
  description: "KampüsMarket'e kayıt olun ve alışverişe başlayın",
};

export default function RegisterPage() {
  return <RegisterForm />;
}
