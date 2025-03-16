export function LoadingSpinner({ size }: { size?: "sm" | "md" | "lg" }) {
  const sizeClassMap = {
    sm: "h-5 w-5",
    md: "h-10 w-10",
    lg: "h-14 w-14",
  };

  const sizeClass = sizeClassMap[size ?? "lg"];

  return (
    <div
      className={`${sizeClass} border-4 border-t-primary rounded-full animate-spin`}
    ></div>
  );
}
