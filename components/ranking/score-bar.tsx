export function ScoreBar({
  value,
  className = "bg-firuza",
  size = "md",
}: {
  value: number;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <div className={`w-full overflow-hidden rounded-full bg-paper-sunk ${size === "sm" ? "h-1.5" : "h-2"}`}>
      <div className={`h-full rounded-full ${className}`} style={{ width: `${Math.max(0, Math.min(100, value))}%` }} />
    </div>
  );
}
