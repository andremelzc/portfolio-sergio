"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getAllProjectSlugs } from "@/sanity/lib/api";

export default function Sidebar() {
  const pathname = usePathname();
  const [projects, setProjects] = useState<{ title: string; slug: string }[]>(
    [],
  );

  useEffect(() => {
    const fetchProjects = async () => {
      const data = await getAllProjectSlugs();
      setProjects(data);
    };
    fetchProjects();
  }, []);

  const primaryItems = [
    { name: "Home", href: "/" },
    { name: "Sobre mí", href: "/about" },
    { name: "Contacto", href: "/contact" },
  ];

  return (
    <nav className="fixed left-0 top-0 h-full w-48 flex flex-col justify-start py-12 px-8 z-[100] bg-night">
      {/* Primary links */}
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

      {/* Secondary links (Dinámicos) */}
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
    </nav>
  );
}
