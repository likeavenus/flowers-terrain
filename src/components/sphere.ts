import * as THREE from "three";

import vertexShader from "../shaders/Sphere/vertex.glsl";
import fragmentShader from "../shaders/Sphere/fragment.glsl";

// Вершинный шейдер с реализацией шума Перлина
// const vertexShader = `
// uniform float u_time;
// uniform float u_noiseScale;
// uniform float u_displacement;
// varying vec3 vNormal;

// // Упрощенная реализация шума Перлина для GLSL
// vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
// vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
// vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
// vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

// float noise(vec3 v) {
//     const vec2 C = vec2(1.0/6.0, 1.0/3.0);
//     const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

//     vec3 i  = floor(v + dot(v, C.yyy));
//     vec3 x0 = v - i + dot(i, C.xxx);

//     vec3 g = step(x0.yzx, x0.xyz);
//     vec3 l = 1.0 - g;
//     vec3 i1 = min(g.xyz, l.zxy);
//     vec3 i2 = max(g.xyz, l.zxy);

//     vec3 x1 = x0 - i1 + C.xxx;
//     vec3 x2 = x0 - i2 + C.yyy;
//     vec3 x3 = x0 - D.yyy;

//     i = mod289(i);
//     vec4 p = permute(permute(permute(
//              i.z + vec4(0.0, i1.z, i2.z, 1.0))
//            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
//            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

//     float n_ = 0.142857142857;
//     vec3  ns = n_ * D.wyz - D.xzx;

//     vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

//     vec4 x_ = floor(j * ns.z);
//     vec4 y_ = floor(j - 7.0 * x_);

//     vec4 x = x_ * ns.x + ns.yyyy;
//     vec4 y = y_ * ns.x + ns.yyyy;
//     vec4 h = 1.0 - abs(x) - abs(y);

//     vec4 b0 = vec4(x.xy, y.xy);
//     vec4 b1 = vec4(x.zw, y.zw);

//     vec4 s0 = floor(b0)*2.0 + 1.0;
//     vec4 s1 = floor(b1)*2.0 + 1.0;
//     vec4 sh = -step(h, vec4(0.0));

//     vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
//     vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

//     vec3 p0 = vec3(a0.xy,h.x);
//     vec3 p1 = vec3(a0.zw,h.y);
//     vec3 p2 = vec3(a1.xy,h.z);
//     vec3 p3 = vec3(a1.zw,h.w);

//     vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
//     p0 *= norm.x;
//     p1 *= norm.y;
//     p2 *= norm.z;
//     p3 *= norm.w;

//     vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
//     m = m * m;
//     return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1),
//                           dot(p2,x2), dot(p3,x3)));
// }

// void main() {
//     vec3 pos = position;

//     float noiseValue = noise(vec3(
//         pos.x * u_noiseScale,
//         pos.y * u_noiseScale,
//         pos.z * u_noiseScale
//     ));

//     vec3 displacedPosition = position + normal * (noiseValue) * u_displacement;

//     // Пересчитываем нормаль после смещения
//     vec3 newNormal = normalize(normal + noiseValue * 0.5);
//     vNormal = newNormal; // Передаем нормаль во фрагментный шейдер

//     gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPosition, 1.0);
// }
// `;
// const vertexShader = `
// // attribute vec3 position;
// uniform float u_time;
// uniform float u_noiseScale;
// uniform float u_displacement;
// varying vec3 vNormal;

// void main() {

//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }

// `;
// const fragmentShader = `
// varying vec3 vNormal; // Соответствующее объявление во фрагментном шейдере

// void main() {
//     vec3 lightDir = normalize(vec3(0.5, 0.8, 0.2));
//     float diff = max(dot(vNormal, lightDir), 0.0);
//     vec3 color = vec3(0.2, 0.5, 1.0) * (diff + 0.2);

//     gl_FragColor = vec4(color, 1.0);
// }
// `;

export const createSphere = (scene: THREE.Scene) => {
  // Параметры сферы
  const radius = 70;
  const widthSegments = 128;
  const heightSegments = 64;

  // Создаем геометрию и материал
  const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_time: { value: 0 },
      u_noiseScale: { value: 0.5 },
      u_displacement: { value: 10.0 },
    },
    wireframe: false,
  });

  // Создаем меш и добавляем в сцену
  const sphere = new THREE.Mesh(geometry, material);
  scene.add(sphere);

  return sphere;
};
