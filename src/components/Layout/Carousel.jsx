import React, { useRef, useEffect } from "react";

export default function Carousel({ children, itemsPerView = 5, autoPlay = 120000 }) {
  const containerRef = useRef(null);

 
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, autoPlay);
    return () => clearInterval(interval);
  }, [children]);

  const next = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      containerRef.current.scrollBy({ left: width, behavior: "smooth" });
    }
  };

  const prev = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      containerRef.current.scrollBy({ left: -width, behavior: "smooth" });
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <div
        ref={containerRef}
        style={{
          display: "flex",
          overflow: "hidden",
          gap: "16px",
        }}
      >
        {React.Children.map(children, (child) => (
          <div style={{ flex: `0 0 calc(100% / ${itemsPerView} - 16px)` }}>
            {child}
          </div>
        ))}
      </div>

      {/* Prev/Next Buttons */}
      <button
        onClick={prev}
        style={{
          position: "absolute",
          top: "50%",
          left: 0,
          transform: "translateY(-50%)",
          background: "#8CBF41",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 36,
          height: 36,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        &#8249;
      </button>
      <button
        onClick={next}
        style={{
          position: "absolute",
          top: "50%",
          right: 0,
          transform: "translateY(-50%)",
          background: "#8CBF41",
          color: "#fff",
          border: "none",
          borderRadius: "50%",
          width: 36,
          height: 36,
          cursor: "pointer",
          zIndex: 10,
        }}
      >
        &#8250;
      </button>
    </div>
  );
}
