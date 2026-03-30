"use client";

import { useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

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

  // Edit states
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

  const supabase = createClient();
  const router = useRouter();
  const t = useTranslations("Settings");

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

  const handleSaveEdit = async (id: string) => {
    if (!editName.trim() || !editPrice || isNaN(Number(editPrice))) return;
    setSavingId(id);
    try {
      const { error } = await supabase
        .from("quick_add_items")
        .update({
          item_name: editName.trim(),
          price: Number(editPrice)
        })
        .eq("id", id);
      
      if (error) throw error;
      setEditingId(null);
      router.refresh();
    } catch (err) {
      console.error("Edit failed:", err);
      alert("Failed to update item. Ensure unique names or check connection.");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Add New Item Form */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-neutral-900 mb-4">{t('addQuickItem')}</h3>
        <form onSubmit={handleAdd} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              {t('itemName')}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('itemNamePlaceholder')}
              className="w-full rounded-xl border-neutral-300 bg-neutral-50 px-4 py-3 text-neutral-900 focus:border-blue-500 focus:bg-white outline-none border transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
              {t('price')}
            </label>
            <input
              type="number"
              required
              min="1"
              step="0.5"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder={t('pricePlaceholder')}
              className="w-full rounded-xl border-neutral-300 bg-neutral-50 px-4 py-3 text-neutral-900 focus:border-blue-500 focus:bg-white outline-none border transition-colors"
              inputMode="decimal"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !name.trim() || !price}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-white font-bold hover:bg-blue-700 active:bg-blue-800 disabled:opacity-50 transition-colors"
          >
            {loading ? t('adding') : <><Plus className="w-5 h-5"/> {t('addItem')}</>}
          </button>
        </form>
      </div>

      {/* Existing Items List */}
      <div>
        <h3 className="text-sm font-bold text-neutral-500 uppercase tracking-wider mb-3 px-1">
          {t('currentQuickItems')}
        </h3>
        
        {items.length === 0 ? (
          <div className="bg-white border border-neutral-200 border-dashed rounded-2xl p-8 text-center text-neutral-500 text-sm">
            {t('noItems')}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {items.map((item) => (
              editingId === item.id ? (
                <div key={item.id} className="flex flex-col gap-3 p-4 bg-blue-50/50 border border-blue-100 rounded-2xl shadow-sm w-full transition-all">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="flex-1 rounded-xl border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 outline-none border bg-white"
                      placeholder={t('itemNamePlaceholder')}
                    />
                    <input
                      type="number"
                      min="1"
                      step="0.5"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-24 rounded-xl border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 outline-none border bg-white"
                      placeholder={t('pricePlaceholder')}
                    />
                  </div>
                  <div className="flex justify-end gap-2 mt-1">
                    <button 
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 flex items-center justify-center text-xs font-bold text-neutral-600 bg-white border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:text-neutral-900 active:scale-95 transition-all"
                    >
                      {t('cancel')}
                    </button>
                    <button 
                      onClick={() => handleSaveEdit(item.id)}
                      disabled={savingId === item.id || !editName.trim() || !editPrice}
                      className="px-4 py-2 flex items-center justify-center text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-700 disabled:opacity-50 active:scale-95 transition-all"
                    >
                      {savingId === item.id ? t('saving') : t('save')}
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm group"
                >
                  <div>
                    <span className="font-bold text-neutral-900 block">{item.item_name}</span>
                    <span className="text-sm text-neutral-500 font-medium">₹{item.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setEditingId(item.id);
                        setEditName(item.item_name);
                        setEditPrice(item.price.toString());
                      }}
                      className="p-3 text-blue-500 bg-blue-50 hover:bg-blue-100 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 rounded-full active:scale-95 transition-all"
                      aria-label="Edit item"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id, item.item_name)}
                      className="p-3 text-red-500 bg-red-50 hover:bg-red-100 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 rounded-full active:scale-95 transition-all"
                      aria-label="Delete item"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
