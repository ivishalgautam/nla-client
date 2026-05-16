"use client";
import { getCookie } from "@/app/lib/cookies";
import { adminRequest } from "@/app/lib/requestMethods";
import { downloadResultsZip } from "@/utils/downloadResultsZip";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function Page() {
  const [isDownloading, setIsDownloading] = useState(false);
  const [date, setDate] = useState({
    startDate: null,
    endDate: null,
  });

  async function getResults() {
    try {
      setIsDownloading(true);
      if (!date.startDate) return toast.error("Please select start date");
      if (!date.endDate) return toast.error("Please select end date");

      const resp = await adminRequest.get(
        `/results-download?start_date=${date.startDate}&end_date=${date.endDate}`,
        {
          headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
        },
      );
      if (resp?.data?.length > 0) {
        // console.log(resp.data);
        downloadResultsZip(resp.data);
      } else {
        toast.error("No result found for selected dats.");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <div className="mb-4 grid grid-cols-12 gap-4">
      <div className="relative col-span-5">
        <input
          type="date"
          onChange={(e) =>
            setDate((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
          name="startDate"
          className="my-input peer"
        />
        <label htmlFor="startDate" className="my-label">
          Start Date
        </label>
      </div>
      <div className="relative col-span-5">
        <input
          type="date"
          onChange={(e) =>
            setDate((prev) => ({ ...prev, [e.target.name]: e.target.value }))
          }
          name="endDate"
          className="my-input peer"
        />
        <label htmlFor="endDate" className="my-label">
          End Date
        </label>
      </div>
      {date.startDate && date.endDate && (
        <button
          onClick={() => getResults()}
          className="px-3 py-1 rounded bg-primary text-white col-span-2"
          disabled={isDownloading}
        >
          {isDownloading ? "Downloading please wait..." : "Download results"}
        </button>
      )}
    </div>
  );
}
