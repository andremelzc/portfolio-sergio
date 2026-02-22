"use client";

import { motion } from "framer-motion";
import data from "@/data/about.json";
import Sidebar from "@/components/Sidebar";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-night text-white flex">
      <Sidebar />

      {/* Contenedor de Contenido */}
      <div className="flex-1 flex items-center justify-center p-8 ml-24 md:ml-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl w-full"
        >
          <div className="space-y-10 text-lg md:text-xl leading-[1.9] font-extralight text-white/90">
            <p className="italic">{data.description}</p>
            <p className="text-white">{data.description2}</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
