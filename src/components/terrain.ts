export const getTerrain = (scene: THREE.Scene) => {
  // Создаем геометрию плоскости

  // Поворачиваем плоскость, чтобы она была горизонтальна
  terrainGeometry.rotateX(-Math.PI / 2);

  // Смещаем вершины для создания холмов
  const positionAttribute = terrainGeometry.attributes.position as THREE.BufferAttribute;
  const vertex = new THREE.Vector3();

  for (let i = 0; i < positionAttribute.count; i++) {
    vertex.fromBufferAttribute(positionAttribute, i);

    // Простая функция шума (можно заменить на шум Перлина для более реалистичного эффекта)
    const height = Math.sin(vertex.x * 0.2) * Math.cos(vertex.z * 0.2);

    vertex.y = height;

    positionAttribute.setXYZ(i, vertex.x, vertex.y, vertex.z);
  }

  // Пересчитываем нормали
  terrainGeometry.computeVertexNormals();

  // Создаем материал и меш

  const terrain = new THREE.Mesh(terrainGeometry, terrainMaterial);
  scene.add(terrain);
};

// const terrainChunks: THREE.Mesh[] = [];
// const chunkSize = 100;
// const numChunks = 5;

// export function createTerrain(scene: THREE.Scene) {
//   // Создаем чанки
//   for (let i = 0; i < numChunks; i++) {
//     const chunkGeometry = terrainGeometry.clone();

//     const chunkMaterial = terrainMaterial.clone();
//     const chunkMesh = new THREE.Mesh(chunkGeometry, chunkMaterial);

//     chunkMesh.position.z = -i * chunkSize;

//     terrainChunks.push(chunkMesh);
//     scene.add(chunkMesh);
//   }
// }

// // Функция для обновления чанков
// export function updateTerrain(camera: THREE.Camera) {
//   for (const chunk of terrainChunks) {
//     // Если чанк позади камеры, перемещаем его вперед
//     if (chunk.position.z - chunkSize / 2 > camera.position.z) {
//       chunk.position.z -= numChunks * chunkSize;
//     }
//   }
// }
import * as THREE from "three";

// Параметры рельефа
export const terrainWidth = 100;
export const terrainDepth = 100;
export const terrainResolution = 100;
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

// Экспортируем функцию создания рельефа
export function createTerrain(scene: THREE.Scene) {
  // Создаем чанки
  for (let i = 0; i < numChunks; i++) {
    // Клонируем базовую геометрию для каждого чанка
    const chunkGeometry = terrainGeometry.clone();

    // Смещаем вершины для создания холмов
    const positionAttribute = chunkGeometry.attributes.position as THREE.BufferAttribute;
    const vertex = new THREE.Vector3();

    for (let j = 0; j < positionAttribute.count; j++) {
      vertex.fromBufferAttribute(positionAttribute, j);

      // Смещаем позицию по координате Z в зависимости от номера чанка
      const worldZ = vertex.z + i * chunkSize;

      // Простая функция шума (можно заменить на шум Перлина)
      const height = Math.sin(vertex.x * 0.2) * Math.cos(worldZ * 0.2);

      vertex.y = height;

      positionAttribute.setXYZ(j, vertex.x, vertex.y, vertex.z);
    }

    // Пересчитываем нормали
    chunkGeometry.computeVertexNormals();

    // Создаем меш для чанка
    const chunkMesh = new THREE.Mesh(chunkGeometry, terrainMaterial);

    // Устанавливаем позицию чанка по оси Z
    chunkMesh.position.z = -i * chunkSize;
    chunkMesh.receiveShadow = true;
    // Добавляем чанк в массив и сцену
    terrainChunks.push(chunkMesh);
    scene.add(chunkMesh);
  }
}

// Экспортируем функцию обновления рельефа
export function updateTerrain(camera: THREE.Camera) {
  const cameraZ = camera.position.z;

  for (const chunk of terrainChunks) {
    // Если чанк позади камеры, перемещаем его вперед
    if (chunk.position.z - chunkSize / 2 > cameraZ + chunkSize) {
      // Находим самый дальний чанк впереди (с минимальным значением позиции Z)
      let minZ = Infinity;
      for (const otherChunk of terrainChunks) {
        if (otherChunk.position.z < minZ) {
          minZ = otherChunk.position.z;
        }
      }

      // Перемещаем чанк впереди всех
      chunk.position.z = minZ - chunkSize;

      // Перегенерируем геометрию чанка для нового положения
      regenerateChunkGeometry(chunk, -chunk.position.z);
    }
  }
}

// Функция для перегенерации геометрии чанка
function regenerateChunkGeometry(chunk: THREE.Mesh, offsetZ: number) {
  const chunkGeometry = chunk.geometry as THREE.PlaneGeometry;
  const positionAttribute = chunkGeometry.attributes.position as THREE.BufferAttribute;
  const vertex = new THREE.Vector3();

  for (let j = 0; j < positionAttribute.count; j++) {
    vertex.fromBufferAttribute(positionAttribute, j);

    // Смещаем позицию по координате Z с учетом нового положения чанка
    const worldZ = vertex.z + offsetZ;

    // Простая функция шума (можно заменить на шум Перлина)
    const height = Math.sin(vertex.x * 0.2) * Math.cos(worldZ * 0.2);

    vertex.y = height;

    positionAttribute.setXYZ(j, vertex.x, vertex.y, vertex.z);
  }

  // Пересчитываем нормали
  chunkGeometry.computeVertexNormals();

  // Обновляем атрибуты геометрии
  positionAttribute.needsUpdate = true;
}
