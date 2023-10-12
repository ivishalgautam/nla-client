"use client";
import { formatDateToIST } from "@/app/lib/time";
import { useRouter } from "next/navigation";
import React from "react";

export default function TestCard({ test }) {
  const router = useRouter();
  function handleNavigate(id) {
    router.replace(`/student/my-tests/instructions/${id}`);
  }

  const isTestStarted = new Date() > new Date(test?.start_time);

  return (
    <div className="bg-white p-6 max-w-[30rem] rounded-md gap-y-4">
      <div className="flex items-center justify-between font-bold text-xl">
        <div className="capitalize text-sm">{`${test.test_type} test`}</div>
        <div className="text-sm">{`Time duration: ${test.duration}`}</div>
      </div>
      <table className="w-full my-4">
        <tbody className="flex flex-col items-start">
          <tr className="w-full flex border-b">
            <th className="py-2 bg-gray-300 w-[30%] text-sm">Name</th>
            <td className="p-2 w-[70%]">{test.name}</td>
          </tr>
          {/* <tr className="w-full flex border-b">
            <th className="py-2 bg-gray-300 w-[30%] text-sm">Grade</th>
            <td className="p-2 w-[70%]">{test.grade}</td>
          </tr> */}
          <tr className="w-full flex border-b">
            <th className="py-2 bg-gray-300 w-[30%] text-sm">Type</th>
            <td className="p-2 w-[70%]">{test.test_type}</td>
          </tr>
          <tr className="w-full flex border-b">
            <th className="py-2 bg-gray-300 w-[30%] text-sm">Test date time</th>
            <td className="p-2 w-[70%]">{formatDateToIST(test.start_time)}</td>
          </tr>
          <tr className="w-full flex border-b">
            <th className="py-2 bg-gray-300 w-[30%] text-sm">
              Total questions
            </th>
            <td className="p-2 w-[70%]">{test.total_questions}</td>
          </tr>
        </tbody>
      </table>
      <div>
        {isTestStarted ? (
          <button
            onClick={() => handleNavigate(test.id)}
            className="bg-primary hover:brightness-90 w-full rounded p-2 inline-block text-center text-white  font-bold"
          >
            Start test
          </button>
        ) : (
          <button
            className="bg-primary text-sm hover:brightness-90 w-full rounded p-2 inline-block text-center text-white  font-bold cursor-not-allowed"
            disabled
          >
            {`Test will start on: ${formatDateToIST(test.start_time)}`}
          </button>
        )}
      </div>
    </div>
  );
}
