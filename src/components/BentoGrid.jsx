import { useEffect, useMemo, useRef, useState } from 'react';

const clampColumnSpan = (width, columns) => {
  if (!Number.isFinite(width)) return 1;
  return Math.max(1, Math.min(columns, Math.round(width)));
};

const clampRowSpan = (height) => {
  if (!Number.isFinite(height)) return 1;
  return Math.max(1, Math.round(height));
};

const createResizeObserver = (callback) => {
  if (typeof ResizeObserver === 'undefined') return null;
  return new ResizeObserver(callback);
};

const BentoGridItem = ({ item, columns, rowHeight, gap, elementClassName }) => {
  const contentRef = useRef(null);
  const [rowSpan, setRowSpan] = useState(() => clampRowSpan(item?.height ?? 1));

  useEffect(() => {
    const node = contentRef.current;
    if (!node) return undefined;

    const recalc = () => {
      if (!contentRef.current) return;
      const { height } = contentRef.current.getBoundingClientRect();
      if (!height) return;
      const measuredSpan = Math.ceil((height + gap) / rowHeight);
      const minSpan = clampRowSpan(item?.height ?? 1);
      setRowSpan(Math.max(minSpan, measuredSpan));
    };

    recalc();
    const observer = createResizeObserver(recalc);
    observer?.observe(node);
    if (typeof window !== 'undefined') {
      window.addEventListener('resize', recalc);
    }

    return () => {
      observer?.disconnect();
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', recalc);
      }
    };
  }, [gap, rowHeight, item?.height]);

  const columnSpan = useMemo(
    () => clampColumnSpan(item?.width ?? 1, columns),
    [item?.width, columns]
  );

  const cardClassName = ['bento-card', item?.color ?? '', elementClassName]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <div
      className={cardClassName}
      style={{
        gridColumn: `span ${columnSpan}`,
        gridRowEnd: `span ${rowSpan}`,
      }}
    >
      <div ref={contentRef}>{item?.element}</div>
    </div>
  );
};

const BentoGrid = ({
  items = [],
  gridCols = 1,
  rowHeight = 200,
  className = '',
  elementClassName = '',
  gap = 24,
}) => {
  const columns = Math.max(1, gridCols);
  const autoRowHeight = Math.max(40, rowHeight);
  const containerClassName = ['bento-grid grid', className]
    .filter(Boolean)
    .join(' ')
    .trim();

  return (
    <div
      className={containerClassName}
      style={{
        gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        gridAutoRows: `${autoRowHeight}px`,
        gridAutoFlow: 'dense',
        gap: `${gap}px`,
      }}
    >
      {items.map((item, index) => (
        <BentoGridItem
          key={item?.id ?? index}
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
