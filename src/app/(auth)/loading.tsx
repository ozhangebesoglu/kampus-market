import { LoadingSpinner } from "@/components/shared/loading";

export default function AuthLoading() {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <LoadingSpinner />
      <p className="mt-4 text-muted-foreground text-sm">Yükleniyor...</p>
    </div>
  );
}
