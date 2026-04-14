import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-6 space-y-1 px-4 md:px-0", className)}>
      <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-[var(--text-primary)] md:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="text-sm text-[var(--text-muted)]">{description}</p>
      ) : null}
    </div>
  );
}
