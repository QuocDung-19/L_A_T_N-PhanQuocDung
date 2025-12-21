import { Link, useLocation } from "react-router-dom";

export default function CustomLink({ to, children, style, className, ...props }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  const defaultStyle = {
    textDecoration: "none",
    color: "#323232", // chữ xám đậm
    fontWeight: 500,
    transition: "all 0.3s",
    fontSize: 20,
    position: "relative",
    ...style,
  };

  return (
    <Link
      to={to}
      style={defaultStyle}
      className={className ? className : ""}
      {...props}
      onMouseEnter={(e) => (e.target.style.color = "#8CBF41")}
      onMouseLeave={(e) => (e.target.style.color = isActive ? "#8CBF41" : "#323232")}
    >
      {children}
      {/* Gạch dưới khi active */}
      {isActive && (
        <span
          style={{
            position: "absolute",
            bottom: -5,
            left: 0,
            width: "100%",
            height: 3,
            backgroundColor: "#8CBF41",
            borderRadius: 2,
          }}
        />
      )}
    </Link>
  );
}
