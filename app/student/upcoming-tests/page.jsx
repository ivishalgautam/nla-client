"use client";
import UpcomingTestCard from "@/app/components/template/UpcomingTestCard";
import { getCookie } from "@/app/lib/cookies";
import { publicRequest } from "@/app/lib/requestMethods";
import React, { useEffect, useState } from "react";
import TestLoading from "../my-tests/loading";

export default function UpcomingTests() {
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  async function getUpcomingTests(id) {
    try {
      setIsLoading(true);
      const resp = await publicRequest.get(`/tests/upcoming/${id}`, {
        headers: { Authorization: `Bearer ${getCookie("student_token")}` },
      });
      setTests(resp.data);
      setIsLoading(false);
      console.log(resp.data);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }
  useEffect(() => {
    getUpcomingTests(getCookie("student_id"));
  }, []);

  return (
    <section className="grid grid-cols-2 gap-y-8">
      {isLoading ? (
        Array.from({ length: 2 }).map((_, key) => {
          return <TestLoading key={key} />;
        })
      ) : tests.length <= 0 ? (
        <div className="col-span-2 flex items-center justify-center text-3xl font-bold text-primary">
          No upcoming tests for you
        </div>
      ) : (
        tests?.map((test) => <UpcomingTestCard test={test} key={test.id} />)
      )}
    </section>
  );
}
