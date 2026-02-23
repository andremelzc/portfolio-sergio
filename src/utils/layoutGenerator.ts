export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface ItemWithPriority {
  index: number;
  isSystem: boolean;
  isProject: boolean;
  naturalWidth?: number;
  naturalHeight?: number;
  isFallback?: boolean;
}

const scaleToFit = (
  naturalWidth: number,
  naturalHeight: number,
  maxSize: number,
  minSize: number,
): { width: number; height: number } => {
  const aspect = naturalWidth / naturalHeight;

  let width: number;
  let height: number;

  if (aspect >= 1) {
    // Horizontal: el ancho es el lado largo
    width = maxSize;
    height = maxSize / aspect;
  } else {
    // Vertical: el alto es el lado largo
    height = maxSize;
    width = maxSize * aspect;
  }

  // Si queda muy pequeño, subimos al mínimo respetando el ratio
  if (width < minSize && height < minSize) {
    if (aspect >= 1) {
      width = minSize;
      height = minSize / aspect;
    } else {
      height = minSize;
      width = minSize * aspect;
    }
  }

  return { width, height };
};

export const generateLayout = (
  itemCount: number,
  items: any[],
): (Position | null)[] => {
  const positions: Position[] = [];

  // --- ESCALA JERÁRQUICA ---
  // El maxSize define el lado más largo; el otro se calcula del aspect ratio
  const systemMaxSize = 200; // About / Contact — presencia clara
  const systemMinSize = 120;

  const projectMaxSize = 170; // Proyectos — un escalón abajo
  const projectMinSize = 100;

  const fillerMaxSize = 130; // Relleno — pequeño, atmosférico
  const fillerMinSize = 80;

  // Tamaños fijos para fallbacks (sin dimensiones naturales)
  const systemFallbackSize = 240;
  const projectFallbackSize = 180;
  const fillerFallbackMin = 80;
  const fillerFallbackMax = 130;

  const padding = 28;
  const edgeMargin = 40;

  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1400;
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 900;

  const itemsWithPriority: ItemWithPriority[] = items.map((item, index) => ({
    index,
    isSystem:
      item.specialType === "about" ||
      item.specialType === "contact" ||
      item.specialType === "info",
    isProject: item.specialType === "project",
    naturalWidth: item.naturalWidth,
    naturalHeight: item.naturalHeight,
    isFallback: item.isFallback,
  }));

  // Primero sistema, luego proyectos, luego relleno
  itemsWithPriority.sort((a, b) => {
    if (a.isSystem && !b.isSystem) return -1;
    if (!a.isSystem && b.isSystem) return 1;
    if (a.isProject && !b.isProject) return -1;
    if (!a.isProject && b.isProject) return 1;
    return 0;
  });

  const placedPositions: (Position | null)[] = new Array(itemCount).fill(null);

  for (const item of itemsWithPriority) {
    const maxAttempts = item.isSystem || item.isProject ? 1500 : 800;
    let placed = false;

    for (let attempts = 0; attempts < maxAttempts; attempts++) {
      let width: number;
      let height: number;

      const hasNaturalDims =
        !item.isFallback && item.naturalWidth && item.naturalHeight;

      if (hasNaturalDims) {
        // ✅ Imagen real: respetamos aspect ratio, acotamos con maxSize
        if (item.isSystem) {
          const scaled = scaleToFit(
            item.naturalWidth!,
            item.naturalHeight!,
            systemMaxSize,
            systemMinSize,
          );
          width = scaled.width;
          height = scaled.height;
        } else if (item.isProject) {
          const scaled = scaleToFit(
            item.naturalWidth!,
            item.naturalHeight!,
            projectMaxSize,
            projectMinSize,
          );
          width = scaled.width;
          height = scaled.height;
        } else {
          const scaled = scaleToFit(
            item.naturalWidth!,
            item.naturalHeight!,
            fillerMaxSize,
            fillerMinSize,
          );
          width = scaled.width;
          height = scaled.height;
        }
      } else {
        // ✅ Fallback: dimensiones fijas
        if (item.isSystem) {
          width = systemFallbackSize;
          height = systemFallbackSize;
        } else if (item.isProject) {
          width = projectFallbackSize;
          height = projectFallbackSize;
        } else {
          width =
            Math.random() * (fillerFallbackMax - fillerFallbackMin) +
            fillerFallbackMin;
          height = width * (0.6 + Math.random() * 0.8);
        }
      }

      const x =
        edgeMargin +
        Math.random() * (viewportWidth - width - padding - edgeMargin * 2);
      const y =
        edgeMargin +
        Math.random() * (viewportHeight - height - padding - edgeMargin * 2);
      const rotation = (Math.random() - 0.5) * 8;

      const newPos: Position = { x, y, width, height, rotation };

      const overlapping = positions.some(
        (pos) =>
          !(
            newPos.x + newPos.width + padding < pos.x ||
            newPos.x > pos.x + pos.width + padding ||
            newPos.y + newPos.height + padding < pos.y ||
            newPos.y > pos.y + pos.height + padding
          ),
      );

      if (!overlapping) {
        positions.push(newPos);
        placedPositions[item.index] = newPos;
        placed = true;
        break;
      }
    }

    if (!placed) {
      console.warn(`Item ${item.index} no pudo ser colocado sin overlap.`);
    }
  }

  return placedPositions;
};
