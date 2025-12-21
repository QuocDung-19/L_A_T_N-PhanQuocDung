import React, { useState } from "react";
import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import Button from "../../components/common/Button";
import CartItemList, { useCart } from "./CartItemList";
import { createOrder } from "../../services/api/orderApi";
import { useAuth } from "../../services/api/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

export default function CartPage() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  

    const handleCreateOrder = async () => {
      if (!user) {
        alert("Bạn cần đăng nhập để đặt hàng");
        return;
      }

      if (cartItems.length === 0) return;

      try {
        setLoading(true);

        await createOrder({
          userID: user.userID,
          items: cartItems.map(i => ({
            productID: i.productId,
            quantity: i.quantity
          }))
        });

       
        clearCart();

        alert("Tạo đơn hàng thành công!");
        navigate("/profile");

      } catch (err) {
        alert(err.message || "Tạo đơn thất bại");
      } finally {
        setLoading(false);
      }
    };


  return (
    <>
      <Header />
    <Box style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
      <Typography variant="h4" style={{ marginBottom: 24 }}>
        Xác nhận đơn hàng
      </Typography>

      <Box
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 24
        }}
      >
        <Box>
          <Typography variant="h6" style={{ marginBottom: 12 }}>
            Sản phẩm trong đơn
          </Typography>

          <CartItemList editable showCheckoutButton={false} />
        </Box>

      <Box>
        <Box
          style={{
            background: "#fff",
            borderRadius: 8,
            padding: 20,
            border: "1px solid #8CBF41",
            height: "fit-content",
            marginTop: 40
          }}
        >
          <Typography variant="h6" style={{ marginBottom: 16 }}>
            Thông tin đơn hàng
          </Typography>

          <Box style={{ marginBottom: 12 }}>
            <Typography>
              Số sản phẩm: <b>{cartItems.length}</b>
            </Typography>
          </Box>

          <Box style={{ marginBottom: 20 }}>
            <Typography variant="h5" style={{ color: "#8CBF41" }}>
              Tổng tiền: {totalPrice.toLocaleString("vi-VN")} ₫
            </Typography>
          </Box>

          <Button
            fullWidth
            onClick={handleCreateOrder}
            disabled={loading || cartItems.length === 0}
            style={{
              background: "#8CBF41",
              color: "#fff",
              padding: "14px 0",
              fontSize: 16
            }}
          >
            {loading ? "Đang tạo đơn..." : "Xác nhận đơn hàng"}
          </Button>
        </Box>
        </Box>
      </Box>
    </Box>
  <Footer />
    </>   
  );
}
