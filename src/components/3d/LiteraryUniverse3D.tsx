import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

interface LiteraryUniverse3DProps {
  interactive?: boolean;
}

export function LiteraryUniverse3D({ interactive = true }: LiteraryUniverse3DProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglSupported, setWebglSupported] = useState(true);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Check WebGL availability
    try {
      const testCanvas = document.createElement("canvas");
      const gl =
        testCanvas.getContext("webgl") ||
        testCanvas.getContext("experimental-webgl");
      if (!gl) {
        setWebglSupported(false);
        return;
      }
    } catch {
      setWebglSupported(false);
      return;
    }

    let animationFrameId: number;
    const width = container.clientWidth;
    const height = container.clientHeight;
    const isMobile = window.innerWidth < 768;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.set(0, 0.4, isMobile ? 8.2 : 6.8);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isMobile,
      powerPreference: "high-performance",
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.25 : 1.75));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // Main 3D Book & Literary Artifact Group
    const literaryGroup = new THREE.Group();
    // Offset slightly right on larger screens to harmonize with the hero text on the left
    literaryGroup.position.set(isMobile ? 0 : 1.4, 0, 0);
    scene.add(literaryGroup);

    // --- 1. PROCEDURAL 3D OPEN MANUSCRIPT / BOOK ---
    const bookGroup = new THREE.Group();
    bookGroup.rotation.x = 0.55; // tilted forward for view
    bookGroup.rotation.y = -0.35;
    literaryGroup.add(bookGroup);

    // A. Hardcover Binding (Rich Burgundy / Leather Finish)
    const coverGeo = new THREE.BoxGeometry(3.6, 0.12, 2.5);
    const coverMat = new THREE.MeshPhysicalMaterial({
      color: 0x6e101d,
      roughness: 0.35,
      metalness: 0.1,
      clearcoat: 0.4,
      clearcoatRoughness: 0.2,
    });
    const coverMesh = new THREE.Mesh(coverGeo, coverMat);
    coverMesh.position.y = -0.1;
    bookGroup.add(coverMesh);

    // Spine Trim (Antique Brass / Gold)
    const spineTrimGeo = new THREE.CylinderGeometry(0.12, 0.12, 2.52, 16);
    const spineTrimMat = new THREE.MeshStandardMaterial({
      color: 0xd97706,
      roughness: 0.25,
      metalness: 0.85,
    });
    const spineTrim = new THREE.Mesh(spineTrimGeo, spineTrimMat);
    spineTrim.rotation.x = Math.PI / 2;
    spineTrim.position.set(0, -0.06, 0);
    bookGroup.add(spineTrim);

    // B. Left Parchment Page Block
    const leftPageGeo = new THREE.BoxGeometry(1.65, 0.2, 2.35);
    const pageMat = new THREE.MeshStandardMaterial({
      color: 0xfaf4eb,
      roughness: 0.85,
      metalness: 0.05,
    });
    const leftPage = new THREE.Mesh(leftPageGeo, pageMat);
    leftPage.position.set(-0.86, 0.06, 0);
    leftPage.rotation.z = 0.08;
    bookGroup.add(leftPage);

    // C. Right Parchment Page Block
    const rightPageGeo = new THREE.BoxGeometry(1.65, 0.2, 2.35);
    const rightPage = new THREE.Mesh(rightPageGeo, pageMat);
    rightPage.position.set(0.86, 0.06, 0);
    rightPage.rotation.z = -0.08;
    bookGroup.add(rightPage);

    // D. Fluttering Top Page Sheets (Simulating a breathing manuscript)
    const sheetGeo = new THREE.PlaneGeometry(1.6, 2.3, 12, 12);
    const sheetMat = new THREE.MeshStandardMaterial({
      color: 0xfdfbf7,
      roughness: 0.75,
      side: THREE.DoubleSide,
    });

    const leftSheet = new THREE.Mesh(sheetGeo, sheetMat);
    leftSheet.rotation.x = -Math.PI / 2;
    leftSheet.rotation.y = 0.08;
    leftSheet.position.set(-0.85, 0.18, 0);
    bookGroup.add(leftSheet);

    const rightSheet = new THREE.Mesh(sheetGeo, sheetMat);
    rightSheet.rotation.x = -Math.PI / 2;
    rightSheet.rotation.y = -0.08;
    rightSheet.position.set(0.85, 0.18, 0);
    bookGroup.add(rightSheet);

    // E. Golden Silk Bookmark Ribbon
    const ribbonCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0, 0.2, -1.15),
      new THREE.Vector3(0.05, 0.22, 0),
      new THREE.Vector3(0.12, 0.08, 1.2),
      new THREE.Vector3(0.18, -0.25, 1.6),
    ]);
    const ribbonGeo = new THREE.TubeGeometry(ribbonCurve, 24, 0.04, 8, false);
    const ribbonMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      metalness: 0.7,
      roughness: 0.3,
    });
    const ribbon = new THREE.Mesh(ribbonGeo, ribbonMat);
    bookGroup.add(ribbon);

    // --- 2. FLOATING BENGALI GLYPH ORBS & SATELLITES ---
    // Floating literary tokens orbiting around the manuscript
    const glyphCount = 6;
    const glyphGroup = new THREE.Group();
    literaryGroup.add(glyphGroup);
    const glyphMeshes: THREE.Mesh[] = [];

    const glyphColors = [0xd97706, 0xef4444, 0xf59e0b, 0xb91c1c, 0xfbbf24, 0x991b1b];
    for (let i = 0; i < glyphCount; i++) {
      // Create glowing pill tokens
      const tokenGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 24);
      const tokenMat = new THREE.MeshStandardMaterial({
        color: glyphColors[i % glyphColors.length],
        emissive: glyphColors[i % glyphColors.length],
        emissiveIntensity: 0.45,
        roughness: 0.2,
        metalness: 0.6,
      });
      const tokenMesh = new THREE.Mesh(tokenGeo, tokenMat);
      tokenMesh.rotation.x = Math.PI / 3;
      glyphMeshes.push(tokenMesh);
      glyphGroup.add(tokenMesh);
    }

    // --- 3. AMBIENT INK & CANDLELIGHT PARTICLES ---
    const particleCount = isMobile ? 220 : 600;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleColors = new Float32Array(particleCount * 3);

    const goldColor = new THREE.Color(0xf59e0b);
    const crimsonColor = new THREE.Color(0xef4444);
    const parchmentColor = new THREE.Color(0xfef3c7);

    for (let i = 0; i < particleCount; i++) {
      const radius = 1.8 + Math.random() * 5.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      particlePositions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      particlePositions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      particlePositions[i * 3 + 2] = radius * Math.cos(phi);

      const mix = Math.random();
      const mixed =
        mix < 0.4
          ? goldColor.clone().lerp(crimsonColor, mix * 2.5)
          : goldColor.clone().lerp(parchmentColor, (mix - 0.4) * 1.6);

      particleColors[i * 3] = mixed.r;
      particleColors[i * 3 + 1] = mixed.g;
      particleColors[i * 3 + 2] = mixed.b;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3));
    particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

    const particleMat = new THREE.PointsMaterial({
      size: isMobile ? 0.04 : 0.035,
      vertexColors: true,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    literaryGroup.add(particles);

    // --- 4. LIGHTING ---
    // Warm ambient library light
    const ambientLight = new THREE.AmbientLight(0xfff8ed, 0.85);
    scene.add(ambientLight);

    // Golden candlelight key light
    const candleLight = new THREE.PointLight(0xf59e0b, 2.8, 18);
    candleLight.position.set(3, 4, 4);
    scene.add(candleLight);

    // Crimson rim light for book binding definition
    const rimLight = new THREE.PointLight(0xb91c1c, 2.0, 16);
    rimLight.position.set(-4, -2, 2);
    scene.add(rimLight);

    // Cursor interactive point light
    const cursorLight = new THREE.PointLight(0xffedd5, 1.8, 10);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);

    // --- 5. INTERACTION & PARALLAX ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let scrollY = 0;
    let targetScrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouseX = x;
      targetMouseY = y;
    };

    const handleScroll = () => {
      targetScrollY = window.scrollY || document.documentElement.scrollTop;
    };

    if (interactive && !prefersReducedMotion) {
      window.addEventListener("mousemove", handleMouseMove, { passive: true });
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // --- 6. RENDER LOOP ---
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Smooth cursor lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;
      scrollY += (targetScrollY - scrollY) * 0.05;

      if (!prefersReducedMotion) {
        // Subtle floating bob for the book
        bookGroup.position.y = Math.sin(elapsed * 1.1) * 0.12;
        bookGroup.rotation.y = -0.35 + mouseX * 0.45;
        bookGroup.rotation.x = 0.55 - mouseY * 0.35;
        bookGroup.rotation.z = Math.sin(elapsed * 0.7) * 0.03;

        // Flutter top sheets gently
        leftSheet.rotation.y = 0.08 + Math.sin(elapsed * 2.5) * 0.025;
        rightSheet.rotation.y = -0.08 - Math.cos(elapsed * 2.3) * 0.025;

        // Position orbiting literary glyph tokens
        glyphMeshes.forEach((token, idx) => {
          const orbitRadius = 2.5 + (idx % 2) * 0.6;
          const speed = 0.5 + idx * 0.12;
          const offset = (idx * Math.PI * 2) / glyphCount;
          const angle = elapsed * speed + offset;

          token.position.x = Math.cos(angle) * orbitRadius;
          token.position.y = Math.sin(angle * 1.2) * 0.8;
          token.position.z = Math.sin(angle) * orbitRadius;

          token.rotation.y += 0.8 * delta;
          token.rotation.z += 0.4 * delta;
        });

        // Drift ink/amber particles
        particles.rotation.y = elapsed * 0.04 + mouseX * 0.08;
        particles.rotation.x = elapsed * 0.02 + mouseY * 0.06;

        // Dynamic candlelight follows cursor
        cursorLight.position.x = mouseX * 3.5;
        cursorLight.position.y = mouseY * 3.5;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      // Clean up Three.js resources
      coverGeo.dispose();
      coverMat.dispose();
      spineTrimGeo.dispose();
      spineTrimMat.dispose();
      leftPageGeo.dispose();
      rightPageGeo.dispose();
      pageMat.dispose();
      sheetGeo.dispose();
      sheetMat.dispose();
      ribbonGeo.dispose();
      ribbonMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      glyphMeshes.forEach((g) => {
        g.geometry.dispose();
        (g.material as THREE.Material).dispose();
      });

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [interactive]);

  if (!webglSupported) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full overflow-hidden opacity-90 transition-opacity duration-700"
      aria-hidden="true"
    />
  );
}
