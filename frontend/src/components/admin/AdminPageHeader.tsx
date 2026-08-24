import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminPageHeaderProps {
  title: string;
  subtitle?: string;
  addHref?: string;
  addLabel?: string;
}

export function AdminPageHeader({
  title,
  subtitle,
  addHref,
  addLabel = "Adicionar",
}: AdminPageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-text">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-brand-muted">{subtitle}</p>}
      </div>
      {addHref && (
        <Button asChild variant="gradient">
          <Link href={addHref}>
            <Plus className="h-4 w-4" />
            {addLabel}
          </Link>
        </Button>
      )}
    </div>
  );
}
