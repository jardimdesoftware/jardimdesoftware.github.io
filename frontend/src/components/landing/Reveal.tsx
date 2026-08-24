"use client";

import { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";
import { useRevealOnScroll } from "@/hooks/useRevealOnScroll";

/**
 * Wrapper cliente que porta o `.will-reveal` do site legado (ver
 * src/hooks/useRevealOnScroll.ts e o `.will-reveal`/`.revealed` em
 * globals.css) para o React: qualquer bloco envolto por <Reveal> aparece
 * com fade + translateY assim que entra na viewport.
 *
 * Usado dentro de Server Components (HeroSection, ValuePropsSection,
 * CTASection) sem precisar torna-los "use client" - a composicao de Server
 * Component -> Client Component como filho e suportada pelo App Router.
 */
export function Reveal({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  const ref = useRevealOnScroll<HTMLDivElement>();

  return (
    <div ref={ref} className={cn("will-reveal", className)} {...props}>
      {children}
    </div>
  );
}
