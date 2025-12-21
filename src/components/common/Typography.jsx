export default function Typography({ children, variant = "body1", style = {}, ...props }) {
  const variants = {
    h1: { fontSize: "32px", fontWeight: "700", margin: "8px 0" },
    h2: { fontSize: "28px", fontWeight: "600", margin: "8px 0" },
    h3: { fontSize: "24px", fontWeight: "600", margin: "8px 0" },
    h4: { fontSize: "22px", fontWeight: "600", margin: "8px 0" },
    h5: { fontSize: "20px", fontWeight: "600", margin: "8px 0" },
    h6: { fontSize: "18px", fontWeight: "600", margin: "8px 0" },
    body1: { fontSize: "16px", margin: "6px 0" },
    body2: { fontSize: "14px", margin: "4px 0" },
    subtitle1: { fontSize: "16px", fontWeight: 500, margin: "4px 0" },
  };

  return (
    <p style={{ ...variants[variant], ...style }} {...props}>
      {children}
    </p>
  );
}
