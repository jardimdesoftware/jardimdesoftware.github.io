"use client";

import { useSearchParams } from "next/navigation";

import { NewsList } from "./NewsList";

const LIMIT = 6;

/**
 * Le `?page=` da URL no cliente (useSearchParams) em vez de via `searchParams`
 * no Server Component - export estatico (GitHub Pages) nao tem servidor para
 * resolver query strings em request time, entao a paginacao precisa ser
 * inteiramente client-side.
 */
export function NoticiasContent() {
  const searchParams = useSearchParams();
  const page = Math.max(1, Number(searchParams.get("page")) || 1);

  return <NewsList page={page} limit={LIMIT} />;
}
