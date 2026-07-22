type ProfileImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ProfileImage({ src, alt, className }: ProfileImageProps) {
  return (
    <figure
      className={
        'group relative mx-auto w-48 shrink-0 overflow-hidden rounded-lg border border-border bg-surface shadow-sm md:sticky md:top-6 md:w-56 ' +
        (className ?? '')
      }
    >
      <div className="aspect-[4/5] overflow-hidden">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-full w-full object-cover grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0 group-focus-within:grayscale-0"
        />
      </div>
      <figcaption className="sr-only">{alt}</figcaption>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-border/40 transition-opacity duration-500 group-hover:opacity-0"
      />
    </figure>
  );
}
