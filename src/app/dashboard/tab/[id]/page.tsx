import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import TabDetailsView from "@/components/TabDetailsView";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

type Params = {
  params: Promise<{ id: string }>;
};

export default async function TabPage(props: Params) {
  const params = await props.params;
  const tabId = params.id;
  const supabase = await createClient();

  // Fetch Tab with Customer info
  const { data: tab, error: tabError } = await supabase
    .from("active_tabs")
    .select(`
      id,
      current_total,
      status,
      customer_id,
      customers (
        name,
        total_khata_balance
      )
    `)
    .eq("id", tabId)
    .single();

  if (tabError || !tab) {
    return notFound();
  }

  // Fetch Items in this tab
  const { data: items } = await supabase
    .from("tab_items")
    .select("*")
    .eq("tab_id", tabId)
    .order("timestamp", { ascending: false });

  // Fetch Quick-Add Items
  const { data: quickItems } = await supabase
    .from("quick_add_items")
    .select("*")
    .order("item_name");

  const customer = Array.isArray(tab.customers) ? tab.customers[0] : tab.customers;

  return (
    <div className="flex flex-col min-h-screen pb-24 bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-10 flex items-center h-16 px-4 bg-white border-b border-neutral-200 shadow-sm">
        <Link 
          href="/dashboard"
          className="flex items-center justify-center p-2 -ml-2 text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div className="ml-2">
          <h1 className="text-xl font-bold text-neutral-900 leading-tight">
            {customer?.name}
          </h1>
          {customer?.total_khata_balance > 0 && (
            <p className="text-xs font-semibold text-orange-500">
              Khata: ₹{customer.total_khata_balance}
            </p>
          )}
        </div>
        <div className="ml-auto flex items-center">
          <span className="text-2xl font-black text-blue-600 tracking-tight">
            <span className="text-sm font-bold text-blue-400 mr-0.5">₹</span>
            {tab.current_total}
          </span>
        </div>
      </header>

      {/* Main Content (Interactive Client Component) */}
      <div className="flex-1 px-4 mt-6">
        <TabDetailsView 
          tabId={tabId}
          customerId={tab.customer_id}
          initialTotal={Number(tab.current_total)}
          initialItems={items || []}
          quickItems={quickItems || []}
        />
      </div>
    </div>
  );
}
