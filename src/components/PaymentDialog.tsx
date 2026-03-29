"use client";

import { useState } from "react";
import { X, Check } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function PaymentDialog({ 
  customer, 
  isOpen, 
  onClose 
}: { 
  customer: any; 
  isOpen: boolean; 
  onClose: () => void 
}) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  if (!isOpen || !customer) return null;

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const payAmount = Number(amount);
    if (!payAmount || payAmount <= 0) return;
    
    setLoading(true);
    
    try {
      const newBalance = Math.max(0, Number(customer.total_khata_balance) - payAmount);
      
      // Update Khata Balance
      const { error: updateError } = await supabase
        .from("customers")
        .update({ total_khata_balance: newBalance })
        .eq("id", customer.id);
        
      if (updateError) throw updateError;

      // Add Payment Transaction
      const { error: txnError } = await supabase
        .from("khata_transactions")
        .insert({
          customer_id: customer.id,
          amount: payAmount,
          type: "payment",
        });

      if (txnError) throw txnError;

      router.refresh();
      onClose();
      setAmount("");
      
    } catch (error) {
      console.error("Payment failed:", error);
      alert("Failed to register payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm px-4 sm:px-0">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:fade-in-from-0 fade-in duration-200">
        <div className="flex items-center justify-between p-6 pb-2 border-b border-neutral-100">
          <div>
            <h2 className="text-xl font-bold text-neutral-900">Receive Payment</h2>
            <p className="text-sm text-neutral-500 mt-1">from {customer.name}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={handlePayment} className="p-6">
          <div className="mb-6">
            <label className="flex justify-between text-sm font-medium text-neutral-700 mb-2">
              <span>Amount Received</span>
              <span className="text-orange-500 font-bold">Owes: ₹{customer.total_khata_balance}</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500 font-bold text-lg">₹</span>
              <input
                type="number"
                autoFocus
                required
                min="1"
                max={customer.total_khata_balance}
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                className="w-full rounded-xl border-neutral-300 bg-neutral-50 pl-10 pr-4 py-3.5 text-lg font-bold text-neutral-900 shadow-sm focus:border-blue-500 focus:bg-white focus:ring-blue-500 outline-none border transition-colors"
                // Handy shortcut for mobile keyboards
                inputMode="decimal"
              />
            </div>
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setAmount(customer.total_khata_balance.toString())}
              className="px-4 py-3 rounded-xl bg-orange-50 text-orange-600 font-bold text-sm border border-orange-100 active:scale-95 transition-all w-1/3"
            >
              Full
            </button>
            <button
              type="submit"
              disabled={loading || !amount || Number(amount) <= 0}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-center text-lg font-bold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:active:bg-blue-600 transition-all"
            >
              {loading ? "Saving..." : <><Check className="w-5 h-5"/> Confirm</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
