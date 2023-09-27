"use client";
import Chart from "@/app/components/template/Chart";
import { getCookie } from "@/app/lib/cookies";
import { publicRequest } from "@/app/lib/requestMethods";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AnalyticsPage() {
  const [points, setPoints] = useState([]);
  const [date, setDate] = useState({
    startDate: null,
    endDate: null,
  });
  const router = useRouter();

  useEffect(() => {
    if (getCookie("package") !== "dashboard") {
      return router.push("/student/profile");
    }
    getResults(getCookie("student_id"));
  }, []);

  async function getResults(studentId) {
    try {
      const resp = await publicRequest.get(`/results/${studentId}`);
      console.log(resp.data);
      setPoints(resp.data.map((item) => item.student_points));
    } catch (error) {
      console.log(error);
    }
  }

  async function handleSearch() {
    try {
      const resp = await publicRequest.get(
        `/results/${getCookie("student_id")}`
      );
      const filtereData = resp.data
        .filter(
          (item) =>
            new Date(item.created_at).toLocaleDateString() >=
            new Date(date.startDate).toLocaleDateString()
        )
        .filter(
          (item) =>
            new Date(item.created_at).toLocaleDateString() <=
            new Date(date.endDate).toLocaleDateString()
        );
      setPoints(filtereData.map((item) => item.student_points));
      console.log(filtereData);
    } catch (error) {
      console.log(error);
    }
  }
  return (
    <section>
      <div className="mb-4 grid grid-cols-12 gap-4">
        <div className="relative col-span-5">
          <input
            type="date"
            onChange={(e) =>
              setDate((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            name="startDate"
            className="my-input peer"
          />
          <label htmlFor="startDate" className="my-label">
            Start Date
          </label>
        </div>
        <div className="relative col-span-5">
          <input
            type="date"
            onChange={(e) =>
              setDate((prev) => ({ ...prev, [e.target.name]: e.target.value }))
            }
            name="endDate"
            className="my-input peer"
          />
          <label htmlFor="endDate" className="my-label">
            End Date
          </label>
        </div>
        <button
          onClick={() => handleSearch()}
          className="px-3 py-1 rounded bg-primary text-white col-span-2"
        >
          Search
        </button>
      </div>
      <Chart points={points} />
    </section>
  );
}
