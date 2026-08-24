"use client";

import { useTeamMembers } from "@/hooks/queries/useTeamMembers";
import { TeamMember } from "@/interfaces/team-member";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function excerpt(bio: string, max = 120) {
  if (bio.length <= max) return bio;
  return `${bio.slice(0, max).trimEnd()}…`;
}

function MemberCard({ member }: { member: TeamMember }) {
  // <a> normal (nao next/link): /equipe/:slug e resolvida no cliente por
  // StaticSlugRouter, nao existe como pagina pre-gerada - precisa de
  // navegacao completa para passar pelo fallback do 404.html. Ver
  // src/components/StaticSlugRouter.tsx.
  return (
    <a href={`/equipe/${member.slug}/`}>
      <Card className="h-full">
        <CardContent className="flex flex-col items-center p-6 text-center">
          <Avatar className="h-20 w-20">
            <AvatarImage src={member.photoUrl ?? undefined} alt={member.name} />
            <AvatarFallback>{initials(member.name)}</AvatarFallback>
          </Avatar>
          <h3 className="mt-4 font-bold text-brand-text">{member.name}</h3>
          {member.roleTitle && (
            <p className="mt-1 text-sm font-semibold text-brand-blue-dark">
              {member.roleTitle}
            </p>
          )}
          <p className="mt-2 text-sm leading-relaxed text-brand-muted">
            {excerpt(member.bio)}
          </p>
        </CardContent>
      </Card>
    </a>
  );
}

function RosterSection({
  title,
  badgeVariant,
  members,
}: {
  title: string;
  badgeVariant: "docente" | "discente";
  members: TeamMember[];
}) {
  if (members.length === 0) return null;

  return (
    <div className="mt-14 first:mt-10">
      <div className="flex items-center gap-3">
        <h2 className="text-xl font-extrabold text-brand-text">{title}</h2>
        <Badge variant={badgeVariant}>{members.length}</Badge>
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => (
          <MemberCard key={member.id} member={member} />
        ))}
      </div>
    </div>
  );
}

export function TeamRoster() {
  const { data: members, isLoading } = useTeamMembers({ active: true });

  if (isLoading) {
    return (
      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-56 animate-pulse rounded-2xl bg-slate-200" />
        ))}
      </div>
    );
  }

  const docentes = (members ?? []).filter((m) => m.roleType === "DOCENTE");
  const discentes = (members ?? []).filter((m) => m.roleType === "DISCENTE");

  if (docentes.length === 0 && discentes.length === 0) {
    return (
      <p className="mt-12 text-center text-brand-muted">
        Em breve, novos integrantes serão apresentados aqui.
      </p>
    );
  }

  return (
    <>
      <RosterSection title="Docentes" badgeVariant="docente" members={docentes} />
      <RosterSection
        title="Discentes"
        badgeVariant="discente"
        members={discentes}
      />
    </>
  );
}
