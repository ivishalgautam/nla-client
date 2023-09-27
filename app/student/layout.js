"use client";
import React, { useEffect } from "react";
import StudentSidebar from "../components/sidebar/StudentSidebar";
import { clearAllCookies, getCookie } from "../lib/cookies";
import { useRouter } from "next/navigation";

import { Poppins } from "next/font/google";
import { IoIosArrowBack } from "react-icons/io";
import { authRequest } from "../lib/requestMethods";
import useSessionStorage from "../hooks/useSessionStorage";
const poppins = Poppins({
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function StudentLayout({ children }) {
  const router = useRouter();
  useEffect(() => {
    const token = getCookie("token");
    if (!token) {
      clearAllCookies();
      return router.push("/auth/login/student");
    } else {
      authRequest
        .get("/validate", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((resp) => console.log({ data: resp.data }))
        .catch((error) => {
          // console.log({ error });
          clearAllCookies();
          return router.replace("/auth/login/student");
        });
    }
  }, []);

  const handleGoBack = () => {
    router.back();
  };

  return (
    <main className={`${poppins.className} h-screen`}>
      <section className="grid grid-cols-5 h-full">
        <div className="col-span-1">
          <StudentSidebar />
        </div>
        <div className="col-span-4 bg-gray-100 p-8">
          <div className="flex items-center justify-start mb-4">
            <button
              onClick={handleGoBack}
              className="flex items-center justify-center gap-1 bg-primary rounded text-white px-2 py-1"
            >
              <IoIosArrowBack size={20} /> Go Back
            </button>
          </div>
          {children}
        </div>
      </section>
    </main>
  );
}
