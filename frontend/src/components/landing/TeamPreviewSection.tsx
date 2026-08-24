"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useTeamMembers } from "@/hooks/queries/useTeamMembers";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/landing/Reveal";

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function TeamPreviewSection() {
  const { data: members, isLoading } = useTeamMembers({ active: true });
  const preview = members?.slice(0, 6) ?? [];

  return (
    <section id="equipe" className="bg-brand-bg py-16 md:py-24">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-extrabold text-brand-text">Equipe</h2>
          <p className="mt-2 text-brand-muted">
            Docentes e discentes atuando na concepção, desenvolvimento e
            transferência de tecnologia.
          </p>
        </Reveal>

        {isLoading ? (
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="h-56 animate-pulse rounded-2xl bg-slate-200"
              />
            ))}
          </div>
        ) : preview.length === 0 ? (
          <p className="mt-12 text-center text-brand-muted">
            Em breve, novos integrantes serão apresentados aqui.
          </p>
        ) : (
          <Reveal className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {preview.map((member) => (
              <Card key={member.id}>
                <CardContent className="flex flex-col items-center p-6 text-center">
                  <Avatar className="h-20 w-20">
                    <AvatarImage
                      src={member.photoUrl ?? undefined}
                      alt={member.name}
                    />
                    <AvatarFallback>{initials(member.name)}</AvatarFallback>
                  </Avatar>
                  <h3 className="mt-4 font-bold text-brand-text">
                    {member.name}
                  </h3>
                  <Badge
                    variant={
                      member.roleType === "DOCENTE" ? "docente" : "discente"
                    }
                    className="mt-2"
                  >
                    {member.roleType === "DOCENTE" ? "Docente" : "Discente"}
                  </Badge>
                  {member.roleTitle && (
                    <p className="mt-2 text-sm text-brand-muted">
                      {member.roleTitle}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </Reveal>
        )}

        <div className="mt-10 text-center">
          <Button asChild variant="outline">
            <Link href="/equipe">
              Ver toda a equipe
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
