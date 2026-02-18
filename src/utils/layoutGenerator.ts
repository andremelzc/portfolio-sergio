export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

// Ahora recibimos el item completo, no solo el índice
interface ItemWithPriority {
  index: number;
  isSystem: boolean; // About, Contact
  isProject: boolean; // Proyectos nuevos
  isSpecial: boolean; // Cualquiera de los dos anteriores
}

export const generateLayout = (
  itemCount: number,
  // CAMBIO: Recibimos el array completo de items para ver sus tipos
  items: any[],
): (Position | null)[] => {
  const positions: Position[] = [];

  // --- NUEVAS MEDIDAS (ESCALA REDUCIDA) ---
  const systemSize = 240; // Antes 320 (About/Contact)
  const projectSize = 180; // Nuevo nivel intermedio (Proyectos)

  const minFiller = 80; // Antes 120 (Fotos pequeñas)
  const maxFiller = 140; // Antes 220 (Fotos medianas)

  const padding = 12;
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1400;
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 900;

  // Clasificamos cada item por su importancia
  const itemsWithPriority: ItemWithPriority[] = items.map((item, index) => ({
    index,
    isSystem:
      item.specialType === "about" ||
      item.specialType === "contact" ||
      item.specialType === "info",
    isProject: item.specialType === "project",
    isSpecial: item.type === "special",
  }));

  // ORDEN DE COLOCACIÓN: Primero lo importante, luego el relleno
  itemsWithPriority.sort((a, b) => {
    if (a.isSystem && !b.isSystem) return -1;
    if (!a.isSystem && b.isSystem) return 1;
    if (a.isProject && !b.isProject) return -1;
    if (!a.isProject && b.isProject) return 1;
    return 0;
  });

  const placedPositions: (Position | null)[] = new Array(itemCount).fill(null);

  for (const item of itemsWithPriority) {
    let attempts = 0;
    // Damos más intentos a los importantes
    const maxAttempts = item.isSpecial ? 800 : 1500;
    let newPos: Position | null = null;
    let overlapping = true;

    while (overlapping && attempts < maxAttempts) {
      let width, height;

      if (item.isSystem) {
        // TAMAÑO GRANDE (Pero reducido a 240px)
        width = systemSize;
        height = systemSize;
      } else if (item.isProject) {
        // TAMAÑO MEDIANO (Cuadrado para destacar)
        width = projectSize;
        height = projectSize;
      } else {
        // TAMAÑO PEQUEÑO (Relleno)
        width = Math.random() * (maxFiller - minFiller) + minFiller;
        // Aspect Ratio variado (Vertical/Horizontal)
        height = width * (0.6 + Math.random() * 0.8);
      }

      const x = Math.random() * (viewportWidth - width - padding);
      const y = Math.random() * (viewportHeight - height - padding);
      const rotation = (Math.random() - 0.5) * 8; // Rotación sutil

      newPos = { x, y, width, height, rotation };

      overlapping = positions.some((pos) => {
        return !(
          newPos!.x + newPos!.width + padding < pos.x ||
          newPos!.x > pos.x + pos.width + padding ||
          newPos!.y + newPos!.height + padding < pos.y ||
          newPos!.y > pos.y + pos.height + padding
        );
      });

      attempts++;
    }

    if (!overlapping && newPos) {
      positions.push(newPos);
      placedPositions[item.index] = newPos;
    } else if (item.isSystem || item.isProject) {
      // FUERZA BRUTA: Si es System o Project, se pone SÍ O SÍ.
      const size = item.isSystem ? systemSize : projectSize;

      const forcedPos = {
        x: Math.random() * (viewportWidth - size - padding),
        y: Math.random() * (viewportHeight - size - padding),
        width: size,
        height: size,
        rotation: 0,
      };
      positions.push(forcedPos);
      placedPositions[item.index] = forcedPos;
      console.warn(`Forzando posición para especial: ${item.index}`);
    }
  }

  return placedPositions;
};
