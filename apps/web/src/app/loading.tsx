export default function Loading() {
  return (
    <div className="flex flex-col gap-4 p-4 md:p-6 animate-pulse">
      <div className="h-8 w-48 bg-muted rounded"></div>
      <div className="grid gap-4 md:grid-cols-3">
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="h-32 bg-muted rounded-lg"></div>
        <div className="h-32 bg-muted rounded-lg"></div>
      </div>
      <div className="h-64 bg-muted rounded-lg mt-4"></div>
    </div>
  );
}
