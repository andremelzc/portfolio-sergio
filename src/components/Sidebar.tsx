// Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllProjectSlugs } from "@/sanity/lib/api";
import { motion, AnimatePresence } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const [projects, setProjects] = useState<{ title: string; slug: string }[]>(
    [],
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getAllProjectSlugs();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  // Cierra el menu al navegar
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const primaryItems = [
    { name: "Home", href: "/" },
    { name: "Sobre mí", href: "/about" },
    { name: "Contacto", href: "/contact" },
  ];

  const NavLinks = () => (
    <>
      <div className="flex flex-col gap-1 mb-8">
        {primaryItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`text-base italic transition-all duration-200 ${
                isActive ? "text-white" : "text-white/60 hover:text-white/90"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </div>
      <div className="flex flex-col gap-1">
        {projects.map((project) => {
          const href = `/project/${project.slug}`;
          const isActive = pathname === href;
          return (
            <Link
              key={project.slug}
              href={href}
              className={`text-base italic transition-all duration-200 ${
                isActive ? "text-white" : "text-white/60 hover:text-white/90"
              }`}
            >
              {project.title}
            </Link>
          );
        })}
      </div>
    </>
  );

  return (
    <>
      {/* DESKTOP: sidebar fijo como antes */}
      <nav className="hidden md:flex fixed left-0 top-0 h-full w-48 flex-col justify-start py-12 px-8 z-[100] bg-night">
        <NavLinks />
      </nav>

      {/* MOBILE: botón + */}
      <button
        onClick={() => setMobileOpen((prev) => !prev)}
        className="md:hidden fixed top-5 left-5 z-[200] text-white/70 hover:text-white text-2xl font-light leading-none"
        aria-label="Menu"
      >
        {mobileOpen ? "×" : "+"}
      </button>

      {/* MOBILE: overlay menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden fixed inset-0 z-[150] bg-night/95 flex flex-col justify-start py-16 px-10"
          >
            <NavLinks />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
