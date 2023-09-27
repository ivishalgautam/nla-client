"use client";
import { getCookie } from "@/app/lib/cookies";
import { publicRequest } from "@/app/lib/requestMethods";
import React, { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [details, setDetails] = useState({});
  let [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  useEffect(() => {
    (async function () {
      try {
        const resp = await publicRequest.get(
          `/students/${getCookie("student_id")}`
        );
        setDetails(resp.data);
        console.log(resp.data);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);

  async function handleUpdatePassword() {
    try {
      const resp = await publicRequest.put(
        `/students/update-password/${getCookie("student_id")}`,
        {
          newPassword: password.newPassword,
          oldPassword: password.oldPassword,
        }
      );
      if (resp.status === 200) {
        toast.success(resp.data.message);
        closeModal();
      }
      console.log(resp.data);
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  }

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Update password
                  </Dialog.Title>
                  <div className="mt-2 space-y-2">
                    <div className="relative">
                      <input
                        type="text"
                        id="oldPassword"
                        className="my-input peer"
                        placeholder="Old password"
                        onChange={(e) =>
                          setPassword((prev) => ({
                            ...prev,
                            oldPassword: e.target.value,
                          }))
                        }
                      />
                      <label htmlFor="oldPassword" className="my-label">
                        Old password
                      </label>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        id="newPassword"
                        placeholder="New password"
                        onChange={(e) =>
                          setPassword((prev) => ({
                            ...prev,
                            newPassword: e.target.value,
                          }))
                        }
                        className="my-input peer"
                      />
                      <label htmlFor="newPassword" className="my-label">
                        New password
                      </label>
                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-emerald-100 px-4 py-2 text-sm font-medium text-primary hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={handleUpdatePassword}
                    >
                      Update password
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <section className="h-full">
        <div className="grid grid-cols-2 gap-4 grid-rows-7 h-full">
          <div className="col-span-2 bg-white row-span-3 shadow-md rounded-md flex items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-2">
              <h5 className="text-2xl text-primary font-bold capitalize">
                {details?.fullname}
              </h5>
              <p className="text-sm">{details?.email}</p>
              {/* <button
                className="text-white bg-primary rounded p-1 px-3 mt-3"
                onClick={() => setIsOpen(true)}
              >
                Change password
              </button> */}
            </div>
          </div>
          <div className="col-span-1 bg-white shadow-md rounded-md p-8">
            <h3 className="border-b pb-6 mb-6 font-bold text-lg">
              Personal Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-primary">Fullname</h4>
                <p className="text-sm capitalize">{details?.fullname}</p>
              </div>
              <div>
                <h4 className="font-bold text-primary">Email</h4>
                <p className="text-sm">{details?.email}</p>
              </div>
              <div>
                <h4 className="font-bold text-primary">Phone</h4>
                <p className="text-sm">{details?.phone}</p>
              </div>
            </div>
          </div>
          <div className="col-span-1 bg-white shadow-md rounded-md p-8">
            <h3 className="border-b pb-6 mb-6 font-bold text-lg">
              Education Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-bold text-primary">Package</h4>
                <p className="text-sm capitalize">{details?.package}</p>
              </div>
              <div>
                <h4 className="font-bold text-primary">Grade</h4>
                <p className="text-sm capitalize">{details?.grade}</p>
              </div>
              <div>
                <h4 className="font-bold text-primary">Reg. date</h4>
                <p className="text-sm capitalize">
                  {new Date(details?.created_at).toDateString()}
                </p>
              </div>
              <div>
                <h4 className="font-bold text-primary">Subject</h4>
                <p className="text-sm capitalize">{details?.subject}</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
