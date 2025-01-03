"use client";
import moment from "moment";
import { Button } from "@/components/ui/button";

export const columns = () => [
  {
    accessorKey: "student_name",
    header: "STUDENT NAME",
  },
  {
    accessorKey: "test_name",
    header: "TEXT NAME",
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => {
      return <Button variant="ghost">DATE</Button>;
    },
    cell: ({ row }) => {
      return (
        <div>{moment(row.getValue("created_at")).format("DD/MM/YYYY")}</div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const id = row.original.id;
      return <div>hello</div>;
    },
  },
];
