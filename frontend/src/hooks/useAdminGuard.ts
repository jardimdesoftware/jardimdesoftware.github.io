"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated } from "@/utils/auth";

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

/**
 * Protege as paginas de `/admin/*` (exceto `/admin/login`): se nao houver
 * token salvo, redireciona para o login. Retorna `isChecking` para que a
 * pagina evite renderizar conteudo protegido antes da checagem (flash).
 *
 * Usa `useSyncExternalStore` (em vez de `useState` + `useEffect`) para ler o
 * localStorage - a forma recomendada pelo React para ler uma fonte externa
 * mutavel, com um snapshot de servidor explicito (`false`) que evita
 * mismatches de hidratacao e nao dispara `setState` sincrono dentro de um
 * efeito (regra `react-hooks/set-state-in-effect`).
 *
 * Espelha o `useRoleGuard` do qualeider, simplificado porque aqui so existe
 * um papel (admin autenticado ou nao) - nao ha checagem de role.
 *
 * IMPORTANTE: o efeito abaixo NAO decide se redireciona usando `authed`
 * (valor de `useSyncExternalStore`, capturado no fechamento do render) -
 * ele chama `isAuthenticated()` novamente, ao vivo, no corpo do efeito.
 * Motivo: em uma navegacao completa (hard reload / URL digitada / link
 * externo) para uma rota aninhada de `/admin/*`, o primeiro efeito apos a
 * hidratacao pode disparar antes do `useSyncExternalStore` re-sincronizar
 * com o valor real do localStorage - nesse instante `authed` ainda carrega
 * o snapshot de servidor (`false`), entao um efeito que confiasse nele
 * redirecionaria para `/admin/login` mesmo com um token valido salvo (o
 * login entao manda de volta para "/admin", perdendo a rota aninhada
 * original). Como o efeito so roda no navegador (nunca durante o SSR),
 * ler `isAuthenticated()` diretamente aqui sempre reflete o localStorage
 * real no momento da execucao - sem o valor "vazado" do snapshot de
 * servidor. `authed` continua nas dependencias para que o efeito
 * re-execute quando o token mudar (login/logout em outra aba via evento
 * `storage`) e para alimentar `isChecking` (evita renderizar conteudo
 * protegido antes da checagem).
 */
export function useAdminGuard() {
  const router = useRouter();
  const authed = useSyncExternalStore(
    subscribe,
    () => isAuthenticated(),
    () => false,
  );

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/admin/login");
    }
  }, [authed, router]);

  return { isChecking: !authed };
}
