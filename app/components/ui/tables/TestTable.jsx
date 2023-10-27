"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { adminRequest } from "@/app/lib/requestMethods";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-hot-toast";
import DataTable from "react-data-table-component";
import { formatDateToIST } from "@/app/lib/time";
import { getCookie } from "@/app/lib/cookies";

export default function TestTable() {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchType, setSearchType] = useState("");

  async function getTests() {
    setIsLoading(true);
    try {
      const resp = await adminRequest.get("/tests", {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      });
      console.log(resp.data);
      setTests(resp.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getTests();
  }, []);

  const handleDelete = async (id) => {
    const confirmation = confirm("Please confirm to delete.");

    if (confirmation) {
      const resp = await adminRequest.delete(`/tests/${id}`, {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      });
      if (resp.status === 200) {
        toast.success(resp.data.message);
        setTests((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  async function updateTest({ id, data }) {
    setTests((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, is_published: data.is_published };
        }
        return item;
      })
    );

    try {
      const resp = await adminRequest.put(
        `/tests/${id}`,
        { ...data },
        {
          headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
        }
      );
    } catch (error) {
      console.log(error);
      toast.error("Some error occurred while updating!");
      setTests((prev) =>
        prev.map((item) => {
          if (item.id === id) {
            return { ...item, is_published: !data.is_published };
          }
          return item;
        })
      );
    }
  }

  const columns = [
    {
      name: "Id",
      selector: (row, key) => key + 1,
      width: "5%",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      // width: "15%",
    },
    {
      name: "Questions",
      selector: (row) => row.total_questions ?? 0,
      // width: "8%",
    },
    {
      name: "Grade",
      selector: (row) => row.grade_name,
      width: "8%",
    },
    {
      name: "Test type",
      selector: (row) => row.test_type,
      // width: "10%",
    },
    {
      name: "Subject",
      selector: (row) => row.subject,
      // width: "8%",
    },
    {
      name: "Start time",
      selector: (row) => formatDateToIST(row.start_time),
      width: "12%",
    },
    {
      name: "End time",
      selector: (row) => formatDateToIST(row.end_time),
      width: "12%",
    },
    {
      name: "Created At",
      selector: (row) => formatDateToIST(row.created_at),
      width: "12%",
    },
    {
      name: "Published",

      selector: (row) => (
        <label className="switch">
          <input
            type="checkbox"
            checked={row.is_published}
            onChange={(e) => {
              updateTest({
                id: row.id,
                data: { ...row, is_published: e.target.checked },
              });
            }}
          />
          <span className="slider"></span>
        </label>
      ),
      // width: "6rem",
    },
    {
      name: "Actions",
      selector: (row) => (
        <div className="flex items-center justify-center gap-2">
          <Link href={`/admin/questions/add/${row.id}`} legacyBehavior>
            <a
              className={`${
                new Date(row.start_time) < new Date() &&
                row.is_published === true &&
                row.total_questions === 100
                  ? "link-disabled bg-rose-500"
                  : "bg-primary"
              }  rounded px-2 py-1 text-white`}
            >
              {new Date(row.start_time) < new Date() &&
              row.is_published === true &&
              row.total_questions === 100
                ? "Not allowed"
                : "Add questions"}
            </a>
          </Link>
          <Link
            href={`/admin/tests/update/${row.id}`}
            className="bg-primary rounded px-2 py-1 text-white"
          >
            update
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
      width: "30%",
    },
  ];

  const customStyles = {
    title: {
      style: {
        fontSize: "32px",
        fontWeight: 700,
      },
    },
    rows: {
      style: {
        fontSize: "12px",
        fontWeight: 500,
        minHeight: "50px",
        width: "auto",
      },
    },
  };

  function handleSearch(value) {
    const inputValue = value.toLowerCase();

    if (inputValue === "") {
      getTests();
    } else {
      let data = [];
      switch (searchType) {
        case "name":
          data = tests.filter((item) =>
            item.name.toLowerCase().includes(inputValue)
          );
          break;
        case "grade":
          data = tests.filter((item) =>
            item.grade_name.toLowerCase().includes(inputValue)
          );
          break;
        case "subject":
          data = tests.filter((item) =>
            item.subject.toLowerCase().includes(inputValue)
          );
          break;

        default:
          toast.error("Please select search type!");
          break;
      }

      setTests(data);
    }
  }

  return (
    <>
      <div className="mb-4 flex items-center justify-between w-full">
        <div className="flex items-center justify-center gap-2">
          <div className="relative">
            <select
              name="search_type"
              id="search_type"
              className="my-input peer"
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option hidden disabled value="" selected>
                Select type
              </option>
              <option value="name">Name</option>
              <option value="grade">Grade</option>
              <option value="subject">Subject</option>
            </select>
            <label htmlFor="search_type" className="my-label">
              Search type
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              onChange={(e) => handleSearch(e.target.value)}
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
            href={`/admin/tests/add`}
            className="bg-emerald-500 rounded-md py-1 px-3 text-white"
          >
            Add new test
          </Link>
        </div>
      </div>
      <div className="rounded-lg overflow-hidden w-full bg-white">
        <DataTable
          columns={columns}
          data={tests}
          pagination
          customStyles={customStyles}
          progressPending={isLoading}
          fixedHeader
        />
      </div>
    </>
  );
}
