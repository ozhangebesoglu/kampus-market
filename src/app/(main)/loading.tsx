import { LoadingSpinner } from "@/components/shared/loading";

export default function MainLoading() {
  return (
    <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-[400px]">
      <LoadingSpinner size="lg" />
      <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
    </div>
  );
}
