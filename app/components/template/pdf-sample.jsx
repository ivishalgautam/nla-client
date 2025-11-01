"use client";
import Pdf from "@/app/components/template/Pdf";
import { PDFDownloadLink } from "@react-pdf/renderer";
import React, { useState, useEffect } from "react";

export default function PDFSample() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="flex gap-2">
        <button className="w-full p-2 bg-primary rounded text-white">
          Loading...
        </button>
        <button className="w-full p-2 bg-primary rounded text-white">
          Loading...
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <PDFDownloadLink
        document={
          <Pdf
            result={{
              subject: "abacus",
              fullname: "Vishal",
              class: "12th",
              school_name: "My school name",
              grade: "A",
              held_on: new Date(),
            }}
          />
        }
        filename="FORM"
      >
        {({ loading }) =>
          loading ? (
            <button className="w-full p-2 bg-primary rounded text-white">
              Loading Document...
            </button>
          ) : (
            <button className="w-full p-2 bg-primary rounded text-white">
              Download Abacus Certificate
            </button>
          )
        }
      </PDFDownloadLink>

      <PDFDownloadLink
        document={
          <Pdf
            result={{
              subject: "vedic",
              fullname: "Vishal",
              class: "12th",
              school_name: "My school name",
              grade: "A",
              held_on: new Date(),
            }}
          />
        }
        filename="FORM"
      >
        {({ loading }) =>
          loading ? (
            <button className="w-full p-2 bg-primary rounded text-white">
              Loading Document...
            </button>
          ) : (
            <button className="w-full p-2 bg-primary rounded text-white">
              Download Vedic Certificate
            </button>
          )
        }
      </PDFDownloadLink>
    </div>
  );
}
