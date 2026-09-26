# Holographic & Particle-Based WebGL Effects Reference Guide

A curated collection of live production websites, interactive Three.js/WebGL demos, open-source sandboxes, and tutorials showcasing particle-based holographic effects, 3D point clouds, depth-map displacement, and GPGPU simulations.

---

## 1. Award-Winning Studios & Live Production Websites

### **Lusion**
* **Main Studio:** [https://lusion.co/](https://lusion.co/)
* **Experiments Lab:** [https://labs.lusion.co/](https://labs.lusion.co/)
* **Highlights:**
  * Industry benchmark for real-time WebGL particle simulations, physics, and organic fluid motion.
  * Interactive 3D particle avatars, volumetric point-cloud clouds, and particle dispersion responding to cursor dynamics.

### **Active Theory**
* **Website:** [https://activetheory.net/](https://activetheory.net/)
* **Highlights:**
  * Pioneers in holographic WebGL visuals, cinematic particle field transitions, depth-map projections, and holographic disassembly of text and geometry.

### **Antinomy Studio**
* **Website:** [https://antinomy.studio/](https://antinomy.studio/)
* **Highlights:**
  * Dark luxury aesthetic with high-density gold/iridescent nano-particle constellations that deform and respond to cursor velocity and scroll physics.

### **Makemepulse**
* **Website:** [https://makemepulse.com/](https://makemepulse.com/)
* **Nomadic Tribe Experiment:** [https://nomadictribe.makemepulse.com/](https://nomadictribe.makemepulse.com/)
* **Highlights:**
  * Poetic narrative storytelling with interactive particle shaders, volumetric lighting, and particle disintegrations.

---

## 2. Interactive Sandboxes & Demos (Inspectable Source Code)

### **Codrops: Interactive Particle Image Effects**
* **Live Demo:** [https://tympanus.net/Development/ParticlesEffects/index6.html](https://tympanus.net/Development/ParticlesEffects/index6.html)
* **In-Depth Tutorial & Source:** [https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/](https://tympanus.net/codrops/2019/01/17/interactive-particles-with-three-js/)
* **Technique:**
  * Reads 2D image/logo pixel data onto an HTML5 canvas.
  * Converts pixels into Three.js particle vertices with cursor repulsion physics and elastic spring-back animations.

### **Codrops: GPGPU Particle Morphing with Three.js**
* **Live Demo:** [https://tympanus.net/Development/GPGPUParticles/](https://tympanus.net/Development/GPGPUParticles/)
* **In-Depth Tutorial & Source:** [https://tympanus.net/codrops/2024/01/23/gpgpu-particle-morphing-with-three-js/](https://tympanus.net/codrops/2024/01/23/gpgpu-particle-morphing-with-three-js/)
* **Technique:**
  * Utilizes `GPUComputationRenderer` to simulate millions of particles on the GPU.
  * Smoothly morphs particle positions between multiple 3D models and image coordinates using FBO (Frame Buffer Object) textures.

### **Three.js Official Point Cloud Examples**
* **Points Waves:** [https://threejs.org/examples/?q=points#webgl_points_waves](https://threejs.org/examples/?q=points#webgl_points_waves)
* **Points Dynamic Mesh:** [https://threejs.org/examples/#webgl_points_dynamic](https://threejs.org/examples/#webgl_points_dynamic)
* **Points Billboard Sprites:** [https://threejs.org/examples/#webgl_points_sprites](https://threejs.org/examples/#webgl_points_sprites)
* **Billboard Particles & Depth Attenuation:** [https://threejs.org/examples/#webgl_particles_shapes](https://threejs.org/examples/#webgl_particles_shapes)

---

## 3. Curated CodePens & Shader Experiments

| Project / Concept | Live URL | Core Technique |
| :--- | :--- | :--- |
| **Interactive WebGL Points** | [https://codepen.io/zadvorsky/pen/dMLOeq](https://codepen.io/zadvorsky/pen/dMLOeq) | Vertex shaders with noise displacement & mouse influence |
| **Particle Image Dispersal** | [https://codepen.io/tamani-coding/pen/YzdpMNX](https://codepen.io/tamani-coding/pen/YzdpMNX) | Image brightness sampling mapped to floating point particles |
| **Three.js Depth Displacement Hologram** | [https://codepen.io/al-ro/pen/BaaBvdJ](https://codepen.io/al-ro/pen/BaaBvdJ) | Parallax 3D displacement from grayscale depth maps |
| **Volumetric Hologram Mesh** | [https://codepen.io/prisoner849/pen/wvBEMWN](https://codepen.io/prisoner849/pen/wvBEMWN) | Custom GLSL shader with scanlines and vertex jitter |

---

## 4. Learning Resources, Shaders & Deconstructions

* **Three.js Journey (by Bruno Simon):** [https://threejs-journey.com/](https://threejs-journey.com/)
  * Complete modules covering particles, GPGPU, custom vertex shaders, and morphing geometry.
* **Yuri Artiukh (akella):** [https://www.youtube.com/@akella_cg/videos](https://www.youtube.com/@akella_cg/videos)
  * Live-stream breakdowns of award-winning Awwwards/FWA WebGL particle effects, shaders, and image displacement techniques.
* **Shadertoy GLSL Search:** [https://www.shadertoy.com/](https://www.shadertoy.com/)
  * Recommended search queries: `hologram`, `point cloud`, `particle audio`, `depth displacement`.

---

## 5. Architectural Parallels to `LuxuryCinematicIntro.astro`

The techniques used across these references map directly to the implementation in [LuxuryCinematicIntro.astro](file:///c:/Users/amir/Documents/Projects/Personal/amirhameed-astro/src/components/LuxuryCinematicIntro.astro):

1. **Point Cloud Grid & Image Projection:**
   * Uses high-density WebGL point primitives mapped to image coordinates and brightness thresholds.
2. **Interactive Force Fields (Modes 1–5):**
   * **3D Hologram:** Parallax mouse translation and depth skewing.
   * **Silk Ripple:** 2D wave equation / sine wave displacement on particle Z-coordinates.
   * **Celestial Lantern / Gravity Lens:** Radial distance decay equations repelling and focusing particles around the pointer.
   * **Fluid Wake:** Velocity trail accumulation pushing particles in the direction of cursor movement.
