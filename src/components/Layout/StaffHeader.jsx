import logo from "../../assets/images/Logo.png";
import { useState } from "react";
import { useAuth } from "../../services/api/AuthContext";

export default function StaffHeader({ user }) {
  const { logout } = useAuth();
  const [confirmLogout, setConfirmLogout] = useState(false);

  const handleLogout = () => {
    logout();
    setConfirmLogout(false);
  };

  return (
    <>
      <header
        style={{
          background: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "15px 30px",
          borderBottom: "1px solid #eee",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <img src={logo} alt="logo" style={{ width: 120, height: 100 }} />
          <span style={{ fontSize: 18, fontWeight: 700, color: "#323232" }}>
            Woodshop / Staff
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "#8CBF41",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            {user?.username?.charAt(0)?.toUpperCase() || "S"}
          </div>
          <button
            onClick={() => setConfirmLogout(true)}
            style={{
              border: "none",
              background: "#8CBF41",
              color: "#fff",
              fontWeight: 600,
              padding: "6px 12px",
              borderRadius: 6,
              cursor: "pointer",
              transition: "0.3s",
            }}
          >
            Đăng xuất
          </button>
        </div>
      </header>

      {/* LOGOUT CONFIRM MODAL */}
      {confirmLogout && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 300,
          }}
          onClick={() => setConfirmLogout(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 30,
              borderRadius: 10,
              width: 350,
              textAlign: "center",
              boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            <p style={{ fontSize: 18, fontWeight: 600, color: "#323232", marginBottom: 20 }}>
              Bạn có chắc muốn đăng xuất?
            </p>
            <div style={{ display: "flex", justifyContent: "center", gap: 20 }}>
              <button
                onClick={() => setConfirmLogout(false)}
                style={{
                  padding: "6px 20px",
                  borderRadius: 6,
                  border: "1px solid #323232",
                  background: "#fff",
                  color: "#323232",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                style={{
                  padding: "6px 20px",
                  borderRadius: 6,
                  border: "none",
                  background: "#8CBF41",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
      <div style={{ width: "100%", height: 3, backgroundColor: "#000", marginTop: 5 }} />
    </>
  );
}
