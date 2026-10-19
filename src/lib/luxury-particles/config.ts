export interface ImageLayout {
  scale: number;
  alignX: number;
  alignY: number;
}

export interface EyeDescriptor {
  lx: number;
  ly: number;
  rx: number;
  ry: number;
  radX: number;
  radY: number;
  irisRad: number;
}

export interface EyeAnimConfig {
  mode: number; // 0 = Disabled, 1 = Option A (Shader Ellipse Warp), 2 = Option B (Mask Tagged)
  gazeStrength: number; // multiplier, default 1.0
  blinkFrequency: number; // average seconds between blinks
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
  eyeAnim: EyeAnimConfig;
  eyeDescriptors: EyeDescriptor[];
}

export const DEFAULT_EYE_DESCRIPTORS: EyeDescriptor[] = [
  {
    // Amir portrait luxury (1800x1800): Left pupil (-0.1806, -0.1639), Right pupil (-0.0306, -0.1806)
    lx: -0.1806,
    ly: -0.1639,
    rx: -0.0306,
    ry: -0.1806,
    radX: 0.038,
    radY: 0.022,
    irisRad: 0.017,
  },
  {
    lx: -0.10,
    ly: -0.15,
    rx: 0.08,
    ry: -0.15,
    radX: 0.04,
    radY: 0.025,
    irisRad: 0.018,
  },
  {
    lx: -0.10,
    ly: -0.15,
    rx: 0.08,
    ry: -0.15,
    radX: 0.04,
    radY: 0.025,
    irisRad: 0.018,
  },
];

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
  eyeAnim: {
    mode: 1, // Default: Option A (Shader Ellipse Warp)
    gazeStrength: 1.0,
    blinkFrequency: 4.2,
  },
  eyeDescriptors: JSON.parse(JSON.stringify(DEFAULT_EYE_DESCRIPTORS)),
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

    const savedEyeMode = localStorage.getItem("luxury_particle_eye_mode");
    if (savedEyeMode !== null) {
      PARTICLE_CONFIG.eyeAnim.mode = parseInt(savedEyeMode, 10);
    }
    const savedGazeStrength = localStorage.getItem("luxury_particle_gaze_strength");
    if (savedGazeStrength !== null) {
      PARTICLE_CONFIG.eyeAnim.gazeStrength = parseFloat(savedGazeStrength);
    }
    const savedBlinkFreq = localStorage.getItem("luxury_particle_blink_freq");
    if (savedBlinkFreq !== null) {
      PARTICLE_CONFIG.eyeAnim.blinkFrequency = parseFloat(savedBlinkFreq);
    }

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
    localStorage.setItem(
      "luxury_particle_eye_mode",
      String(PARTICLE_CONFIG.eyeAnim.mode),
    );
    localStorage.setItem(
      "luxury_particle_gaze_strength",
      String(PARTICLE_CONFIG.eyeAnim.gazeStrength),
    );
    localStorage.setItem(
      "luxury_particle_blink_freq",
      String(PARTICLE_CONFIG.eyeAnim.blinkFrequency),
    );
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
