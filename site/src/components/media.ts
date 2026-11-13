import manifest from '../../public/thumbs/manifest.json';
import { statSync } from 'node:fs';
import { join } from 'node:path';
import { kitUrl } from './kit-url';
export const media = manifest.assets as Record<string, { width: number; height: number; bytes: number; animated: boolean; variants: { path: string; width: number; bytes: number }[] }>;
export const bookPages = manifest.books as Record<string, { title: string; chapter: string; summary: string; transcript: string; source: string }>;
export const publicUrl = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${path}`;
export const thumb = (path: string) => {
  const asset = media[path];
  return asset ? { src: publicUrl(asset.variants[0].path), srcset: asset.variants.map(v => `${publicUrl(v.path)} ${v.width}w`).join(', '), width: asset.width, height: asset.height } : { src: kitUrl(path) };
};
export const bytes = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(2)} MB` : `${(n / 1000).toFixed(1)} kB`;
export function downloadInfo(path: string) {
  // The build synchronises public/kit before rendering. Missing downloads must fail the build.
  const size = statSync(join(process.cwd(), 'public/kit', path)).size;
  return `${path.split('.').pop()!.toUpperCase()} · ${bytes(size)}`;
}
