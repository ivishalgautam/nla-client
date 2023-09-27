"use client";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { adminRequest } from "@/app/lib/requestMethods";
import { AiOutlineDelete } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
import { toast } from "react-hot-toast";
import { getCookie } from "@/app/lib/cookies";
import DataTable from "react-data-table-component";
import { formatDateToIST } from "@/app/lib/time";

export default function StudentTable() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getStudents() {
    setIsLoading(true);
    try {
      const resp = await adminRequest.get("/students");
      setStudents(resp.data);
      // console.log(resp.data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getStudents();
  }, []);

  const handleDelete = async (id) => {
    const confirmation = confirm("Please confirm to delete.");

    if (confirmation) {
      const resp = await adminRequest.delete(`/students/${id}`);
      if (resp.status === 200) {
        toast.success(resp.data.message);
        setStudents((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  async function generateCredentials(studentId) {
    try {
      const resp = await adminRequest.post(`/credentials/${studentId}`, null);
      if (resp.status === 200) {
        toast.success(resp.data.message);
        console.log(resp.data);
        setStudents((prev) =>
          prev.map((item) => {
            if (item.id === studentId) {
              return {
                ...item,
                is_subscribed: true,
                credentials_created: true,
              };
            }
            return item;
          })
        );
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function updateStudent({ id, data }) {
    console.log(data);
    if ("is_disabled" in data) {
      setStudents((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return { ...item, is_disabled: data.is_disabled };
          }
          return item;
        })
      );
    } else {
      setStudents((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return { ...item, payment_received: data.payment_received };
          }
          return item;
        })
      );
    }

    try {
      const resp = await adminRequest.put(
        `/students/${id}`,
        { ...data },
        {
          headers: {
            Authorization: `Bearer ${getCookie("token")}`,
          },
        }
      );
      console.log(resp.data);
    } catch (error) {
      console.log(error);
      toast.error("Some error occurred while updating!");
      setStudents((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return { ...item, is_subscribed: !data.is_subscribed };
          }
          return item;
        })
      );
    }
  }

  function handleSearch(e) {
    const inputValue = e.target.value.toLowerCase();

    if (inputValue === "") {
      getStudents();
    } else {
      const data = students.filter((item) =>
        item.fullname.toLowerCase().includes(inputValue)
      );
      setStudents(data);
    }
  }

  const columns = [
    {
      name: "Id",
      selector: (row) => row.id,
      width: "5rem",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.fullname,
      sortable: true,
      width: "10%",
    },
    {
      name: "Email",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Phone",
      selector: (row) => row.phone,
    },
    {
      name: "City",
      selector: (row) => row.city,
    },
    {
      name: "Created At",
      selector: (row) => formatDateToIST(row.created_at),
      width: "15%",
    },
    {
      name: "Disabled",
      selector: (row) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={row.is_disabled}
            onChange={(e) => {
              updateStudent({
                id: row.id,
                data: { is_disabled: e.target.checked },
              });
            }}
          />
          <span className="slider"></span>
        </label>
      ),
      width: "8%",
    },
    {
      name: "Payment received",
      selector: (row) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={row.payment_received}
            onChange={(e) => {
              updateStudent({
                id: row.id,
                data: { payment_received: e.target.checked },
              });
            }}
          />
          <span className="slider"></span>
        </label>
      ),
      width: "8%",
    },
    {
      name: "Credentials",
      selector: (row) => {
        return row.credentials_created ? (
          <button className="bg-primary px-3 py-1 rounded text-white">
            Already created
          </button>
        ) : (
          <button
            type="button"
            className="bg-primary px-3 py-1 rounded text-white"
            onClick={() => generateCredentials(row.id)}
          >
            Create
          </button>
        );
      },
      width: "15%",
    },
    {
      name: "Actions",
      selector: (row) => (
        <div className="flex items-center justify-center gap-1">
          <Link
            href={`/admin/students/update/${row.id}`}
            className="bg-primary group p-1 rounded hover:bg-white transition-all border hover:border-primary"
          >
            <BsPencilSquare
              size={20}
              className="text-white group-hover:text-primary"
            />
          </Link>
          <button className="bg-rose-500 group p-1 rounded hover:bg-white transition-all border hover:border-rose-500">
            <AiOutlineDelete
              size={20}
              className="text-white group-hover:text-rose-500"
              onClick={() => handleDelete(row.id)}
            />
          </button>
        </div>
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
            href={`/admin/students/add`}
            className="bg-emerald-500 rounded-md py-1 px-3 text-white"
          >
            Add Student
          </Link>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden bg-white">
        <DataTable
          columns={columns}
          data={students}
          pagination
          progressPending={isLoading}
          paginationServer
        />
      </div>
    </>
  );
}
