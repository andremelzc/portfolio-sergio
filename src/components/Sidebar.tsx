"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const primaryItems = [
    { name: "Home", href: "/" },
  ];

  const secondaryItems = [
    { name: "Sobre mí", href: "/about" },
    { name: "Contacto", href: "/contact" },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-48 flex flex-col justify-start py-12 px-8 z-[100]">
      {/* Primary links */}
      <div className="flex flex-col gap-1 mb-8">
        {primaryItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                text-base italic tracking-normal transition-all duration-200
                ${isActive ? "text-white" : "text-white/60 hover:text-white/90"}
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </div>

      {/* Secondary links */}
      <div className="flex flex-col gap-1">
        {secondaryItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                text-base italic tracking-normal transition-all duration-200
                ${isActive ? "text-white" : "text-white/60 hover:text-white/90"}
              `}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
