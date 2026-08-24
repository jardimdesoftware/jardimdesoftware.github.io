import { apiBase, API_ORIGIN } from "@/services/baseApi";

export interface UploadResult {
  url: string;
}

export const uploadsService = {
  /** POST /admin/uploads (multipart/form-data) - retorna a URL absoluta da imagem enviada. */
  uploadImage: async (file: File): Promise<UploadResult> => {
    const formData = new FormData();
    formData.append("file", file);

    const { data } = await apiBase.post<UploadResult>(
      "/admin/uploads",
      formData,
    );

    return { url: `${API_ORIGIN}${data.url}` };
  },
};
