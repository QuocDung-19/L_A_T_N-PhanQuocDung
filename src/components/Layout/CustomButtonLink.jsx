import { Link } from "react-router-dom";
import React from "react";

export default function CustomButtonLink({ children, to, onClick, className, style = {}, ...props }) {
  const [hover, setHover] = React.useState(false);

  const defaultStyle = {
    background: "#8CBF41", 
    border: "none",
    padding: "8px 16px",
    cursor: "pointer",
    color: "#fff", 
    fontWeight: 600,
    fontSize: 10,
    textDecoration: "none",
    borderRadius: 6,
    transition: "all 0.3s",
    display: "inline-block",
    ...style,
  };

  const hoverStyle = {
    background: "#76a736",
  };

  if (to) {
    return (
      <Link
        to={to}
        className={className ? className : ""}
        style={{ ...defaultStyle, ...(hover ? hoverStyle : {}) }}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        {...props}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      style={{ ...defaultStyle, ...(hover ? hoverStyle : {}) }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      {...props}
    >
      {children}
    </button>
  );
}
