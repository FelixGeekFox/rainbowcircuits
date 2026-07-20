import type { ImageMetadata } from 'astro';
import galaInvitation from '../assets/issue-001/gala-invitation.png';
import howTheyMet from '../assets/issue-001/how-they-met.png';
import banner from '../assets/brand/banner.png';
import pipAndPuddle from '../assets/brand/pip-and-puddle.png';

/**
 * Content files refer to images by key (e.g. "gala-invitation") so that
 * editors never touch import statements. Drop a new image into
 * src/assets/, import it here, and add one line to the map.
 *
 * The special key "placeholder" tells components to render a clearly
 * labelled placeholder frame instead of an image.
 */
const IMAGES: Record<string, ImageMetadata> = {
  'gala-invitation': galaInvitation,
  'how-they-met': howTheyMet,
  'brand-banner': banner,
  'pip-and-puddle': pipAndPuddle,
};

export function getImage(key: string | undefined): ImageMetadata | undefined {
  if (!key || key === 'placeholder') return undefined;
  const image = IMAGES[key];
  if (!image) throw new Error(`Unknown image key "${key}" — add it to src/lib/images.ts`);
  return image;
}
