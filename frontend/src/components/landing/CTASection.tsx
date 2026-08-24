import { Github, Mail } from "lucide-react";

import { Reveal } from "@/components/landing/Reveal";

export function CTASection() {
  return (
    <section className="bg-brand-gradient py-16 text-white md:py-20">
      <Reveal className="container flex flex-col items-center gap-6 text-center">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          Quer fazer parte do Jardim de Software?
        </h2>
        <p className="max-w-xl text-white/90">
          Acompanhe nossos repositórios abertos ou entre em contato para
          conhecer oportunidades de parceria, extensão e pesquisa.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="https://github.com/jardimdesoftware/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-base font-extrabold text-brand-blue-dark shadow-lg transition-transform hover:scale-105"
          >
            <Github className="h-5 w-5" />
            Acesse nosso GitHub
          </a>
          <a
            href="mailto:jardimdesoftware@ifpe.edu.br"
            className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/70 px-6 py-3 text-base font-extrabold text-white transition-colors hover:bg-white/10"
          >
            <Mail className="h-5 w-5" />
            Fale Conosco
          </a>
        </div>
      </Reveal>
    </section>
  );
}
