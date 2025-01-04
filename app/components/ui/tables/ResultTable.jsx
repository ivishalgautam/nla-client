"use client";
import { getCookie } from "@/app/lib/cookies";
import { adminRequest } from "@/app/lib/requestMethods";
import { formatDateToIST } from "@/app/lib/time";
import Link from "next/link";
import { parseAsInteger, parseAsString, useQueryState } from "nuqs";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FiExternalLink } from "react-icons/fi";
import { saveAs } from "file-saver"; // For saving the file
import Papa from "papaparse"; // Library for CSV conversion

export default function ResultTable() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10)
  );
  const [type, setType] = useQueryState(
    "type",
    parseAsString.withDefault("olympiad")
  );
  const [search, setSearch] = useQueryState(
    "q",
    parseAsString
      .withOptions({ shallow: true, throttleMs: 1000 })
      .withDefault("")
  );
  console.log({ search });
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearch(value);
  };
  async function getResults({ page, limit, type, q = "" }) {
    setIsLoading(true);
    try {
      const resp = await adminRequest.get(
        `/results?page=${page}&limit=${limit}&type=${type}&q=${q}`,
        { headers: { Authorization: `Bearer ${getCookie("admin_token")}` } }
      );
      setResults(resp.data.results);
      setTotalRows(resp.data.total);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  function downloadCSV() {
    const csvData = results.map((row) => ({
      "Student Name": row.fullname,
      Level: row.class,
      Test: row.test_type,
      "Correct Answers": row.student_points,
      "Time taken": row.time_taken,
    }));

    const csvString = Papa.unparse(csvData);

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "results.csv");
  }

  const columns = [
    {
      name: "Student Name",
      selector: (row) => row.fullname,
      sortable: true,
    },
    {
      name: "Level",
      selector: (row) => row.class,
      sortable: true,
    },
    {
      name: "Test",
      selector: (row) => row.test_type,
      sortable: true,
    },
    {
      name: "Correct ansewers",
      selector: (row) => row.student_points,
    },
    {
      name: "Time taken",
      selector: (row) => row.time_taken,
    },
    {
      name: "All Results",
      selector: (row) => (
        <Link href={`/admin/results/${row.student_id}?page=1`}>
          <FiExternalLink className="text-sky-500" size={20} />
        </Link>
      ),
      width: "10rem",
    },
  ];

  const [totalRows, setTotalRows] = useState(0);

  const currentPage = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePageSizeChange = (size) => {
    setLimit(size);
  };

  useEffect(() => {
    console.log({ search });
    getResults({ page, limit, type, q: search });
  }, [page, limit, type, search]);

  return (
    <div className="rounded">
      <div className="mb-4 flex justify-between gap-4">
        <div className="relative">
          <input
            type="text"
            onChange={handleSearchInput}
            placeholder="search"
            name="search"
            className="my-input peer"
            autoComplete="false"
            value={search}
          />
          <label htmlFor="search" className="my-label">
            Search
          </label>
        </div>
        <div className="relative flex flex-col justify-end">
          <select
            name="test_type"
            id="test_type"
            onChange={(e) => {
              setPage(1);
              setLimit(10);
              setType(e.target.value);
            }}
            className="my-input"
            required
            defaultValue={type}
          >
            <option hidden disabled value="" selected>
              Select test type
            </option>
            <option value="olympiad">Olympiad</option>
            <option value="practice">Practice</option>
          </select>
          <label htmlFor="test_name" className="my-label">
            Test type
          </label>
        </div>
        <button
          onClick={downloadCSV}
          className="bg-sky-500 text-white px-4 py-2 rounded shadow hover:bg-sky-600"
        >
          Download CSV
        </button>
      </div>
      <div className="rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={results}
          progressPending={isLoading}
          pagination
          paginationServer
          paginationTotalRows={totalRows}
          paginationDefaultPage={currentPage}
          paginationPerPage={pageSize}
          onChangePage={handlePageChange}
          onChangeRowsPerPage={handlePageSizeChange}
          paginationRowsPerPageOptions={[10, 20, 30, 40, 50, 100, 200, 500]}
        />
      </div>
    </div>
  );
}
