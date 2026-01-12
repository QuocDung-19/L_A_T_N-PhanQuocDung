import Box from "./Box";
import Typography from "./Typography";

export default function Textarea({
  label,
  value,
  onChange,
  placeholder = "",
  minHeight = 300,
  maxHeight = 500,
  disabled = false,
}) {
  return (
    <Box>
      {label && (
        <Typography
          variant="body2"
          style={{ marginBottom: 6, fontWeight: 500 }}
        >
          {label}
        </Typography>
      )}

      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        style={{

          minHeight,
          maxHeight,
          padding: "12px",
          borderRadius: 8,
          border: "1px solid #ccc",
          fontSize: 14,
          lineHeight: 1.6,
          resize: "vertical",
          overflowY: "auto",
          outline: "none",
          fontFamily: "inherit",
          backgroundColor: disabled ? "#f5f5f5" : "#fff",
        }}
      />
    </Box>
  );
}
