"use client";
import { Table } from "@radix-ui/themes";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { adminRequest, publicRequest } from "@/app/lib/requestMethods";
import { AiOutlineDelete } from "react-icons/ai";
import { toast } from "react-hot-toast";
import { getCookie } from "@/app/lib/cookies";

export default function QuestionTable() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    async function getStudents() {
      const resp = await adminRequest.get("/questions");
      console.log(resp.data);
      setStudents(resp.data);
    }
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

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Link
          href={`/admin/questions/add-questions`}
          className="bg-emerald-500 rounded-md py-1 px-3 text-white"
        >
          Add Questions
        </Link>
      </div>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Email</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Phone</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>City</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Created At</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {students?.length <= 0 ? (
            <Table.Row>
              <Table.Cell>No data found!</Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
              <Table.Cell></Table.Cell>
            </Table.Row>
          ) : (
            students?.map((student) => {
              return (
                <Table.Row key={student.id}>
                  <Table.RowHeaderCell>{student.id}</Table.RowHeaderCell>
                  <Table.Cell>{`${student.firstname} ${student.lastname}`}</Table.Cell>
                  <Table.Cell>{student.email}</Table.Cell>
                  <Table.Cell>{student.phone}</Table.Cell>
                  <Table.Cell>{student.city}</Table.Cell>
                  <Table.Cell>
                    {new Date(student.created_at).toDateString()}
                  </Table.Cell>
                  <Table.Cell>
                    <button className="bg-rose-500 group p-1 rounded hover:bg-white transition-all border hover:border-rose-500">
                      <AiOutlineDelete
                        size={20}
                        className="text-white group-hover:text-rose-500"
                        onClick={() => handleDelete(student.id)}
                      />
                    </button>
                  </Table.Cell>
                </Table.Row>
              );
            })
          )}
        </Table.Body>
      </Table.Root>
    </>
  );
}
