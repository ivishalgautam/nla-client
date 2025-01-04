"use client";
import { getCookie } from "@/app/lib/cookies";
import { adminRequest } from "@/app/lib/requestMethods";
import { formatDateToIST } from "@/app/lib/time";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { parseAsInteger, useQueryState } from "nuqs";
import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { FiExternalLink } from "react-icons/fi";

export default function ResultTable() {
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getResults({ page, limit }) {
    setIsLoading(true);
    try {
      const resp = await adminRequest.get(
        `/results?page=${page}&limit=${limit}`,
        {
          headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
        }
      );
      setResults(resp.data.results);
      setTotalRows(resp.data.total);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  function handleSearch(e) {
    const inputValue = e.target.value.toLowerCase();

    if (inputValue === "") {
      getResults();
    } else {
      const data = results?.filter((item) =>
        item.fullname.toLowerCase().includes(inputValue)
      );
      setResults(data);
    }
  }

  const columns = [
    // {
    //   name: "Id",
    //   selector: (row, key) => key + 1,
    //   width: "4rem",
    //   sortable: true,
    // },
    {
      name: "Student Name",
      selector: (row) => row.fullname,
      sortable: true,
    },
    {
      name: "Level",
      selector: (row) => row.student_grade,
      sortable: true,
    },
    {
      name: "Test Name",
      selector: (row) => row.test_name,
      sortable: true,
    },
    // {
    //   name: "Questions Attempted",
    //   selector: (row) => row.student_attempted,
    //   width: "10rem",
    // },
    // {
    //   name: "Total Questions",
    //   selector: (row) => row.total_questions,
    //   width: "10rem",
    // },
    // {
    //   name: "Student Points",
    //   selector: (row) => row.student_points,
    // },
    // {
    //   name: "Total Points",
    //   selector: (row) => row.total_points,
    // },
    {
      name: "Created On",
      selector: (row) => formatDateToIST(row.created_at),
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
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [limit, setLimit] = useQueryState(
    "limit",
    parseAsInteger.withDefault(10)
  );
  const currentPage = parseInt(page) || 1;
  const pageSize = parseInt(limit) || 10;

  const handlePageChange = (page) => {
    setPage(page);
  };

  const handlePageSizeChange = (size) => {
    setLimit(size); // Reset to page 1 when page size changes
  };

  useEffect(() => {
    getResults({ page, limit });
  }, [page, limit]);

  return (
    <div className="rounded">
      <div className="mb-4 flex justify-start">
        <div className="relative">
          <input
            type="text"
            onChange={(e) => handleSearch(e)}
            placeholder="search"
            name="search"
            className="my-input peer"
            autoComplete="false"
          />
          <label htmlFor="search" className="my-label">
            Search
          </label>
        </div>
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
        />
      </div>
    </div>
  );
}
