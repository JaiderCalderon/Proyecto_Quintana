/* =========================================================
   Rubrik AI · Escena 3D
   - Hoja de parcial flotante
   - Línea de escaneo luminosa
   - Reacción al mouse
   ========================================================= */

import * as THREE from 'three';

const canvas = document.getElementById('scene-canvas');
const container = canvas.parentElement;

// --- Renderer ---
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
});
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x000000, 0);

// --- Escena y cámara ---
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
camera.position.set(0, 0, 6);

// --- Luces ---
scene.add(new THREE.AmbientLight(0xffffff, 0.55));

const keyLight = new THREE.DirectionalLight(0xaab4ff, 0.9);
keyLight.position.set(3, 4, 5);
scene.add(keyLight);

const rimLight = new THREE.DirectionalLight(0xb066ff, 0.6);
rimLight.position.set(-3, 2, -2);
scene.add(rimLight);

const fillLight = new THREE.PointLight(0x45e6c8, 0.5, 12);
fillLight.position.set(0, -2, 3);
scene.add(fillLight);

// =========================================================
// Hoja de parcial (textura procedural en Canvas 2D)
// =========================================================
function makePaperTexture() {
  const w = 512;
  const h = 720;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');

  // Fondo papel
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, '#f6f4ec');
  grad.addColorStop(1, '#ece8d8');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Header
  ctx.fillStyle = '#1a1d36';
  ctx.font = 'bold 26px "Space Grotesk", sans-serif';
  ctx.fillText('PARCIAL · PROGRAMACIÓN I', 32, 54);

  ctx.fillStyle = '#5a5e7a';
  ctx.font = '13px "Inter", sans-serif';
  ctx.fillText('Estudiante: J. A. Sánchez   ·   Código: A-238', 32, 78);
  ctx.fillText('Tema: JavaScript · Estructuras y funciones', 32, 96);
  ctx.fillText('Fecha: 14/05/2026', 32, 114);

  // Línea separadora
  ctx.strokeStyle = '#bcbcc8';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(32, 128);
  ctx.lineTo(w - 32, 128);
  ctx.stroke();

  // Líneas guía
  ctx.strokeStyle = 'rgba(150,160,200,0.22)';
  for (let y = 150; y < h - 30; y += 30) {
    ctx.beginPath();
    ctx.moveTo(32, y);
    ctx.lineTo(w - 32, y);
    ctx.stroke();
  }

  // Helper · trazos manuscritos
  const drawHandwriting = (xStart, yStart, segments, color = '#1f2750') => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    let x = xStart;
    for (let i = 0; i < segments; i++) {
      const len = 26 + Math.random() * 44;
      const dip = (Math.random() - 0.5) * 10;
      ctx.beginPath();
      ctx.moveTo(x, yStart);
      ctx.bezierCurveTo(
        x + len * 0.3, yStart + dip,
        x + len * 0.7, yStart - dip,
        x + len, yStart
      );
      ctx.stroke();
      x += len + 6;
      if (x > w - 50) break;
    }
  };

  // Helper · línea de código manuscrita (monoespaciada azulada)
  const drawCodeLine = (x, y, text, color = '#1f2750') => {
    ctx.fillStyle = color;
    ctx.font = '15px "JetBrains Mono", "Courier New", monospace';
    ctx.fillText(text, x, y);
  };

  // ===== Pregunta 1 =====
  ctx.fillStyle = '#1a1d36';
  ctx.font = 'bold 15px "Inter", sans-serif';
  ctx.fillText('1. Explique la diferencia entre  let, const  y  var', 32, 158);
  drawHandwriting(50, 188, 9);
  drawHandwriting(50, 218, 7);

  // Check verde P1
  ctx.strokeStyle = '#3fbf86';
  ctx.lineWidth = 4.5;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(w - 78, 200);
  ctx.lineTo(w - 62, 218);
  ctx.lineTo(w - 42, 188);
  ctx.stroke();

  // ===== Pregunta 2 =====
  ctx.fillStyle = '#1a1d36';
  ctx.font = 'bold 15px "Inter", sans-serif';
  ctx.fillText('2. Implemente una función factorial recursiva', 32, 262);

  // "Código manuscrito"
  drawCodeLine(50, 292, 'function factorial(n) {');
  drawCodeLine(70, 320, 'if (n <= 1) return 1;');
  drawCodeLine(70, 348, 'return n * factorial(n - 1);');
  drawCodeLine(50, 376, '}');

  // Resaltado verde claro detrás del código (sintaxis correcta)
  ctx.fillStyle = 'rgba(80, 200, 140, 0.12)';
  ctx.fillRect(44, 278, w - 86, 110);

  // Check verde P2
  ctx.strokeStyle = '#3fbf86';
  ctx.lineWidth = 4.5;
  ctx.beginPath();
  ctx.moveTo(w - 78, 320);
  ctx.lineTo(w - 62, 338);
  ctx.lineTo(w - 42, 308);
  ctx.stroke();

  // ===== Pregunta 3 (con marca de revisión) =====
  ctx.fillStyle = '#1a1d36';
  ctx.font = 'bold 15px "Inter", sans-serif';
  ctx.fillText('3. ¿Qué es la complejidad  O(n²)  ? Justifique.', 32, 432);
  drawHandwriting(50, 462, 8);
  drawHandwriting(50, 492, 6);
  drawHandwriting(50, 522, 4);

  // Resaltado naranja sobre P3 (falta justificación)
  ctx.fillStyle = 'rgba(255, 170, 70, 0.18)';
  ctx.fillRect(28, 444, w - 56, 100);

  ctx.strokeStyle = 'rgba(255, 150, 60, 0.85)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([6, 4]);
  ctx.strokeRect(28, 444, w - 56, 100);
  ctx.setLineDash([]);

  // Marca "?" en margen
  ctx.fillStyle = '#d57418';
  ctx.font = 'bold 30px "Space Grotesk", sans-serif';
  ctx.fillText('?', w - 52, 500);

  // ===== Pregunta 4 (vacía / parcial) =====
  ctx.fillStyle = '#1a1d36';
  ctx.font = 'bold 15px "Inter", sans-serif';
  ctx.fillText('4. Diferencias entre arreglo y objeto', 32, 588);
  drawHandwriting(50, 618, 7);

  // ===== Pie · nota =====
  ctx.fillStyle = '#1a1d36';
  ctx.font = 'bold 17px "Space Grotesk", sans-serif';
  ctx.fillText('Nota sugerida:', 32, h - 46);
  ctx.fillStyle = '#6d7bff';
  ctx.font = 'bold 20px "Space Grotesk", sans-serif';
  ctx.fillText('4.2 / 5.0', 162, h - 45);

  // Firma manuscrita
  ctx.strokeStyle = '#222a5a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(w - 160, h - 50);
  ctx.bezierCurveTo(w - 130, h - 70, w - 100, h - 30, w - 70, h - 50);
  ctx.bezierCurveTo(w - 50, h - 60, w - 40, h - 40, w - 30, h - 55);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(c);
  texture.anisotropy = 8;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// --- Group raíz para inclinar y mover la hoja completa ---
