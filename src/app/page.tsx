"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";

export default function MinimalistPortfolio() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* IMAGEN DE FONDO */}
      <motion.div
        className="absolute inset-0"
        animate={{
          filter: isHovered ? "invert(1)" : "invert(0)",
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      >
        <Image
          src="/EXAMPLE_IMAGE.jpg"
          alt="Hero"
          fill
          className="object-cover"
          priority
          quality={95}
          sizes="100vw"
        />
      </motion.div>

      {/* NOMBRE CENTRADO CON HOVER */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <h1
          className="text-4xl font-medium italic tracking-[0.25em] text-white cursor-pointer select-none"
          style={{
            fontFamily: "Roboto, sans-serif",
            textShadow:
              "0 2px 10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 0, 0, 0.7)",
            filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          Sergio Melendez
        </h1>
      </div>
    </div>
  );
}
