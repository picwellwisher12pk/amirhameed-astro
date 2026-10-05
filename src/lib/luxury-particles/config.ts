export interface ImageLayout {
  scale: number;
  alignX: number;
  alignY: number;
}

export interface ParticleConfig {
  imageLayouts: ImageLayout[];
  interactiveMode: number;
  isRandomMode: boolean;
  effectIntensity: number;
  effectSpeed: number;
  cursorRadius: number;
  repelStrength: number;
  returnSpeed: number;
  dragDamping: number;
  initialOpacity: number;
  settledDimOpacity: number;
  dimTransitionDuration: number;
  introGatherDuration: number;
  elementStaggerDelay: number;
  elementRevealStartDelay: number;
  fixedInViewport: boolean;
  morphPlateau: number;
  morphStyle: number;
  images: string[];
}

export const DEFAULT_IMAGE_LAYOUTS: ImageLayout[] = [
  {
    scale: 1.0936430948476303,
    alignX: 0.7600426894343649,
    alignY: 0.48698481561822127,
  },
  {
    scale: 1.5,
    alignX: 0.7465314834578441,
    alignY: 0.48590021691973967,
  },
  {
    scale: 1.1170019439785475,
    alignX: 0.8046424759871932,
    alignY: 0.4436008676789588,
  },
];

export const PARTICLE_CONFIG: ParticleConfig = {
  imageLayouts: JSON.parse(JSON.stringify(DEFAULT_IMAGE_LAYOUTS)),
  interactiveMode: 1,
  isRandomMode: true,
  effectIntensity: 1.0,
  effectSpeed: 1.0,
  cursorRadius: 140.0,
  repelStrength: 20.0,
  returnSpeed: 0.035,
  dragDamping: 0.9,
  initialOpacity: 0.5,
  settledDimOpacity: 0.5,
  dimTransitionDuration: 1.0,
  introGatherDuration: 2600,
  elementStaggerDelay: 320,
  elementRevealStartDelay: 500,
  fixedInViewport: true,
  morphPlateau: 0.28,
  morphStyle: 1,
  images: [
    "/images/amir-portrait-luxury.jpg",
    "/images/3.jpg",
    "/images/4.jpg",
  ],
};

export function restoreSavedSettings(): void {
  try {
    const lockedMode = localStorage.getItem("luxury_particle_locked_mode");
    if (lockedMode) {
      const modeNum = parseInt(lockedMode, 10);
      if (modeNum >= 1 && modeNum <= 7) {
        PARTICLE_CONFIG.interactiveMode = modeNum;
        PARTICLE_CONFIG.isRandomMode = false;
      }
    } else {
      PARTICLE_CONFIG.interactiveMode = Math.floor(Math.random() * 7) + 1;
      PARTICLE_CONFIG.isRandomMode = true;
    }

    localStorage.removeItem("luxury_particle_mode");

    const raw = localStorage.getItem("luxury_particle_layouts");
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        parsed.forEach((layout, i) => {
          if (layout && typeof layout.scale === "number") {
            PARTICLE_CONFIG.imageLayouts[i] = {
              scale: layout.scale,
              alignX: layout.alignX,
              alignY: layout.alignY,
            };
          }
        });
      }
    }
  } catch (e) {
    console.warn("Could not restore particle settings from localStorage", e);
  }
}

export function saveSettingsToStorage(): void {
  try {
    localStorage.setItem(
      "luxury_particle_layouts",
      JSON.stringify(PARTICLE_CONFIG.imageLayouts),
    );
    if (!PARTICLE_CONFIG.isRandomMode) {
      localStorage.setItem(
        "luxury_particle_locked_mode",
        String(PARTICLE_CONFIG.interactiveMode),
      );
    } else {
      localStorage.removeItem("luxury_particle_locked_mode");
    }
  } catch (e) {
    console.warn("Could not save particle settings to localStorage", e);
  }
}

export function getImageLayout(index: number): ImageLayout {
  if (PARTICLE_CONFIG.imageLayouts[index]) {
    return PARTICLE_CONFIG.imageLayouts[index];
  }
  const fallback = { scale: 1.0, alignX: 0.5, alignY: 0.5 };
  PARTICLE_CONFIG.imageLayouts[index] = fallback;
  return fallback;
}
