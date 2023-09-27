"use client";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { adminRequest, publicRequest } from "@/app/lib/requestMethods";
import { getCookie } from "@/app/lib/cookies";
import Image from "next/image";
import registration from "../../public/registration.png";

export default function Registration() {
  const [inputVals, setInputVals] = useState({
    fullname: "",
    email: "",
    phone: "",
    guardian_name: "",
    gender: "",
    dob: "",
    city: "",
    pincode: "",
    subject: "",
    grade: "",
    package: "",
    test_assigned: "",
  });
  const [grades, setGrades] = useState([]);
  const [olympiadTests, setOlympiadTests] = useState([]);

  useEffect(() => {
    (async function () {
      try {
        const resp = await publicRequest.get("/grades");
        setGrades(resp.data);
      } catch (error) {
        console.log(error);
      }
    })();

    (async function () {
      try {
        const resp = await publicRequest.get("/tests", {
          headers: { Authorization: `Bearer ${getCookie("token")}` },
        });
        setOlympiadTests(
          resp.data.filter((item) => item.test_type === "olympiad")
        );
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  const router = useRouter();

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const resp = await publicRequest.post("/leads", {
        ...inputVals,
      });
      if (resp.status === 200) {
        toast.success(resp.data.message);
        // router.push("/registration/thank-you");
      }
      console.log(resp.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  function handleOnChange(e) {
    const { name, value } = e.target;
    setInputVals((prev) => ({ ...prev, [name]: value }));
  }
  console.log(inputVals);

  return (
    <section className="p-8 flex items-center justify-center h-full">
      <div className="image-container flex-1">
        <Image src={registration} layout="fill" className="image" />
      </div>
      <div>
        <h2 className="section-heading text-emerald-800 mb-10 uppercase relative after:absolute after:-bottom-2 after:left-0 after:w-32 after:h-2 after:bg-primary">
          Registration form
        </h2>

        <form onSubmit={handleFormSubmit}>
          <div className="grid grid-cols-3 gap-2">
            {/* subject */}
            <div className="relative flex flex-col justify-end">
              <select
                name="subject"
                id="subject"
                onChange={handleOnChange}
                className="my-input"
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
                className="my-input"
              >
                <option disabled>Select grade</option>
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
              <div className="relative flex flex-col justify-end">
                <select
                  name="test_assigned"
                  id="test_assigned"
                  onChange={handleOnChange}
                  className="my-input peer"
                >
                  <option disabled defaultValue>
                    Select package
                  </option>
                  {olympiadTests?.map((test) => {
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
                onChange={handleOnChange}
                autoComplete="off"
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
              />
              <label htmlFor="pincode" className="my-label">
                Pincode
              </label>
            </div>
          </div>

          <div className="mb-4 flex justify-end">
            <button className="bg-emerald-500 rounded-md mt-4 py-3 text-white w-full font-semibold">
              Register
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
