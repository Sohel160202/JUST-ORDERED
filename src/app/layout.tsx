import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata={title:"Just Ordered",description:"Buy everything. Spend nothing. A virtual shopping simulator.",manifest:"/manifest.webmanifest",themeColor:"#171714",icons:{icon:"/icon.svg",apple:"/icon.svg"}};
export default function RootLayout({children}:{children:React.ReactNode}){return <html lang="en"><body>{children}</body></html>}
