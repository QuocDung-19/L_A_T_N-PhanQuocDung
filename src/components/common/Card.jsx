// src/components/common/Card.jsx
import Box from "./Box";

export default function Card({ children, style = {}, ...props }) {
  return (
    <Box
      style={{
        padding: "20px",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
        backgroundColor: "white",
        ...style,
      }}
      {...props}
    >
      {children}
    </Box>
  );
}

// src/components/common/CardMedia.jsx

export function CardMedia({
  src,
  alt = "",
  height = 160,
  style = {},
  ...props
}) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: "100%",
        height,
        objectFit: "cover",
        borderTopLeftRadius: "12px",
        borderTopRightRadius: "12px",
        display: "block",
        ...style,
      }}
      {...props}
    />
  );
}
// src/components/common/CardContent.jsx

export function CardContent({ children, style = {}, ...props }) {
  return (
    <div
      style={{
        paddingTop: "12px",
        paddingBottom: "12px",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
