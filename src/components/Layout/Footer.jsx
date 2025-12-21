import logo from "../../assets/images/Logo.png";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#323232",
        color: "#fff",
        padding: "40px 30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      {/* Logo trái */}
      <div style={{ flex: 1, minWidth: 200 }}>
        <img src={logo} alt="Woodshop Logo" style={{ width: 120, marginBottom: 10, backgroundColor: "#fff", borderRadius: 90 }} />
        <p>WoodShop – Nơi bạn tìm thấy mọi sản phẩm gỗ chất lượng.</p>
      </div>

      {/* Thông tin liên hệ */}
      <div style={{ flex: 1, minWidth: 200 }}>
        <h4 style={{ marginBottom: 10 }}>Thông tin liên hệ</h4>
        <p>Địa chỉ: TP. Hồ Chí Minh</p>
        <p>Email: contact@woodshop.vn</p>
        <p>Hotline: 0900 123 456</p>
      </div>

      {/* Link nhanh */}
      <div style={{ flex: 1, minWidth: 200 }}>
        <h4 style={{ marginBottom: 10 }}>Liên kết nhanh</h4>
        <Link to="/" style={{ color: "#fff", display: "block", marginBottom: 5, textDecoration: "none" }}>Trang chủ</Link>
        <Link to="/products" style={{ color: "#fff", display: "block", marginBottom: 5, textDecoration: "none" }}>Sản phẩm</Link>
        <Link to="/news" style={{ color: "#fff", display: "block", marginBottom: 5, textDecoration: "none" }}>Tin tức</Link>
        <Link to="/contact" style={{ color: "#fff", display: "block", marginBottom: 5, textDecoration: "none" }}>Liên hệ</Link>
      </div>

      {/* Logo phải */}
      <div style={{ flexBasis: "100%", textAlign: "center", marginTop: 30 }}>
        <p>© 2025 WoodShop. All rights reserved.</p>
      </div>
    </footer>
  );
}
