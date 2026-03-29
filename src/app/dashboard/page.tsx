import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import NewTabDialog from "@/components/NewTabDialog";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  // Fetch active tabs for the current owner
  const { data: activeTabs, error } = await supabase
    .from("active_tabs")
    .select(`
      id,
      current_total,
      created_at,
      customers (
        name,
        total_khata_balance
      )
    `)
    .eq("status", "open")
    .order("created_at", { ascending: false });

  return (
    <div className="px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">Active Tabs</h2>
        <p className="text-neutral-500 text-sm mt-1">Customers currently at the shop</p>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          Failed to load active tabs.
        </div>
      ) : activeTabs?.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-neutral-100 shadow-sm">
          <div className="h-16 w-16 bg-neutral-100 rounded-full flex items-center justify-center mb-4 text-4xl">
            ☕
          </div>
          <h3 className="text-lg font-bold text-neutral-900">No active tabs</h3>
          <p className="mt-2 text-neutral-500 max-w-xs">
            Tap the + button below when a customer arrives to start a tab.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {activeTabs?.map((tab) => {
            // customers is joined as an object or array depending on schema, mostly object if single
            const customer = Array.isArray(tab.customers) ? tab.customers[0] : tab.customers;
            
            return (
              <Link 
                key={tab.id} 
                href={`/dashboard/tab/${tab.id}`}
                className="flex flex-col justify-between aspect-square bg-white border border-neutral-200 rounded-3xl p-5 shadow-sm active:scale-95 active:shadow-inner transition-all hover:border-blue-300 hover:shadow-md group relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 truncate pr-2">
                    {customer?.name || "Unknown"}
                  </h3>
                  <p className="text-xs font-medium text-neutral-400 mt-1 uppercase tracking-wider">
                    {formatDistanceToNow(new Date(tab.created_at), { addSuffix: true })}
                  </p>
                </div>
                
                <div className="mt-auto">
                  <p className="text-3xl font-black text-blue-600 tracking-tight">
                    <span className="text-lg font-bold text-blue-400 mr-0.5">₹</span>
                    {tab.current_total}
                  </p>
                  {customer?.total_khata_balance > 0 && (
                    <p className="text-xs font-semibold text-orange-500 mt-1.5 bg-orange-50 inline-block px-2 py-0.5 rounded-full">
                      Khata: ₹{customer.total_khata_balance}
                    </p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}

      <NewTabDialog />
    </div>
  );
}
