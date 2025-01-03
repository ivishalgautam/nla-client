"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DataTable } from "@/app/components/ui/table/data-table";
import { columns } from "../columns";

export default function Listing({ treatmentId }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const searchParamStr = searchParams.toString();
  const router = useRouter();

  async function getResults() {
    setIsLoading(true);
    try {
      const resp = await adminRequest.get("/results", {
        headers: { Authorization: `Bearer ${getCookie("admin_token")}` },
      });
      setData(resp.data);
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    getResults();
  }, []);

  useEffect(() => {
    if (!searchParamStr) {
      const params = new URLSearchParams();
      params.set("page", 1);
      params.set("limit", 10);
      router.replace(`?${params.toString()}`);
    }
  }, [searchParamStr, router]);

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="rounded-lg border-input">
      <div className="">
        <DataTable
          columns={columns}
          data={data.results}
          totalItems={data.total}
        />
      </div>
    </div>
  );
}
