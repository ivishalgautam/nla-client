"use client";
import { getCookie } from "@/app/lib/cookies";
import { adminRequest } from "@/app/lib/requestMethods";
import React, { useEffect, useState } from "react";

import { PiStudentFill } from "react-icons/pi";
import Loading from "./loading";
import Link from "next/link";
import { IoIosAddCircleOutline } from "react-icons/io";
import LeadsTable from "@/app/components/ui/tables/LeadsTable";

export default function Dashboard() {
  const [details, setDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    (async function () {
      setIsLoading(true);
      try {
        // await new Promise((resolve, reject) => setTimeout(resolve, 4000));
        const resp = await adminRequest.get("/dashboard/details", {
          headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
        });
        // console.log(resp.data);
        setDetails(resp.data);
        setIsLoading(false);
      } catch (error) {
        // console.log(error);
        setIsLoading(false);
      }
    })();
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <section className="h-full">
      <div className="space-y-8">
        <div className="grid grid-cols-3 gap-4 p-4 bg-white text-white rounded-md shadow-md">
          {/* total */}
          <div className="dashboard-mini-card bg-blue-400">
            <div>
              <PiStudentFill size={50} />
            </div>
            <div>
              <h2>Total Students</h2>
              <p>{details?.total_students}</p>
            </div>
          </div>

          {/* abacus */}
          <div className="dashboard-mini-card bg-emerald-400">
            <div>
              <PiStudentFill size={50} />
            </div>
            <div>
              <h2>Abacus Students</h2>
              <p>{details?.abacus_students}</p>
            </div>
          </div>

          {/* vedic */}
          <div className="dashboard-mini-card bg-rose-400">
            <div>
              <PiStudentFill size={50} />
            </div>
            <div>
              <h2>Vedic Students</h2>
              <p>{details?.vedic_students}</p>
            </div>
          </div>

          {/* subscribed */}
          <div className="dashboard-mini-card bg-indigo-400">
            <div>
              <PiStudentFill size={50} />
            </div>
            <div>
              <h2>Subscribed Students</h2>
              <p>{details?.subscribed_students}</p>
            </div>
          </div>

          {/* golden */}
          <div className="dashboard-mini-card bg-orange-400">
            <div>
              <PiStudentFill size={50} />
            </div>
            <div>
              <h2>Olympiad Students</h2>
              <p>{details?.olympiad_students}</p>
            </div>
          </div>

          {/* diamond */}
          <div className="dashboard-mini-card bg-violet-400">
            <div>
              <PiStudentFill size={50} />
            </div>
            <div>
              <h2>P-Olympiad Students</h2>
              <p>{details?.polympiad_students}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-md shadow-md grid grid-cols-2 text-white gap-4 p-4">
            <div className="dashboard-add-card">
              <Link
                href="/admin/students/add"
                className="text-xl font-semibold"
              >
                Add students
              </Link>
              <IoIosAddCircleOutline size={30} className="text-white" />
            </div>
            <div className="dashboard-add-card">
              <Link
                href="/admin/students/add/import"
                className="text-xl font-semibold"
              >
                Import students
              </Link>
              <IoIosAddCircleOutline size={30} className="text-white" />
            </div>
            <div className="dashboard-add-card">
              <Link href="/admin/tests/add" className="text-xl font-semibold">
                Add tests
              </Link>
              <IoIosAddCircleOutline size={30} className="text-white" />
            </div>
            <div className="dashboard-add-card">
              <Link href="/admin/grades/add" className="text-xl font-semibold">
                Add grades
              </Link>
              <IoIosAddCircleOutline size={30} className="text-white" />
            </div>
          </div>
          <div className="bg-white rounded-md shadow-md p-4">
            <h2 className="text-center text-2xl font-bold text-gray-700">
              Recent leads
            </h2>
            <LeadsTable />
          </div>
        </div>
      </div>
    </section>
  );
}
