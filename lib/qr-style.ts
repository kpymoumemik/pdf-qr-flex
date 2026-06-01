import QRCode from "qrcode";

export const FRAME_STYLES = ["Без рамки", "Классика", "Сканируй", "Тонкая", "Контраст"] as const;
export const PATTERN_STYLES = ["Квадрат", "Скругленный", "Точки", "Ромб", "Плитка"] as const;

export type FrameStyle = (typeof FRAME_STYLES)[number];
export type PatternStyle = (typeof PATTERN_STYLES)[number];

export type StyledQrOptions = {
  color?: string;
  background?: string;
  size?: number;
  frameStyle?: string | null;
  patternStyle?: string | null;
};

const DEFAULT_FRAME: FrameStyle = "Без рамки";
const DEFAULT_PATTERN: PatternStyle = "Квадрат";

function normalizeFrameStyle(value?: string | null): FrameStyle {
  return FRAME_STYLES.includes(value as FrameStyle) ? (value as FrameStyle) : DEFAULT_FRAME;
}

function normalizePatternStyle(value?: string | null): PatternStyle {
  return PATTERN_STYLES.includes(value as PatternStyle) ? (value as PatternStyle) : DEFAULT_PATTERN;
}

function clampSize(value?: number) {
  return Math.min(1024, Math.max(192, Number(value) || 512));
}

function escapeXml(value: string) {
  return value.replace(/[&<>"']/g, (char) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&apos;",
    };
    return entities[char];
  });
}

