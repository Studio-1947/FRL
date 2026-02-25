"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  // Define paths where Header and Footer should be hidden
  const hideNavigationPaths = ["/login", "/signup", "/life-balance"];

  // Note: /life-balance has its own sub-routes handling slides, hide global nav there too
  const shouldHideNavigation = hideNavigationPaths.some((path) =>
    pathname?.startsWith(path),
  );

  return (
    <div className="flex flex-col min-h-screen">
      {!shouldHideNavigation && (
        <div className="w-full max-w-[1440px] mx-auto overflow-hidden px-2 lg:px-7">
          <Header />
        </div>
      )}

      <main className="flex-1">{children}</main>

      {!shouldHideNavigation && <Footer />}
    </div>
  );
}
