import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const Hero3DCanvas: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x08090C, 0.035);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 18;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);

    // Group for mouse parallax tilt
    const parallaxGroup = new THREE.Group();
    scene.add(parallaxGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0xa855f7, 5, 50);
    purpleLight.position.set(-6, 5, 8);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, 4, 40);
    cyanLight.position.set(8, -4, 6);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x10b981, 3, 30);
    emeraldLight.position.set(0, -6, 5);
    scene.add(emeraldLight);

    // Materials
    const glassTorusMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x9333ea,
      emissive: 0x3b0764,
      emissiveIntensity: 0.35,
      roughness: 0.1,
      metalness: 0.15,
      transmission: 0.85,
      ior: 1.5,
      thickness: 1.2,
      specularIntensity: 1.0,
      transparent: true,
      opacity: 0.88,
    });

    const glassRingMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: 0x083344,
      emissiveIntensity: 0.3,
      roughness: 0.15,
      metalness: 0.2,
      transmission: 0.9,
      ior: 1.45,
      transparent: true,
      opacity: 0.82,
    });

    const emeraldGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: 0x064e3b,
      emissiveIntensity: 0.4,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.8,
      transparent: true,
      opacity: 0.85,
    });

    // 1. Primary Hero Torus (Floating Purple/Magenta Ring)
    const torusGeo = new THREE.TorusGeometry(3.6, 0.75, 32, 100);
    const mainTorus = new THREE.Mesh(torusGeo, glassTorusMaterial);
    mainTorus.position.set(5.5, 0.5, -2);
    mainTorus.rotation.set(0.6, 0.4, 0.2);
    parallaxGroup.add(mainTorus);

    // 2. Secondary Inner Torus
    const innerTorusGeo = new THREE.TorusGeometry(2.1, 0.4, 24, 80);
    const innerTorus = new THREE.Mesh(innerTorusGeo, glassRingMaterial);
    innerTorus.position.set(5.5, 0.5, -1.5);
    innerTorus.rotation.set(-0.5, 0.8, 0.4);
    parallaxGroup.add(innerTorus);

    // 3. Small Floating Emerald Accent Torus
    const smallTorusGeo = new THREE.TorusGeometry(1.2, 0.25, 20, 60);
    const smallTorus = new THREE.Mesh(smallTorusGeo, emeraldGlassMaterial);
    smallTorus.position.set(-6, -2.5, 2);
    smallTorus.rotation.set(0.8, -0.3, 0.5);
    parallaxGroup.add(smallTorus);

    // 4. Floating Glass Torus Knot / Orb
    const knotGeo = new THREE.TorusKnotGeometry(1.1, 0.3, 80, 16, 2, 3);
    const glassKnot = new THREE.Mesh(knotGeo, glassTorusMaterial);
    glassKnot.position.set(-5.5, 3, -1);
    parallaxGroup.add(glassKnot);

    // 5. Constellation Network: Nodes & Lines representing connected university alumni
    const nodeCount = 35;
    const nodeGeometry = new THREE.SphereGeometry(0.12, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0xc084fc });
    const nodes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 26,
        (Math.random() - 0.5) * 16,
        (Math.random() - 0.5) * 10 - 2
      );
      mesh.position.copy(pos);
      nodes.push(mesh);
      nodePositions.push(pos);
      parallaxGroup.add(mesh);
    }

    // Connect close nodes with lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x6b21a8,
      transparent: true,
      opacity: 0.35,
    });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 5.5) {
          linePositions.push(
            nodePositions[i].x, nodePositions[i].y, nodePositions[i].z,
            nodePositions[j].x, nodePositions[j].y, nodePositions[j].z
          );
        }
      }
    }
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const networkLines = new THREE.LineSegments(lineGeometry, lineMaterial);
    parallaxGroup.add(networkLines);

    // 6. Glowing background star particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 200;
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 40;
      particlePos[i + 1] = (Math.random() - 0.5) * 30;
      particlePos[i + 2] = (Math.random() - 0.5) * 20 - 5;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xe9d5ff,
      size: 0.08,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;
      mouseX = (x / width) * 2 - 1;
      mouseY = -(y / height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Window resize handler
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse parallax interpolation
      targetX += (mouseX - targetX) * 0.04;
      targetY += (mouseY - targetY) * 0.04;

      parallaxGroup.rotation.y = targetX * 0.35;
      parallaxGroup.rotation.x = -targetY * 0.25;

      // Gentle continuous floating spring animation
      mainTorus.rotation.x += 0.004;
      mainTorus.rotation.y += 0.007;
      mainTorus.position.y = 0.5 + Math.sin(elapsedTime * 1.2) * 0.35;

      innerTorus.rotation.x -= 0.006;
      innerTorus.rotation.z += 0.005;
      innerTorus.position.y = 0.5 + Math.cos(elapsedTime * 1.4) * 0.25;

      smallTorus.rotation.x += 0.009;
      smallTorus.rotation.y += 0.01;
      smallTorus.position.y = -2.5 + Math.sin(elapsedTime * 1.5 + 1) * 0.28;

      glassKnot.rotation.y += 0.008;
      glassKnot.rotation.z += 0.005;
      glassKnot.position.y = 3 + Math.cos(elapsedTime * 1.1) * 0.3;

      // Subtle particle drift
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      torusGeo.dispose();
      innerTorusGeo.dispose();
      smallTorusGeo.dispose();
      knotGeo.dispose();
      glassTorusMaterial.dispose();
      glassRingMaterial.dispose();
      emeraldGlassMaterial.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      style={{ opacity: 0.95 }}
    />
  );
};
