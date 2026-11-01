/**
 * Portfolio artwork is embedded as data URIs so every thumbnail is available
 * the moment the page renders — no network requests, no broken/empty cards.
 */
import donutRaw from "./work-donut.svg?raw";
import planeRaw from "./work-plane.svg?raw";
import grabRaw from "./work-grab.svg?raw";
import bookRaw from "./work-book.svg?raw";
import pinsRaw from "./work-pins.svg?raw";

const toDataUri = (raw: string) => `data:image/svg+xml,${encodeURIComponent(raw.trim())}`;

export const artwork = {
  donut: toDataUri(donutRaw),
  plane: toDataUri(planeRaw),
  grab: toDataUri(grabRaw),
  book: toDataUri(bookRaw),
  pins: toDataUri(pinsRaw),
};

export type ArtworkKey = keyof typeof artwork;
