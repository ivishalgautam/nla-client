"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { adminRequest, publicRequest } from "@/app/lib/requestMethods";
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
      const resp = await adminRequest.get("/grades");
      setGrades(resp.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getGrades();
  }, []);

  const handleDelete = async (id) => {
    const confirmation = confirm("Please confirm to delete.");

    if (confirmation) {
      const resp = await adminRequest.delete(`/grades/${id}`);
      if (resp.status === 200) {
        toast.success(resp.data.message);
        setGrades((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
    },
    {
      name: "Grade",
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
      <div className="mb-4 flex justify-end">
        <Link
          href={`/admin/grades/add`}
          className="bg-emerald-500 rounded-md py-1 px-3 text-white"
        >
          Add Grade
        </Link>
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
