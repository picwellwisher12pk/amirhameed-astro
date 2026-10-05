import { PARTICLE_CONFIG, DEFAULT_IMAGE_LAYOUTS, getImageLayout, saveSettingsToStorage } from "./config";

export interface GizmoState {
  studioActive: boolean;
  studioGizmoVisible: boolean;
  selectedImageIdx: number;
  studioManualMorph: number | null;
  activeImageAspects: number[];
  switchMode: (m: number) => void;
}

export function updateGizmoPosition(
  state: GizmoState,
  screenW: number,
  screenH: number,
): void {
  const gizmo = document.getElementById("particle-placement-gizmo");
  if (!gizmo || !state.studioActive || !state.studioGizmoVisible) return;

  const layout = getImageLayout(state.selectedImageIdx);
  const aspect = state.activeImageAspects[state.selectedImageIdx] || 1.0;
  const size = screenH * layout.scale;
  const drawW = size * aspect;
  const drawH = size;
  const centerX = screenW * layout.alignX;
  const centerY = screenH * layout.alignY;

  const left = centerX - drawW / 2;
  const top = centerY - drawH / 2;

  gizmo.style.left = `${left}px`;
  gizmo.style.top = `${top}px`;
  gizmo.style.width = `${drawW}px`;
  gizmo.style.height = `${drawH}px`;

  const label = document.getElementById("gizmo-label");
  const coords = document.getElementById("gizmo-coords");
  if (label) label.textContent = `Image ${state.selectedImageIdx + 1}`;
  if (coords) {
    coords.textContent = `X: ${(layout.alignX * 100).toFixed(1)}% Y: ${(layout.alignY * 100).toFixed(1)}% S: ${layout.scale.toFixed(2)}x`;
  }
}

export function setupGizmoInteractions(
  state: GizmoState,
  onResetMouse: () => void,
): void {
  const gizmo = document.getElementById("particle-placement-gizmo");
  if (!gizmo) return;

  let isDragging = false;
  let isScaling = false;
  let startX = 0;
  let startY = 0;
  let startAlignX = 0;
  let startAlignY = 0;
  let startScale = 1.0;
  let startDist = 0;

  gizmo.addEventListener("pointerdown", (e) => {
    e.stopPropagation();
    e.preventDefault();

    const target = e.target as HTMLElement;
    const layout = getImageLayout(state.selectedImageIdx);
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    onResetMouse();

    if (target.classList.contains("gizmo-handle")) {
      isScaling = true;
      startX = e.clientX;
      startY = e.clientY;
      startScale = layout.scale;
      const cx = screenW * layout.alignX;
      const cy = screenH * layout.alignY;
      startDist = Math.hypot(e.clientX - cx, e.clientY - cy);
    } else {
      isDragging = true;
      startX = e.clientX;
      startY = e.clientY;
      startAlignX = layout.alignX;
      startAlignY = layout.alignY;
    }

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
  });

  function onPointerMove(e: PointerEvent) {
    const layout = getImageLayout(state.selectedImageIdx);
    const screenW = window.innerWidth;
    const screenH = window.innerHeight;

    if (isDragging) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      layout.alignX = Math.max(0.02, Math.min(0.98, startAlignX + dx / screenW));
      layout.alignY = Math.max(0.02, Math.min(0.98, startAlignY + dy / screenH));
      updateGizmoPosition(state, screenW, screenH);
      window.dispatchEvent(
        new CustomEvent("particle-studio:layout-updated", {
          detail: { idx: state.selectedImageIdx, layout },
        }),
      );
    } else if (isScaling) {
      const cx = screenW * layout.alignX;
      const cy = screenH * layout.alignY;
      const curDist = Math.hypot(e.clientX - cx, e.clientY - cy);
      const ratio = curDist / Math.max(10, startDist);
      layout.scale = Math.max(0.2, Math.min(2.5, startScale * ratio));
      updateGizmoPosition(state, screenW, screenH);
      window.dispatchEvent(
        new CustomEvent("particle-studio:layout-updated", {
          detail: { idx: state.selectedImageIdx, layout },
        }),
      );
    }
  }

  function onPointerUp() {
    if (isDragging || isScaling) {
      saveSettingsToStorage();
    }
    isDragging = false;
    isScaling = false;
    window.removeEventListener("pointermove", onPointerMove);
    window.removeEventListener("pointerup", onPointerUp);
  }
}

