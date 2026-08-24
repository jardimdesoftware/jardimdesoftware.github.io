import { Rocket, Palette, Handshake } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/landing/Reveal";

const VALUE_PROPS = [
  {
    icon: Rocket,
    title: "Desenvolvimento Ágil",
    description:
      "Entregamos software em ciclos curtos e iterativos, com foco em valor real para quem usa — do planejamento ao deploy.",
  },
  {
    icon: Palette,
    title: "UX/UI",
    description:
      "Projetamos interfaces acessíveis e centradas na experiência do usuário, unindo pesquisa, prototipação e testes.",
  },
  {
    icon: Handshake,
    title: "Pesquisa & Extensão",
    description:
      "Conectamos ensino, pesquisa aplicada e extensão universitária a parcerias institucionais que geram impacto social.",
  },
];

export function ValuePropsSection() {
  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-brand-text">
            Como atuamos
          </h2>
          <p className="mt-2 text-brand-muted">
            Um grupo de extensão que une teoria e prática na construção de
            soluções digitais.
          </p>
        </Reveal>

        <Reveal className="mt-12 grid gap-6 sm:grid-cols-3">
          {VALUE_PROPS.map((item) => (
            <Card key={item.title}>
              <CardContent className="p-6">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-brand-gradient text-white">
                  <item.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-brand-text">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-brand-muted">
                  {item.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
