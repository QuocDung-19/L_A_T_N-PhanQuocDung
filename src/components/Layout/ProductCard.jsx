import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/api/AuthContext";

import Box from "../../components/common/Box";
import Card, { CardMedia, CardContent } from "../../components/common/Card";
import Typography from "../../components/common/Typography";

export default function ProductCard({ product }) {

  console.log = () => {};

  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleClick = () => {
    console.group("PRODUCT CARD DEBUG");
    console.log("PRODUCT OBJECT:", product);
    console.log("product.id:", product?.id);
    console.log("navigate to:", `/products/${product?.id}`);
    console.groupEnd();

    if (!user) {
      setShowLoginPopup(true);
      return;
    }

    navigate(`/products/${product.id}`);
  };

  const getStatusInfo = () => {
  switch (product.status) {
    case "OUT_OF_STOCK":
      return { text: "Hết hàng", color: "#dc3545" };

    case "INACTIVE":
      return { text: "Đang bán", color: "#6c757d" };

    case "ACTIVE":
    default:
      return { text: "Hàng mới", color: "#28a745" };
  }
};

const status = getStatusInfo();

  return (
    <>
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        <Card style={{ width: "100%", padding: 0, overflow: "hidden" }}>
          <Box style={{ position: "relative" }}>
            <Box style={{ position: "relative" }}>
              <CardMedia
                src={product.image || "/images/no-image.png"}
                alt={product.name}
                style={{ height: 260 }}
              />

              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: "#8CBF41",
                  color: "#fff",
                  padding: "10px 12px",
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: 700,
                }}
              >
                <span>{product.name}</span>
                <span
                  style={{
                    background: "#fff",
                    color: "#ff8c00",
                    padding: "4px 8px",
                    borderRadius: 20,
                  }}
                >
                  PQD
                </span>
              </div>
                <Box
                  style={{
                    position: "absolute",
                    left: 12,
                    top: 24,
                    right: 12,
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      background: "#323232",
                      color: "#fff",
                      padding: "4px 8px",
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                    }}
                  >
                    {product.height} x {product.length} x {product.width} = {product.piecesNumber} thanh
                  </div>

                  <span
                    style={{
                      padding: "4px 10px",
                      borderRadius: 20,
                      fontSize: 13,
                      fontWeight: 700,
                      background: status.color,
                      color: "#fff",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {status.text}
                  </span>
                </Box>
            </Box>

            <div style={{
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              background: "#8CBF41",
              color: "#fff",
              padding: "10px 12px",
              display: "flex",
              justifyContent: "space-between",
              fontWeight: 700,
            }}>
              <span>{product.name}</span>
              <span style={{
                background: "#fff",
                color: "#ff8c00",
                padding: "4px 8px",
                borderRadius: 20,
              }}>PQD</span>
            </div>
          </Box>

          <CardContent>         
          <Typography variant="body2" style={{ color: "#555", fontSize: 15, fontWeight: 500, margin: "0px 5px 5px" }}>
            Quy cách: {product.height} x {product.length} x {product.width} = {product.piecesNumber}
          </Typography>

            <Typography variant="body1" style={{ fontWeight: 800,margin: "0px 5px" }}>
              {product.price?.toLocaleString("vi-VN")} ₫
            </Typography>
          </CardContent>
        </Card>
      </div>

      {showLoginPopup && (
        <div onClick={() => setShowLoginPopup(false)} style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 500,
        }}>
          <div onClick={(e) => e.stopPropagation()} style={{
            background: "#fff",
            padding: 25,
            borderRadius: 10,
            width: 350,
            textAlign: "center",
          }}>
            <Typography variant="h3" style={{ marginBottom: 10 }}>Bạn cần đăng nhập</Typography>
            <Typography variant="body1" style={{ marginBottom: 20 }}>Vui lòng đăng nhập để xem chi tiết sản phẩm.</Typography>
            <button onClick={() => (window.location.href = "/login")} style={{
              padding: "10px 15px",
              background: "#8CBF41",
              color: "#fff",
              borderRadius: 6,
              border: "none",
              cursor: "pointer",
            }}>Đăng nhập</button>
          </div>
        </div>
      )}
    </>
  );
}
