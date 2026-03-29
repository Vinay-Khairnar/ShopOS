"use client";

import { useState } from "react";
import PaymentDialog from "@/components/PaymentDialog";

export default function KhataListClient({ customers }: { customers: any[] }) {
  const [selectedCustomer, setSelectedCustomer] = useState<any | null>(null);

  return (
    <>
      <div className="space-y-3">
        {customers.map((customer) => (
          <button
            key={customer.id}
            onClick={() => setSelectedCustomer(customer)}
            className="w-full flex justify-between items-center p-5 bg-white border border-neutral-200 rounded-3xl shadow-sm hover:border-orange-300 active:scale-95 active:shadow-inner transition-all group"
          >
            <div className="flex flex-col text-left">
              <span className="text-xl font-bold text-neutral-900 leading-tight">
                {customer.name}
              </span>
              <span className="text-xs text-neutral-400 font-medium mt-0.5">
                Tap to clear amount
              </span>
            </div>
            <div className="flex-shrink-0 flex items-center justify-center bg-orange-50 text-orange-600 font-bold px-4 py-2 rounded-2xl group-active:bg-orange-600 group-active:text-white transition-colors">
              ₹{customer.total_khata_balance}
            </div>
          </button>
        ))}
      </div>

      <PaymentDialog
        customer={selectedCustomer}
        isOpen={!!selectedCustomer}
        onClose={() => setSelectedCustomer(null)}
      />
    </>
  );
}
