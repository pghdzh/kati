// 📄 src/components/initCartethyiaBackground.js
import * as THREE from "three";

export default function initCartethyiaBackground(container) {
  // ── 场景基础 ──
  const scene = new THREE.Scene();
  scene.background = null;
  scene.fog = new THREE.FogExp2(0x060810, 0.00008); // 柔化远方

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.set(0, 1.5, 20);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  container.appendChild(renderer.domElement);

  const timer = new THREE.Timer();

  // ── 纹理生成（备用径向渐变） ──
  let particleMap;
  const textureLoader = new THREE.TextureLoader();
  try {
    particleMap = textureLoader.load("/textures/spark1.png");
  } catch (e) {
    const canvas = document.createElement("canvas");
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext("2d");
    const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.3, "rgba(160,212,255,0.95)");
    gradient.addColorStop(0.7, "rgba(160,212,255,0.2)");
    gradient.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
    particleMap = new THREE.CanvasTexture(canvas);
  }

  // ── 1. 鸢尾光冕（三个光环 + 中心球体） ──
  const crownGroup = new THREE.Group();
  const ringColors = [0xa0d4ff, 0xd4b87a, 0xf0f5fc];
  const ringRadii = [4.5, 3.8, 5.0];
  ringColors.forEach((color, i) => {
    const geometry = new THREE.TorusGeometry(ringRadii[i], 0.08, 64, 180);
    const material = new THREE.MeshStandardMaterial({
      color,
      emissive: color,
      emissiveIntensity: 0.5,
      roughness: 0.3,
      metalness: 0.2,
      transparent: true,
      opacity: 0.7,
    });
    const ring = new THREE.Mesh(geometry, material);
    ring.rotation.x = Math.PI / 2;
    ring.rotation.z = (i * Math.PI) / 3;
    crownGroup.add(ring);
  });

  // 中心光核 (使用 StandardMaterial 支持 emissive)
  const coreGeom = new THREE.SphereGeometry(0.6, 32, 32);
  const coreMat = new THREE.MeshStandardMaterial({
    color: 0xa0d4ff,
    emissive: 0x4477aa,
    emissiveIntensity: 1.2,
    roughness: 0.2,
    metalness: 0.1,
  });
  const core = new THREE.Mesh(coreGeom, coreMat);
  crownGroup.add(core);
  scene.add(crownGroup);

  // ── 2. 海底波动平面（扩大网格范围） ──
  const seaGeom = new THREE.PlaneGeometry(40, 40, 160, 160);
  seaGeom.rotateX(-Math.PI / 2);
  const seaMat = new THREE.MeshStandardMaterial({
    color: 0x0a1220,
    emissive: 0x020810,
    roughness: 0.85,
    metalness: 0.1,
    transparent: true,
    opacity: 0.65,
    wireframe: false,
  });
  const seaPlane = new THREE.Mesh(seaGeom, seaMat);
  seaPlane.position.y = -5;
  scene.add(seaPlane);

  // ── 3. 双生剑形粒子流（更粗更亮） ──
  function createSwordStream(color, angleOffset) {
    const pointsCount = 120;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(pointsCount * 3);
    for (let i = 0; i < pointsCount; i++) {
      const t = i / (pointsCount - 1);
      const y = t * 12 - 6;
      const x = Math.sin(t * Math.PI * 5 + angleOffset) * 1.8;
      const z = Math.cos(t * Math.PI * 3 + angleOffset) * 1.2;
      positions.set([x, y, z], i * 3);
    }
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const material = new THREE.PointsMaterial({
      color,
      size: 0.55, // 加大粒子
      map: particleMap,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      opacity: 0.65,
      transparent: true,
    });
    return new THREE.Points(geometry, material);
  }

  const swordBlue = createSwordStream(0xa0d4ff, 0);
  const swordGold = createSwordStream(0xd4b87a, Math.PI);
  scene.add(swordBlue);
  scene.add(swordGold);

  // ── 4. 上升圣光气泡（数量更多、范围更广、粒子更大） ──
  const bubbleCount = 400;
  const bubbleGeom = new THREE.BufferGeometry();
  const bubblePositions = new Float32Array(bubbleCount * 3);
  const bubbleSpeeds = new Float32Array(bubbleCount);
  const startY = -8;
  for (let i = 0; i < bubbleCount; i++) {
    bubblePositions.set(
      [
        (Math.random() - 0.5) * 20, // 宽域
        startY + Math.random() * 16,
        (Math.random() - 0.5) * 14,
      ],
      i * 3
    );
    bubbleSpeeds[i] = 0.015 + Math.random() * 0.04;
  }
  bubbleGeom.setAttribute(
    "position",
    new THREE.BufferAttribute(bubblePositions, 3)
  );
  const bubbleMat = new THREE.PointsMaterial({
    color: 0xa0d4ff,
    size: 0.35, // 放大
    map: particleMap,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    opacity: 0.55,
    transparent: true,
  });
  const bubbles = new THREE.Points(bubbleGeom, bubbleMat);
  scene.add(bubbles);

  // ── 光照 ──
  const ambient = new THREE.AmbientLight(0x334466);
  scene.add(ambient);
  const pointLight = new THREE.PointLight(0xaaccff, 25, 30);
  pointLight.position.set(3, 4, 6);
  scene.add(pointLight);
  // 补充一盏反向灯
  const backLight = new THREE.PointLight(0x55aacc, 15, 25);
  backLight.position.set(-3, -1, -5);
  scene.add(backLight);

  // ── 动画循环 ──
  let animationId;
  function animate() {
    animationId = requestAnimationFrame(animate);
    const elapsed = timer.getElapsed();

    // 光冕旋转
    crownGroup.rotation.y += 0.0015;
    crownGroup.rotation.x = Math.sin(elapsed * 0.4) * 0.08;
    crownGroup.rotation.z += 0.001;

    // 剑流摇曳
    swordBlue.rotation.z += 0.0008;
    swordGold.rotation.z -= 0.0008;
    swordBlue.position.y = Math.sin(elapsed * 0.6) * 0.6;
    swordGold.position.y = Math.cos(elapsed * 0.6) * 0.6;

    // 海底波动（减缓速度）
    const positions = seaPlane.geometry.attributes.position.array;
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const baseY = -5;
      positions[i + 2] =
        baseY +
        Math.sin(x * 0.3 + elapsed * 1.2) * 0.9 +
        Math.cos(y * 0.3 + elapsed * 0.8) * 0.7;
    }
    seaPlane.geometry.attributes.position.needsUpdate = true;

    // 气泡上升（减速）
    const bPos = bubbles.geometry.attributes.position.array;
    for (let i = 0; i < bubbleCount; i++) {
      bPos[i * 3 + 1] += bubbleSpeeds[i];
      if (bPos[i * 3 + 1] > 8) {
        bPos[i * 3 + 1] = startY;
        bPos[i * 3] = (Math.random() - 0.5) * 20;
        bPos[i * 3 + 2] = (Math.random() - 0.5) * 14;
      }
    }
    bubbles.geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animate();

  // ── 自适应 ──
  const onResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener("resize", onResize);

  // ── 清理 ──
  return {
    cleanup: () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      container.removeChild(renderer.domElement);
    },
  };
}
