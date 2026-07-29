(function() {
  if (typeof THREE === 'undefined') return;

  const container = document.getElementById('hero-3d-container');
  if (!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 100);
  camera.position.z = 8;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  container.appendChild(renderer.domElement);

  const colors = [
    0x8b5cf6, 0xec4899, 0x06b6d4, 0x22c55e,
    0xf59e0b, 0xef4444, 0x6366f1, 0x14b8a6
  ];

  const geometries = [
    new THREE.BoxGeometry(1.2, 1.4, 0.2),
    new THREE.CylinderGeometry(0.6, 0.6, 1, 32),
    new THREE.TorusGeometry(0.6, 0.2, 16, 32),
    new THREE.IcosahedronGeometry(0.7, 0),
    new THREE.TorusKnotGeometry(0.5, 0.15, 64, 8),
    new THREE.ConeGeometry(0.7, 1.2, 32),
    new THREE.OctahedronGeometry(0.7, 0),
    new THREE.SphereGeometry(0.6, 24, 24)
  ];

  const meshes = [];
  const total = 28;
  const spread = 6;

  for (let i = 0; i < total; i++) {
    const geo = geometries[i % geometries.length];
    const color = colors[i % colors.length];
    const mat = new THREE.MeshPhysicalMaterial({
      color: color,
      metalness: 0.1,
      roughness: 0.2,
      clearcoat: 0.3,
      clearcoatRoughness: 0.25,
      transparent: true,
      opacity: 0.7,
      emissive: color,
      emissiveIntensity: 0.05
    });
    const mesh = new THREE.Mesh(geo, mat);

    const angle = (i / total) * Math.PI * 2;
    const radius = 2 + Math.random() * 2.5;
    mesh.position.set(
      Math.cos(angle) * radius + (Math.random() - 0.5) * 1.5,
      (Math.random() - 0.5) * 3,
      Math.sin(angle) * radius * 0.6 - 2
    );

    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    mesh.userData = {
      speed: 0.2 + Math.random() * 0.4,
      rotSpeed: { x: (Math.random() - 0.5) * 0.02, y: (Math.random() - 0.5) * 0.02, z: (Math.random() - 0.5) * 0.02 },
      floatOffset: Math.random() * Math.PI * 2,
      floatSpeed: 0.3 + Math.random() * 0.4,
      floatAmp: 0.1 + Math.random() * 0.15,
      orbitAngle: angle,
      orbitRadius: radius,
      orbitSpeed: 0.1 + Math.random() * 0.15
    };
    scene.add(mesh);
    meshes.push(mesh);
  }

  const particleCount = 800;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleSizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    particlePos[i * 3] = (Math.random() - 0.5) * 20;
    particlePos[i * 3 + 1] = (Math.random() - 0.5) * 15;
    particlePos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    particleSizes[i] = Math.random() * 3 + 1;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
  particleGeo.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));

  const particleMat = new THREE.PointsMaterial({
    color: 0x8b5cf6,
    size: 0.03,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  let mouseX = 0, mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  function animate(time) {
    requestAnimationFrame(animate);
    const t = time * 0.001;

    meshes.forEach((mesh, i) => {
      const d = mesh.userData;
      mesh.rotation.x += d.rotSpeed.x;
      mesh.rotation.y += d.rotSpeed.y;
      mesh.rotation.z += d.rotSpeed.z;

      mesh.position.y += Math.sin(t * d.floatSpeed + d.floatOffset) * 0.002;

      d.orbitAngle += d.orbitSpeed * 0.008;
      mesh.position.x = Math.cos(d.orbitAngle) * d.orbitRadius + Math.sin(t * 0.3 + i) * 0.3;
      mesh.position.z = Math.sin(d.orbitAngle) * d.orbitRadius * 0.6 - 2 + Math.cos(t * 0.3 + i) * 0.3;
    });

    particles.rotation.y = t * 0.015;
    particles.rotation.x = Math.sin(t * 0.01) * 0.1;

    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 0.3 - camera.position.y) * 0.03;
    camera.lookAt(0, 0, -1);

    renderer.render(scene, camera);
  }

  animate(0);

  let resizeTimeout;
  function onResize() {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    }, 100);
  }
  window.addEventListener('resize', onResize);
})();
