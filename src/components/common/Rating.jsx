// src/components/common/Rating.jsx
import { useState } from "react";

export default function Rating({ value = 0, max = 5, onChange, size = 22 }) {
  const [hover, setHover] = useState(null);

  return (
    <div style={{ display: "flex", gap: "4px", cursor: "pointer" }}>
      {[...Array(max)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <span
            key={index}
            onClick={() => onChange && onChange(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(null)}
            style={{
              fontSize: size,
              color: (hover || value) >= ratingValue ? "#FFC107" : "#CCC",
              transition: "0.2s",
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
