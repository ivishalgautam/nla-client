"use client";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { adminRequest, publicRequest } from "@/app/lib/requestMethods";
import Link from "next/link";
import { FaFileImport } from "react-icons/fa";
import { RxCrossCircled } from "react-icons/rx";
import { getCookie } from "@/app/lib/cookies";

export default function CreateStudentPage() {
  const [inputVals, setInputVals] = useState({
    fullname: "",
    email: "",
    phone: "",
    guardian_name: "",
    gender: "",
    dob: "",
    city: "",
    school_name: "",
    pincode: "",
    subject: "",
    grade: "",
    package: "",
    test_assigned: [],
  });
  const [grades, setGrades] = useState([]);
  const [olympiadTests, setOlympiadTests] = useState([]);
  const [olympiadTestsOptions, setOlympiadTestsOptions] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const router = useRouter();

  useEffect(() => {
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
  }, []);

  async function getFilteredTests(grade, subject) {
    try {
      const resp = await publicRequest.get(
        `/tests/filter?grade=${grade}&subject=${subject}`,
        {
          headers: { Authorization: `Bearer ${getCookie("student_token")}` },
        }
      );
      setOlympiadTests(resp.data);
      console.log(resp.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const resp = await adminRequest.post(
        "/students",
        {
          ...inputVals,
        },
        {
          headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
        }
      );
      if (resp.status === 200) {
        toast.success("Student created successfully.");
        router.push("/admin/students");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    if (name === "test_assigned") {
      setInputVals((prev) => ({
        ...prev,
        [name]: [...prev[name], parseInt(value)],
      }));
      return;
    }
    setInputVals((prev) => ({ ...prev, [name]: value }));
  }

  const handleSelectTest = useCallback(() => {
    setSelectedTests(
      olympiadTests?.filter((item) => inputVals.test_assigned.includes(item.id))
    );

    setOlympiadTestsOptions(
      olympiadTests?.filter(
        (item) => !inputVals.test_assigned.includes(item.id)
      )
    );
  }, [inputVals.test_assigned, olympiadTests]);

  function handleDeleteOption(id) {
    setInputVals((prev) => ({
      ...prev,
      test_assigned: inputVals.test_assigned.filter((item) => item !== id),
    }));
  }

  useEffect(() => {
    handleSelectTest();
  }, [inputVals.test_assigned, handleSelectTest]);

  useEffect(() => {
    setOlympiadTestsOptions(olympiadTests);
  }, [olympiadTests]);

  useEffect(() => {
    getFilteredTests(inputVals.grade, inputVals.subject);
  }, [inputVals.grade, inputVals.subject]);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="section-heading">Create Student</h2>
        <Link
          href="/admin/students/add/import"
          className="bg-primary py-1 px-4 rounded-md text-white flex items-center justify-center gap-2"
        >
          Import <FaFileImport size={20} />
        </Link>
      </div>

      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-3 gap-2">
          {/* subject */}
          <div className="relative flex flex-col justify-end">
            <select
              name="subject"
              id="subject"
              onChange={handleOnChange}
              className="my-input"
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

          {/* grade */}
          <div className="relative flex flex-col justify-end">
            <select
              name="grade"
              id="grade"
              onChange={handleOnChange}
              className="my-input"
              required
            >
              <option hidden disabled value="" selected>
                Select grade
              </option>
              {grades.length <= 0 ? (
                <option disabled>No grade found</option>
              ) : (
                grades?.map((grade) => {
                  return (
                    <option key={grade.id} value={grade.id}>
                      {grade.name}
                    </option>
                  );
                })
              )}
            </select>
            <label htmlFor="grade" className="my-label">
              Grade
            </label>
          </div>

          {/* package */}
          <div className="relative flex flex-col justify-end">
            <select
              name="package"
              id="package"
              onChange={handleOnChange}
              className="my-input peer"
              required
            >
              <option hidden disabled value="" selected>
                Select package
              </option>
              <option value="dashboard">Dashboard</option>
              <option value="olympiad">Olympiad</option>
              <option value="polympiad">Practice Olympiad</option>
              <option value="eligibility">Eligibility</option>
            </select>
            <label htmlFor="package" className="my-label">
              Package
            </label>
          </div>

          {/* test assigned */}
          {inputVals.package === "polympiad" ||
          inputVals.package === "olympiad" ? (
            <div className="relative flex flex-col justify-end col-span-3">
              <div className="col-span-3 flex flex-wrap gap-2 py-4 absolute left-3 top-3">
                {selectedTests.map((item) => (
                  <span
                    key={item.id}
                    className="bg-primary text-sm text-white p-1 px-2 rounded"
                  >
                    {item.name}
                    <RxCrossCircled
                      className="inline ml-2"
                      size={20}
                      onClick={() => handleDeleteOption(item.id)}
                    />
                  </span>
                ))}
              </div>
              <select
                name="test_assigned"
                id="test_assigned"
                onChange={handleOnChange}
                className="my-input peer"
              >
                <option hidden>Select package</option>
                {olympiadTestsOptions?.map((test) => {
                  return (
                    <option key={test.id} value={test.id}>
                      {test.name}
                    </option>
                  );
                })}
              </select>
              <label htmlFor="test_assigned" className="my-label">
                Olympiad test
              </label>
            </div>
          ) : null}

          {/* fullname */}
          <div className="relative flex flex-col justify-end">
            <input
              type="text"
              id="fullname"
              name="fullname"
              className="my-input peer"
              placeholder=""
              autoComplete="off"
              onChange={handleOnChange}
              required
            />
            <label htmlFor="fullname" className="my-label">
              Fullname
            </label>
          </div>

          {/* gender */}
          <div className="relative flex flex-col justify-end">
            <select
              name="gender"
              id="gender"
              className="my-input peer"
              onChange={handleOnChange}
              required
            >
              <option hidden disabled value="" selected>
                Select gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
            <label htmlFor="gender" className="my-label">
              Gender
            </label>
          </div>

          {/* email */}
          <div className="relative flex flex-col justify-end">
            <input
              type="text"
              id="email"
              name="email"
              className="my-input peer"
              placeholder=""
              onChange={handleOnChange}
              autoComplete="off"
              required
            />
            <label htmlFor="email" className="my-label">
              Email
            </label>
          </div>

          {/* phone */}
          <div className="relative flex flex-col justify-end">
            <input
              type="tel"
              id="phone"
              name="phone"
              className="my-input peer"
              placeholder=""
              onChange={handleOnChange}
              autoComplete="off"
              required
            />
            <label htmlFor="phone" className="my-label">
              Phone
            </label>
          </div>

          {/* guardian name */}
          <div className="relative flex flex-col justify-end">
            <input
              type="text"
              id="guardian_name"
              name="guardian_name"
              className="my-input peer"
              placeholder=""
              onChange={handleOnChange}
              autoComplete="off"
              required
            />
            <label htmlFor="guardian_name" className="my-label">
              Guardian Name
            </label>
          </div>

          {/* dob */}
          <div className="relative flex flex-col justify-end">
            <input
              type="date"
              id="dob"
              name="dob"
              className="my-input peer"
              placeholder=""
              onChange={handleOnChange}
              autoComplete="off"
              required
            />
            <label htmlFor="dob" className="my-label">
              Date Of Birth
            </label>
          </div>

          {/* school name */}
          <div className="relative flex flex-col justify-end">
            <input
              type="text"
              id="school_name"
              name="school_name"
              className="my-input peer"
              placeholder=""
              onChange={handleOnChange}
              autoComplete="off"
              required
            />
            <label htmlFor="school_name" className="my-label">
              School name
            </label>
          </div>

          {/* city */}
          <div className="relative flex flex-col justify-end">
            <input
              type="text"
              id="city"
              name="city"
              className="my-input peer"
              placeholder=""
              onChange={handleOnChange}
              autoComplete="off"
              required
            />
            <label htmlFor="city" className="my-label">
              City
            </label>
          </div>

          {/* pincode */}
          <div className="relative flex flex-col justify-end">
            <input
              type="number"
              id="pincode"
              name="pincode"
              className="my-input peer"
              placeholder=""
              onChange={handleOnChange}
              autoComplete="off"
              required
            />
            <label htmlFor="pincode" className="my-label">
              Pincode
            </label>
          </div>
        </div>

        <div className="mb-4 flex justify-end">
          <button className="bg-emerald-500 rounded-md mt-4 py-3 text-white w-full">
            Create Student
          </button>
        </div>
      </form>
    </section>
  );
}
