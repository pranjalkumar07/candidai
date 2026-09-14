export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
      <span className="inline-block size-10 border-3 border-primary-200 border-t-transparent rounded-full animate-spin" />
      <p className="text-light-100 text-sm font-medium animate-pulse">Loading...</p>
    </div>
  );
}
