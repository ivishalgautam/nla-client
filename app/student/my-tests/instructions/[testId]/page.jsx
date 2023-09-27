"use client";
import { publicRequest } from "@/app/lib/requestMethods";
import Link from "next/link";
import React, { useEffect, useState } from "react";

export default function InstructionPage({ params: { testId } }) {
  const [test, setTest] = useState({});

  useEffect(() => {
    (async function () {
      const resp = await publicRequest(`/tests/instructions/${testId}`);
      setTest(resp.data);
      console.log(resp.data);
    })();
  }, []);

  return (
    <section>
      <div className="bg-white p-6 rounded-md shadow flex flex-col gap-4">
        <ul className="list-inside list-decimal">
          {test?.instructions?.map((instruction, key) => {
            return <li key={key}>{instruction}</li>;
          })}
        </ul>

        <Link
          href={`/student/my-tests/${test.id}`}
          className="bg-primary px-3 py-2 rounded text-white font-semibold text-center"
        >
          Start test
        </Link>
      </div>
    </section>
  );
}
