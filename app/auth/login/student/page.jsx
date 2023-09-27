"use client";
import { getCookie, setCookie } from "@/app/lib/cookies";
import { authRequest } from "@/app/lib/requestMethods";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const { data, status } = await authRequest.post("/login", {
        ...credentials,
      });

      console.log(data);

      if (status === 200) {
        toast.success("Logged in successfully");
        sessionStorage.setItem("email", data.student.email);
        sessionStorage.setItem("fullname", data.student.fullname);
        sessionStorage.setItem("student_id", data.student.id);
        sessionStorage.setItem("package", data.student.package);
        sessionStorage.setItem("grade", data.student.grade);
        sessionStorage.setItem("token", data.access_token);
        router.push("/student/profile");
      }

      console.log(data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  }

  useEffect(() => {
    if (getCookie("student_id")) {
      return router.push("/student/profile");
    }
  }, []);

  return (
    <section className="h-full flex items-center justify-center flex-col">
      <h2 className="section-heading"> Student login </h2>
      <form onSubmit={handleFormSubmit}>
        <div className="max-w-lg bg-white shadow-lg p-6 space-y-2 rounded-lg">
          {/* username */}
          <div className="relative">
            <input
              type="text"
              className="my-input peer"
              name="username"
              placeholder="username"
              onChange={handleChange}
            />
            <label htmlFor="username" className="my-label">
              Username
            </label>
          </div>

          {/* password */}
          <div className="relative">
            <input
              type="password"
              className="my-input peer"
              name="password"
              placeholder="password"
              onChange={handleChange}
            />
            <label htmlFor="password" className="my-label">
              Password
            </label>
          </div>

          <button className="w-full py-3 rounded-md bg-primary text-white">
            Login
          </button>
          <p className="text-sm text-center">
            Reset your{" "}
            <Link className="text-rose-500" href="/reset-password/email">
              password
            </Link>
          </p>
        </div>
      </form>
    </section>
  );
}
