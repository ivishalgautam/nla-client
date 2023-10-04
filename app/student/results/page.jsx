"use client";
import ResultCard from "@/app/components/template/ResultCard";
import ResultCardMulti from "@/app/components/template/ResultCardMulti";
import { getCookie } from "@/app/lib/cookies";
import { publicRequest } from "@/app/lib/requestMethods";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { MdSkipNext, MdSkipPrevious } from "react-icons/md";

export default function StudentResultPage() {
  const [results, setResults] = useState([]);
  const [date, setDate] = useState({
    startDate: null,
    endDate: null,
  });

  const [totalPages, setTotalPages] = useState(0);
  const [resultsPerPage, setResultsPerPage] = useState(5);
  const params = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const startIndex = (parseInt(params.get("page")) - 1) * resultsPerPage;
  const endIndex = startIndex + resultsPerPage;
  const resultsToDisplay = results.slice(startIndex, endIndex);

  useEffect(() => {
    getResults(getCookie("student_id"));
  }, []);

  async function getResults(id) {
    try {
      const resp = await publicRequest.get(`/results/${id}`, {
        headers: { Authorization: `Bearer ${getCookie("student_token")}` },
      });
      setResults(resp.data);
      const tp = Math.ceil(resp.data.length / resultsPerPage);
      setTotalPages(tp);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleFilter(id) {
    try {
      const resp = await publicRequest.get(`/results/${id}`, {
        headers: { Authorization: `Bearer ${getCookie("student_token")}` },
      });
      const filteredData = resp.data
        .filter((item) => new Date(item.created_at) >= new Date(date.startDate))
        .filter((item) => new Date(item.created_at) <= new Date(date.endDate));
      setResults(filteredData);
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <section>
      <h2 className="section-heading">Results</h2>
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
        <button
          onClick={() => handleFilter(getCookie("student_id"))}
          className="px-3 py-1 rounded bg-primary text-white col-span-2"
        >
          Search
        </button>
      </div>
      <div className="rounded grid grid-cols-3 gap-y-8">
        {resultsToDisplay?.map((result) => (
          <ResultCardMulti key={result.id} result={result} path={"student"} />
        ))}
      </div>
      <div className="pagination flex items-center justify-center mt-10 text-white gap-3">
        <button
          onClick={() =>
            router.push(`${pathname}?page=${parseInt(params.get("page")) - 1}`)
          }
          disabled={parseInt(params.get("page")) === 1}
          className={`flex items-center justify-cente px-4 py-2 pr-5 rounded-md ${
            parseInt(params.get("page")) === 1
              ? "cursor-not-allowed bg-gray-400"
              : "cursor-pointer bg-primary"
          }`}
        >
          <MdSkipPrevious size={25} className="text-white" />
          <span>Previous</span>
        </button>
        <div className="bg-white text-primary border border-primary px-4 py-2 rounded-md">
          <span>Page {params.get("page")}</span>
          {/* Display total pages if needed */}
          <span> of {totalPages}</span>
        </div>
        <button
          onClick={() =>
            router.push(`${pathname}?page=${parseInt(params.get("page")) + 1}`)
          }
          disabled={endIndex >= results.length}
          className={`flex items-center justify-center bg-primary px-4 py-2 pl-5 rounded-md ${
            endIndex >= results.length
              ? "cursor-not-allowed bg-gray-400"
              : "cursor-pointer bg-primary"
          }
          `}
        >
          <span>Next</span>
          <MdSkipNext size={25} fill="#fff" className="text-white" />
        </button>
      </div>
    </section>
  );
}
