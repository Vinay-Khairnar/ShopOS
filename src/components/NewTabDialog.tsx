"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function NewTabDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    setLoading(true);
    
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) throw new Error("Not authenticated");

      const ownerId = userData.user.id;

      // 1. Check if customer exists for this owner, if not create
      let { data: existingCustomer } = await supabase
        .from("customers")
        .select("id")
        .eq("name", name.trim())
        .eq("owner_id", ownerId)
        .single();
        
      let customerId = existingCustomer?.id;

      if (!customerId) {
        const { data: newCustomer, error: createError } = await supabase
          .from("customers")
          .insert({ name: name.trim(), owner_id: ownerId })
          .select("id")
          .single();
          
        if (createError) throw createError;
        customerId = newCustomer.id;
      }

      // 2. Create an active tab
      const { data: newTab, error: tabError } = await supabase
        .from("active_tabs")
        .insert({ customer_id: customerId })
        .select("id")
        .single();

      if (tabError) throw tabError;

      // 3. Reset and refresh
      setIsOpen(false);
      setName("");
      router.refresh();
      // Optional: navigate directly to the new tab
      // router.push(`/dashboard/tab/${newTab.id}`);
      
    } catch (error) {
      console.error("Failed to create tab:", error);
      alert("Failed to create tab. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-6 z-40 flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-xl hover:bg-blue-700 active:scale-95 transition-all"
        aria-label="New Tab"
      >
        <Plus className="h-8 w-8" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 sm:slide-in-from-bottom-0 sm:fade-in-from-0 fade-in duration-200">
            <div className="flex items-center justify-between p-6 pb-2 border-b border-neutral-100">
              <h2 className="text-xl font-bold text-neutral-900">New Customer Tab</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 active:bg-neutral-200"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6">
              <div className="mb-6">
                <label htmlFor="name" className="block text-sm font-medium text-neutral-700 mb-2">
                  Customer Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoFocus
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Vinay"
                  className="w-full rounded-xl border-neutral-300 bg-neutral-50 px-4 py-3.5 text-lg text-neutral-900 shadow-sm focus:border-blue-500 focus:bg-white focus:ring-blue-500 outline-none border transition-colors"
                />
              </div>
              
              <button
                type="submit"
                disabled={loading || !name.trim()}
                className="w-full rounded-xl bg-blue-600 px-4 py-4 text-center text-lg font-bold text-white shadow-sm hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 disabled:active:bg-blue-600 transition-all"
              >
                {loading ? "Starting..." : "Start Tab"}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
