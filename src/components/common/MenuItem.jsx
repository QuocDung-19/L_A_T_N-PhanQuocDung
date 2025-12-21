// src/components/common/MenuItem.jsx
export default function MenuItem({ children, value, style = {}, ...props }) {
  return (
    <option value={value} style={{ padding: "10px", ...style }} {...props}>
      {children}
    </option>
  );
}
