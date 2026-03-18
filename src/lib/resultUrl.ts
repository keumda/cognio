import { PathType } from "@/store/useTestStore";

const pathToNum: Record<string, number> = {
  perfectionism: 0,
  attachment: 1,
  emotion: 2,
  initiation: 3,
};
const numToPath: PathType[] = [
  "perfectionism",
  "attachment",
  "emotion",
  "initiation",
];
const additionalPrefixes: Record<string, string> = {
  perfectionism: "P",
  attachment: "A",
  emotion: "E",
  initiation: "I",
};

// --- Bit packing utilities ---

class BitWriter {
  private bits: number[] = [];
  write(value: number, width: number) {
    for (let i = width - 1; i >= 0; i--) {
      this.bits.push((value >> i) & 1);
    }
  }
  toBytes(): Uint8Array {
    // Pad to multiple of 8
    while (this.bits.length % 8 !== 0) this.bits.push(0);
    const bytes = new Uint8Array(this.bits.length / 8);
    for (let i = 0; i < bytes.length; i++) {
      let byte = 0;
      for (let b = 0; b < 8; b++) {
        byte = (byte << 1) | this.bits[i * 8 + b];
      }
      bytes[i] = byte;
    }
    return bytes;
  }
}

class BitReader {
  private bits: number[] = [];
  private pos = 0;
  constructor(bytes: Uint8Array) {
    for (const byte of bytes) {
      for (let b = 7; b >= 0; b--) {
        this.bits.push((byte >> b) & 1);
      }
    }
  }
  read(width: number): number {
    let value = 0;
    for (let i = 0; i < width; i++) {
      value = (value << 1) | (this.bits[this.pos++] || 0);
    }
    return value;
  }
}

// --- Base64url (no padding, URL-safe) ---

function toBase64url(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64url(str: string): Uint8Array {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/") + "==".slice(0, (4 - (str.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

// --- Encode / Decode ---
// Layout: 15 answers (3 bits each) + pathway (2 bits) + acFlag (1 bit) [+ 6 additional answers (3 bits each)]
// Without additional: 48 bits = 6 bytes → 8 base64url chars
// With additional:    66 bits = 9 bytes → 12 base64url chars

export function encodeResult(
  answers: Record<number, number>,
  pathway: PathType,
  additionalCompleted: boolean,
  additionalAnswers: Record<string, number>
): string {
  const w = new BitWriter();
  for (let i = 1; i <= 15; i++) {
    w.write((answers[i] || 3) - 1, 3); // 0-4 in 3 bits
  }
  w.write(pathToNum[pathway], 2);
  w.write(additionalCompleted ? 1 : 0, 1);
  if (additionalCompleted) {
    const prefix = additionalPrefixes[pathway];
    for (let i = 1; i <= 6; i++) {
      w.write((additionalAnswers[`${prefix}${i}`] || 3) - 1, 3);
    }
  }
  return toBase64url(w.toBytes());
}

export function decodeResult(code: string): {
  answers: Record<number, number>;
  pathway: PathType;
  additionalCompleted: boolean;
  additionalAnswers: Record<string, number>;
} | null {
  try {
    const bytes = fromBase64url(code);
    const r = new BitReader(bytes);

    const answers: Record<number, number> = {};
    for (let i = 1; i <= 15; i++) {
      const v = r.read(3) + 1;
      if (v < 1 || v > 5) return null;
      answers[i] = v;
    }

    const pathIdx = r.read(2);
    const pathway = numToPath[pathIdx];
    if (!pathway) return null;

    const additionalCompleted = r.read(1) === 1;
    const additionalAnswers: Record<string, number> = {};

    if (additionalCompleted) {
      const prefix = additionalPrefixes[pathway];
      for (let i = 1; i <= 6; i++) {
        const v = r.read(3) + 1;
        if (v >= 1 && v <= 5) {
          additionalAnswers[`${prefix}${i}`] = v;
        }
      }
    }

    return { answers, pathway, additionalCompleted, additionalAnswers };
  } catch {
    return null;
  }
}
