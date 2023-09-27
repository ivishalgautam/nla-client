import StudentTable from "@/app/components/ui/tables/StudentTable";
import React from "react";

export default function StudentsPage() {
  return (
    <section>
      <h2 className="section-heading">Students</h2>
      <StudentTable />
    </section>
  );
}
