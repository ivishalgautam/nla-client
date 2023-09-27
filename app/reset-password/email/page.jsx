"use client";
import { publicRequest } from "@/app/lib/requestMethods";
import React, { useState } from "react";
import toast from "react-hot-toast";

export default function EnterEmail() {
  const [email, setEmail] = useState("");

  async function handleFormSubmit(e) {
    e.preventDefault();
    try {
      const { data, status } = await publicRequest.post(
        "/students/send-reset-mail",
        {
          email: email,
        }
      );

      if (status === 200) {
        toast.success("We have sent a reset password link to your email");
      }
      console.log(data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  return (
    <section className="h-full flex items-center justify-center flex-col">
      <h2 className="section-heading">Reset password</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="max-w-lg bg-white shadow p-6 space-y-2 rounded-lg">
          {/* email */}
          <div className="relative">
            <input
              type="text"
              className="my-input peer"
              name="email"
              placeholder="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email" className="my-label">
              Email
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
