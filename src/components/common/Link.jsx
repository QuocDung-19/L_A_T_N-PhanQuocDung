// src/components/common/Link.jsx
export default function Link({ children, href = "#", style = {}, ...props }) {
  return (
    <a
      href={href}
      style={{
        color: "#1976d2",
        textDecoration: "none",
        cursor: "pointer",
        ...style,
      }}
      {...props}
    >
      {children}
    </a>
  );
}