export function registerLuxuryParticleStudioApi(state: GizmoState): void {
  (window as any).LuxuryParticleStudio = {
    getConfig: () => PARTICLE_CONFIG,
    switchMode: (m: number) => state.switchMode(m),
    setMorphStyle: (s: number) => {
      PARTICLE_CONFIG.morphStyle = s;
    },
    setMorphProgress: (pct: number | null) => {
      state.studioManualMorph = pct !== null ? pct / 100 : null;
    },
    testMorphAnimation: (durationMs = 3000) => {
      const start = performance.now();
      function animStep(now: number) {
        const elapsed = now - start;
        const progress = Math.min(1.0, elapsed / durationMs);
        const t = progress <= 0.5 ? progress * 2 : (1.0 - progress) * 2;
        state.studioManualMorph = t;
        window.dispatchEvent(
          new CustomEvent("particle-studio:morph-updated", {
            detail: { pct: t * 100 },
          }),
        );
        if (progress < 1.0) {
          requestAnimationFrame(animStep);
        } else {
          state.studioManualMorph = null;
          window.dispatchEvent(
            new CustomEvent("particle-studio:morph-updated", {
              detail: { pct: 0 },
            }),
          );
        }
      }
      requestAnimationFrame(animStep);
    },
    setPhysics: (intensity: number, speed: number, radius: number) => {
      PARTICLE_CONFIG.effectIntensity = intensity;
      PARTICLE_CONFIG.effectSpeed = speed;
      PARTICLE_CONFIG.cursorRadius = radius;
    },
    selectImageTab: (idx: number) => {
      state.selectedImageIdx = idx;
      updateGizmoPosition(state, window.innerWidth, window.innerHeight);
    },
    setLayout: (
      idx: number,
      scale: number,
      alignX: number,
      alignY: number,
    ) => {
      const layout = getImageLayout(idx);
      layout.scale = scale;
      layout.alignX = alignX;
      layout.alignY = alignY;
      updateGizmoPosition(state, window.innerWidth, window.innerHeight);
      saveSettingsToStorage();
    },
    getLayout: (idx: number) => getImageLayout(idx),
    toggleGizmo: (visible: boolean) => {
      state.studioGizmoVisible = visible;
      state.studioActive = visible;
      const gizmo = document.getElementById("particle-placement-gizmo");
      if (gizmo) {
        if (visible) {
          gizmo.classList.remove("hidden");
          updateGizmoPosition(state, window.innerWidth, window.innerHeight);
        } else {
          gizmo.classList.add("hidden");
        }
      }
    },
    triggerRandomMode: () => {
      const current = PARTICLE_CONFIG.interactiveMode;
      let next = Math.floor(Math.random() * 8) + 1;
      if (next === current) next = (current % 8) + 1;
      state.switchMode(next);
      return next;
    },
    lockCurrentMode: () => {
      const mode = PARTICLE_CONFIG.interactiveMode;
      localStorage.setItem("luxury_particle_locked_mode", String(mode));
      PARTICLE_CONFIG.isRandomMode = false;
      saveSettingsToStorage();
      return mode;
    },
    getCurrentMode: () => PARTICLE_CONFIG.interactiveMode,
    isRandomMode: () => PARTICLE_CONFIG.isRandomMode,
    isLocked: () => !!localStorage.getItem("luxury_particle_locked_mode"),
    resetDefaults: () => {
      localStorage.removeItem("luxury_particle_layouts");
      localStorage.removeItem("luxury_particle_mode");
      localStorage.removeItem("luxury_particle_locked_mode");
      PARTICLE_CONFIG.imageLayouts = JSON.parse(
        JSON.stringify(DEFAULT_IMAGE_LAYOUTS),
      );
      PARTICLE_CONFIG.interactiveMode = 1;
      PARTICLE_CONFIG.morphStyle = 1;
      updateGizmoPosition(state, window.innerWidth, window.innerHeight);
    },
    saveSettings: () => saveSettingsToStorage(),
  };
}
