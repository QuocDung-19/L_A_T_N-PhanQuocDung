// src/components/common/Divider.jsx
export default function Divider({ style = {}, ...props }) {
  return (
    <div
      style={{
        width: "100%",
        height: "1px",
        backgroundColor: "#ddd",
        margin: "12px 0",
        ...style,
      }}
      {...props}
    />
  );
}
