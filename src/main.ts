import { getFlowers } from "./components/flowers";
import { getTerrain, updateTerrain } from "./components/terrain";
import "./style.css";
import * as THREE from "three";

const canvas = document.querySelector("#canvas") as HTMLCanvasElement;

// Создаем сцену
const scene = new THREE.Scene();

// Настраиваем камеру (PerspectiveCamera)
const camera = new THREE.PerspectiveCamera(
  75, // Поле зрения
  window.innerWidth / window.innerHeight, // Соотношение сторон
  0.1, // Ближняя плоскость отсечения
  1000 // Дальняя плоскость отсечения
);

// Располагаем камеру
camera.position.set(0, 2, 5);
camera.lookAt(new THREE.Vector3(0, 2, -1));

// Настраиваем рендерер
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;

// Обработка изменения размеров окна
window.addEventListener("resize", onWindowResize, false);
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

// createTerrain(scene);
getTerrain(scene);
getFlowers(scene);

// Добавляем свет

// Ambient Light - мягкий фоновой свет
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light - направленный свет (например, Солнце)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 100, 50);
directionalLight.castShadow = true;

// Настройка параметров тени для направленного света
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.left = -100;
directionalLight.shadow.camera.right = 100;
directionalLight.shadow.camera.top = 100;
directionalLight.shadow.camera.bottom = -100;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;

scene.add(directionalLight);

// Добавляем туман
scene.fog = new THREE.Fog(0xcce0ff, 10, 500);

// Устанавливаем цвет фона
renderer.setClearColor(scene.fog.color);

const clock = new THREE.Clock();

// Анимационный цикл
function animate() {
  requestAnimationFrame(animate);

  // Скорость движения камеры (единиц в секунду)
  const speed = 2;

  // Вычисляем время, прошедшее с предыдущего кадра
  const delta = clock.getDelta();
  // Обновляем позицию камеры
  camera.position.z -= speed * delta;

  // Обновляем позицию цели взгляда камеры, если необходимо
  // Например, чтобы камера всегда смотрела вперед
  camera.lookAt(camera.position.x, camera.position.y, camera.position.z - 1);
  updateTerrain(camera);

  renderer.render(scene, camera);
}
animate();
