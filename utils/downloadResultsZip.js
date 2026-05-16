// utils/downloadResultsZip.js

import JSZip from "jszip";
import { saveAs } from "file-saver";
import { pdf } from "@react-pdf/renderer";
import Pdf from "@/app/components/template/Pdf";

export async function downloadResultsZip(results) {
  try {
    const zip = new JSZip();

    for (const result of results) {
      // Generate PDF Blob
      const blob = await pdf(<Pdf result={result} />).toBlob();
      // File name
      const fileName = `${result.fullname}-${result.test_name}-${result.id}.pdf`
        .replace(/\s+/g, "-")
        .toLowerCase();

      // Add to zip
      zip.file(fileName, blob);
    }

    // Generate ZIP
    const zipBlob = await zip.generateAsync({ type: "blob" });

    // Download ZIP
    saveAs(zipBlob, "student-results.zip");
  } catch (error) {
    console.error("ZIP download failed:", error);
  }
}
