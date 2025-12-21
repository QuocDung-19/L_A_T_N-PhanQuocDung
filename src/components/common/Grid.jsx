export default function Grid({ container, item, columns = 12, spacing = 10, style = {}, children, ...props }) {
  if (container) {
    return (
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: spacing,
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }

  if (item) {
    const width = `calc(${(columns / 12) * 100}% - ${spacing}px)`;

    return (
      <div style={{ width, ...style }} {...props}>
        {children}
      </div>
    );
  }

  return (
    <div style={style} {...props}>
      {children}
    </div>
  );
}
