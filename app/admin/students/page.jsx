"use client";
import StudentTable from "@/app/components/ui/tables/StudentTable";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import { adminRequest } from "@/app/lib/requestMethods";
import { getCookie } from "@/app/lib/cookies";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const page = parseInt(searchParams.get("page") ?? 0);
  const limit = parseInt(Math.max(10, searchParams.get("limit")));

  async function getStudents() {
    setIsLoading(true);
    try {
      const resp = await adminRequest.get("/students", {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      });
      setStudents(resp.data);
      setFilteredStudents(
        q
          ? resp.data.filter(
              (item) =>
                item.fullname.toLowerCase().includes(q.split("-").join(" ")) ||
                item.package.toLowerCase().includes(q.split("-").join(" ")) ||
                item.email.toLowerCase().includes(q.split("-").join(" "))
            )
          : resp.data
      );
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getStudents();
  }, [q]);

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

  async function generateCredentials(studentId) {
    try {
      const resp = await adminRequest.post(`/credentials/${studentId}`, null, {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      });
      if (resp.status === 200) {
        toast.success(resp.data.message);
        // console.log(resp.data);
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
    // console.log(data);
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
            Authorization: `Bearer ${getCookie("admin_token")}`,
          },
        }
      );
      // console.log(resp.data);
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
    router.push(`?page=0&q=${inputValue.split(" ").join("-")}`);

    if (inputValue === "") {
      getStudents();
    } else {
      const data = students.filter((item) =>
        item.fullname.toLowerCase().includes(inputValue)
      );
      setFilteredStudents(data);
    }
  }

  const startIndex = page * limit;
  const currentStudents = filteredStudents.slice(
    startIndex,
    startIndex + limit
  );

  return (
    <section>
      <h2 className="section-heading">Students</h2>
      <div className="bg-white p-4 rounded-lg">
        <DataTable
          columns={columns(updateStudent, handleDelete, generateCredentials)}
          data={currentStudents}
          totalPage={Math.floor(filteredStudents?.length / limit)}
          handleSearch={handleSearch}
        />
      </div>
      {/* <StudentTable /> */}
    </section>
  );
}
