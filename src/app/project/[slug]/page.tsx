import { getProjectBySlug } from "@/sanity/lib/api";
import ProjectTemplate from "@/components/ProjectTemplate";
import { notFound } from "next/navigation";

// Definimos la interfaz para los props de la página
interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProjectPage({ params }: Props) {
  // 1. Esperamos a que los params se resuelvan (Requisito de Next.js 15+)
  const { slug } = await params;

  // 2. Llamamos a tu función de Sanity usando el slug
  const project = await getProjectBySlug(slug);

  // 3. Si Sanity no devuelve nada, lanzamos el 404
  if (!project) {
    notFound();
  }

  // 4. Pasamos los datos al componente de cliente que diseñamos
  return <ProjectTemplate project={project} />;
}
