// src/components/common/TextField.jsx
export default function TextField({ label, value, onChange, type = "text", placeholder = "", style = {}, ...props }) {
  return (
    <div style={{ marginBottom: 15, ...style }}>
      {label && <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>{label}</label>}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{
          width: "93%",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #ccc",
          outline: "none",
          fontSize: 14,
        }}
        {...props}
      />
    </div>
  );
}
