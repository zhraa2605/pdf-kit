import toast from "react-hot-toast";
import { api } from "./api";

export const generatePdf = async (blocks: any[]) => {
  try {
    const response = await api.post(
      "/generate-pdf",
      { blocks },
      { responseType: "blob" }
    );
    const blob = new Blob([response.data], { type: "application/pdf" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "generated.pdf";
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success("PDF generated and downloaded!");
  } catch (err) {
    toast.error("Failed to generate PDF");
  }
};