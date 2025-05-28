import { api } from "./api";
import toast from "react-hot-toast";

export const mergePdfFiles = async (
  files: File[],
  onLoadingChange: (loading: boolean) => void,
  onSuccess: () => void
) => {
  if (files.length === 0) {
    toast.error("Please select files to upload.");
    return;
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  onLoadingChange(true);

  try {
    const response = await api.post("/merge-files", formData, {
      headers: { "Content-Type": "multipart/form-data" },
      responseType: "blob",
    });

    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "merged-report.pdf";
    a.click();
    window.URL.revokeObjectURL(url);

    toast.success("Files merged and downloaded!");
    onSuccess();
  } catch (err) {
    toast.error("Failed to merge files");
    console.error(err);
  } finally {
    onLoadingChange(false);
  }
};