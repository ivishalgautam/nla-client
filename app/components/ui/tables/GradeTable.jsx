"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { adminRequest } from "@/app/lib/requestMethods";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { getCookie } from "@/app/lib/cookies";
import DataTable from "react-data-table-component";

export default function LevelTable() {
  const [grades, setGrades] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getGrades() {
    setIsLoading(true);
    try {
      const resp = await adminRequest.get("/grades", {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      });
      setGrades(resp.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getGrades();
  }, []);

  function handleSearch(e) {
    const inputValue = e.target.value.toLowerCase();

    if (inputValue === "") {
      getGrades();
    } else {
      const data = grades.filter((item) =>
        item.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setGrades(data);
    }
  }

  const handleDelete = async (id) => {
    const confirmation = confirm("Please confirm to delete.");

    if (confirmation) {
      const resp = await adminRequest.delete(`/grades/${id}`, {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      });
      if (resp.status === 200) {
        toast.success(resp.data.message);
        setGrades((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  const columns = [
    {
      name: "Id",
      selector: (row, key) => key + 1,
    },
    {
      name: "Level",
      selector: (row) => row.name,
    },
    {
      name: "Actions",
      selector: (row) => (
        <button className="bg-rose-500 group p-1 rounded hover:bg-white transition-all border hover:border-rose-500">
          <AiOutlineDelete
            size={20}
            className="text-white group-hover:text-rose-500"
            onClick={() => handleDelete(row.id)}
          />
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex justify-between">
        <div>
          <div className="relative">
            <input
              type="text"
              onChange={(e) => handleSearch(e)}
              placeholder="search"
              name="search"
              className="my-input peer"
            />
            <label htmlFor="search" className="my-label">
              Search
            </label>
          </div>
        </div>
        <div>
          <Link
            href={`/admin/grades/add`}
            className="bg-emerald-500 rounded-md py-1 px-3 text-white"
          >
            Add level
          </Link>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden">
        <DataTable
          columns={columns}
          data={grades}
          pagination
          progressPending={isLoading}
          paginationServer
        />
      </div>
    </>
  );
}
