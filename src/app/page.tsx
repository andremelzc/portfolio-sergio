"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getHomeImages } from "@/sanity/lib/api";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  const [isHovered, setIsHovered] = useState(false);

  // Iniciamos con tu imagen de fallback por defecto
  const [heroImage, setHeroImage] = useState("/EXAMPLE_IMAGE3.jpg");

  // Traemos la imagen de Sanity al cargar la página
  useEffect(() => {
    const fetchImages = async () => {
      const homeImages = await getHomeImages();
      if (homeImages?.image1) {
        setHeroImage(homeImages.image1);
      }
    };
    fetchImages();
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* IMAGEN DE FONDO */}
      <motion.div
        className="absolute inset-0"
        animate={{
          filter: isHovered
            ? "invert(1) hue-rotate(180deg)"
            : "invert(0) hue-rotate(0deg)",
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{
          duration: 0.6,
          ease: "easeInOut",
        }}
      >
        <Image
          src={heroImage} // ¡Ahora sí usa la variable!
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
        <Link href="/gallery" className="pointer-events-auto">
          <h1
            className="text-4xl font-medium italic tracking-[0.25em] text-white cursor-pointer mix-blend-difference select-none"
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
        </Link>
      </div>
    </div>
  );
}
