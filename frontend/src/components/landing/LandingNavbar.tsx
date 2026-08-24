"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";

import { cn } from "@/lib/utils";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

/**
 * A navbar aponta para as secoes da propria home (`/#secao`) em vez de
 * navegar para paginas separadas - clicar em "Equipe", por exemplo, rola ate
 * a secao Equipe da home. As paginas dedicadas (/equipe, /projetos,
 * /noticias, /publicacoes) continuam existindo para listas completas, mas
 * sao acessadas pelos botoes "Ver todos" de cada secao, nao pela navbar.
 * "Publicações" e excecao: nao tem secao propria na home, entao continua
 * apontando direto para a pagina dedicada.
 *
 * Itens com `sectionId` usam <a> nativa (nao o <Link> do Next): um <Link>
 * para um href que so muda o hash nao dispara o scroll-ate-a-ancora quando
 * ja se esta em "/" (o Next so rola em navegacoes que trocam de rota). Ainda
 * assim, chamamos scrollIntoView explicitamente no onClick (sem
 * preventDefault, o href continua funcionando normalmente para
 * abrir-em-nova-aba/etc.) em vez de confiar so no scroll nativo do
 * navegador para a ancora, que se mostrou inconsistente estando ja em "/".
 */
function scrollToSection(sectionId: string) {
  document
    .getElementById(sectionId)
    ?.scrollIntoView({ behavior: "smooth", block: "start" });
}
const NAV_LINKS = [
  { href: "/#equipe", label: "Equipe", sectionId: "equipe" },
  { href: "/#projetos", label: "Projetos", sectionId: "projetos" },
  { href: "/#depoimentos", label: "Depoimentos", sectionId: "depoimentos" },
  { href: "/#noticias", label: "Notícias", sectionId: "noticias" },
  { href: "/publicacoes", label: "Publicações", sectionId: null },
] as const;

const SCROLL_SPY_IDS = ["equipe", "projetos", "depoimentos", "noticias"];

function navLinkClass(active: boolean) {
  return cn(
    "group relative rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-brand-blue/10 hover:text-brand-blue",
    active && "text-brand-blue-dark",
  );
}

function NavUnderline({ active }: { active: boolean }) {
  return (
    <span
      className={cn(
        "absolute inset-x-3 -bottom-0.5 h-0.5 origin-left scale-x-0 rounded-full bg-brand-gradient transition-transform duration-300 ease-out group-hover:scale-x-100",
        active && "scale-x-100",
      )}
    />
  );
}

export function LandingNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const activeId = useScrollSpy(SCROLL_SPY_IDS);

  function isLinkActive(href: string, sectionId: string | null) {
    if (sectionId) {
      return pathname === "/" && activeId === sectionId;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-transparent bg-white/80 backdrop-blur-md transition-shadow",
        scrolled && "border-brand-border shadow-[0_6px_24px_rgba(0,0,0,0.06)]",
      )}
    >
      <div className="container flex h-16 items-center justify-between">
        <a
          href="/#inicio"
          onClick={() => scrollToSection("inicio")}
          className="flex items-center gap-2"
        >
          <Image
            src="/logot.png"
            alt="Logo Jardim de Software"
            width={40}
            height={40}
            className="h-9 w-9 object-contain"
            priority
          />
          <span className="hidden flex-col leading-tight sm:flex">
            <span className="text-base font-extrabold text-brand-text">
              Jardim de Software
            </span>
            <span className="text-xs font-medium text-brand-muted">
              IFPE • Campus Belo Jardim
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const active = isLinkActive(link.href, link.sectionId);
            return link.sectionId ? (
              <a
                key={link.href}
                href={link.href}
                onClick={() => scrollToSection(link.sectionId)}
                className={navLinkClass(active)}
              >
                {link.label}
                <NavUnderline active={active} />
              </a>
            ) : (
              <Link key={link.href} href={link.href} className={navLinkClass(active)}>
                {link.label}
                <NavUnderline active={active} />
              </Link>
            );
          })}
          <Button asChild size="sm" className="ml-2">
            <a
              href="https://github.com/jardimdesoftware/"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
        </nav>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              aria-label="Abrir menu"
            >
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-4/5 sm:w-72">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="mt-6 flex flex-col gap-1">
              {NAV_LINKS.map((link) => {
                const active = isLinkActive(link.href, link.sectionId);
                const className = cn(
                  "rounded-lg px-3 py-3 text-base font-semibold text-slate-700 hover:bg-brand-blue/10 hover:text-brand-blue",
                  active && "bg-brand-blue/10 text-brand-blue-dark",
                );
                return link.sectionId ? (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => {
                      scrollToSection(link.sectionId);
                      setOpen(false);
                    }}
                    className={className}
                  >
                    {link.label}
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={className}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <a
                href="https://github.com/jardimdesoftware/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-lg bg-brand-gradient px-3 py-3 text-center text-base font-bold text-white"
              >
                Acesse o GitHub
              </a>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
