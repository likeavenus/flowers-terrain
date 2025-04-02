import { getFlowers, updateFlowers } from "./components/flowers";
import { createSphere } from "./components/sphere";
import { createTerrain, getTerrain, updateTerrain } from "./components/terrain";
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
camera.position.set(0, 50, -180);
camera.lookAt(new THREE.Vector3(0, 70, -2));

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
// getTerrain(scene);
// getFlowers(scene);

// Добавляем свет

// Ambient Light - мягкий фоновой свет
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light - направленный свет (например, Солнце)
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(50, 100, 50);

scene.add(directionalLight);

// Добавляем туман
scene.fog = new THREE.Fog(0xcce0ff, 10, 500);

// Устанавливаем цвет фона
renderer.setClearColor(scene.fog.color);

const clock = new THREE.Clock();
const sphereMaterial = createSphere(scene);

// Анимационный цикл
function animate() {
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();
  // Скорость движения камеры (единиц в секунду)
  const speed = 15;

  // Вычисляем время, прошедшее с предыдущего кадра
  const delta = clock.getDelta();
  sphereMaterial.material.uniforms.u_time.value = elapsedTime;
  sphereMaterial.rotateX(-delta * 0.05);

  // Обновляем позицию камеры
  // camera.position.z += speed * delta;

  renderer.render(scene, camera);
}
animate();
