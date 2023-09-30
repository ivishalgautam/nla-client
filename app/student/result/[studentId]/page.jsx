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
import useSessionStorage from "@/app/hooks/useSessionStorage";
import ResultCard from "@/app/components/template/ResultCard";
import { getCookie } from "@/app/lib/cookies";

export default function ResultPage({ params: { studentId } }) {
  const [result, setResult] = useState([]);
  const studentPackage = useSessionStorage("package");

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
      {studentPackage === "olympiad" ||
        (studentPackage === "polympiad" && result[0]?.grade !== "F" && (
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
        ))}
    </section>
  );
}
