import Image from "next/image";
import Link from "next/link";
import { Github, Instagram } from "lucide-react";

export function LandingFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-brand-border bg-white">
      <div className="container flex flex-col items-center justify-between gap-6 py-10 sm:flex-row">
        <div className="flex items-center gap-3">
          <Image
            src="/logob.png"
            alt="Logo Jardim de Software"
            width={40}
            height={40}
            className="h-10 w-10 object-contain"
          />
          <div>
            <p className="font-extrabold text-brand-text">
              Jardim de Software — IFPE
            </p>
            <p className="text-sm text-brand-muted">
              Campus Belo Jardim • Ensino | Extensão | Pesquisa | Inovação
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/jardimdesoftware/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-brand-border px-3 py-2 text-sm font-bold text-slate-800 transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5 hover:text-brand-blue-dark"
          >
            <Github className="h-[18px] w-[18px]" aria-hidden />
            GitHub
          </Link>
          <Link
            href="https://github.com/jardimdesoftware/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-brand-border px-3 py-2 text-sm font-bold text-slate-800 transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5 hover:text-brand-blue-dark"
          >
            <Instagram className="h-[18px] w-[18px]" aria-hidden />
            Instagram
          </Link>
        </div>
      </div>

      <div className="container border-t border-brand-border py-5">
        <p className="text-center text-sm text-brand-muted">
          © {year} Jardim de Software — IFPE • Campus Belo Jardim. Todos os
          direitos reservados.
        </p>
      </div>
    </footer>
  );
}
