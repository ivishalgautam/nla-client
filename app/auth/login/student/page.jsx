"use client";
import { getCookie, setCookie } from "@/app/lib/cookies";
import { authRequest } from "@/app/lib/requestMethods";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const query = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function login(username, password) {
      try {
        const { data, status } = await authRequest.post("/login", {
          username,
          password,
        });

        if (status === 200) {
          toast.success("Logged in successfully");

          setCookie("email", data.student.email, 2);
          setCookie("fullname", data.student.fullname, 2);
          setCookie("student_id", data.student.id, 2);
          setCookie("package", data.student.package, 2);
          setCookie("grade", data.student.grade, 2);
          setCookie("student_token", data.access_token, 2);

          router.push("/student/profile");
        }
      } catch (error) {
        router.replace("https://nlaacademy.in/login.php");
        // toast.error(error.response.data.message);
        console.log(error);
      }
    }

    const u = query.get("u");
    const p = query.get("p");

    if (u && p) {
      login(u, p);
    } else {
      router.replace("https://nlaacademy.in/login.php");
    }
  }, []);

  return (
    <section className="h-full flex items-center justify-center flex-col">
      <h2 className="section-heading"> Student login </h2>
    </section>
  );
}
