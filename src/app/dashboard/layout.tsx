import BottomNav from "@/components/BottomNav";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { createClient } from "@/utils/supabase/server";
import { LogOut } from "lucide-react";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900 antialiased selection:bg-blue-100 selection:text-blue-900 pb-20">
      <header className="sticky top-0 z-40 w-full bg-white border-b border-neutral-200">
        <div className="flex h-16 items-center justify-between px-4 max-w-md mx-auto">
          <div className="flex gap-2 items-center">
            <h1 className="text-lg font-bold">Shop Manager</h1>
          </div>
          <div className="flex items-center gap-3">
            <LanguageSwitcher />
            <form action={async () => {
              "use server";
              const supabaseServer = await createClient();
              await supabaseServer.auth.signOut();
              redirect("/login");
            }}>
              <button className="p-2 text-neutral-500 hover:text-neutral-900 active:bg-neutral-100 rounded-full transition-colors">
                <LogOut className="h-5 w-5" />
              </button>
            </form>
          </div>
        </div>
      </header>
      
      <main className="max-w-md mx-auto relative pt-4 pb-8">
        {children}
      </main>

      <BottomNav />
    </div>
  );
}
