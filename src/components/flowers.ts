import * as THREE from "three";
import { terrainWidth, terrainDepth, terrainChunks } from "./terrain";

const flowers: THREE.Sprite[] = []; // Массив для хранения цветов
const flowerCount = 15000; // Количество цветов на сцене
let flowerScale: number[] = []; // Массив для хранения масштаба каждого цветка

export const getFlowers = (scene: THREE.Scene) => {
  const loader = new THREE.TextureLoader();
  loader.load(
    "/pool_summer.png",
    (flowerTexture) => {
      flowerTexture.wrapS = flowerTexture.wrapT = THREE.RepeatWrapping;
      flowerTexture.repeat.set(terrainWidth / 10, terrainDepth / 10);

      const tilesHoriz = 8;
      const tilesVert = 7;
      const tileWidth = 1 / tilesHoriz;
      const tileHeight = 1 / tilesVert;

      const grassRows = [4, 5];
      const grassTileIndices: number[] = [];

      for (const row of grassRows) {
        for (let col = 0; col < tilesHoriz; col++) {
          const tileIndex = row * tilesHoriz + col;
          grassTileIndices.push(tileIndex);
        }
      }

      // Создаем цветы и добавляем их на сцену
      for (let i = 0; i < flowerCount; i++) {
        const tileIndex = grassTileIndices[Math.floor(Math.random() * grassTileIndices.length)];
        const offsetX = (tileIndex % tilesHoriz) / tilesHoriz;
        const offsetY = 1 - tileHeight - Math.floor(tileIndex / tilesHoriz) / tilesVert;

        const spriteTexture = flowerTexture.clone();
        spriteTexture.repeat.set(tileWidth, tileHeight);
        spriteTexture.offset.set(offsetX, offsetY);
        spriteTexture.needsUpdate = true;

        const spriteMaterial = new THREE.SpriteMaterial({
          map: spriteTexture,
          transparent: true,
        });

        const sprite = new THREE.Sprite(spriteMaterial);

        const x = (Math.random() - 0.5) * terrainWidth;
        const z = (Math.random() - 0.5) * terrainDepth;

        // Получаем высоту рельефа в данной точке
        const baseHeight = getTerrainHeightAtPoint(x, z);
        const heightOffset = Math.random() * 0.5; // Случайное смещение
        const y = baseHeight + heightOffset;

        sprite.position.set(x, y, z);

        // Сохранение масштаба каждого цветка
        const scale = 0.3 + Math.random() * 0.4;
        sprite.scale.set(scale, scale, scale);

        flowers.push(sprite); // Сохраняем цвет в массив
        flowerScale.push(scale); // Сохранение масштаба для каждого цветка
        scene.add(sprite);
      }
    },
    undefined,
    (error) => {
      console.error("Ошибка при загрузке текстуры:", error);
    }
  );
};

// Функция для обновления цветов
export const updateFlowers = (camera: THREE.Camera) => {
  const cameraZ = camera.position.z;

  // Перебираем все цветы
  for (let i = 0; i < flowers.length; i++) {
    const flower = flowers[i];

    // Если цветок позади камеры (последние по Z)...
    if (flower.position.z + flowerScale[i] < cameraZ) {
      // Находим последнюю позицию по Z
      const farthestZ = Math.max(...flowers.map((f) => f.position.z));

      // Перемещаем цветок на конец
      flower.position.z = farthestZ + flowerScale[i]; // Увеличиваем Z на масштаб цветка

      // Переопределяем высоту цветка
      const newBaseHeight = getTerrainHeightAtPoint(flower.position.x, flower.position.z);
      const newHeightOffset = Math.random() * 0.5;
      //   flower.position.y = newBaseHeight + newHeightOffset;
    }
  }
};

// Обновленная функция получения высоты рельефа в точке
export function getTerrainHeightAtPoint(x: number, z: number): number {
  const chunkIndex = Math.floor(-z / (terrainWidth / terrainChunks.length));

  if (chunkIndex < 0 || chunkIndex >= terrainChunks.length) {
    return 0;
  }

  const chunk = terrainChunks[chunkIndex].geometry.attributes.position.array;

  const position = new THREE.Vector3();
  const localX = x + (chunkIndex * terrainWidth) / 2;
  const localZ = z; // Корректировка местоположения оси z

  let closestDistance = Infinity;
  let height = 0;

  for (let i = 0; i < chunk.length / 3; i++) {
    const vx = chunk[i * 3];
    const vy = chunk[i * 3 + 1];
    const vz = chunk[i * 3 + 2];

    const dx = localX - vx;
    const dz = localZ - vz;
    const distanceSquared = dx * dx + dz * dz;

    if (distanceSquared < closestDistance) {
      closestDistance = distanceSquared;
      height = vy;
    }
  }

  return height;
}
