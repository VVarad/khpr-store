/**
 * Resolves a product image URL.
 * - If it's already a full URL (http/https), use it directly.
 * - If it's a local path (/designs/...), use it as-is (Vite serves from public/).
 * - If empty, return a placeholder.
 */
export function resolveImageUrl(path) {
  if (!path) return '/designs/placeholder.png';
  if (path.startsWith('http')) return path;
  return path; // local Vite public path, e.g. /designs/D1_M.png
}
