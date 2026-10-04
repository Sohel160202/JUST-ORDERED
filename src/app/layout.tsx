import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./engagement.css";
import "./season-rewards.css";
import EngagementDock from "@/components/EngagementDock";

export const metadata: Metadata={
  title:"Just Ordered",
  description:"Buy everything. Spend nothing. A virtual shopping simulator.",
  manifest:"/manifest.webmanifest",
  icons:{icon:"/icon.svg",apple:"/icon.svg"}
};

export const viewport: Viewport={
  themeColor:"#171714",
  width:"device-width",
  initialScale:1
};

export default function RootLayout({children}:{children:React.ReactNode}){
  return <html lang="en"><body>{children}<EngagementDock/></body></html>
}
