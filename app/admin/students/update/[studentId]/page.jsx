"use client";
import { getCookie } from "@/app/lib/cookies";
import { adminRequest, publicRequest } from "@/app/lib/requestMethods";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillDelete } from "react-icons/ai";
import { RxCrossCircled } from "react-icons/rx";

export default function StudentUpdate({ params: { studentId } }) {
  const [inputVals, setInputVals] = useState({
    fullname: "",
    gender: "",
    email: "",
    phone: "",
    guardian_name: "",
    dob: "",
    city: "",
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
  // console.log({ selectedTests, olympiadTests, olympiadTestsOptions });

  const router = useRouter();

  async function handleUpdate(e) {
    e.preventDefault();
    try {
      const resp = await adminRequest.put(`/students/${studentId}`, {
        ...inputVals,
      });
      if (resp.status === 200) {
        toast.success("Student updated successfully.");
        router.push("/admin/students");
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    console.log(value);
    if (name === "test_assigned") {
      setInputVals((prev) => ({
        ...prev,
        [name]: [...prev[name], parseInt(value)],
      }));
      return;
    }
    setInputVals((prev) => ({ ...prev, [name]: value }));
  }

  const handleDelete = async (id) => {
    const confirmation = confirm("Please confirm to delete.");

    if (confirmation) {
      const resp = await adminRequest.delete(`/students/${id}`);
      if (resp.status === 200) {
        toast.success(resp.data.message);
        router.push("/admin/students");
      }
    }
  };

  async function getFilteredTests(grade, subject) {
    console.log("object");
    try {
      const resp = await publicRequest.get(
        `/tests/filter?grade=${grade}&subject=${subject}`
      );
      setOlympiadTests(resp.data);
      console.log(resp.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    // get students
    (async function () {
      try {
        const resp = await adminRequest.get(`/students/${studentId}`);
        for (const [key, value] of Object.entries(resp.data)) {
          if (key in inputVals) {
            setInputVals((prev) => ({ ...prev, [key]: value }));
          }
        }
        console.log(resp.data);
      } catch (error) {
        console.log(error);
      }
    })();

    // get grades
    (async function () {
      try {
        const resp = await adminRequest.get("/grades");
        setGrades(resp.data);
      } catch (error) {
        console.log(error);
      }
    })();

    // get olympiad test
    (async function () {
      try {
        const resp = await adminRequest.get("/tests");
        setOlympiadTests(
          resp.data.filter((item) => item.test_type === "olympiad")
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  useEffect(() => {
    if (
      inputVals.package === "dashboard" ||
      inputVals.package === "eligibility"
    ) {
      setInputVals((prev) => ({ ...prev, test_assigned: [] }));
    }
  }, [inputVals.package]);

  const handleSelectTest = useCallback(() => {
    setSelectedTests(
      olympiadTests?.filter((item) =>
        inputVals?.test_assigned?.map((i) => parseInt(i)).includes(item.id)
      )
    );

    setOlympiadTestsOptions(
      olympiadTests?.filter(
        (item) =>
          !inputVals?.test_assigned?.map((i) => parseInt(i)).includes(item.id)
      )
    );
  }, [inputVals.test_assigned, olympiadTests]);

  function handleDeleteOption(id) {
    setInputVals((prev) => ({
      ...prev,
      test_assigned: inputVals.test_assigned
        .map((i) => parseInt(i))
        .filter((item) => item !== id),
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

  // console.log({ inputVals });

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="section-heading">Update Student</h2>
        <button onClick={() => handleDelete(studentId)}>
          <AiFillDelete
            className="text-rose-500 hover:scale-110 transition-transform"
            size={30}
          />
        </button>
      </div>

      <form onSubmit={handleUpdate}>
        <div className="grid grid-cols-3 gap-2">
          {/* subject */}
          <div className="relative flex flex-col justify-end">
            <select
              name="subject"
              id="subject"
              onChange={handleOnChange}
              className="my-input peer"
              value={inputVals.subject}
            >
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
              className="my-input peer"
              value={inputVals.grade}
            >
              <option disabled>Select grade</option>
              {grades.length <= 0 ? (
                <option disabled>Loading...</option>
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
              value={inputVals.package}
            >
              <option disabled defaultValue>
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
              value={inputVals.fullname}
              onChange={handleOnChange}
            />
            <label htmlFor="fullaname" className="my-label">
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
              value={inputVals.gender}
            >
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
              value={inputVals.email}
              onChange={handleOnChange}
              autoComplete="off"
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
              value={inputVals.phone}
              onChange={handleOnChange}
              autoComplete="off"
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
              value={inputVals.guardian_name}
              onChange={handleOnChange}
              autoComplete="off"
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
              value={inputVals.dob.split("T")[0]}
              //   min={new Date()}
              onChange={handleOnChange}
              autoComplete="off"
            />
            <label htmlFor="dob" className="my-label">
              Date Of Birth
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
              value={inputVals.city}
              onChange={handleOnChange}
              autoComplete="off"
            />
            <label htmlFor="city" className="my-label">
              City
            </label>
          </div>

          {/* state */}
          <div className="relative flex flex-col justify-end">
            <input
              type="text"
              id="pincode"
              name="pincode"
              className="my-input peer"
              placeholder=""
              value={inputVals.pincode}
              onChange={handleOnChange}
              autoComplete="off"
            />
            <label htmlFor="pincode" className="my-label">
              Pincode
            </label>
          </div>
        </div>

        <div className="mb-4">
          <button className="bg-emerald-500 rounded-md w-full mt-4 py-3 text-white">
            Update
          </button>
        </div>
      </form>
    </section>
  );
}
