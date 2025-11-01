"use client";
import React from "react";
import dynamic from "next/dynamic";

// Dynamically import the component with no SSR
const PDFSample = dynamic(() => import("../components/template/pdf-sample"), {
  ssr: false,
  loading: () => (
    <div className="flex gap-2">
      <button className="w-full p-2 bg-primary rounded text-white">
        Loading...
      </button>
      <button className="w-full p-2 bg-primary rounded text-white">
        Loading...
      </button>
    </div>
  ),
});

export default function Page() {
  return <PDFSample />;
}
