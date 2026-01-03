import { LoadingSpinner } from "@/components/shared/loading";

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
    </div>
  );
}
