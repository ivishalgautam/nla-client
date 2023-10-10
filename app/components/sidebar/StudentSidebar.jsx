"use client";
import Link from "next/link";
import React from "react";
import { ImStatsDots } from "react-icons/im";
import { CgNotes, CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { IoAnalyticsOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";
import { clearAllCookies, getCookie } from "@/app/lib/cookies";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import Logo from "../../../public/nla-logo.jpeg";
import { AiOutlineShopping } from "react-icons/ai";

const navList = [
  {
    name: "Profile",
    path: "/student/profile",
    icon: <CgProfile size={20} />,
  },
  {
    name: "My tests",
    path: "/student/my-tests",
    icon: <CgNotes size={20} />,
  },
  {
    name: "Results",
    path: "/student/results?page=1",
    icon: <ImStatsDots size={20} />,
  },
  {
    name: "Upcoming tests",
    path: "/student/upcoming-tests",
    icon: <SlCalender size={20} />,
  },
  {
    name: "Shop",
    path: "https://nlaacademy.in",
    icon: <AiOutlineShopping size={20} />,
  },
];

const StudentSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  function IsDashboard() {
    const p = getCookie("package");
    return p === "dashboard" ? true : false;
  }

  function handleLogout() {
    clearAllCookies();
    router.push("/auth/login/student");
  }

  function handleShop() {
    router.replace("https://nlaacademy.in");
  }

  return (
    <aside className="w-full h-full bg-white shadow text-gray-900 space-y-4 p-4">
      <div>
        <figure>
          <Image
            src={Logo}
            alt="logo"
            width={100}
            height={100}
            className="rounded-full mx-auto"
          />
        </figure>
      </div>
      <div>
        <ul className="px-4 space-y-3">
          {navList.map((list, key) => {
            return (
              <li key={key}>
                <Link
                  className={`text-[1.2rem] ${
                    pathname.includes(list.path)
                      ? "text-blue-950 font-semibold"
                      : "text-gray-500"
                  }  hover:text-blue-950 transition-colors flex gap-2 items-center`}
                  href={list.path}
                >
                  {list.icon}
                  {list.name}
                </Link>
              </li>
            );
          })}
          {IsDashboard() && (
            <li>
              <Link
                className={`text-[1.2rem] ${
                  pathname.includes("/student/analytics")
                    ? "text-blue-950 font-semibold"
                    : "text-gray-500"
                }  hover:text-blue-950 transition-colors flex gap-2 items-center`}
                href={"/student/analytics"}
              >
                <IoAnalyticsOutline size={20} />
                Analytics
              </Link>
            </li>
          )}
        </ul>
        <button
          className="w-full bg-primary align-middle rounded py-2 text-white mt-6"
          onClick={handleLogout}
        >
          Logout
          <FiLogOut className="inline ml-2" size={20} />
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
