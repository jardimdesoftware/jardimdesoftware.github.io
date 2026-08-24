import Image from "next/image";
import { ArrowRight, Github } from "lucide-react";

import { Reveal } from "@/components/landing/Reveal";

const PILLS = [
  "Desenvolvimento Ágil",
  "UX/UI",
  "Pesquisa & Extensão",
  "Parcerias Institucionais",
];

export function HeroSection() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden bg-gradient-to-b from-white to-brand-bg pb-16 pt-16 md:pb-24 md:pt-24"
    >
      {/* Blobs decorativos: dois circulos borrados em animacao lenta, dao
          profundidade ao hero sem competir com o conteudo (aria-hidden,
          atras de tudo via -z-10, contidos pelo overflow-hidden da section). */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      >
        <div className="absolute -left-24 -top-24 h-72 w-72 animate-blob rounded-full bg-brand-blue/25 blur-3xl" />
        <div className="absolute -right-16 top-1/3 h-80 w-80 animate-blob rounded-full bg-brand-green/20 blur-3xl [animation-delay:4s]" />
        <div className="absolute bottom-0 left-1/3 h-64 w-64 animate-blob rounded-full bg-brand-blue/15 blur-3xl [animation-delay:8s]" />
      </div>

      <div className="container grid items-center gap-12 md:grid-cols-2">
        <Reveal className="text-center md:text-left">
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-brand-text sm:text-5xl">
            Inovação em{" "}
            <span className="gradient-text">Soluções de Software</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 md:mx-0">
            Jardim de Software do IFPE — Campus Belo Jardim. Unimos ensino,
            extensão, pesquisa e inovação para conceber, projetar e entregar
            soluções digitais de impacto acadêmico e social.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row md:justify-start">
            <a
              href="#projetos"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-blue px-6 py-3 text-base font-extrabold text-white shadow-[0_10px_24px_rgba(30,136,229,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-blue-dark hover:shadow-[0_16px_32px_rgba(30,136,229,0.4)]"
            >
              Conheça nossos projetos
              <ArrowRight className="h-5 w-5" />
            </a>
            <a
              href="https://github.com/jardimdesoftware/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-[#A9D2FF] px-6 py-3 text-base font-extrabold text-brand-blue-dark transition-colors hover:border-[#68B7FF] hover:bg-[#EAF3FF]"
            >
              <Github className="h-5 w-5" />
              Acesse o GitHub
            </a>
          </div>

          <ul className="mt-6 flex flex-wrap justify-center gap-2.5 md:justify-start">
            {PILLS.map((pill) => (
              <li
                key={pill}
                className="rounded-full border border-brand-border bg-slate-100 px-3.5 py-2 text-sm font-semibold text-slate-700"
              >
                {pill}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="relative hidden md:block">
          <div
            aria-hidden
            className="absolute -inset-3 -z-10 rounded-[2rem] bg-brand-gradient opacity-20 blur-2xl"
          />
          <div className="overflow-hidden rounded-2xl border border-brand-border shadow-[0_10px_30px_rgba(30,136,229,0.08)]">
            <Image
              src="/logob.png"
              alt="Equipe colaborando em projeto de software educacional"
              width={900}
              height={700}
              className="aspect-[4/3] w-full object-cover"
              priority
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
