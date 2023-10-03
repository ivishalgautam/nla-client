"use client";
import { getCookie } from "@/app/lib/cookies";
import { publicRequest } from "@/app/lib/requestMethods";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function InstructionPage({ params: { testId } }) {
  const router = useRouter();
  const [test, setTest] = useState({});

  function handleNavigate(id) {
    router.replace(`/student/my-tests/${test.id}`);
  }

  useEffect(() => {
    (async function () {
      const resp = await publicRequest(`/tests/instructions/${testId}`, {
        headers: { Authorization: `Bearer ${getCookie("student_token")}` },
      });
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

        <button
          onClick={() => handleNavigate(test.id)}
          className="bg-primary px-3 py-2 rounded text-white font-semibold text-center"
        >
          Start test
        </button>
      </div>
    </section>
  );
}
