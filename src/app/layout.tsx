"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { SideBar } from "@/components/side-bar/side-bar";
import { Provider } from "@/utils/providers/provider";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <Provider>
        <body className={inter.className}>
          <div className="grid grid-cols-[20vw_80vw]">
            <SideBar />
            {children}
          </div>
        </body>
      </Provider>
    </html>
  );
}
