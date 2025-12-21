import { Link, useLocation } from "react-router-dom";
import CustomLink from "./CustomLink";
import CustomButtonLink from "./CustomButtonLink";
import { useState, useEffect } from "react";
import { useAuth } from "../../services/api/AuthContext";
import LoginForm from "../auth/LoginForm";
import logo from "../../assets/images/Logo.png";

export default function Header() {
  const [openLogin, setOpenLogin] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);

  const location = useLocation();
  const { user, logout, initialized } = useAuth();

  const authPages = ["/login", "/register", "/forgot-password", "/reset-password"];
  const isAuthPage = authPages.includes(location.pathname);

  useEffect(() => {
    if (isAuthPage && openLogin) setOpenLogin(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    setConfirmLogout(false);
  };

  if (!initialized) return null;

  return (
    <>
      <header
        style={{
          padding: "15px 30px",
          background: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          position: "sticky",
          top: 0,
          zIndex: 100,
        }}
      >
        <Link
          to="/"
          style={{ display: "flex", alignItems: "center", textDecoration: "none" }}
        >
          <img src={logo} alt="Woodshop Logo" style={{ width: 120, height: 100 }} />
          <span style={{ fontSize: 24, fontWeight: 700, color: "#323232", marginLeft: 10 }}>
            Woodshop
          </span>
        </Link>

        <nav style={{ display: "flex", gap: 50 }}>
          <CustomLink to="/">Trang chủ</CustomLink>
          <CustomLink to="/products">Sản phẩm</CustomLink>
          <CustomLink to="/news">Tin tức</CustomLink>
          <CustomLink to="/contact">Liên hệ</CustomLink>
        </nav>

        <div
          style={{
            display: "flex",
            gap: 15,
            alignItems: "center",
            width: 250,
            justifyContent: "flex-end",
            visibility: isAuthPage ? "hidden" : "visible",
          }}
        >
          {(!user || user.role !== "customer") && (
            <>
              <CustomButtonLink onClick={() => setOpenLogin(true)}>Đăng nhập</CustomButtonLink>
              <CustomButtonLink to="/register">Đăng ký</CustomButtonLink>
            </>
          )}

          {user?.role === "customer" && (
            <>
              <Link to="/profile">
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: "#8CBF41",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {(user?.name || "").charAt(0).toUpperCase()}
                </div>
              </Link>
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
                }}
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </header>

 
      {openLogin && !isAuthPage && (!user || user.role !== "customer") && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 200,
          }}
          onClick={() => setOpenLogin(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <LoginForm onClose={() => setOpenLogin(false)} />
          </div>
        </div>
      )}

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
