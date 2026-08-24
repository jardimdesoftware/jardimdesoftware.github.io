import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * `<select>` nativo estilizado para combinar com os demais campos do painel
 * admin. Nao usa Radix Select para manter a dependencia minima (o plano de
 * Milestone 5 explicitamente permite "ou um `<select>` nativo estilizado de
 * forma consistente" em vez de puxar um componente de UI a mais).
 */
export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <select
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        ref={ref}
        {...props}
      >
        {children}
      </select>
    );
  },
);
Select.displayName = "Select";

export { Select };
