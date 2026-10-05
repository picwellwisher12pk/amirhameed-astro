// WebGL Shaders with 8 Switchable Organic Interaction Modes

export const VS_SOURCE = `
  attribute vec2 a_targetA;
  attribute vec3 a_colorA;
  attribute vec2 a_targetB;
  attribute vec3 a_colorB;
  attribute vec2 a_origin;
  attribute vec4 a_params; // x: delay, y: duration, z: size, w: curl
  attribute float a_scatter; // 0.0: assembles into picture (99%), 1.0: permanent wanderer (1%)

  uniform float u_time;
  uniform vec2 u_resolution;
  uniform vec2 u_mouse;
  uniform vec2 u_mouse_vel;
  uniform float u_mouse_speed;
  uniform float u_mouse_active;
  uniform float u_cursor_radius;
  uniform float u_dim_factor;
  uniform float u_morph_t; // 0.0 to 1.0 morph between Image A and Image B
  uniform int u_morph_style; // 1:WaveWipe 2:GravityCollapse 3:LiquidFlow 4:Lightning 5:RadialIris

  // Interactive Mode & Parameters
  uniform int u_interactive_mode; // 1: Hologram, 2: Ripple, 3: Lantern, 4: Gravity, 5: Fluid
  uniform float u_param_intensity;
  uniform float u_param_speed;
  uniform float u_repel_strength;

  // Dynamic Live Transforms (Scale and Center per Image)
  uniform vec2 u_centerA;
  uniform float u_sizeA;
  uniform vec2 u_centerB;
  uniform float u_sizeB;

  // Hero content area for invert effect (left side of screen)
  uniform vec2 u_hero_area; // x: width of hero area (in pixels), y: unused

  varying vec3 v_color;
  varying float v_alpha;

  // Simplex Noise & Divergence-Free Curl Field
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x * 34.0) + 1.0) * x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187,
                        0.366025403784439,
                       -0.577350269189626,
                        0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0))
          + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
    m = m * m;
    m = m * m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
    vec3 g;
    g.x  = a0.x  * x0.x  + h.x  * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  vec2 curlNoise(vec2 p) {
    float eps = 0.5;
    float n1 = snoise(vec2(p.x, p.y + eps));
    float n2 = snoise(vec2(p.x, p.y - eps));
    float n3 = snoise(vec2(p.x + eps, p.y));
    float n4 = snoise(vec2(p.x - eps, p.y));
    float dx = (n1 - n2) / (2.0 * eps);
    float dy = (n3 - n4) / (2.0 * eps);
    return vec2(dx, -dy);
  }

  void main() {
    float delay = a_params.x;
    float duration = a_params.y;
    float size = a_params.z;
    float curl = a_params.w;

    float pElapsed = max(0.0, u_time - delay);
    float progress = clamp(pElapsed / duration, 0.0, 1.0);

    // Smooth quintic ease out for majestic cinematic gathering
    float t = 1.0 - progress;
    float ease = 1.0 - t * t * t * t;

    // Dynamically compute screen pixel target coordinates from normalized coordinates
    vec2 targetPosA = u_centerA + a_targetA * u_sizeA;
    vec2 targetPosB = u_centerB + a_targetB * u_sizeB;

    // High-entropy per-particle pseudo-random seeds: breaks any artificial banding
    float pRnd1 = fract(sin(dot(a_targetA.xy + vec2(curl, size), vec2(12.9898, 78.233))) * 43758.5453);
    float pRnd2 = fract(sin(dot(a_targetB.xy + vec2(size, -curl), vec2(39.346, 11.135))) * 28462.6315);
    float pRnd3 = fract(a_params.x * 0.0071 + curl * 13.37);

    // Screen origin in absolute pixels:
    vec2 screenOrigin = a_origin * u_resolution;

    // Ambient wandering flow across viewport:
    // When page loads, particles move randomly "here and there"
    vec2 driftCoord = screenOrigin * 0.0016 + vec2(u_time * 0.00015, -u_time * 0.00012);
    vec2 curlWander = curlNoise(driftCoord) * 36.0;
    vec2 harmonicWander = vec2(
      sin(u_time * 0.0013 * (0.7 + pRnd1 * 0.6) + pRnd2 * 6.283) * 26.0,
      cos(u_time * 0.0010 * (0.7 + pRnd2 * 0.6) + pRnd3 * 6.283) * 22.0
    );
    vec2 liveOrigin = screenOrigin + curlWander + harmonicWander;

    // =====================================================================
    // 5 SELECTABLE MORPH STYLES (u_morph_style 1–5)
    // =====================================================================
    vec2 screenCenter = u_resolution * 0.5;
    float mt = u_morph_t; // 0=Image A, 1=Image B
    vec2 morphedTarget;
    vec3 morphedColor;
    float morphHighlight = 0.0; // extra brightness at the wave/transition front
    // ---------------------------------------------------------------
    // STYLE 1: DIRECT SPATIAL FLOW
    // Particles flow directly from their A target to B target.
    // Individual stochastic dispersion: ZERO strips, ZERO bands.
    // Particles embark and arrive independently with organic micro-arcs.
    // ---------------------------------------------------------------
    if (u_morph_style == 1) {
      vec2 midPt = (targetPosA + targetPosB) * 0.5;
      float distFromCenter = length(midPt - screenCenter);
      float maxDist = max(1.0, length(u_resolution) * 0.52);
      float normDist = clamp(distFromCenter / maxDist, 0.0, 1.0);

      float particleJitter = (pRnd1 - 0.5) * 0.38 + (pRnd2 - 0.5) * 0.16;
      float particleOffset = normDist * 0.18 + particleJitter;
      float windowWidth = 0.52;
      float localT = clamp((mt * (1.0 + windowWidth) - particleOffset) / windowWidth, 0.0, 1.0);

      float smoothT = localT * localT * (3.0 - 2.0 * localT);
      smoothT = smoothT * smoothT * (3.0 - 2.0 * smoothT);

      float arcHeight = length(targetPosB - targetPosA) * 0.08 * (0.6 + pRnd3 * 0.8);
      vec2 randomArcDir = vec2(cos(pRnd1 * 6.28318), sin(pRnd1 * 6.28318));
      vec2 centerBias = normalize(screenCenter - midPt + vec2(0.001));
      vec2 arcDir = normalize(mix(randomArcDir, centerBias, 0.35));
      float arcAmt = 4.0 * smoothT * (1.0 - smoothT);
      vec2 arcOffset = arcDir * (arcHeight * arcAmt);

      morphedTarget = mix(targetPosA, targetPosB, smoothT) + arcOffset;
      morphedColor = mix(a_colorA, a_colorB, smoothT);
      morphHighlight = 3.0 * localT * (1.0 - localT) * 0.55;

    // ---------------------------------------------------------------
    // STYLE 2: WIND SWIRL & VORTEX
    // ---------------------------------------------------------------
    } else if (u_morph_style == 2) {
      float windSplit = 0.50;

      if (mt <= windSplit) {
        float p = mt / windSplit;
        float windFront = clamp(p * 1.5 - (targetPosA.x / max(1.0, u_resolution.x)) * 0.5, 0.0, 1.0);
        float pe = windFront * windFront * (3.0 - 2.0 * windFront);

        vec2 rel = targetPosA - u_centerA;
        float swirlAngle = pe * 3.6 * (0.8 + 0.4 * abs(curl));
        float cA = cos(swirlAngle); float sA = sin(swirlAngle);
        vec2 spun = vec2(rel.x * cA - rel.y * sA, rel.x * sA + rel.y * cA);

        vec2 windDraft = vec2(300.0, -80.0) * (pe * pe);
        vec2 curlSample = targetPosA * 0.005 + vec2(u_time * 0.0004, pe * 0.5);
        vec2 curlField = curlNoise(curlSample) * (140.0 * pe);

        morphedTarget = u_centerA + mix(rel, spun, pe) + windDraft + curlField;
        morphedColor = mix(a_colorA, vec3(0.95, 0.88, 0.55), pe * 0.45);
        morphHighlight = pe * 0.45;
      } else {
        float p = (mt - windSplit) / (1.0 - windSplit);
        float gatherFront = clamp(p * 1.5 - (1.0 - targetPosB.x / max(1.0, u_resolution.x)) * 0.5, 0.0, 1.0);
        float ge = gatherFront * gatherFront * (3.0 - 2.0 * gatherFront);

        vec2 relB = targetPosB - u_centerB;
        float returnAngle = (1.0 - ge) * 3.6 * (0.8 + 0.4 * abs(curl));
        float cB = cos(returnAngle); float sB = sin(returnAngle);
        vec2 spunB = vec2(relB.x * cB - relB.y * sB, relB.x * sB + relB.y * cB);

        vec2 residualDraft = vec2(300.0, -80.0) * (1.0 - ge) * (1.0 - ge);
        vec2 residualCurl = curlNoise(targetPosB * 0.005 + vec2(p * 0.5)) * (140.0 * (1.0 - ge));

        vec2 vortexSource = u_centerB + spunB + residualDraft + residualCurl;

        morphedTarget = mix(vortexSource, targetPosB, ge);
        morphedColor = mix(vec3(0.95, 0.88, 0.55), a_colorB, ge);
        morphHighlight = (1.0 - ge) * 0.40;
      }

    // ---------------------------------------------------------------
    // STYLE 3: DIAGONAL WAVE WIPE (editorial page-turn)
    // ---------------------------------------------------------------
    } else if (u_morph_style == 3) {
      vec2 sweepDir = normalize(vec2(0.65, 0.35));
      vec2 midPt = (targetPosA + targetPosB) * 0.5;
      float proj = dot(midPt / u_resolution, sweepDir);
      float wavePos = mt * 1.08 - 0.04;
      float waveBand = 0.10;
      float signedD = wavePos - proj;
      float localT = clamp(signedD / waveBand + 0.5, 0.0, 1.0);
      float smoothT = localT * localT * (3.0 - 2.0 * localT);
      smoothT = smoothT * smoothT * (3.0 - 2.0 * smoothT);
      morphedTarget = mix(targetPosA, targetPosB, smoothT);
      morphedColor = mix(a_colorA, a_colorB, smoothT);
      morphHighlight = 4.0 * localT * (1.0 - localT);

    // ---------------------------------------------------------------
    // STYLE 4: GRAVITY COLLAPSE (black hole singularity)
    // ---------------------------------------------------------------
    } else if (u_morph_style == 4) {
      float collapseEnd = 0.44;
      float expandStart = 0.56;
      if (mt <= collapseEnd) {
        float p = mt / collapseEnd;
        float pe = p * p * p;
        morphedTarget = mix(targetPosA, screenCenter, pe);
        morphedColor = mix(a_colorA, vec3(1.0, 0.9, 0.5), pe);
        morphHighlight = pe * 0.9;
      } else if (mt < expandStart) {
        morphedTarget = screenCenter;
        morphedColor = vec3(1.0, 0.95, 0.6);
        morphHighlight = 1.0;
      } else {
        float p = (mt - expandStart) / (1.0 - expandStart);
        float pe = 1.0 - (1.0 - p) * (1.0 - p) * (1.0 - p);
        morphedTarget = mix(screenCenter, targetPosB, pe);
        morphedColor = mix(vec3(1.0, 0.95, 0.6), a_colorB, pe);
        morphHighlight = (1.0 - p) * 0.5;
      }

    // ---------------------------------------------------------------
    // STYLE 5: RADIAL IRIS (camera aperture reveal)
    // ---------------------------------------------------------------
    } else {
      vec2 midPt2 = (targetPosA + targetPosB) * 0.5;
      float distFromCenter = length(midPt2 - screenCenter);
      float maxDist = max(1.0, length(u_resolution) * 0.5);
      float normDist = clamp(distFromCenter / maxDist, 0.0, 1.0);

      float noisyDist = normDist + (pRnd1 - 0.5) * 0.32 + (pRnd2 - 0.5) * 0.14;
      float irisWidth = 0.38;
      float irisPos = mt * (1.0 + irisWidth) - irisWidth * 0.5;
      float localT = clamp((irisPos - noisyDist) / irisWidth + 0.5, 0.0, 1.0);

      float smoothT = localT * localT * (3.0 - 2.0 * localT);
      smoothT = smoothT * smoothT * (3.0 - 2.0 * smoothT);

      float irisTwist = (1.0 - smoothT) * smoothT * curl * (0.3 + pRnd3 * 0.4);
      float cI = cos(irisTwist); float sI = sin(irisTwist);
      vec2 diffAB = targetPosB - targetPosA;
      vec2 twistedB = targetPosA + vec2(diffAB.x * cI - diffAB.y * sI, diffAB.x * sI + diffAB.y * cI);

      morphedTarget = mix(targetPosA, twistedB, smoothT);
      morphedColor = mix(a_colorA, a_colorB, smoothT);
      morphHighlight = 3.5 * localT * (1.0 - localT) * 0.65;
    }

    vec3 goldHighlight = vec3(1.0, 0.87, 0.38);
    vec3 finalColor = mix(morphedColor, goldHighlight, clamp(morphHighlight, 0.0, 1.0) * 0.65);
    float pointSize = size * (1.0 + morphHighlight * 0.6 + (1.0 - progress) * 0.6);

    float gatherSwirl = sin(progress * 3.14159) * curl * 0.85;
    vec2 diff = liveOrigin - morphedTarget;
    float cosA = cos(gatherSwirl);
    float sinA = sin(gatherSwirl);
    vec2 rotatedDiff = vec2(
      diff.x * cosA - diff.y * sinA,
      diff.x * sinA + diff.y * cosA
    );
    vec2 currentOrigin = morphedTarget + rotatedDiff;
    vec2 pos = mix(currentOrigin, morphedTarget, ease);

    if (progress >= 1.0) {
      float shimmer = sin(u_time * 0.002 + morphedTarget.x * 0.01 + morphedTarget.y * 0.01) * 0.6;
      pos.y += shimmer;
    }

    // 1% permanent scattered wanderers:
    if (a_scatter > 0.5) {
      float gatherProgress = clamp((u_time - 500.0) / 1900.0, 0.0, 1.0);
      float pullEase = gatherProgress * gatherProgress * (3.0 - 2.0 * gatherProgress);
      pullEase = pullEase * pullEase * (3.0 - 2.0 * pullEase);

      float pullFraction = 0.18 + 0.28 * pRnd2;
      vec2 assemblyCenter = u_centerA;
      vec2 toCenter = assemblyCenter - screenOrigin;
      vec2 inwardOffset = toCenter * (pullFraction * pullEase);

      vec2 cosmicNoise = curlNoise(screenOrigin * 0.0011 + vec2(u_time * 0.00010, -u_time * 0.00008)) * 65.0;
      vec2 cosmicSine = vec2(
        sin(u_time * 0.0009 * (0.6 + pRnd3 * 0.8) + pRnd1 * 6.283) * 45.0,
        cos(u_time * 0.0007 * (0.6 + pRnd2 * 0.8) + pRnd3 * 6.283) * 35.0
      );
      pos = screenOrigin + inwardOffset + cosmicNoise + cosmicSine;

      finalColor = mix(vec3(0.96, 0.84, 0.43), vec3(1.0, 0.94, 0.72), pRnd1);
      pointSize = size * (1.15 + sin(u_time * 0.0028 + pRnd2 * 6.283) * 0.35);
    }

    // =====================================================================
    // 8 SWITCHABLE ORGANIC INTERACTIVE MODES
    // =====================================================================
    if (u_mouse_active > 0.01) {
      vec2 toMouse = pos - u_mouse;
      float d = length(toMouse);

      // MODE 1: Volumetric Quantum Aura
      if (u_interactive_mode == 1) {
        vec2 center = mix(u_centerA, u_centerB, u_morph_t);
        float curSize = mix(u_sizeA, u_sizeB, u_morph_t);
        float distToCenter = length(pos - center);
        float normFaceDist = distToCenter / max(1.0, curSize * 0.45);

        float waveSpeed = u_time * 0.0055 * u_param_speed;
        float ringWave = sin(d * 0.048 - waveSpeed);
        float ringDecay = exp(-d * 0.0070);
        float ringIntensity = ringWave * ringDecay * u_param_intensity;

        float outerFactor = smoothstep(0.18, 0.95, normFaceDist);
        vec2 tangent = vec2(-toMouse.y, toMouse.x);
        vec2 normTangent = length(tangent) > 0.001 ? normalize(tangent) : vec2(0.0, 1.0);
        vec2 normRadial = d > 0.001 ? (toMouse / d) : vec2(1.0, 0.0);
        
        vec2 orbitalPush = normTangent * (sin(d * 0.04 + waveSpeed * 1.5) * 7.5 * outerFactor * ringDecay * u_param_intensity);
        vec2 radialPulse = normRadial * (ringIntensity * 5.5 * outerFactor);
        pos += (orbitalPush + radialPulse) * u_mouse_active;
      }
      // MODE 2: Silk Surface Ripple
      else if (u_interactive_mode == 2) {
        float maxRippleDist = u_cursor_radius * 2.2;
        if (d < maxRippleDist && d > 0.01) {
          float wavePhase = d * 0.075 - u_time * 0.007 * u_param_speed;
          float wave = sin(wavePhase);
          float decay = exp(-d * 0.011) * (1.0 - smoothstep(u_cursor_radius * 0.6, maxRippleDist, d));
          vec2 rippleDisplace = normalize(toMouse) * (wave * 20.0 * decay * u_param_intensity);
          pos += rippleDisplace * u_mouse_active;
        }
      }
      // MODE 3: Celestial Lantern
      else if (u_interactive_mode == 3) {
        float lanternRadius = u_cursor_radius * 1.6;
        if (d < lanternRadius && d > 0.01) {
          float lightFalloff = max(0.0, 1.0 - d / lanternRadius);
          lightFalloff = lightFalloff * lightFalloff * (3.0 - 2.0 * lightFalloff);
          pos += normalize(-toMouse) * (lightFalloff * 8.0 * u_param_intensity) * u_mouse_active;
        }
      }
      // MODE 4: Gravitational Lens
      else if (u_interactive_mode == 4) {
        float maxGravDist = u_cursor_radius * 1.8;
        if (d < maxGravDist && d > 1.0) {
          float r0 = u_cursor_radius * 0.45;
          vec2 tangent = vec2(-toMouse.y, toMouse.x);
          float deflection = (r0 / (d + 25.0)) * (34.0 * u_param_intensity);
          float falloff = 1.0 - smoothstep(r0, maxGravDist, d);
          vec2 gravDisplace = (normalize(tangent) * deflection + normalize(-toMouse) * (deflection * 0.35)) * falloff;
          pos += gravDisplace * u_mouse_active;
        }
      }
      // MODE 5: Fluid Stardust Wake
      else if (u_interactive_mode == 5) {
        if (d < u_cursor_radius && d > 0.01) {
          float normD = d / u_cursor_radius;
          float falloff = 1.0 - normD;
          falloff = falloff * falloff * (3.0 - 2.0 * falloff);

          vec2 velocityWake = u_mouse_vel * (0.38 * u_param_intensity) * falloff;
          vec2 curlCoord = pos * 0.0065 + vec2(u_time * 0.0006, -u_time * 0.0005);
          vec2 fluidVortex = curlNoise(curlCoord) * (46.0 * u_param_intensity) * falloff;
          vec2 radialPush = normalize(toMouse) * (u_repel_strength * falloff * (1.0 - normD * 0.5));

          float particleInertia = 0.75 + 0.5 * abs(curl);
          vec2 totalDisplacement = (velocityWake + fluidVortex + radialPush) * particleInertia;
          pos += totalDisplacement * u_mouse_active;
        }
      }
      // MODE 6: Simple Soft Physics
      else if (u_interactive_mode == 6) {
        float sigma = u_cursor_radius * 0.58;
        float gaussian = exp(- (d * d) / (2.0 * sigma * sigma));
        
        if (gaussian > 0.0008) {
          vec2 pushDir = (d > 0.01) ? (toMouse / d) : vec2(0.0, 1.0);
          float softPush = gaussian * (22.0 * u_param_intensity);
          vec2 viscousDrag = u_mouse_vel * (0.16 * u_param_intensity) * gaussian;
          float springPhase = u_time * 0.005 * u_param_speed - d * 0.025;
          float springWave = sin(springPhase) * gaussian * (3.0 * u_param_intensity);
          
          vec2 displacement = pushDir * softPush + viscousDrag + pushDir * springWave;
          pos += displacement * u_mouse_active;
        }
      }
      // MODE 7: Neural Constellation
      else if (u_interactive_mode == 7) {
        float constellRadius = u_cursor_radius * 1.5;
        if (d < constellRadius && d > 0.01) {
          float normD = d / constellRadius;
          float falloff = 1.0 - normD;
          falloff = falloff * falloff * (3.0 - 2.0 * falloff);

          pos += normalize(-toMouse) * (falloff * 7.0 * u_param_intensity) * u_mouse_active;

          float twitch = sin(u_time * 0.02 + pos.x * 0.15 + pos.y * 0.15) * (falloff * 2.0 * u_param_intensity);
          pos.y += twitch * u_mouse_active;
        }
      }
      // MODE 8: Holographic Cyber Scanlines
      else if (u_interactive_mode == 8) {
        float sweepProgress = fract(u_time * 0.00035 * u_param_speed);
        float laserY = sweepProgress * u_resolution.y;
        float beamDist = abs(pos.y - laserY);
        float laserBeam = smoothstep(55.0, 0.0, beamDist) * u_param_intensity;

        float scanFreq = sin(pos.y * 0.75 + u_time * 0.015);
        float glitchJitter = step(0.94, sin(pos.y * 0.25 + u_time * 0.04)) * 3.5;
        
        float cursorProximity = max(0.0, 1.0 - d / (u_cursor_radius * 1.3));
        float activeSlice = max(laserBeam, cursorProximity * 0.75);
        pos.x += (scanFreq * 2.2 + glitchJitter) * activeSlice * u_param_intensity * u_mouse_active;

        if (abs(pos.x - u_mouse.x) < 2.5 && d < u_cursor_radius * 1.2) {
          pointSize += 1.5 * u_mouse_active;
        }

        if (activeSlice > 0.05) {
          vec3 cyberHolo = vec3(0.55, 0.92, 1.0);
          vec3 goldHolo = vec3(1.0, 0.88, 0.52);
          vec3 holoGlint = mix(goldHolo, cyberHolo, sin(pos.y * 0.1 + u_time * 0.008) * 0.5 + 0.5);
          finalColor = mix(finalColor, holoGlint, activeSlice * 0.65 * u_mouse_active);
          pointSize += activeSlice * 1.4 * u_mouse_active;
        }
      }
    }

    // Map to clip space (-1 to 1)
    vec2 zeroToOne = pos / u_resolution;
    vec2 zeroToTwo = zeroToOne * 2.0;
    vec2 clipSpace = zeroToTwo - 1.0;
    clipSpace.y = -clipSpace.y; // Invert Y for screen

    gl_Position = vec4(clipSpace, 0.0, 1.0);
    gl_PointSize = pointSize;

    // Invert effect for particles over hero content area (left side)
    float heroWidth = u_hero_area.x;
    float inHeroArea = step(pos.x, heroWidth);
    vec3 invertedColor = 1.0 - finalColor;
    v_color = mix(finalColor, invertedColor, inHeroArea * 0.7);

    // Fixed 50% opacity from loading across entire life cycle:
    float initialFade = min(1.0, u_time / 80.0);
    float baseOpacity = 0.50;

    if (a_scatter > 0.5) {
      float twinkle = 0.88 + 0.12 * sin(u_time * 0.003 + pRnd1 * 6.283);
      v_alpha = initialFade * 0.95 * twinkle;
    } else {
      v_alpha = initialFade * baseOpacity;
    }
  }
`;

export const FS_SOURCE = `
  precision mediump float;
  varying vec3 v_color;
  varying float v_alpha;

  void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;
    float core = smoothstep(0.22, 0.0, dist);
    float halo = smoothstep(0.5, 0.08, dist);
    float intensity = halo * 0.75 + core * 0.55;
    gl_FragColor = vec4(v_color, v_alpha * intensity);
  }
`;
