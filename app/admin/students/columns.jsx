"use client";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import Link from "next/link";
import { AiOutlineDelete } from "react-icons/ai";
import { BsPencilSquare } from "react-icons/bs";
// import moment from "moment";

export const columns = (updateStudent, handleDelete, generateCredentials) => [
  {
    accessorKey: "fullname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "phone",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "package",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Package
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const item = row.getValue("package");
      return item === "polympiad" ? "practice + olympiad" : item;
    },
  },
  {
    accessorKey: "expiration_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Expire
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const expire = row.getValue("expiration_date");
      return new Date(expire).toLocaleDateString();
    },
  },
  {
    accessorKey: "is_disabled",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Disable
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <label className="switch">
          <input
            type="checkbox"
            checked={row.getValue("is_disabled")}
            onChange={(e) => {
              updateStudent({
                id: row.original.id,
                data: { is_disabled: e.target.checked },
              });
            }}
          />
          <span className="slider"></span>
        </label>
      );
    },
  },
  {
    accessorKey: "payment_received",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Payment
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      return (
        <label className="switch">
          <input
            type="checkbox"
            checked={row.getValue("payment_received")}
            onChange={(e) => {
              updateStudent({
                id: row.original.id,
                data: { payment_received: e.target.checked },
              });
            }}
          />
          <span className="slider"></span>
        </label>
      );
    },
  },
  {
    accessorKey: "credentials_created",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Credentials
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const val = row.getValue("credentials_created");
      return val ? (
        <button className="bg-primary px-3 py-1 rounded text-white">
          Already created
        </button>
      ) : (
        <button
          type="button"
          className="bg-primary px-3 py-1 rounded text-white"
          onClick={() => generateCredentials(row.original.id)}
        >
          Create
        </button>
      );
    },
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Created at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const createdAt = row.getValue("created_at");
      return new Date(createdAt).toLocaleDateString();
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      return (
        <div className="flex items-center justify-center gap-1">
          <Link
            href={`/admin/students/update/${id}`}
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
              onClick={() => handleDelete(id)}
            />
          </button>
        </div>
      );
    },
  },
];
