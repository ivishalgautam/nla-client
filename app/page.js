"use client";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Pdf from "./components/template/Pdf";

export default function Home() {
  return "Hello";

  return (
    <div>
      <PDFDownloadLink
        document={
          <Pdf
            result={{
              subject: "vedic",
              fullname: "Vishal",
              class: "12th",
              school_name: "Vishal school",
              grade: "1",
              held_on: "12-09-2025",
            }}
          />
        }
        filename="FORM"
        className="col-span-2"
      >
        {({ loading }) =>
          loading ? (
            <button className="w-full py-2 bg-primary rounded text-white">
              Loading Document...
            </button>
          ) : (
            <button className="w-full py-2 bg-primary rounded text-white">
              Download Certificate
            </button>
          )
        }
      </PDFDownloadLink>
    </div>
  );
}
