import { createClient } from "@/utils/supabase/server";
import KhataListClient from "./KhataListClient";

// Force dynamic because we want to see live updates to payments
export const dynamic = 'force-dynamic'

export default async function KhataPage() {
  const supabase = await createClient();
  
  // We need to fetch the current user to optionally restrict query, though RLS handles it.
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch all customers that have a khata balance > 0
  const { data: customers, error } = await supabase
    .from("customers")
    .select("*")
    .gt("total_khata_balance", 0)
    .order("total_khata_balance", { ascending: false });

  return (
    <div className="px-4">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Khata Book</h2>
          <p className="text-neutral-500 text-sm mt-1">Pending payments</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-semibold text-neutral-500 uppercase">Total Owed</p>
          <p className="text-xl font-black text-orange-600">
            ₹{customers?.reduce((acc, c) => acc + Number(c.total_khata_balance), 0) || 0}
          </p>
        </div>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          Failed to load khata databse.
        </div>
      ) : customers?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-neutral-100 shadow-sm mt-8">
          <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-4xl">
            🎉
          </div>
          <h3 className="text-lg font-bold text-neutral-900">All clear!</h3>
          <p className="mt-2 text-neutral-500 max-w-xs">
            Nobody owes you any money right now.
          </p>
        </div>
      ) : (
        <KhataListClient customers={customers || []} />
      )}
    </div>
  );
}
