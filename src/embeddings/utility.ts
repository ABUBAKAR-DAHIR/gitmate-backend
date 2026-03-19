export function mockEmbedding(text: string, dim = 1536): number[] {
  const vector = new Array(dim);

  let seed = 0;

  // simple hash from text
  for (let i = 0; i < text.length; i++) {
    seed = (seed * 31 + text.charCodeAt(i)) >>> 0;
  }

  // pseudo-random but deterministic numbers
  for (let i = 0; i < dim; i++) {
    seed = (1664525 * seed + 1013904223) >>> 0;
    vector[i] = (seed % 2000 - 1000) / 1000; // range ≈ [-1, 1]
  }

  return vector;
}