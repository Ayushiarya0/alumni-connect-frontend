import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface Hero3DCanvasProps {
  className?: string;
  opacity?: number;
}

export const Hero3DCanvas: React.FC<Hero3DCanvasProps> = ({
  className = '',
  opacity = 0.9,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth || window.innerWidth;
    let height = container.clientHeight || 700;

    // Check theme
    const isDark = document.documentElement.classList.contains('dark');

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.z = 18;
    camera.position.y = 1;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = isDark ? 1.3 : 1.1;
    container.appendChild(renderer.domElement);

    // Group for mouse parallax tilt
    const parallaxGroup = new THREE.Group();
    scene.add(parallaxGroup);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 1.1 : 1.4);
    scene.add(ambientLight);

    const purpleLight = new THREE.PointLight(0xa855f7, isDark ? 6 : 4, 60);
    purpleLight.position.set(-6, 5, 8);
    scene.add(purpleLight);

    const cyanLight = new THREE.PointLight(0x06b6d4, isDark ? 5 : 3.5, 50);
    cyanLight.position.set(8, -4, 6);
    scene.add(cyanLight);

    const emeraldLight = new THREE.PointLight(0x10b981, isDark ? 4 : 3, 40);
    emeraldLight.position.set(0, -6, 5);
    scene.add(emeraldLight);

    // Materials
    const glassTorusMaterial = new THREE.MeshPhysicalMaterial({
      color: isDark ? 0x9333ea : 0x7c3aed,
      emissive: isDark ? 0x3b0764 : 0x2e1065,
      emissiveIntensity: isDark ? 0.45 : 0.25,
      roughness: 0.12,
      metalness: 0.15,
      transmission: 0.85,
      ior: 1.5,
      thickness: 1.2,
      specularIntensity: 1.0,
      transparent: true,
      opacity: isDark ? 0.85 : 0.72,
    });

    const glassRingMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x06b6d4,
      emissive: isDark ? 0x083344 : 0x0e7490,
      emissiveIntensity: isDark ? 0.35 : 0.2,
      roughness: 0.15,
      metalness: 0.2,
      transmission: 0.88,
      ior: 1.45,
      transparent: true,
      opacity: isDark ? 0.8 : 0.65,
    });

    const emeraldGlassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x10b981,
      emissive: isDark ? 0x064e3b : 0x047857,
      emissiveIntensity: isDark ? 0.4 : 0.25,
      roughness: 0.2,
      metalness: 0.1,
      transmission: 0.8,
      transparent: true,
      opacity: isDark ? 0.82 : 0.7,
    });

    // 1. Primary Hero Torus (Floating Purple Ring)
    const torusGeo = new THREE.TorusGeometry(3.6, 0.75, 32, 100);
    const mainTorus = new THREE.Mesh(torusGeo, glassTorusMaterial);
    mainTorus.position.set(6, 0.5, -2);
    mainTorus.rotation.set(0.6, 0.4, 0.2);
    parallaxGroup.add(mainTorus);

    // 2. Secondary Inner Torus
    const innerTorusGeo = new THREE.TorusGeometry(2.1, 0.4, 24, 80);
    const innerTorus = new THREE.Mesh(innerTorusGeo, glassRingMaterial);
    innerTorus.position.set(6, 0.5, -1.5);
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
    const nodeCount = 38;
    const nodeGeometry = new THREE.SphereGeometry(0.13, 16, 16);
    const nodeMaterial = new THREE.MeshBasicMaterial({
      color: isDark ? 0xc084fc : 0x3b82f6,
    });
    const nodes: THREE.Mesh[] = [];
    const nodePositions: THREE.Vector3[] = [];

    for (let i = 0; i < nodeCount; i++) {
      const mesh = new THREE.Mesh(nodeGeometry, nodeMaterial);
      const pos = new THREE.Vector3(
        (Math.random() - 0.5) * 28,
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 12 - 2
      );
      mesh.position.copy(pos);
      nodes.push(mesh);
      nodePositions.push(pos);
      parallaxGroup.add(mesh);
    }

    // Connect close nodes with lines
    const lineMaterial = new THREE.LineBasicMaterial({
      color: isDark ? 0x818cf8 : 0x60a5fa,
      transparent: true,
      opacity: isDark ? 0.38 : 0.28,
    });
    const lineGeometry = new THREE.BufferGeometry();
    const linePositions: number[] = [];

    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = nodePositions[i].distanceTo(nodePositions[j]);
        if (dist < 5.8) {
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

    // 6. Traveling light pulses along network
    const pulseCount = 8;
    const pulseGeometry = new THREE.SphereGeometry(0.08, 12, 12);
    const pulseMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.9,
    });
    const pulseNodes: { mesh: THREE.Mesh; startIdx: number; endIdx: number; progress: number; speed: number }[] = [];

    for (let i = 0; i < pulseCount; i++) {
      const pMesh = new THREE.Mesh(pulseGeometry, pulseMaterial);
      const startIdx = Math.floor(Math.random() * nodeCount);
      let endIdx = (startIdx + 1 + Math.floor(Math.random() * (nodeCount - 1))) % nodeCount;
      parallaxGroup.add(pMesh);
      pulseNodes.push({
        mesh: pMesh,
        startIdx,
        endIdx,
        progress: Math.random(),
        speed: 0.004 + Math.random() * 0.006,
      });
    }

    // 7. Glowing background star particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 220;
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 44;
      particlePos[i + 1] = (Math.random() - 0.5) * 32;
      particlePos[i + 2] = (Math.random() - 0.5) * 22 - 4;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: isDark ? 0xe9d5ff : 0x93c5fd,
      size: 0.09,
      transparent: true,
      opacity: isDark ? 0.65 : 0.45,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse parallax tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const x = event.clientX;
      const y = event.clientY;
      mouseX = (x / window.innerWidth) * 2 - 1;
      mouseY = -(y / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Window resize handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth || window.innerWidth;
      height = container.clientHeight || 700;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
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

      parallaxGroup.rotation.y = targetX * 0.28;
      parallaxGroup.rotation.x = -targetY * 0.2;

      // Gentle continuous floating spring animation
      mainTorus.rotation.x += 0.0035;
      mainTorus.rotation.y += 0.006;
      mainTorus.position.y = 0.5 + Math.sin(elapsedTime * 1.2) * 0.35;

      innerTorus.rotation.x -= 0.005;
      innerTorus.rotation.z += 0.0045;
      innerTorus.position.y = 0.5 + Math.cos(elapsedTime * 1.4) * 0.25;

      smallTorus.rotation.x += 0.008;
      smallTorus.rotation.y += 0.009;
      smallTorus.position.y = -2.5 + Math.sin(elapsedTime * 1.5 + 1) * 0.28;

      glassKnot.rotation.y += 0.007;
      glassKnot.rotation.z += 0.004;
      glassKnot.position.y = 3 + Math.cos(elapsedTime * 1.1) * 0.3;

      // Node breathing pulse
      for (let i = 0; i < nodes.length; i++) {
        const scale = 1 + 0.25 * Math.sin(elapsedTime * 2.2 + i * 0.4);
        nodes[i].scale.set(scale, scale, scale);
      }

      // Traveling light pulses
      for (let i = 0; i < pulseNodes.length; i++) {
        const p = pulseNodes[i];
        p.progress += p.speed;
        if (p.progress > 1) {
          p.progress = 0;
          p.startIdx = Math.floor(Math.random() * nodeCount);
          p.endIdx = (p.startIdx + 1 + Math.floor(Math.random() * (nodeCount - 1))) % nodeCount;
        }
        const vStart = nodePositions[p.startIdx];
        const vEnd = nodePositions[p.endIdx];
        p.mesh.position.lerpVectors(vStart, vEnd, p.progress);
      }

      // Subtle particle drift
      particles.rotation.y = elapsedTime * 0.015;

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
      nodeGeometry.dispose();
      lineGeometry.dispose();
      particleGeo.dispose();
      pulseGeometry.dispose();
      glassTorusMaterial.dispose();
      glassRingMaterial.dispose();
      emeraldGlassMaterial.dispose();
      nodeMaterial.dispose();
      lineMaterial.dispose();
      particleMat.dispose();
      pulseMaterial.dispose();
      scene.clear();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden ${className}`}
      style={{ opacity }}
    />
  );
};
