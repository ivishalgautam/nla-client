"use client";
import ResultCardMulti from "@/app/components/template/ResultCardMulti";
import { getCookie } from "@/app/lib/cookies";
import { adminRequest } from "@/app/lib/requestMethods";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { AiOutlineDelete } from "react-icons/ai";

export default function StudentResultTable({ params: { studentId } }) {
  const [results, setResults] = useState([]);
  const [date, setDate] = useState({
    startDate: null,
    endDate: null,
  });

  async function getResults(id) {
    try {
      const resp = await adminRequest.get(`/results/${id}`, {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      });
      setResults(resp.data);
      console.log(resp.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getResults(studentId);
  }, [studentId]);

  async function handleSearch(id) {
    try {
      const resp = await adminRequest.get(`/results/${id}`, {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      });
      const filtereData = resp.data
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
      setResults(filtereData);
    } catch (error) {
      console.log(error);
    }
  }

  const columns = [
    {
      name: "Id",
      selector: (row, key) => key + 1,
      width: "4rem",
      sortable: true,
    },
    {
      name: "Student Name",
      selector: (row) => row.fullname,
      sortable: true,
      width: "10rem",
    },
    {
      name: "Test Name",
      selector: (row) => row.test_name,
      sortable: true,
      width: "7rem",
    },
    {
      name: "Questions Attempted",
      selector: (row) => row.student_attempted,
      width: "10rem",
    },
    {
      name: "Total Questions",
      selector: (row) => row.total_questions,
      width: "10rem",
    },
    {
      name: "Student Points",
      selector: (row) => row.student_points,
    },
    {
      name: "Total Points",
      selector: (row) => row.total_points,
    },
    {
      name: "Created On",
      selector: (row) => new Date(row.created_at).toLocaleDateString(),
      width: "10rem",
    },
  ];

  return (
    <div className="rounded">
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
          onClick={() => handleSearch(studentId)}
          className="px-3 py-1 rounded bg-primary text-white col-span-2"
        >
          Search
        </button>
      </div>

      <div className="rounded grid grid-cols-3 gap-y-8">
        {results?.map((result) => (
          <ResultCardMulti
            key={result.id}
            result={result}
            path={"admin/students"}
          />
        ))}
      </div>
    </div>
  );
}