const paperGroup = new THREE.Group();
scene.add(paperGroup);

// --- Hoja (plano con dos caras) ---
const paperGeo = new THREE.PlaneGeometry(2.6, 3.65, 32, 32);
const paperTexture = makePaperTexture();

const paperMat = new THREE.MeshStandardMaterial({
  map: paperTexture,
  side: THREE.DoubleSide,
  roughness: 0.85,
  metalness: 0.05,
});

const paper = new THREE.Mesh(paperGeo, paperMat);
paperGroup.add(paper);

// --- Sombra/halo detrás de la hoja ---
const haloGeo = new THREE.PlaneGeometry(4.2, 5.2);
const haloMat = new THREE.MeshBasicMaterial({
  color: 0x7c5cff,
  transparent: true,
  opacity: 0.18,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const halo = new THREE.Mesh(haloGeo, haloMat);
halo.position.z = -0.4;
paperGroup.add(halo);

// --- Borde luminoso (segundo plano un pelín más grande) ---
const edgeGeo = new THREE.PlaneGeometry(2.66, 3.71);
const edgeMat = new THREE.MeshBasicMaterial({
  color: 0x6d7bff,
  transparent: true,
  opacity: 0.25,
  side: THREE.DoubleSide,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const edge = new THREE.Mesh(edgeGeo, edgeMat);
edge.position.z = -0.01;
paperGroup.add(edge);

// =========================================================
// Línea de escaneo
// =========================================================
const scanGeo = new THREE.PlaneGeometry(2.8, 0.08);
const scanMat = new THREE.MeshBasicMaterial({
  color: 0x9eaeff,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const scanLine = new THREE.Mesh(scanGeo, scanMat);
scanLine.position.z = 0.03;
paperGroup.add(scanLine);

// Resplandor de la línea (más ancho, más difuso)
const scanGlowGeo = new THREE.PlaneGeometry(3.2, 0.6);
const scanGlowMat = new THREE.MeshBasicMaterial({
  color: 0x7c5cff,
  transparent: true,
  opacity: 0.25,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const scanGlow = new THREE.Mesh(scanGlowGeo, scanGlowMat);
scanGlow.position.z = 0.025;
paperGroup.add(scanGlow);

// =========================================================
// Partículas flotantes alrededor
// =========================================================
const particleCount = 80;
const particleGeo = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3]     = (Math.random() - 0.5) * 8;
  positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
  positions[i * 3 + 2] = (Math.random() - 0.5) * 4 - 1;
}
particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMat = new THREE.PointsMaterial({
  color: 0x9eaeff,
  size: 0.025,
  transparent: true,
  opacity: 0.7,
  blending: THREE.AdditiveBlending,
  depthWrite: false,
});
const particles = new THREE.Points(particleGeo, particleMat);
scene.add(particles);

// =========================================================
// Resize
// =========================================================
function resize() {
  const w = container.clientWidth;
  const h = container.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
resize();
window.addEventListener('resize', resize);

// =========================================================
// Interacción del mouse (suave, con lerp)
// =========================================================
const mouse = { x: 0, y: 0 };
const target = { x: 0, y: 0 };

container.addEventListener('mousemove', (e) => {
  const rect = container.getBoundingClientRect();
  mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
});

container.addEventListener('mouseleave', () => {
  mouse.x = 0;
  mouse.y = 0;
});

// =========================================================
// Loop de animación
// =========================================================
const clock = new THREE.Clock();

function animate() {
  const t = clock.getElapsedTime();

  // Lerp del mouse para suavidad
  target.x += (mouse.x - target.x) * 0.06;
  target.y += (mouse.y - target.y) * 0.06;

  // Hoja: rotación base lenta + influencia del mouse
  paperGroup.rotation.y = target.x * 0.6 + Math.sin(t * 0.4) * 0.08;
  paperGroup.rotation.x = -target.y * 0.4 + Math.sin(t * 0.3) * 0.05;

  // Pequeña traslación vertical (flotante)
  paperGroup.position.y = Math.sin(t * 0.8) * 0.08;
  paperGroup.position.x = Math.sin(t * 0.5) * 0.05;

  // Línea de escaneo: barrido vertical
  const scanProgress = (Math.sin(t * 0.7) + 1) / 2; // 0 .. 1
  const scanY = 1.6 - scanProgress * 3.2;
  scanLine.position.y = scanY;
  scanGlow.position.y = scanY;

  // Pulso del halo
  halo.material.opacity = 0.14 + Math.sin(t * 1.2) * 0.05;

  // Partículas: rotación lenta
  particles.rotation.y = t * 0.04;
  particles.rotation.x = Math.sin(t * 0.2) * 0.1;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();