function svgToDataUrl(svg: string) {
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function isFinderArea(x: number, y: number, count: number) {
  const inTop = y < 7;
  const inLeft = x < 7;
  const inRight = x >= count - 7;
  const inBottom = y >= count - 7;
  return (inTop && inLeft) || (inTop && inRight) || (inBottom && inLeft);
}

function drawFinder(x: number, y: number, moduleSize: number, color: string, background: string) {
  const unit = moduleSize;
  const outer = 7 * unit;
  const middleOffset = unit;
  const middle = 5 * unit;
  const innerOffset = 2 * unit;
  const inner = 3 * unit;

  return [
    `<rect x="${x}" y="${y}" width="${outer}" height="${outer}" rx="${unit * 0.45}" fill="${escapeXml(color)}"/>`,
    `<rect x="${x + middleOffset}" y="${y + middleOffset}" width="${middle}" height="${middle}" rx="${unit * 0.25}" fill="${escapeXml(background)}"/>`,
    `<rect x="${x + innerOffset}" y="${y + innerOffset}" width="${inner}" height="${inner}" rx="${unit * 0.2}" fill="${escapeXml(color)}"/>`,
  ].join("");
}

function drawModule(x: number, y: number, moduleSize: number, style: PatternStyle, color: string, index: number) {
  const escapedColor = escapeXml(color);
  const gap = moduleSize * 0.08;
  const size = moduleSize - gap * 2;
  const cx = x + moduleSize / 2;
  const cy = y + moduleSize / 2;

  if (style === "Скругленный") {
    return `<rect x="${x + gap}" y="${y + gap}" width="${size}" height="${size}" rx="${moduleSize * 0.32}" fill="${escapedColor}"/>`;
  }

  if (style === "Точки") {
    return `<circle cx="${cx}" cy="${cy}" r="${moduleSize * 0.43}" fill="${escapedColor}"/>`;
  }

  if (style === "Ромб") {
    const r = moduleSize * 0.5;
    return `<path d="M ${cx} ${cy - r} L ${cx + r} ${cy} L ${cx} ${cy + r} L ${cx - r} ${cy} Z" fill="${escapedColor}"/>`;
  }

  if (style === "Плитка") {
    const radius = index % 2 === 0 ? moduleSize * 0.08 : moduleSize * 0.28;
    const inset = index % 3 === 0 ? moduleSize * 0.02 : moduleSize * 0.12;
    return `<rect x="${x + inset}" y="${y + inset}" width="${moduleSize - inset * 2}" height="${moduleSize - inset * 2}" rx="${radius}" fill="${escapedColor}"/>`;
  }

  return `<rect x="${x}" y="${y}" width="${moduleSize}" height="${moduleSize}" fill="${escapedColor}"/>`;
}

function framePadding(frameStyle: FrameStyle, size: number) {
  if (frameStyle === "Без рамки") return 0;
  if (frameStyle === "Тонкая") return Math.round(size * 0.045);
  if (frameStyle === "Контраст") return Math.round(size * 0.07);
  return Math.round(size * 0.085);
}

function drawFrame(frameStyle: FrameStyle, size: number, color: string, background: string, padding: number) {
  if (frameStyle === "Без рамки") return "";

  const escapedColor = escapeXml(color);
  const escapedBackground = escapeXml(background);
  const radius = Math.max(8, padding * 0.6);
  const inner = size - padding * 2;

  if (frameStyle === "Сканируй") {
    const labelHeight = Math.max(22, padding * 0.9);
    const fontSize = Math.max(11, Math.round(padding * 0.34));
    return [
      `<rect x="${padding * 0.35}" y="${padding * 0.35}" width="${size - padding * 0.7}" height="${size - padding * 0.7}" rx="${radius}" fill="none" stroke="${escapedColor}" stroke-width="${Math.max(3, padding * 0.18)}"/>`,
      `<rect x="${padding}" y="${size - padding - labelHeight}" width="${inner}" height="${labelHeight}" rx="${Math.max(6, labelHeight * 0.22)}" fill="${escapedColor}"/>`,
      `<text x="${size / 2}" y="${size - padding - labelHeight / 2 + fontSize * 0.36}" text-anchor="middle" font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="${escapedBackground}">SCAN ME</text>`,
    ].join("");
  }

  if (frameStyle === "Контраст") {
    return [
      `<rect x="0" y="0" width="${size}" height="${size}" rx="${radius}" fill="${escapedColor}"/>`,
      `<rect x="${padding}" y="${padding}" width="${inner}" height="${inner}" rx="${radius * 0.65}" fill="${escapedBackground}"/>`,
    ].join("");
  }

  const strokeWidth = frameStyle === "Тонкая" ? Math.max(2, padding * 0.1) : Math.max(4, padding * 0.16);
  return `<rect x="${padding / 2}" y="${padding / 2}" width="${size - padding}" height="${size - padding}" rx="${radius}" fill="none" stroke="${escapedColor}" stroke-width="${strokeWidth}"/>`;
}

export function generateStyledQrSvgDataUrl(content: string, options: StyledQrOptions = {}) {
  const color = options.color || "#000000";
  const background = options.background || "#ffffff";
  const size = clampSize(options.size);
  const frameStyle = normalizeFrameStyle(options.frameStyle);
  const patternStyle = normalizePatternStyle(options.patternStyle);
  const padding = framePadding(frameStyle, size);
  const quietModules = 2;
  const qr = QRCode.create(content, { errorCorrectionLevel: "M" }) as unknown as {
    modules: { size: number; get: (x: number, y: number) => number | boolean };
  };
  const count = qr.modules.size;
  const availableSize = size - padding * 2;
  const moduleSize = availableSize / (count + quietModules * 2);
  const qrOffset = padding + quietModules * moduleSize;
  const parts: string[] = [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">`,
    `<rect width="100%" height="100%" fill="${escapeXml(background)}"/>`,
    drawFrame(frameStyle, size, color, background, padding),
  ];

  let index = 0;
  for (let y = 0; y < count; y += 1) {
    for (let x = 0; x < count; x += 1) {
      if (!Boolean(qr.modules.get(x, y)) || isFinderArea(x, y, count)) continue;
      parts.push(drawModule(qrOffset + x * moduleSize, qrOffset + y * moduleSize, moduleSize, patternStyle, color, index));
      index += 1;
    }
  }

  parts.push(
    drawFinder(qrOffset, qrOffset, moduleSize, color, background),
    drawFinder(qrOffset + (count - 7) * moduleSize, qrOffset, moduleSize, color, background),
    drawFinder(qrOffset, qrOffset + (count - 7) * moduleSize, moduleSize, color, background),
    "</svg>",
  );

  return svgToDataUrl(parts.join(""));
}

export async function generateStyledQrPngDataUrl(content: string, options: StyledQrOptions = {}) {
  const size = clampSize(options.size);
  const svgUrl = generateStyledQrSvgDataUrl(content, options);
  const image = new Image();

  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = svgUrl;
  });

  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Не удалось подготовить QR для скачивания.");
  context.drawImage(image, 0, 0, size, size);
  return canvas.toDataURL("image/png");
}
