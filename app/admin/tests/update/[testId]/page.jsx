"use client";
import { adminRequest } from "@/app/lib/requestMethods";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { getCookie } from "@/app/lib/cookies";
import { RxCrossCircled } from "react-icons/rx";

export default function UpdateTestPage({ params: { testId } }) {
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
    getTestById(testId);
    (async function () {
      try {
        const resp = await adminRequest.get("/grades", {
          headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
        });
        setGrades(resp.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [testId]);

  async function getTestById(id) {
    try {
      const resp = await adminRequest.get(`/tests/${id}`, {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      });
      setInstructions(resp.data.instructions);
      console.log(resp.data);
      for (const [key, value] of Object.entries(resp.data)) {
        if (key in inputs) {
          setInputs((prev) => ({ ...prev, [key]: value }));
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    const { instruction, ...data } = inputs;
    const resp = await adminRequest.put(
      `/tests/${testId}`,
      {
        ...data,
        instructions: instructions,
      },
      {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      }
    );

    if (resp.status === 200) {
      toast.success("Test updated");
      router.push("/admin/tests");
    }
  }

  function handleDateChange(e, type) {
    // console.log(e.target.value);
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

  useEffect(() => {
    const startTime = new Date(inputs.start_time);
    setSelectedDate((prev) => ({
      ...prev,
      start: startTime,
    }));
  }, [inputs.start_time]);

  useEffect(() => {
    const endTime = new Date(inputs.end_time);
    setSelectedDate((prev) => ({
      ...prev,
      end: endTime,
    }));
  }, [inputs.end_time]);

  function addInstruction() {
    if (inputs.instruction === "") {
      return toast.error("Instruction can't be empty!");
    }
    setInstructions((prev) => [...prev, inputs.instruction]);
    setInputs((prev) => ({ ...prev, instruction: "" }));
  }

  function getFormattedDate(date) {
    const parsedDate = new Date(date);
    parsedDate.setMinutes(parsedDate.getMinutes() + 5.5 * 60);
    const formattedDateString = parsedDate.toISOString();
    return String(formattedDateString).split(".")[0];
  }

  return (
    <section>
      <h2 className="section-heading">Update test</h2>
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
              value={inputs.name}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
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
              value={inputs.grade}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
            >
              <option hidden disabled value="" selected>
                Select grade
              </option>
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
              value={inputs.subject}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
            >
              <option hidden disabled value="" selected>
                Select subject
              </option>
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
              value={inputs.test_type}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
            >
              <option hidden disabled value="" selected>
                Select package
              </option>
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
              type="datetime-local"
              // value={new Date(inputs.start_time).toISOString().split(".")[0]}
              value={getFormattedDate(inputs.start_time)}
              onChange={(e) => handleDateChange(e, "start")}
              className="bg-white my-input mt-2"
              min={new Date().toISOString().split("T")[0]}
              required
            />
            <label htmlFor="start_time" className="my-label">
              Start time
            </label>
          </div>

          {/* end time */}
          <div className="relative flex flex-col justify-end">
            <input
              type="datetime-local"
              // value={new Date(inputs.end_time).toISOString().split(".")[0]}
              value={getFormattedDate(inputs.end_time)}
              onChange={(e) => handleDateChange(e, "end")}
              className="bg-white my-input mt-2"
              min={new Date().toISOString().split("T")[0]}
              required
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
              value={inputs.duration}
              onChange={(e) =>
                setInputs((prev) => ({
                  ...prev,
                  [e.target.name]: e.target.value,
                }))
              }
              required
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
                return (
                  <li key={key}>
                    <div className="flex items justify-start gap-1">
                      <span>{instruction}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setInstructions((prev) =>
                            prev.filter((i, ind) => ind !== key)
                          )
                        }
                      >
                        <RxCrossCircled className="text-rose-500" size={20} />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="mb-4 flex w-full">
          <button className="w-full bg-emerald-500 rounded-md py-4 mt-4 px-3 text-white">
            Update
          </button>
        </div>
      </form>
    </section>
  );
}
