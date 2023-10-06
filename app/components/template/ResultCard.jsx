import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import Pdf from "@/app/components/template/Pdf";
import Link from "next/link";
import React from "react";
import { AiOutlineCheckCircle } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";

export default function ResultCard({ result }) {
  const grade = result[0]?.grade;

  return (
    <div className="bg-white shadow-md rounded-lg p-4 max-w-[25rem] mx-auto">
      <div className="grade">
        <div
          className={`${
            grade === "A"
              ? "bg-primary"
              : grade === "B"
              ? "bg-[#99c144d9]"
              : grade === "C"
              ? "bg-[#f6ab34d9]"
              : grade === "D"
              ? "bg-orange-400"
              : "bg-rose-500"
          } text-white mx-auto w-20 h-20 rounded-full flex items-center justify-center flex-col`}
        >
          <span className="text-4xl font-bold">{result[0]?.grade}</span>
          <p className="text-sm font-bold -mt-2">Grade</p>
        </div>
      </div>

      <div className="grid grid-cols-2 text-sm gap-4 mt-4 text-white">
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-[#adb5bd]">
          Total Q: {result[0]?.total_questions}
        </div>
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-[#adb5bd]">
          Attempted Q: {result[0]?.student_attempted}
        </div>
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-[#adb5bd]">
          Total points: {result[0]?.total_points}
        </div>
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-[#adb5bd]">
          Your points: {result[0]?.student_points}
        </div>
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-lime-500 flex items-center justify-start gap-1">
          <AiOutlineCheckCircle size={20} />
          <span>Correct : {result[0]?.student_points}</span>
        </div>
        <div className="rounded-md shadow-sm p-2 text-sm font-semibold bg-red-500 flex items-center justify-start gap-1">
          <RxCross2 size={20} />
          <span>
            Wrong :
            {result[0]?.total_points -
              result[0]?.student_points -
              (result[0]?.total_questions - result[0]?.student_attempted)}
          </span>
        </div>
        <Link
          href={`/student/answer-sheet/${result[0]?.student_id}/${result[0]?.test_id}?t=${result[0]?.created_at}`}
          className="bg-primary col-span-2 text-center py-2 rounded-md"
        >
          View answer sheet
        </Link>

        {result[0]?.test_type !== "practice" && result[0]?.grade !== "F" && (
          <PDFDownloadLink
            document={<Pdf result={result[0]} />}
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
