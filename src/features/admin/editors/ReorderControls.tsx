import { motion, type DragControls } from 'framer-motion';
import { GripVertical, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const controlBtnClass =
  'inline-flex size-6 items-center justify-center rounded border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30';

type ReorderControlsProps = {
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  /** When provided, renders a drag handle wired to the framer-motion
   * drag controls (from useDragControls inside the Reorder.Item). */
  dragControls?: DragControls;
  className?: string;
};

/**
 * Shared reorder affordances for the admin editors: a drag handle (when
 * dragControls is given) plus Up/Down buttons as an accessible fallback.
 * Both paths call `onMove(from, to)` so reordering logic stays in one place.
 */
export function ReorderControls({
  index,
  count,
  onMove,
  dragControls,
  className,
}: ReorderControlsProps) {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {dragControls && (
        <motion.button
          type="button"
          aria-label="Drag to reorder"
          title="Drag to reorder"
          className={cn(controlBtnClass, 'cursor-grab active:cursor-grabbing')}
          onPointerDown={(e) => dragControls.start(e)}
        >
          <GripVertical className="size-3.5" aria-hidden="true" />
        </motion.button>
      )}
      <button
        type="button"
        aria-label="Move up"
        title="Move up"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        className={controlBtnClass}
      >
        <ChevronUp className="size-3.5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Move down"
        title="Move down"
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
        className={controlBtnClass}
      >
        <ChevronDown className="size-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}