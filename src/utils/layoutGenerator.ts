export interface Position {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
}

interface ItemWithPriority {
  index: number;
  isSpecial: boolean;
}

export const generateLayout = (
  itemCount: number,
  specialIndices: number[],
): (Position | null)[] => {
  const positions: Position[] = [];

  // CONFIGURACIÓN DE TAMAÑOS
  const minSize = 120;
  const maxSize = 220;
  const specialSize = 320; // Son grandes

  const padding = 15;

  // Fallback seguro para dimensiones
  const viewportWidth =
    typeof window !== "undefined" ? window.innerWidth : 1400;
  const viewportHeight =
    typeof window !== "undefined" ? window.innerHeight : 900;

  const itemsWithPriority: ItemWithPriority[] = [];
  for (let i = 0; i < itemCount; i++) {
    itemsWithPriority.push({
      index: i,
      isSpecial: specialIndices.includes(i),
    });
  }

  // Ordenar: especiales primero
  itemsWithPriority.sort((a, b) => {
    if (a.isSpecial && !b.isSpecial) return -1;
    if (!a.isSpecial && b.isSpecial) return 1;
    return 0;
  });

  // Inicializamos el array con huecos vacíos
  const placedPositions: (Position | null)[] = new Array(itemCount).fill(null);

  for (const item of itemsWithPriority) {
    let attempts = 0;
    const maxAttempts = item.isSpecial ? 500 : 2000;
    let newPos: Position | null = null;
    let overlapping = true;

    // --- INTENTO DE COLOCACIÓN LIMPIA ---
    while (overlapping && attempts < maxAttempts) {
      let width, height;

      if (item.isSpecial) {
        width = specialSize;
        height = specialSize;
      } else {
        width = Math.random() * (maxSize - minSize) + minSize;
        const aspectRatio = 0.7 + Math.random() * 0.6;
        height = width * aspectRatio;
      }

      const x = Math.random() * (viewportWidth - width - padding);
      const y = Math.random() * (viewportHeight - height - padding);
      const rotation = (Math.random() - 0.5) * 6;

      newPos = { x, y, width, height, rotation };

      // Comprobar colisión
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

    // --- DECISIÓN FINAL ---
    if (!overlapping && newPos) {
      // ÉXITO: Encontramos un hueco libre
      positions.push(newPos);
      placedPositions[item.index] = newPos;
    } else if (item.isSpecial) {
      // FALLO PERO ES ESPECIAL: FORZAR COLOCACIÓN
      // Si no hay hueco, la ponemos en el centro o en una posición aleatoria segura
      // ignorando si choca con otras (el z-index la salvará visualmente)
      console.warn(`Forzando posición para item especial ${item.index}`);

      const forcedPos: Position = {
        x: Math.random() * (viewportWidth - specialSize - padding),
        y: Math.random() * (viewportHeight - specialSize - padding),
        width: specialSize,
        height: specialSize,
        rotation: 0,
      };

      positions.push(forcedPos);
      placedPositions[item.index] = forcedPos;
    } else {
      // FALLO Y ES NORMAL: Se queda fuera (para evitar saturación fea)
      // console.log(`Item ${item.index} omitido por falta de espacio`);
    }
  }

  // Filtramos los nulos (las fotos que no cupieron)
  return placedPositions;
};
