"use client";
import { calculateGrade } from "@/app/lib/calculateGrade";
import { getCookie } from "@/app/lib/cookies";
import { publicRequest } from "@/app/lib/requestMethods";
import { formatTime } from "@/app/lib/time";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

const Page = ({ params: { testId } }) => {
  const [shouldSubmit, setShouldSubmit] = useState(false);
  const [duration, setDuration] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  const [points, setPoints] = useState({
    totalPoints: null,
  });
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmitTest() {
    console.log(points.totalPoints);
    let TP = 0;
    let attempted = 0;

    for (let i = 0; i < answers.length; i++) {
      if (
        Object.values(userAnswers)[i] !== undefined &&
        Object.values(userAnswers)[i] !== ""
      ) {
        attempted++;
      }

      if (answers[i] === parseInt(Object.values(userAnswers)[i])) {
        TP += 1;
      }
    }

    try {
      const resp = await publicRequest.post(`/results`, {
        student_id: getCookie("student_id"),
        test_id: testId,
        student_points: TP,
        total_points: points.totalPoints,
        student_attempted: attempted,
        total_questions: questions.length,
        grade: calculateGrade(TP, points.totalPoints, questions.length),
      });
      if (resp.status === 200) {
        router.replace(`/student/result/${getCookie("student_id")}`);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      try {
        const { data } = await publicRequest.get(`/questions/${testId}`, {
          studentId: `${getCookie("student_id")}`,
        });
        setQuestions(data);
        console.log(data);
        setAnswers(data.map((item) => item.answer));
        const userAnswersObj = {};

        for (let i = 0; i < data?.length; i++) {
          if (data[i]?.id in userAnswersObj) {
            return;
          }
          userAnswersObj[data[i]?.id] = undefined;
        }

        setUserAnswers(userAnswersObj);
        setPoints((prev) => ({ ...prev, totalPoints: data.length * 1 }));
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
    })();

    (async function () {
      const { data } = await publicRequest.get(`/tests/instructions/${testId}`);
      const timeArr = data?.duration?.split(" ");
      if (timeArr && timeArr[1] === "minute") {
        setDuration(timeArr[0] * 60 * 1000);
      }

      if (timeArr && timeArr[1] === "hour") {
        setDuration(timeArr[0] * 60 * 60 * 1000);
      }
    })();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning) {
      interval = setInterval(() => {
        setDuration((prevSeconds) => {
          if (prevSeconds === 0) {
            setIsRunning(false);
            setShouldSubmit(true);
            return 0;
          }
          return prevSeconds - 1000;
        });
      }, 1000); // Update every 1 second (1000 milliseconds)
    } else {
      clearInterval(interval);
    }
    return () => {
      clearInterval(interval); // Cleanup the interval when the component unmounts
    };
  }, [isRunning]);

  // Use this useEffect to handle submission when shouldSubmit is true
  useEffect(() => {
    if (shouldSubmit) {
      handleSubmitTest();
    }
  }, [shouldSubmit]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const referrer = document.referrer;
      if (referrer && referrer.length > 0) {
        console.log(referrer);
      }
    }
  }, []);

  return (
    <section>
      <p className="text-xl font-bold mb-8 text-end">{`Time left: ${formatTime(
        duration
      )}`}</p>
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
          questions?.map(({ id, question }) => {
            return (
              <div
                key={id}
                className="bg-white shadow rounded-md p-4 flex flex-col items-end justify-end"
              >
                {question.map((item, key) => {
                  return (
                    <div
                      className="flex justify-end text-lg font-bold"
                      key={key}
                    >
                      {question.every((num) => num >= 0) ? `+${item}` : item}
                    </div>
                  );
                })}
                <div>
                  <input
                    type="text"
                    className="bg-gray-100 w-full text-end px-1 py-3 rounded outline-none"
                    placeholder="Answer"
                    name={id}
                    onChange={(e) => {
                      setUserAnswers((prev) => ({
                        ...prev,
                        [e.target.name]: e.target.value,
                      }));
                    }}
                  />
                </div>
              </div>
            );
          })
        )}
        <div className="col-span-6 text-white">
          <button
            className="w-full p-2 rounded bg-primary"
            onClick={handleSubmitTest}
          >
            Submit test
          </button>
        </div>
      </div>
    </section>
  );
};

export default Page;
