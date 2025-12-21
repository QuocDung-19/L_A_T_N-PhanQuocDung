export default function Button({ children, onClick, type = "button" }) {
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        backgroundColor: "#8CBF41",
        color: "white",
        padding: "10px 20px",
        border: "none",
        borderRadius: "6px",
        cursor: "pointer",
        fontWeight: 600,
      }}
    >
      {children}
    </button>
  );
}