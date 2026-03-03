"use client";

import { motion } from "framer-motion";
import data from "@/data/about.json";
import Sidebar from "@/components/Sidebar";

export default function AboutPage() {
  return (
    <main className="min-h-svh bg-night text-white flex">
      <Sidebar />

      <div className="flex-1 flex items-center justify-center p-8 md:ml-48">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl w-full"
        >
          <div className="space-y-10 text-base md:text-xl leading-[1.9] font-extralight text-white/90">
            <p className="italic">{data.description}</p>
            <p className="text-white">{data.description2}</p>
            <p className="text-white">{data.description3}</p>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
