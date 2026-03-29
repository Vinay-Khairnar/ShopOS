"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function SettingsClient({ 
  items,
  ownerId 
}: { 
  items: any[];
  ownerId: string;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !price || isNaN(Number(price))) return;
    
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from("quick_add_items")
        .insert({
          owner_id: ownerId,
          item_name: name.trim(),
          price: Number(price),
        });

      if (error) throw error;

      setName("");
      setPrice("");
      router.refresh();
      
    } catch (error) {
      console.error("Add failed:", error);
      alert("Failed to add item. Ensure unique names or check connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, itemName: string) => {
    if (!confirm(`Remove ${itemName} from quick-add?`)) return;

    try {
      const { error } = await supabase
        .from("quick_add_items")
        .delete()
        .eq("id", id);
        
      if (error) throw error;
      router.refresh();
      
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to remove item.");
    }
  };

  return (
    <div className="space-y-8">
      {/* Add New Item Form */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">Add Quick Item</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Item Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Medium Tea"
              className="w-full rounded-xl border-neutral-300 bg-neutral-50 px-4 py-3 text-neutral-900 focus:border-blue-500 focus:bg-white outline-none border transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              Price (₹)
            </label>
            <input
              type="number"
              required
              min="1"
              step="0.5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="10"
              className="w-full rounded-xl border-neutral-300 bg-neutral-50 px-4 py-3 text-neutral-900 focus:border-blue-500 focus:bg-white outline-none border transition-colors"
              inputMode="decimal"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim() || !price}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white font-bold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            {loading ? "Adding..." : <><Plus className="w-5 h-5"/> Add Item</>}
          </button>
        </form>
      </div>

      {/* Existing Items List */}
      <div>
        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3 px-1">
          Current Quick Items
        </h3>
        
        {items.length === 0 ? (
          <div className="bg-white border border-neutral-200 border-dashed rounded-2xl p-8 text-center text-neutral-500 text-sm">
            No items added yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm"
              >
                <div>
                  <span className="font-bold text-neutral-900 block">{item.item_name}</span>
                  <span className="text-sm text-neutral-500 font-medium">₹{item.price}</span>
                </div>
                <button
                  onClick={() => handleDelete(item.id, item.item_name)}
                  className="p-3 text-red-500 bg-red-50 hover:bg-red-100 rounded-full active:scale-95 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
