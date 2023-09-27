"use client";
import React, { useEffect, useState } from "react";
import { publicRequest } from "@/app/lib/requestMethods";
import { getCookie } from "@/app/lib/cookies";
import TestCard from "@/app/components/template/TestCard";
import TestLoading from "./loading";
import useSessionStorage from "@/app/hooks/useSessionStorage";

const Page = () => {
  const token = useSessionStorage("student_id");
  const [tests, setTests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  async function getTests() {
    setIsLoading(true);
    await new Promise((resolve, reject) => setTimeout(resolve, 4000));
    try {
      const { data } = await publicRequest.get(
        `/tests/${getCookie("student_id")}`
      );
      console.log(data);
      setTests(data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getTests();
  }, []);

  return (
    <>
      <section className="grid grid-cols-2 gap-y-8">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, key) => {
            return <TestLoading key={key} />;
          })
        ) : tests.length <= 0 ? (
          <div className="col-span-2 flex items-center justify-center text-3xl font-bold text-primary">
            You dont have any test
          </div>
        ) : (
          tests?.map((test) => {
            return <TestCard key={test.id} test={test} />;
          })
        )}
      </section>
    </>
  );
};

export default Page;
