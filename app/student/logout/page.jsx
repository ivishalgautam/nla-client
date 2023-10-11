"use client";
import { clearAllCookies } from "@/app/lib/cookies";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

export default function LogoutPage() {
  const query = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const logout = query.get("logout");
    if (logout) {
      clearAllCookies();
      router.replace("https://nlacademy.in/login.php");
    }
  }, []);
  return <div>Logging out...</div>;
}
