"use client";
import { getCookie } from "@/app/lib/cookies";
import { adminRequest } from "@/app/lib/requestMethods";
import React, { useEffect, useState } from "react";

import { PiStudentFill } from "react-icons/pi";
import Loading from "./loading";
import Link from "next/link";

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
          <div className="bg-white rounded-md shadow-md">
            <div>
              <Link href="/admin/students/add">Add students</Link>
            </div>
            <div>
              <Link href="/admin/students/add/import">Import students</Link>
            </div>
            <div>
              <Link href="/admin/tests/add">Add tests</Link>
            </div>
            <div>
              <Link href="/admin/grades/add">Add grades</Link>
            </div>
          </div>
          <div className="bg-white rounded-md shadow-md"></div>
        </div>
      </div>
    </section>
  );
}
