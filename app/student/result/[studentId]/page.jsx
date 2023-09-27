"use client";
import { publicRequest } from "@/app/lib/requestMethods";
import React, { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  PDFDownloadLink,
} from "@react-pdf/renderer";
import Pdf from "@/app/components/template/Pdf";

export default function ResultPage({ params: { studentId } }) {
  const [result, setResult] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const resp = await publicRequest.get(`/results/${studentId}`);
        setResult(resp.data);
        console.log(resp.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  return (
    <section>
      <table className="w-full my-4" key={result[result?.length - 1]?.id}>
        <tbody className="flex flex-col items-start">
          <tr className="w-full flex border-b">
            <th className="py-2 bg-gray-300 w-[30%]">Your grades</th>
            <td className="p-2 w-[70%]">{result[result?.length - 1]?.grade}</td>
          </tr>
          <tr className="w-full flex border-b">
            <th className="py-2 bg-gray-300 w-[30%]">Your points</th>
            <td className="p-2 w-[70%]">
              {result[result?.length - 1]?.student_points}
            </td>
          </tr>
          <tr className="w-full flex border-b">
            <th className="py-2 bg-gray-300 w-[30%]">Total points</th>
            <td className="p-2 w-[70%]">
              {result[result?.length - 1]?.total_points}
            </td>
          </tr>
          <tr className="w-full flex border-b">
            <th className="py-2 bg-gray-300 w-[30%]">Question attempted</th>
            <td className="p-2 w-[70%]">
              {result[result?.length - 1]?.student_attempted}
            </td>
          </tr>
          <tr className="w-full flex border-b">
            <th className="py-2 bg-gray-300 w-[30%]">Total questions</th>
            <td className="p-2 w-[70%]">
              {result[result?.length - 1]?.total_questions}
            </td>
          </tr>
        </tbody>
      </table>
      {result[0]?.grade !== "F" && (
        <PDFDownloadLink
          document={<Pdf result={result[result?.length - 1]} />}
          filename="FORM"
        >
          {({ loading }) =>
            loading ? (
              <button className="w-full py-3 bg-primary rounded text-white">
                Loading Document...
              </button>
            ) : (
              <button className="w-full py-3 bg-primary rounded text-white">
                Download Certificate
              </button>
            )
          }
        </PDFDownloadLink>
      )}
    </section>
  );
}
