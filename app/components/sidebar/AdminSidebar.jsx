import Link from "next/link";
import React from "react";
import { MdOutlineDashboard } from "react-icons/md";
import { HiOutlinePencilAlt } from "react-icons/hi";
import { ImProfile, ImStatsDots } from "react-icons/im";
import { CgNotes } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";
import { usePathname, useRouter } from "next/navigation";
import { clearAllCookies } from "@/app/lib/cookies";

const navList = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <MdOutlineDashboard size={20} />,
  },
  {
    name: "Tests",
    path: "/admin/tests",
    icon: <HiOutlinePencilAlt size={20} />,
  },
  {
    name: "Grades",
    path: "/admin/grades",
    icon: <CgNotes size={20} />,
  },
  {
    name: "Students",
    path: "/admin/students",
    icon: <ImProfile size={20} />,
  },
  {
    name: "Results",
    path: "/admin/results",
    icon: <ImStatsDots size={20} />,
  },
];

const AdminSidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  console.log(pathname);
  function handleLogout() {
    clearAllCookies();
    router.push("/auth/login/admin");
  }
  return (
    <aside className="w-full h-full bg-white shadow text-gray-900 space-y-4 p-4">
      <div>
        <h2 className="font-bold text-4xl text-center">logo</h2>
      </div>
      <div>
        <ul className="space-y-1">
          {navList.map((list, key) => {
            return (
              <li
                key={key}
                className={`px-4 py-2 rounded-md hover:bg-primary hover:text-white ${
                  pathname.includes(list.path)
                    ? "bg-primary text-white"
                    : "text-gray-800"
                }`}
              >
                <Link
                  className={`text-md transition-colors flex gap-2 items-center`}
                  href={list.path}
                >
                  {list.icon}
                  {list.name}
                </Link>
              </li>
            );
          })}
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

export default AdminSidebar;
