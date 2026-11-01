import { useEffect, useState } from "react";
import fallbackPhoto from "../assets/profile-fallback.jpg?inline";
import { cn } from "../utils/cn";

/** Owner-supplied portrait, served from Google Drive. */
export const PROFILE_PHOTO_URL =
  "https://drive.google.com/thumbnail?id=1HXZU_JRCvv8DbDft74ehmMpmqVjjQUCy&sz=s2000";

/**
 * Embedded copy of the same portrait. It is part of the page bundle, so the
 * photo is visible immediately — the Drive original replaces it once ready.
 */
export const PROFILE_PHOTO_FALLBACK = fallbackPhoto;

let resolvedSrc: string | null = null;
let driveRequest: Promise<string> | null = null;

/** Preload the Drive photo once and share the result across every instance. */
function loadDrivePhoto(): Promise<string> {
  if (resolvedSrc) return Promise.resolve(resolvedSrc);
  if (driveRequest) return driveRequest;

  driveRequest = new Promise<string>((resolve) => {
    const probe = new Image();
    probe.decoding = "async";
    probe.onload = () => {
      resolvedSrc = PROFILE_PHOTO_URL;
      resolve(PROFILE_PHOTO_URL);
    };
    probe.onerror = () => {
      resolvedSrc = PROFILE_PHOTO_FALLBACK;
      resolve(PROFILE_PHOTO_FALLBACK);
    };
    probe.src = PROFILE_PHOTO_URL;
  });

  return driveRequest;
}

/**
 * Read-only profile photo. Starts with the embedded portrait so it is never
 * empty, then swaps to the high-resolution Drive image. Visitors cannot
 * replace, edit, drag or save the image.
 */
export function ProfilePhoto({
  alt,
  className,
  loading = "lazy",
  priority = false,
}: {
  alt: string;
  className?: string;
  loading?: "lazy" | "eager";
  priority?: boolean;
}) {
  const [src, setSrc] = useState(resolvedSrc ?? PROFILE_PHOTO_FALLBACK);

  useEffect(() => {
    let active = true;
    loadDrivePhoto().then((next) => {
      if (active) setSrc(next);
    });
    return () => {
      active = false;
    };
  }, []);

  return (
    <img
      src={src}
      alt={alt}
      width={960}
      height={1200}
      loading={priority ? "eager" : loading}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      draggable={false}
      onDragStart={(event) => event.preventDefault()}
      onContextMenu={(event) => event.preventDefault()}
      onError={() => {
        if (src !== PROFILE_PHOTO_FALLBACK) setSrc(PROFILE_PHOTO_FALLBACK);
      }}
      className={cn("profile-photo", className)}
    />
  );
}
