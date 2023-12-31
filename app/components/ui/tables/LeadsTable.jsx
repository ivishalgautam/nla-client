"use client";
import React, { useEffect, useState } from "react";
import { adminRequest } from "@/app/lib/requestMethods";
import { toast } from "react-hot-toast";
import { getCookie } from "@/app/lib/cookies";
import DataTable from "react-data-table-component";
import { formatDateToIST } from "@/app/lib/time";

export default function LeadsTable() {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getStudents() {
    setIsLoading(true);
    try {
      const resp = await adminRequest.get("/leads", {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      });
      setStudents(resp.data);
      console.log(resp.data);
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
      const resp = await adminRequest.delete(`/students/${id}`, {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      });
      if (resp.status === 200) {
        toast.success(resp.data.message);
        setStudents((prev) => prev.filter((item) => item.id !== id));
      }
    }
  };

  // async function generateCredentials(studentId) {
  //   try {
  //     const resp = await adminRequest.post(`/credentials/${studentId}`, null, {
  //       headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
  //     });
  //     if (resp.status === 200) {
  //       toast.success(resp.data.message);
  //       // console.log(resp.data);
  //       setStudents((prev) =>
  //         prev.map((item) => {
  //           if (item.id === studentId) {
  //             return {
  //               ...item,
  //               is_subscribed: true,
  //               credentials_created: true,
  //             };
  //           }
  //           return item;
  //         })
  //       );
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  // async function updateStudent({ id, data }) {
  //   // console.log(data);
  //   if ("is_disabled" in data) {
  //     setStudents((prev) =>
  //       prev.map((item) => {
  //         if (item.id === id) {
  //           return { ...item, is_disabled: data.is_disabled };
  //         }
  //         return item;
  //       })
  //     );
  //   } else {
  //     setStudents((prev) =>
  //       prev.map((item) => {
  //         if (item.id === id) {
  //           return { ...item, payment_received: data.payment_received };
  //         }
  //         return item;
  //       })
  //     );
  //   }

  //   try {
  //     const resp = await adminRequest.put(
  //       `/students/${id}`,
  //       { ...data },
  //       {
  //         headers: {
  //           Authorization: `Bearer ${getCookie("admin_token")}`,
  //         },
  //       }
  //     );
  //     // console.log(resp.data);
  //   } catch (error) {
  //     console.log(error);
  //     toast.error("Some error occurred while updating!");
  //     setStudents((prev) =>
  //       prev.map((item) => {
  //         if (item.id === id) {
  //           return { ...item, is_subscribed: !data.is_subscribed };
  //         }
  //         return item;
  //       })
  //     );
  //   }
  // }

  // function handleSearch(e) {
  //   const inputValue = e.target.value.toLowerCase();

  //   if (inputValue === "") {
  //     getStudents();
  //   } else {
  //     const data = students.filter((item) =>
  //       item.fullname.toLowerCase().includes(inputValue)
  //     );
  //     setStudents(data);
  //   }
  // }

  const columns = [
    {
      name: "Id",
      selector: (row, key) => key + 1,
      //   width: "5rem",
      sortable: true,
    },
    {
      name: "Name",
      selector: (row) => row.fullname,
      sortable: true,
      //   width: "10%",
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
      //   width: "15%",
    },
  ];

  return (
    <>
      <div className="rounded-lg overflow-hidden bg-white">
        <DataTable
          columns={columns}
          data={students}
          pagination
          progressPending={isLoading}
        />
      </div>
    </>
  );
}
