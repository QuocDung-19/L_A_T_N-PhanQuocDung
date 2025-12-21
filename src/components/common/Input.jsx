export default function Input({ label, value, onChange, multiline, rows = 3 }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && (
        <label style={{ display: "block", marginBottom: 6, fontWeight: 500 }}>
          {label}
        </label>
      )}

      {multiline ? (
        <textarea
          rows={rows}
          value={value}
          onChange={onChange}
          style={inputStyle}
        />
      ) : (
        <input value={value} onChange={onChange} style={inputStyle} />
      )}
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "1px solid #ccc",
  outline: "none",
  fontSize: 14,
};
