// src/components/common/Box.jsx
export default function Box({ children, style = {}, ...props }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" , ...style }} {...props}>
      {children}
    </div>
  );
}
