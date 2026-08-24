"use client";

import { useEffect, useRef } from "react";

/**
 * Porta do initRevealOnScroll() do script.js legado: quando o elemento
 * referenciado entra na viewport, recebe a classe `.revealed`, que dispara
 * a transicao definida em `.will-reveal` (src/app/globals.css). Use o ref
 * retornado em conjunto com `className="will-reveal"`.
 */
export function useRevealOnScroll<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          el.classList.add("revealed");
          obs.unobserve(el);
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}
