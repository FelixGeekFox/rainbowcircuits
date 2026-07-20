import type { ImageMetadata } from 'astro';
import galaInvitation from '../assets/issue-001/gala-invitation.png';
import howTheyMet from '../assets/issue-001/how-they-met.png';
import banner from '../assets/brand/banner.png';
import pipAndPuddle from '../assets/brand/pip-and-puddle.png';

/**
 * Content files refer to images by key (e.g. "gala-invitation") so that
 * editors never touch import statements.
 *
 * Two kinds of key work:
 *  1. Named keys from the map below (for hand-placed editorial images).
 *  2. Path keys — every file under src/assets/ is automatically
 *     available by its path relative to that folder, without extension.
 *     e.g. src/assets/issue-001/gallery/abc-1.png → "issue-001/gallery/abc-1".
 *     The gallery importer (scripts/import-gallery.mjs) relies on this.
 *
 * The special key "placeholder" tells components to render a clearly
 * labelled placeholder frame instead of an image.
 */
const NAMED: Record<string, ImageMetadata> = {
  'gala-invitation': galaInvitation,
  'how-they-met': howTheyMet,
  'brand-banner': banner,
  'pip-and-puddle': pipAndPuddle,
};

const FILES = import.meta.glob<ImageMetadata>('../assets/**/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
});
const BY_PATH: Record<string, ImageMetadata> = Object.fromEntries(
  Object.entries(FILES).map(([path, image]) => [
    path.replace('../assets/', '').replace(/\.(png|jpe?g|webp|avif|gif)$/i, ''),
    image,
  ]),
);

export function getImage(key: string | undefined): ImageMetadata | undefined {
  if (!key || key === 'placeholder') return undefined;
  const image = NAMED[key] ?? BY_PATH[key];
  if (!image) throw new Error(`Unknown image key "${key}" — add the file under src/assets/ or a named entry in src/lib/images.ts`);
  return image;
}
