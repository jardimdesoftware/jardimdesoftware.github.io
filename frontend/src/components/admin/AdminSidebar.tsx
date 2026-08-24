"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Newspaper,
  BookOpen,
  Quote,
  BarChart3,
  ShieldCheck,
  LogOut,
  Sprout,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { clearAuthToken } from "@/utils/auth";

interface NavItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/admin", label: "Visão Geral", icon: LayoutDashboard, exact: true },
  { href: "/admin/team-members", label: "Integrantes", icon: Users },
  { href: "/admin/projetos", label: "Projetos", icon: FolderKanban },
  { href: "/admin/noticias", label: "Notícias", icon: Newspaper },
  { href: "/admin/publicacoes", label: "Publicações", icon: BookOpen },
  { href: "/admin/depoimentos", label: "Depoimentos", icon: Quote },
  { href: "/admin/estatisticas", label: "Estatísticas", icon: BarChart3 },
  { href: "/admin/administradores", label: "Administradores", icon: ShieldCheck },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuthToken();
    router.push("/admin/login");
  };

  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-brand-border bg-white">
      <div className="flex items-center gap-2 border-b border-brand-border px-5 py-5">
        <Sprout className="h-6 w-6 text-brand-green" />
        <div>
          <p className="text-sm font-extrabold leading-tight text-brand-text">
            Jardim de Software
          </p>
          <p className="text-xs text-brand-muted">Painel Administrativo</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const isActive = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors",
                isActive
                  ? "bg-brand-blue/10 text-brand-blue-dark"
                  : "text-brand-muted hover:bg-brand-bg hover:text-brand-text",
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-brand-border p-3">
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-brand-muted transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
          Sair
        </button>
      </div>
    </aside>
  );
}
