"use client";

import Link from "next/link";
import { ArrowLeft, Github, Linkedin, Mail } from "lucide-react";

import { useTeamMember } from "@/hooks/queries/useTeamMembers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function MemberDetailView({ slug }: { slug: string }) {
  // Export estatico: nao ha mais hidratacao vinda do servidor - o dado e
  // buscado aqui mesmo, no cliente, via useQuery (useTeamMember).
  const { data: member, isLoading, isError } = useTeamMember(slug);

  if (isLoading) {
    return (
      <section className="py-16 md:py-20">
        <div className="container max-w-3xl animate-pulse space-y-4">
          <div className="h-4 w-40 rounded bg-slate-200" />
          <div className="mx-auto h-28 w-28 rounded-full bg-slate-200" />
          <div className="mx-auto h-8 w-1/2 rounded bg-slate-200" />
          <div className="h-24 w-full rounded-2xl bg-slate-200" />
        </div>
      </section>
    );
  }

  if (isError || !member) {
    return (
      <section className="py-16 md:py-20">
        <div className="container max-w-3xl text-center">
          <h1 className="text-2xl font-extrabold text-brand-text">
            Integrante não encontrado
          </h1>
          <p className="mt-2 text-brand-muted">
            O integrante que você está procurando não existe ou foi
            removido.
          </p>
          <Link
            href="/equipe"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar para Equipe
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 md:py-20">
      <div className="container max-w-3xl">
        <Link
          href="/equipe"
          className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-blue-dark hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para Equipe
        </Link>

        <div className="mt-6 flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left">
          <Avatar className="h-28 w-28 sm:mr-6">
            <AvatarImage src={member.photoUrl ?? undefined} alt={member.name} />
            <AvatarFallback className="text-2xl">
              {initials(member.name)}
            </AvatarFallback>
          </Avatar>

          <div className="mt-4 sm:mt-0">
            <Badge variant={member.roleType === "DOCENTE" ? "docente" : "discente"}>
              {member.roleType === "DOCENTE" ? "Docente" : "Discente"}
            </Badge>
            <h1 className="mt-2 text-3xl font-extrabold text-brand-text">
              {member.name}
            </h1>
            {member.roleTitle && (
              <p className="mt-1 text-lg text-brand-muted">
                {member.roleTitle}
              </p>
            )}

            {(member.email || member.linkedinUrl || member.githubUrl) && (
              <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    aria-label="Enviar e-mail"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border text-slate-700 transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5 hover:text-brand-blue-dark"
                  >
                    <Mail className="h-[18px] w-[18px]" />
                  </a>
                )}
                {member.linkedinUrl && (
                  <a
                    href={member.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Perfil no LinkedIn"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border text-slate-700 transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5 hover:text-brand-blue-dark"
                  >
                    <Linkedin className="h-[18px] w-[18px]" />
                  </a>
                )}
                {member.githubUrl && (
                  <a
                    href={member.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Perfil no GitHub"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-brand-border text-slate-700 transition-colors hover:border-brand-blue/40 hover:bg-brand-blue/5 hover:text-brand-blue-dark"
                  >
                    <Github className="h-[18px] w-[18px]" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="mt-10 space-y-4 text-base leading-relaxed text-brand-text">
          {member.bio
            .split(/\n+/)
            .map((p) => p.trim())
            .filter(Boolean)
            .map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
        </div>
      </div>
    </section>
  );
}
