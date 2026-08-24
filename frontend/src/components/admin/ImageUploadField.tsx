"use client";

import * as React from "react";
import toast from "react-hot-toast";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uploadsService } from "@/services/uploads.service";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

interface ImageUploadFieldProps {
  id?: string;
  value?: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

/**
 * Campo de imagem dos formularios admin: aceita tanto colar uma URL externa
 * quanto enviar um arquivo (POST /admin/uploads), preenchendo o mesmo campo
 * de texto com a URL absoluta retornada pelo backend.
 */
export function ImageUploadField({
  id,
  value,
  onChange,
  disabled,
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Formato não suportado. Use JPEG, PNG, WEBP ou GIF.");
      return;
    }
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error("Imagem muito grande (máximo 5MB).");
      return;
    }

    setIsUploading(true);
    try {
      const { url } = await uploadsService.uploadImage(file);
      onChange(url);
      toast.success("Imagem enviada com sucesso");
    } catch {
      toast.error("Falha ao enviar a imagem. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          id={id}
          placeholder="https://..."
          value={value ?? ""}
          disabled={disabled || isUploading}
          onChange={(event) => onChange(event.target.value)}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled || isUploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {isUploading ? "Enviando..." : "Enviar imagem"}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          accept={ALLOWED_TYPES.join(",")}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Pré-visualização"
          className="h-20 w-20 rounded-md border border-brand-border object-cover"
        />
      ) : null}
    </div>
  );
}
