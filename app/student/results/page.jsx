"use client";
import ResultCard from "@/app/components/template/ResultCard";
import ResultCardMulti from "@/app/components/template/ResultCardMulti";
import { getCookie } from "@/app/lib/cookies";
import { publicRequest } from "@/app/lib/requestMethods";
import React, { useEffect, useState } from "react";

export default function StudentResultPage() {
  const [results, setResults] = useState([]);
  const [date, setDate] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    getResults(getCookie("student_id"));
  }, []);

  async function getResults(id) {
    try {
      const resp = await publicRequest.get(`/results/${id}`, {
        headers: { Authorization: `Bearer ${getCookie("student_token")}` },
      });
      setResults(resp.data);
      console.log(resp.data);
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
        .filter(
          (item) =>
            new Date(item.created_at).toLocaleDateString() >=
            new Date(date.startDate).toLocaleDateString()
        )
        .filter(
          (item) =>
            new Date(item.created_at).toLocaleDateString() <=
            new Date(date.endDate).toLocaleDateString()
        );
      setResults(filteredData);
      console.log(filteredData);
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
        {results?.map((result) => (
          <ResultCardMulti key={result.id} result={result} path={"student"} />
        ))}
      </div>
    </section>
  );
}
