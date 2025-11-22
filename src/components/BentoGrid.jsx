import { useEffect, useMemo, useRef, useState } from 'react';

const createResizeObserver = (callback) => {
  if (typeof ResizeObserver === 'undefined') return null;
  return new ResizeObserver(callback);
};

const BentoGridItem = ({ item, columns, rowHeight, gap, elementClassName }) => {
  const contentRef = useRef(null);
  const [rowSpan, setRowSpan] = useState(Math.max(1, item.height || 1));

  useEffect(() => {
    if (!contentRef.current) return undefined;

    const recalc = () => {
      if (!contentRef.current) return;
      const { height } = contentRef.current.getBoundingClientRect();
      const measuredSpan = Math.max(1, Math.ceil((height + gap) / rowHeight));
      const enforcedSpan = item.height ? Math.max(item.height, measuredSpan) : measuredSpan;
      setRowSpan(enforcedSpan);
    };

    recalc();
    const observer = createResizeObserver(recalc);
    observer?.observe(contentRef.current);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', recalc);
    }

    return () => {
      observer?.disconnect();
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', recalc);
      }
    };
  }, [gap, rowHeight, item.height]);

  const columnSpan = useMemo(
    () => Math.max(1, Math.min(columns, item.width || 1)),
    [columns, item.width]
  );

  return (
    <div
      className={`rounded-[28px] border border-white/30 bg-transparent ${elementClassName}`.trim()}
      style={{
        gridColumn: `span ${columnSpan}`,
        gridRowEnd: `span ${rowSpan}`,
      }}
    >
      <div ref={contentRef}>{item.element}</div>
    </div>
  );
};

const BentoGrid = ({
  items = [],
  gridCols = 1,
  rowHeight = 220,
  className = '',
  elementClassName = '',
  gap = 24,
}) => {
  const columns = Math.max(1, gridCols);
  const autoRowHeight = Math.max(40, rowHeight);

  return (
    <div
      className={`grid ${className}`.trim()}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: `${autoRowHeight}px`,
        gap: `${gap}px`,
      }}
    >
      {items.map((item) => (
        <BentoGridItem
          key={item.id}
          item={item}
          columns={columns}
          rowHeight={autoRowHeight}
          gap={gap}
          elementClassName={elementClassName}
        />
      ))}
    </div>
  );
};

export default BentoGrid;
