"use client";
import { adminRequest } from "@/app/lib/requestMethods";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import Datetime from "react-datetime";
import "react-datetime/css/react-datetime.css";
import { getCookie } from "@/app/lib/cookies";

export default function AddTestPage() {
  const router = useRouter();
  const [instructions, setInstructions] = useState([]);
  const [grades, setGrades] = useState([]);
  const [selectedDate, setSelectedDate] = useState({
    start: new Date(),
    end: new Date(),
  });

  const [inputs, setInputs] = useState({
    name: "",
    grade: "",
    test_type: "",
    subject: "",
    instruction: "",
    start_time: null,
    end_time: null,
    duration: null,
  });

  useEffect(() => {
    (async function () {
      try {
        const resp = await adminRequest.get("/grades");
        setGrades(resp.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function handleFormSubmit(e) {
    e.preventDefault();
    const resp = await adminRequest.post("/tests", {
      name: inputs.name,
      grade: inputs.grade,
      test_type: inputs.test_type,
      subject: inputs.subject,
      start_time: inputs.start_time,
      end_time: inputs.end_time,
      duration: inputs.duration,
      instructions,
    });

    // console.log(resp.data);
    if (resp.status === 200) {
      toast.success("New test created");
      router.push("/admin/tests");
    }
  }

  // function handleDateChange(e, type) {
  //   if (type === "start") {
  //     const date = new Date(e._d).toISOString();
  //     setSelectedDate((prev) => ({
  //       ...prev,
  //       start: new Date(e._d).setSeconds(0),
  //     }));
  //     setInputs((prev) => ({
  //       ...prev,
  //       start_time: date,
  //     }));
  //   } else {
  //     const date = new Date(e._d).toISOString();
  //     setSelectedDate((prev) => ({
  //       ...prev,
  //       end: new Date(e._d).setSeconds(0),
  //     }));
  //     setInputs((prev) => ({
  //       ...prev,
  //       end_time: date,
  //     }));
  //   }
  // }

  function handleDateChange(e, type) {
    console.log(e.target.value);
    const selectedDate = e.target.value;

    if (type === "start") {
      setInputs((prev) => ({
        ...prev,
        start_time: selectedDate,
      }));
    } else {
      setInputs((prev) => ({
        ...prev,
        end_time: selectedDate,
      }));
    }
  }

  function addInstruction() {
    if (inputs.instruction === "") {
      return toast.error("Instruction can't be empty!");
    }
    setInstructions((prev) => [...prev, inputs.instruction]);
    setInputs((prev) => ({ ...prev, instruction: "" }));
  }

  useEffect(() => {
    const startTime = new Date(inputs.start_time);
    startTime.setHours(9, 0, 0, 0);
    setSelectedDate((prev) => ({
      ...prev,
      start: startTime,
    }));
  }, [inputs.start_time]);

  useEffect(() => {
    const endTime = new Date(inputs.end_time);
    endTime.setHours(21, 0, 0, 0);
    setSelectedDate((prev) => ({
      ...prev,
      end: endTime,
    }));
  }, [inputs.end_time]);

  console.log(inputs);

  return (
    <section>
      <h2 className="section-heading">Add new test</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-3 gap-y-2 gap-x-4">
          {/* name */}
          <div className="relative flex flex-col justify-end">
            <input
              type="name"
              id="name"
              name="name"
              className="my-input peer"
              placeholder=""
              autoComplete="off"
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            />
            <label htmlFor="name" className="my-label">
              Test Name
            </label>
          </div>

          {/* grade */}
          <div className="relative flex flex-col justify-end">
            <select
              id="grade"
              name="grade"
              className="my-input peer"
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            >
              <option hidden></option>
              {grades?.map((grade) => {
                return (
                  <option key={grade.id} value={grade.id}>
                    {grade.name}
                  </option>
                );
              })}
            </select>
            <label htmlFor="grade" className="my-label">
              Grade
            </label>
          </div>

          {/* subject */}
          <div className="relative flex flex-col justify-end">
            <select
              name="subject"
              id="subject"
              className="my-input peer"
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            >
              <option hidden></option>
              <option value="abacus">Abacus</option>
              <option value="vedic">Vedic</option>
            </select>
            <label htmlFor="subject" className="my-label">
              Subject
            </label>
          </div>

          {/* test type */}
          <div className="relative flex flex-col justify-end">
            <select
              name="test_type"
              id="test_type"
              className="my-input peer"
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            >
              <option hidden></option>
              <option value="practice">Practice</option>
              <option value="olympiad">Olympiad</option>
              <option value="eligibility">Eligibility</option>
            </select>
            <label htmlFor="test_type" className="my-label">
              Test type
            </label>
          </div>

          {/* start time */}
          <div className="relative flex flex-col justify-end">
            <input
              value={inputs.start_time}
              type="date"
              onChange={(e) => handleDateChange(e, "start")}
              className="bg-white my-input mt-2"
              min={new Date().toISOString().split("T")[0]}
            />
            <label htmlFor="start_time" className="my-label">
              Start time
            </label>
          </div>

          {/* end time */}
          <div className="relative flex flex-col justify-end">
            <input
              value={inputs.end_time}
              onChange={(e) => handleDateChange(e, "end")}
              className="bg-white my-input mt-2"
              type="date"
              min={new Date().toISOString().split("T")[0]}
            />
            <label htmlFor="end_time" className="my-label">
              End time
            </label>
          </div>

          {/* duration */}
          <div className="relative flex flex-col justify-end mt-2">
            <select
              name="duration"
              id="duration"
              className="my-input peer"
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
            >
              <option value="5 minute">5 Minute</option>
              <option value="10 minute">10 Minute</option>
              <option value="15 minute">15 Minute</option>
              <option value="20 minute">20 Minute</option>
              <option value="25 minute">25 Minute</option>
              <option value="30 minute">30 Minute</option>
              <option value="35 minute">35 Minute</option>
              <option value="40 minute">40 Minute</option>
              <option value="45 minute">45 Minute</option>
              <option value="50 minute">50 Minute</option>
              <option value="55 minute">55 Minute</option>
              <option value="1 hour">1 Hour</option>
              <option value="2 hour">2 Hour</option>
              <option value="3 hour">3 Hour</option>
              <option value="4 hour">4 Hour</option>
              <option value="5 hour">5 Hour</option>
            </select>
            <label htmlFor="duration" className="my-label">
              Duration
            </label>
          </div>

          {/* instructions */}
          <div className="col-span-3 mt-2 flex items-center justify-center gap-2">
            <div className="relative w-full">
              <input
                type="text"
                name="instruction"
                className="my-input peer"
                placeholder="instruction"
                value={inputs.instruction}
                onChange={(e) =>
                  setInputs((prev) => ({
                    ...prev,
                    instruction: e.target.value,
                  }))
                }
              />
              <label htmlFor="instruction" className="my-label">
                Instruction
              </label>
            </div>
            <button
              type="button"
              className="bg-primary text-white rounded-md h-full whitespace-nowrap px-4 font-bold"
              onClick={addInstruction}
            >
              Add instruction
            </button>
          </div>

          {/* instruction map */}
          <div className="col-span-3">
            <ul className="list-decimal pl-5">
              {instructions?.map((instruction, key) => {
                return <li key={key}>{instruction}</li>;
              })}
            </ul>
          </div>
        </div>

        <div className="mb-4 flex w-full">
          <button className="w-full bg-emerald-500 rounded-md py-4 mt-4 px-3 text-white">
            Create Test
          </button>
        </div>
      </form>
    </section>
  );
}
