"use client";
import { publicRequest } from "@/app/lib/requestMethods";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function AnswerSheet({ params: { studentId, testId } }) {
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState({});
  const query = useSearchParams();
  const createdAt = query.get("t");
  //   console.log(questions);

  async function getAnserSheet(studentId, testId, createdAt) {
    setIsLoading(true);
    try {
      const resp = await publicRequest.get(
        `/results/answerSheet/${studentId}/${testId}?t=${createdAt}`
      );
      setIsLoading(false);
      setQuestions(resp.data);
      console.log(resp.data);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    getAnserSheet(studentId, testId, createdAt);
    console.log(studentId, testId);
  }, [studentId, testId]);

  return (
    <section>
      <div className="grid grid-cols-6 gap-4">
        {isLoading ? (
          Array.from({ length: 30 }).map((_, key) => {
            return (
              <div
                key={key}
                className="animate-pulse bg-gray-300 aspect-square w-40 rounded-md"
              ></div>
            );
          })
        ) : questions.length <= 0 ? (
          <div>No questions for you</div>
        ) : (
          questions?.questions?.map(
            ({ id, question, heading, answer }, key) => {
              return (
                <div
                  key={id}
                  className={`bg-white shadow rounded-md p-4 flex flex-col items-end justify-between border-2 ${
                    questions.studentAnswers[key] === null
                      ? "border-yellow-500"
                      : answer !== parseInt(questions.studentAnswers[key])
                      ? "border-red-500"
                      : "border-primary"
                  }`}
                >
                  <div className="w-full border-b pb-1">
                    <p className="text-start text-sm font-semibold">
                      Q{key + 1}. {heading}
                    </p>
                  </div>
                  <div className="mt-auto">
                    {question.map((item, key) => {
                      return (
                        <div
                          className="flex justify-end text-lg font-bold"
                          key={key}
                        >
                          {`${item > 0 ? "+" : ""}${item}`}
                        </div>
                      );
                    })}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-start">
                      Correct : {answer}
                    </p>
                    <p className="text-xs font-semibold text-start">
                      Your answer :{" "}
                      {questions?.studentAnswers[key] === null
                        ? "Not attempted"
                        : questions?.studentAnswers[key]}
                    </p>
                  </div>
                </div>
              );
            }
          )
        )}
      </div>
    </section>
  );
}
