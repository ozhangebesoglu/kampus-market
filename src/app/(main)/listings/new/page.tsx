import { Metadata } from "next";
import { CreateListingForm } from "@/components/listings/create-listing-form";

export const metadata: Metadata = {
  title: "Yeni İlan Oluştur",
  description: "Satmak istediğiniz ürünü ilan olarak paylaşın",
};

export default function NewListingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <CreateListingForm />
    </div>
  );
}
