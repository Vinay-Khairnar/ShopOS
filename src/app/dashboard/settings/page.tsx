import { createClient } from "@/utils/supabase/server";
import SettingsClient from "./SettingsClient";
import { getTranslations } from "next-intl/server";

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const t = await getTranslations("Settings");

  if (!user) return null;

  // Fetch quick add items for management
  const { data: items, error } = await supabase
    .from("quick_add_items")
    .select("*")
    .order("item_name");

  return (
    <div className="px-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-neutral-900 tracking-tight">{t('title')}</h2>
        <p className="text-neutral-500 text-sm mt-1">{t('subtitle')}</p>
      </div>

      {error ? (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
          {t('failedToLoad')}
        </div>
      ) : (
        <SettingsClient items={items || []} ownerId={user.id} />
      )}
    </div>
  );
}
