export default function Avatar({ src, alt = "", size = 48, style = {}, ...props }) {
  return (
    <img
      src={src}
      alt={alt}
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        objectFit: "cover",
        ...style,
      }}
      {...props}
    />
  );
}