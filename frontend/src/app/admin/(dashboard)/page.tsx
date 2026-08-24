"use client";

import Link from "next/link";
import {
  Users,
  FolderKanban,
  Newspaper,
  BookOpen,
  Quote,
  BarChart3,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAdminTeamMembers } from "@/hooks/queries/useTeamMembers";
import { useAdminProjects } from "@/hooks/queries/useProjects";
import { useAdminNews } from "@/hooks/queries/useNews";
import { usePublications } from "@/hooks/queries/usePublications";
import { useAdminTestimonials } from "@/hooks/queries/useTestimonials";
import { useSiteStats } from "@/hooks/queries/useSiteStats";

export default function AdminDashboardPage() {
  const teamMembers = useAdminTeamMembers();
  const projects = useAdminProjects();
  const news = useAdminNews();
  const publications = usePublications();
  const testimonials = useAdminTestimonials();
  const siteStats = useSiteStats();

  const tiles = [
    {
      href: "/admin/team-members",
      label: "Integrantes",
      icon: Users,
      count: teamMembers.data?.length,
      isLoading: teamMembers.isLoading,
    },
    {
      href: "/admin/projetos",
      label: "Projetos",
      icon: FolderKanban,
      count: projects.data?.length,
      isLoading: projects.isLoading,
    },
    {
      href: "/admin/noticias",
      label: "Notícias",
      icon: Newspaper,
      count: news.data?.length,
      isLoading: news.isLoading,
    },
    {
      href: "/admin/publicacoes",
      label: "Publicações",
      icon: BookOpen,
      count: publications.data?.length,
      isLoading: publications.isLoading,
    },
    {
      href: "/admin/depoimentos",
      label: "Depoimentos",
      icon: Quote,
      count: testimonials.data?.length,
      isLoading: testimonials.isLoading,
    },
    {
      href: "/admin/estatisticas",
      label: "Estatísticas",
      icon: BarChart3,
      count: siteStats.data?.length,
      isLoading: siteStats.isLoading,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-text">
          Visão Geral
        </h1>
        <p className="mt-1 text-sm text-brand-muted">
          Resumo do conteúdo cadastrado no site do Jardim de Software.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => {
          const Icon = tile.icon;
          return (
            <Link key={tile.href} href={tile.href}>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-semibold text-brand-muted">
                    {tile.label}
                  </CardTitle>
                  <Icon className="h-5 w-5 text-brand-blue" />
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-extrabold text-brand-text">
                    {tile.isLoading ? "…" : (tile.count ?? 0)}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
