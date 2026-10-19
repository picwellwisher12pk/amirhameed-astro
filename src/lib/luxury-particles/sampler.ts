// Image sampling, Morton Z-order curve spatial keying, and multi-image loader

export interface ConstellationNode {
  nx: number;
  ny: number;
}

export async function loadAllConfigImages(
  srcList: string[],
): Promise<HTMLImageElement[]> {
  const list =
    srcList && srcList.length > 0
      ? srcList
      : ["/images/amir-portrait-luxury.jpg"];
  const promises = list.map((src) => {
    return new Promise<HTMLImageElement>((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => {
        console.warn(`[LuxuryParticles] Could not load image: ${src}`);
        resolve(img);
      };
      img.src = src;
    });
  });
  return Promise.all(promises);
}

// Isotropic 2D Space-Filling Curve (Morton Z-Order) + Continuous Random Jitter
export function computeSpatialKey(nx: number, ny: number, imgAspect: number): number {
  const u = Math.max(
    0,
    Math.min(1023, Math.floor((nx / imgAspect + 0.5) * 1023)),
  );
  const v = Math.max(0, Math.min(1023, Math.floor((ny + 0.5) * 1023)));

  let x = u;
  let y = v;
  x = (x | (x << 8)) & 0x00ff00ff;
  x = (x | (x << 4)) & 0x0f0f0f0f;
  x = (x | (x << 2)) & 0x33333333;
  x = (x | (x << 1)) & 0x55555555;

  y = (y | (y << 8)) & 0x00ff00ff;
  y = (y | (y << 4)) & 0x0f0f0f0f;
  y = (y | (y << 2)) & 0x33333333;
  y = (y | (y << 1)) & 0x55555555;

  return (x | (y << 1)) + (Math.random() - 0.5) * 32.0;
}

export function sampleImageTargets(
  img: HTMLImageElement,
  particleCount: number,
  constellationNodes?: ConstellationNode[],
): Float32Array {
  const imgW = img.naturalWidth || 1800;
  const imgH = img.naturalHeight || 1800;
  const imgAspect = imgW / imgH;

  const sampleW = 400;
  const sampleH = Math.max(250, Math.round(400 / imgAspect));
  const offscreen = document.createElement("canvas");
  offscreen.width = sampleW;
  offscreen.height = sampleH;
  const offCtx = offscreen.getContext("2d");

  const buffer = new Float32Array(particleCount * 5); // 5 floats: nx, ny, r, g, b

  if (!offCtx || imgW === 0 || imgH === 0) {
    for (let i = 0; i < particleCount; i++) {
      buffer[i * 5] = (Math.random() - 0.5) * imgAspect;
      buffer[i * 5 + 1] = Math.random() - 0.5;
      buffer[i * 5 + 2] = 0.96;
      buffer[i * 5 + 3] = 0.84;
      buffer[i * 5 + 4] = 0.43;
    }
    return buffer;
  }

  offCtx.drawImage(img, 0, 0, sampleW, sampleH);
  const imgData = offCtx.getImageData(0, 0, sampleW, sampleH).data;
  const totalPixels = sampleW * sampleH;

  const cdf = new Float64Array(totalPixels);
  let runningSum = 0;

  for (let i = 0; i < totalPixels; i++) {
    const idx = i * 4;
    const r = imgData[idx] / 255;
    const g = imgData[idx + 1] / 255;
    const b = imgData[idx + 2] / 255;
    const a = imgData[idx + 3] / 255;

    const lum = 0.299 * r + 0.587 * g + 0.114 * b;
    let weight = 0;

    if (a > 0.08) {
      if (lum > 0.04) {
        weight = (Math.pow(lum, 0.82) * 1.2 + 0.12) * a;
      } else if (r > 0.02 || g > 0.02 || b > 0.02) {
        weight = 0.05 * a;
      }
    }

    runningSum += weight;
    cdf[i] = runningSum;
  }

  const totalWeight = runningSum > 0 ? runningSum : 1;

  for (let p = 0; p < particleCount; p++) {
    const rnd = Math.random() * totalWeight;

    let low = 0;
    let high = totalPixels - 1;
    while (low < high) {
      const mid = (low + high) >> 1;
      if (cdf[mid] < rnd) {
        low = mid + 1;
      } else {
        high = mid;
      }
    }

    const pixelIndex = low;
    const py = Math.floor(pixelIndex / sampleW);
    const px = pixelIndex % sampleW;

    const subX = px + Math.random();
    const subY = py + Math.random();

    const nx = (subX / sampleW - 0.5) * imgAspect;
    const ny = subY / sampleH - 0.5;

    const samplePx = Math.min(sampleW - 1, Math.max(0, Math.floor(subX)));
    const samplePy = Math.min(sampleH - 1, Math.max(0, Math.floor(subY)));
    const byteIdx = (samplePy * sampleW + samplePx) * 4;
    const r = imgData[byteIdx] / 255;
    const g = imgData[byteIdx + 1] / 255;
    const b = imgData[byteIdx + 2] / 255;

    const isGold = Math.random() < 0.14;
    const finalR = isGold ? 0.96 : r;
    const finalG = isGold ? 0.84 : g;
    const finalB = isGold ? 0.43 : b;

    const base = p * 5;
    buffer[base] = nx;
    buffer[base + 1] = ny;
    buffer[base + 2] = finalR;
    buffer[base + 3] = finalG;
    buffer[base + 4] = finalB;

    if (constellationNodes && p % 110 === 0 && constellationNodes.length < 500) {
      constellationNodes.push({ nx, ny });
    }
  }

  const indices = new Int32Array(particleCount);
  const keys = new Float64Array(particleCount);
  for (let i = 0; i < particleCount; i++) {
    indices[i] = i;
    const base = i * 5;
    keys[i] = computeSpatialKey(buffer[base], buffer[base + 1], imgAspect);
  }

  indices.sort((a, b) => keys[a] - keys[b]);

  const sortedBuffer = new Float32Array(particleCount * 5);
  for (let i = 0; i < particleCount; i++) {
    const src = indices[i] * 5;
    const dst = i * 5;
    sortedBuffer[dst] = buffer[src];
    sortedBuffer[dst + 1] = buffer[src + 1];
    sortedBuffer[dst + 2] = buffer[src + 2];
    sortedBuffer[dst + 3] = buffer[src + 3];
    sortedBuffer[dst + 4] = buffer[src + 4];
  }

  return sortedBuffer;
}

