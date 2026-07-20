import { memo, type RefObject } from 'react';

const PIXEL = 2;

const ARROW_PIXELS = [
  [3, 0], [4, 0], [5, 0], [6, 0], [7, 0],
  [1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1], [7, 1], [8, 1],
  [0, 2], [1, 2], [2, 2], [3, 2], [4, 2], [5, 2], [6, 2], [7, 2], [8, 2], [9, 2],
  [0, 3], [1, 3], [2, 3], [3, 3], [4, 3], [5, 3], [6, 3], [7, 3], [8, 3], [9, 3],
  [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4], [9, 4],
  [0, 5], [1, 5], [2, 5], [3, 5], [4, 5], [5, 5], [6, 5], [7, 5], [8, 5], [9, 5],
  [0, 6], [1, 6], [2, 6], [3, 6], [4, 6], [5, 6], [6, 6], [7, 6], [8, 6],
  [0, 7], [1, 7], [2, 7], [3, 7], [4, 7], [5, 7], [6, 7],
  [2, 8], [3, 8], [4, 8], [5, 8],
];

const EYE_LEFT = { cx: 2, cy: 3 };
const EYE_RIGHT = { cx: 6, cy: 3 };
const EYE_SIZE = 1.4;

type Props = {
  color: string;
  eyesRef: RefObject<SVGGElement | null>;
  blinkGRef: RefObject<SVGGElement | null>;
};

export const EyeCursorSprite = memo(function EyeCursorSprite({ color, eyesRef, blinkGRef }: Props) {
  return (
    <div style={{ position: 'relative', width: 10 * PIXEL, height: 9 * PIXEL }}>
      <svg
        width={10 * PIXEL}
        height={9 * PIXEL}
        viewBox="0 0 10 9"
        style={{ imageRendering: 'pixelated', display: 'block', position: 'absolute', top: 0, left: 0 }}
        shapeRendering="crispEdges"
        aria-hidden="true"
      >
        <g fill={color}>
          {ARROW_PIXELS.map(([x, y], i) => (
            <rect key={`a-${i}`} x={x * PIXEL} y={y * PIXEL} width={PIXEL} height={PIXEL} />
          ))}
        </g>

        <g ref={eyesRef} style={{ opacity: 1 }}>
          {[EYE_LEFT, EYE_RIGHT].map((eye, i) => (
            <g key={`eye-${i}`} transform={`translate(${eye.cx * PIXEL} ${eye.cy * PIXEL})`}>
              <rect x={0} y={0} width={EYE_SIZE * PIXEL} height={EYE_SIZE * PIXEL} fill="#ffffff" />
              <rect
                x={PIXEL * 0.3}
                y={PIXEL * 0.3}
                width={PIXEL * 0.8}
                height={PIXEL * 0.8}
                fill={color}
              />
            </g>
          ))}
        </g>

        <g ref={blinkGRef} style={{ opacity: 0 }}>
          {[EYE_LEFT, EYE_RIGHT].map((eye, i) => (
            <rect
              key={`lid-${i}`}
              x={eye.cx * PIXEL}
              y={(eye.cy + EYE_SIZE - 0.2) * PIXEL}
              width={EYE_SIZE * PIXEL}
              height={PIXEL * 0.35}
              fill={color}
            />
          ))}
        </g>
      </svg>
    </div>
  );
});
