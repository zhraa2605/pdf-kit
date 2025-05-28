import { api } from "./api";
import toast from "react-hot-toast";

export const uploadAndSplitPdf = async (
  selectedFile: File,
  numFiles: number,
  onSuccess: (files: string[]) => void,
  onLoadingChange: (loading: boolean) => void
) => {
  if (!selectedFile) {
    toast.error("Please select a PDF file first.");
    return;
  }

  const formData = new FormData();
  formData.append("pdfFile", selectedFile);
  formData.append("numFiles", numFiles.toString());

  onLoadingChange(true);
  try {
    const response = await api.post("/split-pdf", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.data?.files) {
      onSuccess(response.data.files);
      toast.success("PDF successfully split!");
    } else {
      toast.error("No split files returned from the server.");
    }
  } catch (error: any) {
    console.error("Error:", error);
    toast.error(error.response?.data?.message || "Error splitting PDF.");
  } finally {
    onLoadingChange(false);
  }
};

export const downloadSplitFile = async (filePath: string) => {
  try {
    const fileName = filePath.split("/").pop() || "split.pdf";
    const encodedName = encodeURIComponent(fileName);

    const response = await api.get(`/download/split/${encodedName}`, {
      responseType: "blob",
    });

    const url = window.URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    console.error("Download error:", error);
    toast.error(error.response?.data?.message || "Error downloading split file.");
  }
};