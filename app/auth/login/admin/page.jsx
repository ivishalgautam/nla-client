"use client";
import useSessionStorage from "@/app/hooks/useSessionStorage";
import { getCookie, setCookie } from "@/app/lib/cookies";
import { authRequest } from "@/app/lib/requestMethods";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const query = useSearchParams();
  const callback = query.get("callback");
  // console.log(callback);
  const token = getCookie("token");
  // console.log("login", token);
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  }

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const { data, status } = await authRequest.post("/admin/login", {
        ...credentials,
      });

      if (status === 200) {
        toast.success("Logged in successfully");
        sessionStorage.setItem("email", data.email);
        sessionStorage.setItem("token", data.access_token);

        if (callback) {
          return router.replace(callback);
        }

        router.push("/admin/dashboard");
      }

      console.log(data);
    } catch (error) {
      // toast.error(error.response.data.message);
      console.log(error);
    }
  }

  useEffect(() => {
    if (token) {
      return router.push("/admin/dashboard");
    }
  }, [token]);

  return (
    <section className="h-full flex flex-col items-center justify-center">
      <h2 className="section-heading">Admin login</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="max-w-lg bg-white shadow-lg p-6 space-y-2 rounded-lg">
          {/* username */}
          <div className="relative">
            <input
              type="text"
              className="my-input peer"
              name="email"
              placeholder="email"
              onChange={handleChange}
            />
            <label htmlFor="email" className="my-label">
              Email
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
        </div>
      </form>
    </section>
  );
}
