import React from "react";

export default function Loading() {
  return (
    <section className="h-full space-y-4">
      <div className="rounded-md bg-white shadow animate-pulse">
        <div className="grid grid-cols-3 gap-4 p-4 text-white">
          <div className="h-24 animate-pulse bg-gray-200 rounded-md"></div>
          <div className="h-24 animate-pulse bg-gray-200 rounded-md"></div>
          <div className="h-24 animate-pulse bg-gray-200 rounded-md"></div>
          <div className="h-24 animate-pulse bg-gray-200 rounded-md"></div>
          <div className="h-24 animate-pulse bg-gray-200 rounded-md"></div>
          <div className="h-24 animate-pulse bg-gray-200 rounded-md"></div>
        </div>
      </div>

      <div className="rounded-md bg-gray-300 shadow animate-pulse">
        <div className="grid grid-cols-3 gap-4 p-4 text-white">
          <div className="h-24"></div>
          <div className="h-24"></div>
          <div className="h-24"></div>
          <div className="h-24"></div>
          <div className="h-24"></div>
          <div className="h-24"></div>
        </div>
      </div>
    </section>
  );
}
