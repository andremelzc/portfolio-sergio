"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getHomeImages } from "@/sanity/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);
  // Guardamos el objeto completo para tener las dimensiones y el desenfoque
  const [heroData, setHeroData] = useState<any>(null);

  useEffect(() => {
    const fetchImages = async () => {
      const homeImages = await getHomeImages();
      if (homeImages?.image1) {
        setHeroData(homeImages.image1);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="relative h-svh w-screen overflow-hidden bg-night">
      {/* IMAGEN DE FONDO */}
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{
          opacity: heroData ? 1 : 0, // Solo aparece cuando tenemos la data
          scale: isHovered ? 1.02 : 1,
          filter: isHovered
            ? "invert(1) hue-rotate(180deg)"
            : "invert(0) hue-rotate(0deg)",
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        {heroData && (
          <Image
            // Aplicamos los parámetros de Sanity directamente en el src
            src={`${heroData.url}?w=1920&q=90&auto=format`}
            alt="Sergio Melendez Hero"
            fill
            className="object-cover object-center"
            priority // Esto le dice al navegador: "Bájala antes que nada"
            sizes="100vw"
            // Si añadiste lqip en la query, puedes usar placeholder="blur"
            placeholder={heroData.metadata?.lqip ? "blur" : "empty"}
            blurDataURL={heroData.metadata?.lqip}
          />
        )}
      </motion.div>

      {/* NOMBRE CENTRADO CON HOVER */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
        <Link href="/gallery" className="pointer-events-auto">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
            className="text-3xl sm:text-4xl md:text-5xl font-medium italic tracking-[0.2em] sm:tracking-[0.25em] text-white cursor-pointer mix-blend-difference select-none px-4 text-center"
            style={{
              fontFamily: "Roboto, sans-serif",
              textShadow:
                "0 2px 10px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 0, 0, 0.7)",
              filter: "drop-shadow(0 0 10px rgba(255, 255, 255, 0.3))",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onTouchStart={() => setIsHovered(true)}
            onTouchEnd={() => setIsHovered(false)}
          >
            Sergio Melendez
          </motion.h1>
        </Link>
      </div>
    </div>
  );
}
