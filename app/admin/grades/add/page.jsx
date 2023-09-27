"use client";
import { getCookie } from "@/app/lib/cookies";
import { adminRequest } from "@/app/lib/requestMethods";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";
import { toast } from "react-hot-toast";

export default function AddGradePage() {
  const inputRef = useRef();
  const router = useRouter();

  async function handleFormSubmit(e) {
    e.preventDefault();
    if (inputRef.current.value === "") {
      return toast.error("Please enter grade!");
    }
    try {
      const resp = await adminRequest.post("/grades", {
        name: inputRef.current.value,
      });
      console.log(resp.data);
      if (resp.status === 200) {
        toast.success(resp.data.message);
        router.push("/admin/grades");
      }
    } catch (error) {
      toast.error(error.response.data.message);
      console.log(error);
    }
  }

  return (
    <section>
      <h2 className="section-heading">Add Grade</h2>
      <form onSubmit={handleFormSubmit}>
        <div className="relative flex flex-col justify-end">
          <input
            type="name"
            id="name"
            className="my-input peer"
            placeholder="Grade"
            autoComplete="off"
            ref={inputRef}
          />
          <label htmlFor="name" className="my-label">
            Grade
          </label>
        </div>
        <div className="mb-4 flex justify-end">
          <button className="bg-emerald-500 rounded-md py-3 w-full mt-4 text-white">
            Create
          </button>
        </div>
      </form>
    </section>
  );
}
