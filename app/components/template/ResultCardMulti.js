import Link from "next/link";
import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";

export default function ResultCardMulti({ result }) {
  console.log(result);
  return (
    <div className="bg-white shadow-md rounded-md p-4 max-w-[25rem] mx-auto">
      <div className="grade">
        <div
          className={`${
            result?.grade === "A"
              ? "bg-primary"
              : result?.grade === "B"
              ? "bg-[#99c144d9]"
              : result?.grade === "C"
              ? "bg-[#f6ab34d9]"
              : result?.grade === "D"
              ? "bg-orange-400"
              : "bg-rose-500"
          } text-white mx-auto w-20 h-20 rounded-full flex items-center justify-center flex-col`}
        >
          <span className="text-4xl font-bold">{result?.grade}</span>
          <p className="text-sm font-bold -mt-2">Grade</p>
        </div>
      </div>

      <div className="grid grid-cols-2 text-sm gap-4 mt-4 text-white">
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-[#adb5bd]">
          Total Q: {result?.total_questions}
        </div>
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-[#adb5bd]">
          Attempted Q: {result?.student_attempted}
        </div>
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-[#adb5bd]">
          Total points: {result?.total_points}
        </div>
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-[#adb5bd]">
          Your points: {result?.student_points}
        </div>
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-lime-500 flex items-center justify-start gap-1">
          <AiOutlineCheckCircle size={20} />
          <span>Correct answer: {result?.student_points}</span>
        </div>
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-red-500 flex items-center justify-start gap-1">
          <RxCross2 size={20} />
          <span>
            Wrong answers: {result?.total_points - result?.student_points}
          </span>
        </div>
        <Link
          href={`/student/answer-sheet/${result?.student_id}/${result?.test_id}?t=${result?.created_at}`}
          className="bg-primary col-span-2 text-center py-2 rounded-md"
        >
          View answer sheet
        </Link>
      </div>
    </div>
  );
}
