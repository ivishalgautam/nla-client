"use client";
import { publicRequest } from "@/app/lib/requestMethods";
import React, { useEffect, useState } from "react";
import ResultCard from "@/app/components/template/ResultCard";
import { getCookie } from "@/app/lib/cookies";

export default function ResultPage({ params: { studentId } }) {
  const [result, setResult] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const resp = await publicRequest.get(`/results/${studentId}`, {
          headers: { Authorization: `Bearer ${getCookie("student_token")}` },
        });
        setResult(resp.data);
        console.log(resp.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <section>
      <ResultCard result={result} />
    </section>
  );
}
