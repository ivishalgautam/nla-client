"use client";
import UpcomingTestCard from "@/app/components/template/UpcomingTestCard";
import { getCookie } from "@/app/lib/cookies";
import { publicRequest } from "@/app/lib/requestMethods";
import React, { useEffect, useState } from "react";

export default function UpcomingTests() {
  const [tests, setTests] = useState([]);

  async function getUpcomingTests(id) {
    try {
      const resp = await publicRequest.get(`/tests/upcoming/${id}`);
      setTests(resp.data);
      console.log(resp.data);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getUpcomingTests(getCookie("student_id"));
  }, []);

  return (
    <section>
      {tests?.map((test) => (
        <UpcomingTestCard test={test} key={test.id} />
      ))}
    </section>
  );
}
