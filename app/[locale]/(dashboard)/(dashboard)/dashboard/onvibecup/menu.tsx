import { AppSidebar } from "@/components/dashboard/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"


import { useTranslations } from "next-intl";


export default function MenuMaun() {
  const t = useTranslations('catalog')
  return (
    <div className="w-full">
        <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger />
        хуй
      </main>
    </SidebarProvider>
    </div>
  )
}