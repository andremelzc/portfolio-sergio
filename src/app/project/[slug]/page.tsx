"use client";
import { useParams } from "next/navigation";

export default function ProjectPage() {
  const params = useParams();
  return <div className="p-4">Project Page for slug: {params.slug}</div>;
}
