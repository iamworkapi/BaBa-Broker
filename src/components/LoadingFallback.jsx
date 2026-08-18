export default function LoadingFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b0f19]">
      <div className="animate-spin h-8 w-8 border-2 border-accent border-t-transparent rounded-full"></div>
    </div>
  );
}