export interface DualStateBuffers {
  bufferA: Float32Array;
  bufferB: Float32Array;
}

// 1:1 Coherent Dual-State Sampling:
// Particle i in bufferA is mapped EXACTLY to particle i in bufferB.
// Particles outside the eye socket are 100% frozen (forehead, glasses, beard NEVER move).
// Particles inside the eye socket descend smoothly down to the natural lash line,
// sampling authentic closed-eyelid skin tone & eyelashes from the closed portrait.
export function sampleDualStateTargets(
  openImg: HTMLImageElement,
  closedImg: HTMLImageElement,
  particleCount: number,
  constellationNodes?: ConstellationNode[],
): DualStateBuffers {
  const bufferA = sampleImageTargets(openImg, particleCount, constellationNodes);

  const imgW = closedImg.naturalWidth || 1800;
  const imgH = closedImg.naturalHeight || 1800;
  const imgAspect = imgW / imgH;

  const sampleW = 400;
  const sampleH = Math.max(250, Math.round(400 / imgAspect));
  const offscreen = document.createElement("canvas");
  offscreen.width = sampleW;
  offscreen.height = sampleH;
  const offCtx = offscreen.getContext("2d");

  const bufferB = new Float32Array(particleCount * 5);

  const lx = -0.1806;
  const ly = -0.1639;
  const rx = -0.0306;
  const ry = -0.1806;
  const radX = 0.040;
  const radY = 0.024;

  let closedData: Uint8ClampedArray | null = null;
  if (offCtx && imgW > 0 && imgH > 0) {
    offCtx.drawImage(closedImg, 0, 0, sampleW, sampleH);
    closedData = offCtx.getImageData(0, 0, sampleW, sampleH).data;
  }

  for (let i = 0; i < particleCount; i++) {
    const base = i * 5;
    const nx = bufferA[base];
    const ny = bufferA[base + 1];
    const rA = bufferA[base + 2];
    const gA = bufferA[base + 3];
    const bA = bufferA[base + 4];

    const dLx = (nx - lx) / radX;
    const dLy = (ny - ly) / radY;
    const distL = dLx * dLx + dLy * dLy;

    const dRx = (nx - rx) / radX;
    const dRy = (ny - ry) / radY;
    const distR = dRx * dRx + dRy * dRy;

    const inEye = distL < 1.0 || distR < 1.0;

    if (!inEye || !closedData) {
      // 100% IDENTICAL outside eyes: zero movement, zero checkerboard
      bufferB[base] = nx;
      bufferB[base + 1] = ny;
      bufferB[base + 2] = rA;
      bufferB[base + 3] = gA;
      bufferB[base + 4] = bA;
    } else {
      const isLeft = distL < distR;
      const uRel = Math.max(-1.0, Math.min(1.0, isLeft ? dLx : dRx));
      const vRel = Math.max(-1.0, Math.min(1.0, isLeft ? dLy : dRy));
      const currentRadY = radY;

      // Natural lash seam line where upper and lower eyelids meet
      const seamV = 0.22 + 0.08 * (1.0 - uRel * uRel);

      // Upper lid rolls downward to seamV; lower lid lifts slightly
      let targetNy = ny;
      if (vRel < seamV) {
        targetNy = ny + (seamV - vRel) * currentRadY * 0.95;
      } else {
        targetNy = ny + (seamV - vRel) * currentRadY * 0.18;
      }

      // Sample color from closed portrait image
      const px = Math.min(sampleW - 1, Math.max(0, Math.floor((nx / imgAspect + 0.5) * sampleW)));
      const py = Math.min(sampleH - 1, Math.max(0, Math.floor((targetNy + 0.5) * sampleH)));
      const byteIdx = (py * sampleW + px) * 4;

      const rClosed = closedData[byteIdx] / 255;
      const gClosed = closedData[byteIdx + 1] / 255;
      const bClosed = closedData[byteIdx + 2] / 255;

      const isGold = rA > 0.94 && gA > 0.80 && bA < 0.48;

      bufferB[base] = nx;
      bufferB[base + 1] = targetNy;
      bufferB[base + 2] = isGold ? 0.96 : rClosed;
      bufferB[base + 3] = isGold ? 0.84 : gClosed;
      bufferB[base + 4] = isGold ? 0.43 : bClosed;
    }
  }

  return { bufferA, bufferB };
}
