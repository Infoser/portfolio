type ProfileImageProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ProfileImage({ src, alt, className }: ProfileImageProps) {
  return (
    <figure
      className={
        'group relative mx-auto w-32 shrink-0 overflow-hidden rounded-lg border border-border bg-surface shadow-sm sm:w-44 md:w-56 md:sticky md:top-6 ' +
        (className ?? '')
      }
    >
      <div className="overflow-hidden">
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          className="h-auto w-full object-contain grayscale transition-[filter] duration-500 ease-out group-hover:grayscale-0 group-focus-within:grayscale-0"
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
