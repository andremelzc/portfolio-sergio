import Image from "next/image";

export default function MinimalistPortfolio() {
  const images = [
    {
      src: "/photo1.jpg",
      alt: "Portrait",
      size: "w-64 h-80",
      pos: "mt-10 ml-20",
    },
    {
      src: "/photo2.jpg",
      alt: "Landscape",
      size: "w-96 h-64",
      pos: "mt-40 ml-auto mr-40",
    },
    {
      src: "/photo3.jpg",
      alt: "Abstract",
      size: "w-72 h-72",
      pos: "-mt-20 ml-60",
    },
    {
      src: "/photo4.jpg",
      alt: "Nature",
      size: "w-80 h-96",
      pos: "ml-auto mr-20 mt-10",
    },
  ];

  return (
    <div className="flex min-h-screen bg-white text-night">
      {/* SIDEBAR NAVIGATION (Fija a la izquierda) */}
      <nav className="fixed left-0 top-0 h-full w-64 p-12 flex flex-col justify-start z-50">
        <h1 className="text-3xl font-semibold mb-16">
          Sergio Melendez
        </h1>

        <ul className="space-y-6 text-sm font-medium text-night tracking-wider">
          <li>
            <a href="#works" className="hover:text-onyx transition-colors">
              Works
            </a>
          </li>
          <li>
            <a href="#about" className="hover:text-onyx transition-colors">
              About
            </a>
          </li>
          <li>
            <a href="#clients" className="hover:text-onyx transition-colors">
              Clients
            </a>
          </li>
          <li>
            <a href="#contact" className="hover:text-onyx transition-colors">
              Contact
            </a>
          </li>
        </ul>
      </nav>

      {/* MAIN CONTENT (Grilla asimétrica) */}
      <main className="ml-64 w-full p-12 relative">
        <div className="flex flex-col">
          {images.map((img, index) => (
            <div
              key={index}
              className={`relative grayscale hover:grayscale-0 transition-all duration-1000 border border-onyx/10 bg-whitesmoke ${img.size} ${img.pos}`}
            >
              <div className="absolute inset-0 flex items-center justify-center text-xs text-silver uppercase tracking-wider font-medium">
                Placeholder {index + 1}
              </div>
              {/* Descomenta esto cuando tengas las imágenes:
              <Image 
                src={img.src} 
                alt={img.alt} 
                fill 
                className="object-cover"
              /> 
              */}
            </div>
          ))}
        </div>
      </main>

      {/* ESTÉTICA DE LÍNEAS SUTILES (Opcional) */}
      <div className="fixed inset-0 pointer-events-none border-[1px] border-onyx/5 m-4" />
    </div>
  );
}
