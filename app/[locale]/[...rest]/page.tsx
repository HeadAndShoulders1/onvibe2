import NotFound from "@/components/NotFound/page";
import '@/app/globals.css'
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'ONVIBE.FUN',
}

export default function CatchAllPage() {
  return (
    <NotFound />
  )
}