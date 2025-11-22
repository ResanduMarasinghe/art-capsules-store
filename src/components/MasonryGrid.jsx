const MasonryGrid = ({
  items = [],
  columns = 3,
  className = '',
}) => {
  if (!items?.length) return null;

  return (
    <div
      className={`masonry-grid ${className}`.trim()}
      style={{
        columnCount: columns,
        columnGap: '24px',
      }}
    >
      {items.map((item, index) => (
        <div
          key={item?.id ?? index}
          className="masonry-item"
          style={{
            breakInside: 'avoid',
            marginBottom: '24px',
          }}
        >
          {item?.element}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
