"use client";

import { useState } from "react";
import { Plus, Coffee, Check, Users } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

type Item = {
  id: string;
  item_name: string;
  price: number;
  quantity: number;
  timestamp: string;
};

type QuickItem = {
  id: string;
  item_name: string;
  price: number;
};

export default function TabDetailsView({
  tabId,
  customerId,
  initialTotal,
  initialItems,
  quickItems,
}: {
  tabId: string;
  customerId: string;
  initialTotal: number;
  initialItems: Item[];
  quickItems: QuickItem[];
}) {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [total, setTotal] = useState(initialTotal);
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const haptic = () => {
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleQuickAdd = async (qItem: QuickItem) => {
    haptic(); // Tactile feedback
    
    // Optimistic Update
    const tempId = crypto.randomUUID();
    const newItem = {
      id: tempId,
      item_name: qItem.item_name,
      price: qItem.price,
      quantity: 1,
      timestamp: new Date().toISOString(),
    };
    
    setItems((prev) => [newItem, ...prev]);
    setTotal((prev) => prev + Number(qItem.price));

    // Database Insert
    const { error } = await supabase.from("tab_items").insert({
      tab_id: tabId,
      item_name: qItem.item_name,
      price: qItem.price,
      quantity: 1,
    });

    if (!error) {
      // Update Tab Total in DB
      await supabase
        .from("active_tabs")
        .update({ current_total: total + Number(qItem.price) })
        .eq("id", tabId);
        
      router.refresh();
    } else {
      // Revert if failed
      setItems((prev) => prev.filter((i) => i.id !== tempId));
      setTotal((prev) => prev - Number(qItem.price));
      alert("Failed to add item");
    }
  };

  const handleCheckout = async (type: "paid" | "khata") => {
    if (loading || total === 0) return;
    setLoading(true);

    try {
      if (type === "khata") {
        // 1. Fetch current khata balance
        const { data: customer } = await supabase
          .from("customers")
          .select("total_khata_balance")
          .eq("id", customerId)
          .single();
          
        const newBalance = Number(customer?.total_khata_balance || 0) + total;

        // 2. Update Khata Balance
        await supabase
          .from("customers")
          .update({ total_khata_balance: newBalance })
          .eq("id", customerId);

        // 3. Add to Khata Transactions
        await supabase.from("khata_transactions").insert({
          customer_id: customerId,
          amount: total,
          type: "credit",
        });
      }

      // 4. Update Tab Status to Closed
      await supabase
        .from("active_tabs")
        .update({ status: type === "khata" ? "transferred_to_khata" : "closed" })
        .eq("id", tabId);

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Quick Add Section */}
      <div className="mb-8">
        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3 px-1">
          Quick Add
        </h3>
        {quickItems.length === 0 ? (
          <div className="text-sm text-neutral-400 italic px-1">
            No quick items. Add them in Settings.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {quickItems.map((q) => (
              <button
                key={q.id}
                onClick={() => handleQuickAdd(q)}
                className="flex items-center justify-between p-4 bg-white border border-neutral-200 rounded-2xl shadow-sm hover:border-blue-300 active:scale-95 active:shadow-inner transition-all group"
              >
                <span className="font-semibold text-neutral-800 text-left line-clamp-2 pr-2">
                  {q.item_name}
                </span>
                <div className="flex-shrink-0 flex items-center justify-center bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-xl group-active:bg-blue-600 group-active:text-white transition-colors">
                  +₹{q.price}
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Consumed Items List */}
      <div>
        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3 px-1">
          History Today
        </h3>
        
        {items.length === 0 ? (
          <div className="bg-white border border-neutral-200 border-dashed rounded-2xl p-8 text-center">
            <p className="text-neutral-500 font-medium">No items consumed yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => {
              const date = new Date(item.timestamp);
              const time = isNaN(date.getTime()) ? "Just now" : date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
              
              return (
                <div key={item.id} className="flex justify-between items-center p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm">
                  <div className="flex flex-col">
                    <span className="font-bold text-neutral-900">{item.item_name}</span>
                    <span className="text-xs text-neutral-400 font-medium mt-0.5">{time}</span>
                  </div>
                  <span className="font-bold text-neutral-900 border-2 border-neutral-100 bg-neutral-50 px-3 py-1 rounded-xl">
                    ₹{item.price * item.quantity}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Bottom Checkout Bar (Hides BottomNav natively via z-index & layout) */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-white border-t border-neutral-200 p-4 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
        <div className="max-w-md mx-auto flex gap-3">
          <button
            onClick={() => handleCheckout("paid")}
            disabled={loading || total === 0}
            className="flex-1 flex flex-col items-center justify-center p-3.5 bg-green-500 text-white font-bold rounded-2xl shadow-sm active:scale-95 transition-all outline-none disabled:opacity-50"
          >
            <Check className="w-5 h-5 mb-1 opacity-90" />
            Paid in Full
          </button>
          <button
            onClick={() => handleCheckout("khata")}
            disabled={loading || total === 0}
            className="flex-1 flex flex-col items-center justify-center p-3.5 bg-blue-600 text-white font-bold rounded-2xl shadow-sm active:scale-95 transition-all outline-none disabled:opacity-50"
          >
            <Users className="w-5 h-5 mb-1 opacity-90" />
            Add to Khata
          </button>
        </div>
      </div>
    </>
  );
}
