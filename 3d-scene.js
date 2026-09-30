import * as THREE from "./assets/three.module.js";

const visual = document.querySelector(".hero-visual");
const canvas = document.querySelector("#hero-3d");

if (!visual || !canvas) {
  throw new Error("The homepage 3D scene requires its hero canvas.");
}

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const motionTargets = document.querySelectorAll(
  ".hero-copy > *, .contact-strip > *, .section-title-wrap, .mini-brand-card, .tech-bubble, .tech-list-item, .service-card, .digital-device, .industry-item, .work-card, .journey-node, .metric-box, .why-item, .eco-node, .eco-center, .cta-copy, .cta-visual",
);

if (reducedMotion || !("IntersectionObserver" in window)) {
  motionTargets.forEach((target) => target.classList.add("motion-revealed"));
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    if (entries.some((entry) => entry.isIntersecting)) {
      document.documentElement.classList.add("motion-enabled");
    }

    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("motion-revealed");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -36px 0px" });

  motionTargets.forEach((target, index) => {
    target.classList.add("motion-reveal");
    target.style.setProperty("--motion-delay", `${(index % 4) * 70}ms`);
    revealObserver.observe(target);
  });
}

try {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.setClearColor(0x000000, 0);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 40);
  camera.position.set(0, 0, 8);

  scene.add(new THREE.AmbientLight(0xd9efff, 2.1));

  const keyLight = new THREE.DirectionalLight(0x9edcff, 3.4);
  keyLight.position.set(-3, 5, 6);
  scene.add(keyLight);

  const blueLight = new THREE.PointLight(0x3199ff, 30, 11);
  blueLight.position.set(2.8, -1.4, 2.4);
  scene.add(blueLight);

  const roseLight = new THREE.PointLight(0xffa6cf, 16, 9);
  roseLight.position.set(-3, -1.2, -1.5);
  scene.add(roseLight);

  const core = new THREE.Group();
  scene.add(core);

  const coreSphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.03, 64, 48),
    new THREE.MeshPhysicalMaterial({
      color: 0x0867c8,
      emissive: 0x073b7c,
      emissiveIntensity: 0.52,
      metalness: 0.46,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
    }),
  );
  core.add(coreSphere);

  const coreShell = new THREE.Mesh(
    new THREE.SphereGeometry(1.08, 48, 32),
    new THREE.MeshPhysicalMaterial({
      color: 0x8ddaff,
      transparent: true,
      opacity: 0.2,
      roughness: 0.08,
      metalness: 0.14,
      transmission: 0.34,
      thickness: 0.45,
      clearcoat: 1,
      side: THREE.DoubleSide,
      depthWrite: false,
    }),
  );
  core.add(coreShell);

  const coreRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.27, 0.018, 10, 128),
    new THREE.MeshBasicMaterial({ color: 0x8de5ff, transparent: true, opacity: 0.78 }),
  );
  coreRing.rotation.set(0.8, 0.2, -0.35);
  core.add(coreRing);

  const innerCore = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.3, 1),
    new THREE.MeshPhysicalMaterial({
      color: 0xc7f0ff,
      emissive: 0x2485e6,
      emissiveIntensity: 0.55,
      metalness: 0.4,
      roughness: 0.16,
      clearcoat: 1,
    }),
  );
  core.add(innerCore);

  const textureLoader = new THREE.TextureLoader();
  const brandOrbs = [
    { source: "assets/couple image.jpg", radius: 0.66, position: [-1.55, 1.18, 0.12], color: 0xffa6d0, phase: 0.2 },
    { source: "assets/Real Estate Image.jpg", radius: 0.7, position: [1.58, 1.08, -0.24], color: 0x79caff, phase: 2.1 },
    { source: "assets/Leather Image.png", radius: 0.69, position: [1.65, -1.27, 0.3], color: 0xe7bd88, phase: 4.2 },
  ].map((spec) => {
    const group = new THREE.Group();
    group.position.set(...spec.position);
    scene.add(group);

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(spec.radius, 56, 40),
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.28,
        metalness: 0.12,
        clearcoat: 0.88,
        clearcoatRoughness: 0.16,
      }),
    );
    group.add(sphere);

    const glassRim = new THREE.Mesh(
      new THREE.TorusGeometry(spec.radius * 1.035, 0.018, 8, 96),
      new THREE.MeshBasicMaterial({ color: spec.color, transparent: true, opacity: 0.78 }),
    );
    glassRim.rotation.set(0.52, 0.3, -0.2);
    group.add(glassRim);

    textureLoader.load(spec.source, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
      sphere.material.map = texture;
      sphere.material.needsUpdate = true;
    });

    return { group, phase: spec.phase, baseY: spec.position[1] };
  });

  const orbitSpecs = [
    { color: 0x7ed4ff, tilt: [0.7, 0.1, 0.35], speed: 0.18, size: 0.15 },
    { color: 0xffaad4, tilt: [-0.75, 0.25, -0.45], speed: -0.14, size: 0.13 },
    { color: 0xf5d49a, tilt: [0.15, 0.85, 0.5], speed: 0.11, size: 0.12 },
  ];

  const orbits = orbitSpecs.map((spec) => {
    const orbit = new THREE.Group();
    orbit.rotation.set(...spec.tilt);
    scene.add(orbit);

    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.012, 8, 144),
      new THREE.MeshBasicMaterial({ color: spec.color, transparent: true, opacity: 0.48 }),
    );
    orbit.add(ring);

    const satellite = new THREE.Mesh(
      new THREE.SphereGeometry(spec.size, 24, 24),
      new THREE.MeshPhysicalMaterial({
        color: spec.color,
        emissive: spec.color,
        emissiveIntensity: 0.28,
        metalness: 0.24,
        roughness: 0.18,
        clearcoat: 1,
      }),
    );
    satellite.position.x = 2.2;
    orbit.add(satellite);

    return { orbit, speed: spec.speed };
  });

  const particlePositions = new Float32Array(210);
  for (let index = 0; index < particlePositions.length; index += 3) {
    const angle = Math.random() * Math.PI * 2;
    const radius = 2.5 + Math.random() * 0.85;
    particlePositions[index] = Math.cos(angle) * radius;
    particlePositions[index + 1] = (Math.random() - 0.5) * 5.5;
    particlePositions[index + 2] = (Math.random() - 0.5) * 2.8;
  }

  const particleGeometry = new THREE.BufferGeometry();
  particleGeometry.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
  const particles = new THREE.Points(
    particleGeometry,
    new THREE.PointsMaterial({ color: 0x7fcaff, size: 0.025, transparent: true, opacity: 0.66 }),
  );
  scene.add(particles);

  let visible = true;
  let pointerX = 0;
  let pointerY = 0;
  const clock = new THREE.Clock();

  const resize = () => {
    const bounds = visual.getBoundingClientRect();
    if (!bounds.width || !bounds.height) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.setSize(bounds.width, bounds.height, false);
    camera.aspect = bounds.width / bounds.height;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };

  const observer = new ResizeObserver(resize);
  observer.observe(visual);
  window.addEventListener("resize", resize);

  visual.addEventListener("pointermove", (event) => {
    const bounds = visual.getBoundingClientRect();
    pointerX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 0.16;
    pointerY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 0.12;
  });
  visual.addEventListener("pointerleave", () => {
    pointerX = 0;
    pointerY = 0;
  });

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) renderer.render(scene, camera);
  });
  visibilityObserver.observe(visual);

  visual.classList.add("is-3d-ready");
  resize();

  const animate = () => {
    if (!visible || document.hidden) {
      requestAnimationFrame(animate);
      return;
    }

    const elapsed = clock.getElapsedTime();
    if (!reducedMotion) {
      core.rotation.y = elapsed * 0.12 + pointerX;
      core.rotation.x = Math.sin(elapsed * 0.24) * 0.06 + pointerY;
      core.position.y = Math.sin(elapsed * 0.55) * 0.06;
      innerCore.rotation.y = -elapsed * 0.32;
      innerCore.rotation.x = elapsed * 0.2;
      brandOrbs.forEach(({ group, phase, baseY }) => {
        group.rotation.y = elapsed * 0.06 + phase;
        group.position.y = baseY + Math.sin(elapsed * 0.7 + phase) * 0.08;
      });
      particles.rotation.y = elapsed * 0.012;
      for (const { orbit, speed } of orbits) orbit.rotation.y += speed * 0.008;
    }
    renderer.render(scene, camera);
    if (!reducedMotion) requestAnimationFrame(animate);
  };

  if (reducedMotion) {
    renderer.render(scene, camera);
  } else {
    animate();
  }
} catch (error) {
  console.warn("The 3D hero is unavailable; showing its static fallback.", error);
}
