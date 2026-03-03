"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllProjectSlugs } from "@/sanity/lib/api";
import { AnimatePresence, motion } from "framer-motion";

export default function Sidebar() {
  const pathname = usePathname();
  const [projects, setProjects] = useState<{ title: string; slug: string }[]>(
    [],
  );
  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopOpen, setDesktopOpen] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const data = await getAllProjectSlugs();
        setProjects(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error loading project slugs:", error);
        setProjects([]);
      }
    };
    fetchProjects();
  }, []);

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
      <div className="flex flex-col gap-2">
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
      {/* DESKTOP */}
      <div className="hidden md:block">
        <div className="fixed left-0 top-0 h-full z-[100] flex">
          {desktopOpen && (
            <nav className="flex flex-col justify-start py-12 px-8 bg-night w-48">
              <button
                onClick={() => setDesktopOpen(false)}
                className="text-white/30 hover:text-white/80 transition-colors duration-200 text-lg font-light leading-none text-left mb-8"
                aria-label="Cerrar menú"
              >
                ×
              </button>
              <NavLinks />
            </nav>
          )}

          {/* Franja siempre visible */}
          <div className="w-px h-full bg-white/10 relative">
            {!desktopOpen && (
              <button
                onClick={() => setDesktopOpen(true)}
                className="absolute top-12 left-8 text-white/30 hover:text-white/80 transition-colors duration-200 text-lg font-light leading-none"
                aria-label="Abrir menú"
              >
                +
              </button>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE: botón + */}
      <button
        onClick={() => setMobileOpen((prev) => !prev)}
        className="md:hidden fixed top-5 left-5 z-[500] text-white/70 hover:text-white text-2xl font-light leading-none"
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
