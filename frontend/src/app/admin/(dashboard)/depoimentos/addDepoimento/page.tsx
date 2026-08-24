"use client";

import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { TestimonialForm } from "@/app/admin/(dashboard)/depoimentos/_components/TestimonialForm";
import { useCreateTestimonial } from "@/hooks/queries/useTestimonials";
import { getFriendlyErrorMessage } from "@/utils/errorMessage";

export default function AddDepoimentoPage() {
  const router = useRouter();
  const { mutate: createTestimonial, isPending } = useCreateTestimonial();

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Adicionar Depoimento" subtitle="Cadastre um novo depoimento" />

      <TestimonialForm
        isSubmitting={isPending}
        submitLabel="Cadastrar Depoimento"
        onSubmit={(values) =>
          createTestimonial(values, {
            onSuccess: () => {
              toast.success("Depoimento cadastrado com sucesso.");
              router.push("/admin/depoimentos");
            },
            onError: (err) => toast.error(getFriendlyErrorMessage(err)),
          })
        }
      />
    </div>
  );
}
