"use client";
import { publicRequest } from "@/app/lib/requestMethods";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function EnterEmail({ params: { studentId } }) {
  const [password, setPassword] = useState("");

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const { data, status } = await publicRequest.post(
        `/students/reset-password/${studentId}`,
        {
          password: password,
        }
      );

      if (status === 200) {
        toast.success(data.message);
      }
      console.log(data);
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  }

  return (
    <section className="h-full flex items-center justify-center flex-col">
      <h2 className="section-heading">Reset password</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="max-w-lg bg-white shadow p-6 space-y-2 rounded-lg">
          {/* password */}
          <div className="relative">
            <input
              type="text"
              className="my-input peer"
              name="password"
              placeholder="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password" className="my-label">
              Password
            </label>
          </div>

          <button className="w-full py-3 rounded-md bg-primary text-white">
            Reset
          </button>
        </div>
      </form>
    </section>
  );
}
