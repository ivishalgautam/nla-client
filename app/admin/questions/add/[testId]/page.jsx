"use client";
import Question from "@/app/components/template/Question";
import { getCookie } from "@/app/lib/cookies";
import { adminRequest, publicRequest } from "@/app/lib/requestMethods";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function Page({ params: { testId } }) {
  const router = useRouter;
  const [isLoading, setIsLoading] = useState(false);
  const [questionStates, setQuestionStates] = useState([
    {
      heading: "",
      values: {
        value1: "",
        value2: "",
        value3: "",
        value4: "",
        value5: "",
      },
      answer: "",
    },
  ]);
  // console.log(questionStates);

  async function handleFormSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    try {
      const resp = await adminRequest.post(
        "/questions",
        {
          data: questionStates,
          testId,
        },
        {
          headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
        }
      );

      if (resp.status === 200) {
        toast.success(resp.data.message);
        setIsLoading(false);
        // setOptions((prev) => resetValues(prev));
        // setInputs({
        //   answer: null,
        // });
        // router.push("/admin/tests");
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  function resetValues(obj) {
    const resetObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        resetObj[key] = "";
      }
    }
    return resetObj;
  }

  useEffect(() => {
    (async function () {
      try {
        const { data } = await adminRequest.get(`/questions/${testId}`, {
          headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
        });
        // console.log({ apiDate: data });
        if (data.length > 0) {
          setQuestionStates([]);
        }
        data.forEach((data) => {
          const convertedData = {
            heading: data.heading,
            values: {
              value1: data.question[0] || "",
              value2: data.question[1] || "",
              value3: data.question[2] || "",
              value4: data.question[3] || "",
              value5: data.question[4] || "",
            },
            answer: data.answer.toString(),
          };
          setQuestionStates((prev) => [...prev, convertedData]);
          // questionStates.push(convertedData);
        });
      } catch (error) {
        console.log(error);
      }
    })();
  }, [testId]);
  return (
    <form onSubmit={handleFormSubmit} className="w-full">
      <div className="flex flex-col">
        <div className="mt-4">
          <div className="flex flex-col gap-y-2 col-span-1">
            <Question
              questionStates={questionStates}
              setQuestionStates={setQuestionStates}
            />
            {isLoading ? (
              <button
                type="button"
                disabled
                className="bg-primary text-white rounded-md py-2 cursor-not-allowed"
              >
                Questions adding...
              </button>
            ) : (
              <button className="bg-primary text-white rounded-md py-2">
                Submit
              </button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
