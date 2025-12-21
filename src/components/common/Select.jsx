// src/components/common/Select.jsx
export default function Select({ value, onChange, children, style = {}, ...props }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        padding: "8px 12px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "15px",
        cursor: "pointer",
        ...style,
      }}
      {...props}
    >
      {children}
    </select>
  );
}
