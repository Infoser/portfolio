type ProfileImageProps = {
  src: string;
  alt: string;
  className?: string;
};

/**
 * Polaroid stack frame (adapted from Uiverse.io by janisar-hyder).
 * Three paper layers sit behind the photo — on hover the stack fans out
 * (5deg stack tilt, -4deg/+4deg inner layers). The photo itself is
 * grayscale at rest, full colour on hover.
 *
 * Layout: the polaroid card is a tall rectangle (taller than the square
 * photo). The photo occupies the top portion; beneath it, inside the
 * polaroid frame's white space, sits the name as a caption. This keeps
 * the name visible inside the frame without overlapping the photo.
 */
export function ProfileImage({ src, alt, className }: ProfileImageProps) {
  return (
    <figure
      className={
        'group relative mx-auto w-44 max-w-[400px] shrink-0 transition-transform duration-200 ease-out hover:rotate-[5deg] sm:w-52 md:sticky md:top-6 md:w-60 ' +
        (className ?? '')
      }
    >
      {/* Polaroid card — paper background, square photo on top, caption strip below */}
      <div className="group/card relative block cursor-pointer border-4 border-foreground bg-surface p-[5%] pb-[8%] transition-transform duration-150 ease-out">
        {/* Two rotated paper layers behind the card */}
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-10 block border-4 border-foreground bg-surface transition-transform duration-150 ease-out group-hover/card:-translate-y-[2%] group-hover/card:-rotate-[4deg]"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 -z-20 block border-4 border-foreground bg-surface transition-transform duration-150 ease-out group-hover/card:translate-y-[2%] group-hover/card:rotate-[4deg]"
        />

        {/* The photo itself: square, grayscale until hover */}
        <div className="relative aspect-square w-full overflow-hidden border-4 border-foreground bg-muted">
          <img
            src={src}
            alt={alt}
            loading="lazy"
            decoding="async"
            className="block h-full w-full object-cover grayscale transition-[filter] duration-500 ease-out group-hover/card:grayscale-0"
          />
        </div>

        {/* Caption strip — sits inside the polaroid frame, beneath the photo */}
        <figcaption className="mt-[6%] truncate text-center font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground/80">
          {alt}
        </figcaption>
      </div>
    </figure>
  );
}
