// import * as THREE from "three";
// import { terrainWidth, terrainDepth, terrainGeometry } from "./terrain";

// export const getFlowers = (scene: THREE.Scene) => {
//   // Загрузка текстуры спрайт-листа
//   const loader = new THREE.TextureLoader();
//   const flowerTexture = loader.load("/pool_summer.png");

//   // Параметры спрайт-листа
//   const tilesHoriz = 8; // количество столбцов в спрайт-листе
//   const tilesVert = 7; // количество строк в спрайт-листе
//   const tileWidth = 1 / tilesHoriz;
//   const tileHeight = 1 / tilesVert;

//   // **Диапазон строк для травы (5 и 6 строки)**:
//   const grassRows = [4, 5]; // индексы строк 5 и 6 (если нумерация с нуля)

//   // **Получаем индексы кадров для этих строк**
//   const grassTileIndices: number[] = [];
//   for (const row of grassRows) {
//     for (let col = 0; col < tilesHoriz; col++) {
//       const tileIndex = row * tilesHoriz + col;
//       grassTileIndices.push(tileIndex);
//     }
//   }

//   // **Увеличиваем количество травы для большей плотности**
//   const flowerCount = 20000; // Увеличили количество травы

//   for (let i = 0; i < flowerCount; i++) {
//     // **Выбираем случайный кадр из доступных для травы**
//     const tileIndex = grassTileIndices[Math.floor(Math.random() * grassTileIndices.length)];

//     // Рассчитываем смещение UV для выбранного кадра
//     const offsetX = (tileIndex % tilesHoriz) / tilesHoriz;
//     const offsetY = 1 - tileHeight - Math.floor(tileIndex / tilesHoriz) / tilesVert;

//     // Создаем копию текстуры для спрайта
//     const spriteTexture = flowerTexture.clone();
//     spriteTexture.repeat.set(tileWidth, tileHeight);
//     spriteTexture.offset.set(offsetX, offsetY);
//     spriteTexture.needsUpdate = true;

//     // Создаем материал спрайта с индивидуальной текстурой
//     const spriteMaterial = new THREE.SpriteMaterial({
//       map: spriteTexture,
//       transparent: true,
//     });

//     const sprite = new THREE.Sprite(spriteMaterial);

//     // **Позиционирование для более плотной травы**
//     // Вместо равномерного распределения, сгруппируем траву
//     const x = (Math.random() - 0.5) * terrainWidth;
//     const z = (Math.random() - 0.5) * terrainDepth;

//     // Получаем высоту рельефа в данной точке
//     const y = getTerrainHeightAtPoint(x, z, terrainGeometry);

//     sprite.position.set(x, y, z);

//     // Задаем случайный масштаб для разнообразия
//     const scale = 0.3 + Math.random() * 0.4; // От 0.3 до 0.7
//     sprite.scale.set(scale, scale, scale);

//     scene.add(sprite);
//   }
// };

// export function getTerrainHeightAtPoint(x: number, z: number, geometry: THREE.BufferGeometry): number {
//   // Так как рельеф представляет собой сетку, мы можем приблизительно определить высоту
//   const position = geometry.attributes.position as THREE.BufferAttribute;
//   const vertices = position.array;

//   let closestDistance = Infinity;
//   let height = 0;

//   for (let i = 0; i < position.count; i++) {
//     const vx = vertices[i * 3];
//     const vy = vertices[i * 3 + 1];
//     const vz = vertices[i * 3 + 2];

//     const dx = x - vx;
//     const dz = z - vz;
//     const distanceSquared = dx * dx + dz * dz;

//     if (distanceSquared < closestDistance) {
//       closestDistance = distanceSquared;
//       height = vy;
//     }
//   }

//   return height;
// }
import * as THREE from "three";
import { terrainWidth, terrainDepth, terrainGeometry } from "./terrain";

export const getFlowers = (scene: THREE.Scene) => {
  // Загрузка текстуры спрайт-листа
  const loader = new THREE.TextureLoader();
  loader.load(
    "/pool_summer.png",
    (flowerTexture) => {
      // Этот код выполняется после полной загрузки текстуры

      flowerTexture.wrapS = flowerTexture.wrapT = THREE.RepeatWrapping;
      flowerTexture.repeat.set(terrainWidth / 10, terrainDepth / 10);

      // Параметры спрайт-листа
      const tilesHoriz = 8; // количество столбцов в спрайт-листе
      const tilesVert = 7; // количество строк в спрайт-листе
      const tileWidth = 1 / tilesHoriz;
      const tileHeight = 1 / tilesVert;

      // **Диапазон строк для травы (5 и 6 строки)**:
      const grassRows = [4, 5]; // индексы строк 5 и 6 (если нумерация с нуля)

      // **Получаем индексы кадров для этих строк**
      const grassTileIndices: number[] = [];
      for (const row of grassRows) {
        for (let col = 0; col < tilesHoriz; col++) {
          const tileIndex = row * tilesHoriz + col;
          grassTileIndices.push(tileIndex);
        }
      }

      // **Увеличиваем количество травы для большей плотности**
      const flowerCount = 15000; // Увеличили количество травы

      for (let i = 0; i < flowerCount; i++) {
        // **Выбираем случайный кадр из доступных для травы**
        const tileIndex = grassTileIndices[Math.floor(Math.random() * grassTileIndices.length)];

        // Рассчитываем смещение UV для выбранного кадра
        const offsetX = (tileIndex % tilesHoriz) / tilesHoriz;
        const offsetY = 1 - tileHeight - Math.floor(tileIndex / tilesHoriz) / tilesVert;

        // Создаем копию текстуры для спрайта
        const spriteTexture = flowerTexture.clone();
        spriteTexture.repeat.set(tileWidth, tileHeight);
        spriteTexture.offset.set(offsetX, offsetY);
        spriteTexture.needsUpdate = true;

        // Создаем материал спрайта с индивидуальной текстурой
        const spriteMaterial = new THREE.SpriteMaterial({
          map: spriteTexture,
          transparent: true,
        });

        // spriteMaterial.map = flowerTexture;
        // spriteMaterial.needsUpdate = true;

        const sprite = new THREE.Sprite(spriteMaterial);

        // **Позиционирование для более плотной травы**
        const x = (Math.random() - 0.5) * terrainWidth;
        const z = (Math.random() - 0.5) * terrainDepth;

        // Получаем высоту рельефа в данной точке
        const y = getTerrainHeightAtPoint(x, z, terrainGeometry);

        sprite.position.set(x, y, z);

        // Задаем случайный масштаб для разнообразия
        const scale = 0.3 + Math.random() * 0.4; // От 0.3 до 0.7
        sprite.scale.set(scale, scale, scale);

        scene.add(sprite);
      }
    },
    undefined,
    (error) => {
      console.error("Ошибка при загрузке текстуры:", error);
    }
  );
};

export function getTerrainHeightAtPoint(x: number, z: number, geometry: THREE.BufferGeometry): number {
  // Так как рельеф представляет собой сетку, мы можем приблизительно определить высоту
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const vertices = position.array;

  let closestDistance = Infinity;
  let height = 0;

  for (let i = 0; i < position.count; i++) {
    const vx = vertices[i * 3];
    const vy = vertices[i * 3 + 1];
    const vz = vertices[i * 3 + 2];

    const dx = x - vx;
    const dz = z - vz;
    const distanceSquared = dx * dx + dz * dz;

    if (distanceSquared < closestDistance) {
      closestDistance = distanceSquared;
      height = vy;
    }
  }

  return height;
}
