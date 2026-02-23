"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { Instagram } from "lucide-react";

export default function ContactPage() {
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
          <div className="flex flex-col items-center space-y-12 text-lg font-extralight text-white">
            <a
              href="mailto:sergio200024@gmail.com"
              className="italic hover:text-white/60 transition-colors text-center break-all"
            >
              sergio200024@gmail.com
            </a>

            <a
              href="https://instagram.com/sergiomelendezc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              <Instagram size={24} strokeWidth={1} />
            </a>

            <a
              href="https://instagram.com/sergiomelendezc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              @sergiomelendezc
            </a>

            <span className="text-white/50">Lima, Peru</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
