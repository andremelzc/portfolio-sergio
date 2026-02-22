"use client";

import { motion } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import { Instagram } from "lucide-react";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-night text-white flex">
      <Sidebar />

      <div className="flex-1 flex items-center justify-center p-8 ml-24 md:ml-32">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="max-w-xl w-full"
        >
          {/* Estructura minimalista: centrada y con aire */}
          <div className="flex flex-col items-center space-y-12 text-lg font-extralight text-white">
            {/* 1. Email */}
            <a
              href="mailto:sergio200024@gmail.com"
              className="italic hover:text-white/60 transition-colors"
            >
              sergio200024@gmail.com
            </a>

            {/* 2. Icono (Solo, como en la imagen) */}
            <a
              href="https://instagram.com/sergiomelendezc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-60 transition-opacity"
            >
              <Instagram size={24} strokeWidth={1} />
            </a>

            {/* 3. Instagram User */}
            <a
              href="https://instagram.com/sergiomelendezc"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              @sergiomelendezc
            </a>

            {/* 4. Ubicación */}
            <span className="text-white/50">Lima, Peru</span>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
