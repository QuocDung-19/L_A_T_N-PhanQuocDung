// src/components/common/FormControl.jsx
export default function FormControl({ children, style = {}, ...props }) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        marginBottom: "12px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
