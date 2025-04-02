import * as THREE from "three";
import { ImprovedNoise } from "three/examples/jsm/math/ImprovedNoise.js";

// Параметры рельефа
export const terrainWidth = 1000;
export const terrainDepth = 500;
export const terrainResolution = 1000;
export const chunkSize = 100; // Размер одного чанка
export const numChunks = 5; // Количество чанков

// Экспортируем базовую геометрию рельефа
export const terrainGeometry = new THREE.PlaneGeometry(terrainWidth, terrainDepth, terrainResolution, terrainResolution);

// Поворачиваем плоскость, чтобы она была горизонтальна
terrainGeometry.rotateX(-Math.PI / 2);

// Экспортируем материал рельефа
export const terrainMaterial = new THREE.MeshStandardMaterial({
  color: 0x228b22, // Зеленый цвет травы
  flatShading: true,
});

// Экспортируем массив чанков рельефа
export const terrainChunks: THREE.Mesh[] = [];

// Экспортируем функцию обновления рельефа
// export function updateTerrain(camera: THREE.Camera) {
//   const cameraZ = camera.position.z;

//   for (const chunk of terrainChunks) {
//     // Если чанк позади камеры, перемещаем его вперед
//     if (chunk.position.z - chunkSize / 2 > cameraZ + chunkSize) {
//       // Находим самый дальний чанк впереди (с минимальным значением позиции Z)
//       let minZ = Infinity;
//       for (const otherChunk of terrainChunks) {
//         if (otherChunk.position.z < minZ) {
//           minZ = otherChunk.position.z;
//         }
//       }

//       // Перемещаем чанк впереди всех
//       chunk.position.z = minZ - chunkSize;

//       // Перегенерируем геометрию чанка для нового положения
//       regenerateChunkGeometry(chunk, -chunk.position.z);
//     }
//   }
// }

// Функция для перегенерации геометрии чанка
// function regenerateChunkGeometry(chunk: THREE.Mesh, offsetZ: number) {
//   const chunkGeometry = chunk.geometry as THREE.PlaneGeometry;
//   const positionAttribute = chunkGeometry.attributes.position as THREE.BufferAttribute;
//   const vertex = new THREE.Vector3();

//   for (let j = 0; j < positionAttribute.count; j++) {
//     vertex.fromBufferAttribute(positionAttribute, j);

//     // Смещаем позицию по координате Z с учетом нового положения чанка
//     const worldZ = vertex.z + offsetZ;

//     // Простая функция шума (можно заменить на шум Перлина)
//     const height = Math.sin(vertex.x * 0.2) * Math.cos(worldZ * 0.2);

//     vertex.y = height;

//     positionAttribute.setXYZ(j, vertex.x, vertex.y, vertex.z);
//   }

//   // Пересчитываем нормали
//   chunkGeometry.computeVertexNormals();

//   // Обновляем атрибуты геометрии
//   positionAttribute.needsUpdate = true;
// }
// Параметры для настройки
const VISIBLE_RANGE = 500; // Дистанция перед камерой, где чанки должны оставаться видимыми
const CHUNK_REUSE_OFFSET = 200; // Запас для плавного перехода

export function updateTerrain(camera: THREE.Camera) {
  const cameraZ = camera.position.z;
  let furthestChunkZ = -Infinity;
  let closestChunkZ = Infinity;

  // Находим крайние чанки
  terrainChunks.forEach((chunk) => {
    if (chunk.position.z > furthestChunkZ) furthestChunkZ = chunk.position.z;
    if (chunk.position.z < closestChunkZ) closestChunkZ = chunk.position.z;
  });

  // Проверяем чанки на необходимость перемещения
  terrainChunks.forEach((chunk) => {
    const chunkStartZ = chunk.position.z;
    const chunkEndZ = chunkStartZ + terrainDepth;

    // Если чанк полностью вышел за пределы видимости позади камеры
    if (chunkEndZ < cameraZ - CHUNK_REUSE_OFFSET) {
      // Перемещаем чанк в конец цепочки
      const newPositionZ = furthestChunkZ + terrainDepth;
      chunk.position.z = newPositionZ;

      // Перегенерируем геометрию для новой позиции
      regenerateChunkGeometry(chunk, newPositionZ);

      // Обновляем крайние значения
      furthestChunkZ = newPositionZ;
      closestChunkZ = Math.min(closestChunkZ, newPositionZ);
    }

    // Дополнительная проверка для чанков перед камерой
    if (chunkStartZ > cameraZ + VISIBLE_RANGE) {
      // Перемещаем чанк в начало цепочки
      const newPositionZ = closestChunkZ - terrainDepth;
      chunk.position.z = newPositionZ;

      regenerateChunkGeometry(chunk, newPositionZ);

      closestChunkZ = newPositionZ;
      furthestChunkZ = Math.max(furthestChunkZ, newPositionZ);
    }
  });
}

// Улучшенная функция перегенерации геометрии
function regenerateChunkGeometry(chunk: THREE.Mesh, newPositionZ: number) {
  const noise = new ImprovedNoise();
  const scale = 0.01;
  const geometry = chunk.geometry.clone() as THREE.PlaneGeometry;
  const positionAttribute = geometry.attributes.position as THREE.BufferAttribute;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);

    // Глобальные координаты с учетом позиции чанка
    const worldX = vertex.x;
    const worldZ = vertex.z + newPositionZ;

    // Генерация высоты
    const height = noise.noise(worldX * scale, worldZ * scale, 0) * 50;

    // Сглаживание краев
    const edgeBlend = Math.min(1.0, Math.min(vertex.z / 50.0, (terrainDepth - vertex.z) / 50.0));

    vertex.y = height * edgeBlend;
    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  geometry.computeVertexNormals();
  chunk.geometry = geometry;
}

export const createTerrain = (scene: THREE.Scene) => {
  const noise = new ImprovedNoise();
  const scale = 0.01;
  let lastChunkEndZ = 0; // Отслеживаем конечную позицию предыдущего чанка

  for (let i = 0; i < numChunks; i++) {
    const chunkGeometry = terrainGeometry.clone();
    const positionAttribute = chunkGeometry.attributes.position as THREE.BufferAttribute;
    const vertex = new THREE.Vector3();

    // Рассчитываем смещение для текущего чанка
    const chunkOffsetZ = lastChunkEndZ;

    for (let j = 0; j < positionAttribute.count; j++) {
      vertex.fromBufferAttribute(positionAttribute, j);

      // Глобальная Z-координата с учетом позиции чанка
      const worldZ = vertex.z + chunkOffsetZ;

      // Генерируем высоту с использованием шума Перлина
      const height = noise.noise(vertex.x * scale, worldZ * scale, 0);

      // Добавляем небольшую коррекцию для плавных переходов
      const edgeBlend = Math.min(1.0, vertex.z / 5.0) * Math.min(1.0, (terrainDepth - vertex.z) / 5.0);
      vertex.y = height * edgeBlend;

      positionAttribute.setXYZ(j, vertex.x, vertex.y, vertex.z);
    }

    chunkGeometry.computeVertexNormals();
    const chunkMesh = new THREE.Mesh(chunkGeometry, terrainMaterial);

    // Устанавливаем позицию чанка
    chunkMesh.position.z = chunkOffsetZ;
    chunkMesh.receiveShadow = true;

    terrainChunks.push(chunkMesh);
    scene.add(chunkMesh);

    // Обновляем конечную позицию для следующего чанка
    lastChunkEndZ += terrainDepth;
  }
};
