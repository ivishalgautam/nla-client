"use client";
import Link from "next/link";
import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import { PDFDownloadLink } from "@react-pdf/renderer";
import Pdf from "./Pdf";

export default function ResultCardMulti({ result, path }) {
  return (
    <div className="bg-white shadow-md rounded-md p-4 max-w-[25rem] mx-auto">
      <div className="flex items-center justify-between">
        <span className="bg-gray-500 tracking-wide text-white font-semibold rounded px-2 py-1 text-xs capitalize">
          {result.test_type}
        </span>
        <span className="bg-gray-500 tracking-wide text-white font-semibold rounded px-2 py-1 text-xs capitalize">
          {`Time taken: ${result?.time_taken ? result?.time_taken : "N/a"}`}
        </span>
      </div>
      <div className="grade">
        <div
          className={`${
            result?.grade === "championship"
              ? "bg-primary"
              : result?.grade === "winner"
              ? "bg-[#99c144d9]"
              : result?.grade === "runner up"
              ? "bg-[#f6ab34d9]"
              : result?.grade === "participation"
              ? "bg-orange-400"
              : null
          } text-white mx-auto w-32 h-32 rounded-full flex items-center justify-center`}
        >
          <span className="text-md font-bold capitalize tracking-wider">
            {result?.grade}
          </span>
          {/* <p className="text-sm font-bold -mt-2">Grade</p> */}
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
          <span>Correct : {result?.student_points}</span>
        </div>
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-red-500 flex items-center justify-start gap-1">
          <RxCross2 size={20} />
          <span>
            Wrong :{" "}
            {result?.total_points -
              result?.student_points -
              (result?.total_questions - result?.student_attempted)}
          </span>
        </div>
        <Link
          href={`/${path}/answer-sheet/${result?.student_id}/${result?.test_id}?t=${result?.created_at}`}
          className="bg-primary col-span-2 text-center py-2 rounded-md"
        >
          View answer sheet
        </Link>

        {result?.test_type !== "practice" &&
          result?.test_type !== "eligibility" && (
            <PDFDownloadLink
              document={<Pdf result={result} />}
              filename="FORM"
              className="col-span-2"
            >
              {({ loading }) =>
                loading ? (
                  <button className="w-full py-2 bg-primary rounded text-white">
                    Loading Document...
                  </button>
                ) : (
                  <button className="w-full py-2 bg-primary rounded text-white">
                    Download Certificate
                  </button>
                )
              }
            </PDFDownloadLink>
          )}
      </div>
    </div>
  );
}
