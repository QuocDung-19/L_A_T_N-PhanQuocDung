export default function StaffSidebar({ active, setActive }) {
  const menus = [
    { key: "confirm", label: "Xác nhận đơn hàng" },
    { key: "update", label: "Cập nhật trạng thái" },
    { key: "excel", label: "Nhập dữ liệu Excel" },
  ];

  return (
    <aside
      style={{
        width: 260,
        background: "#ffffff",
        borderRight: "1px solid #eee",
        padding: 24,
      }}
    >
      <h3
        style={{
          marginBottom: 24,
          fontSize: 14,
          fontWeight: 700,
          color: "#323232",
        }}
      >
        STAFF DASHBOARD
      </h3>

      {menus.map((m) => (
        <div
          key={m.key}
          onClick={() => setActive(m.key)}
          style={{
            padding: "12px 16px",
            borderRadius: 10,
            marginBottom: 10,
            cursor: "pointer",
            fontWeight: 500,
            background: active === m.key ? "#8CBF41" : "#fff",
            color: active === m.key ? "#fff" : "#323232",
            boxShadow:
              active === m.key ? "0 4px 10px rgba(140,191,65,0.3)" : "none",
            transition: "all 0.2s ease",
          }}
        >
          {m.label}
        </div>
      ))}
    </aside>
  );
}
