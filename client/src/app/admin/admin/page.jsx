"use client";
import { EcommerceMetrics } from "../../components/admin/ecommerce/EcommerceMetrics";
import MonthlyTarget from "../../components/admin/ecommerce/MonthlyTarget";
import MonthlySalesChart from "../../components/admin/ecommerce/MonthlySalesChart";
import { useAuth } from "@/app/hooks/UseAuth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Ecommerce() {
  const { token } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (token?.role === false) {
      router.push("/admin");
    }
  }, [token]);
  return (
    <div className="grid grid-cols-12 gap-4 md:gap-6 ">
      <div className="col-span-12 space-y-6 xl:col-span-7">
        <EcommerceMetrics />

        <MonthlySalesChart />
      </div>

      <div className="col-span-12 xl:col-span-5">
        <MonthlyTarget />
      </div>
    </div>
  );
}
