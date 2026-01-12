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

  console.log = () => {};

  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth(); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  
  const calcVolume = (item) => {
  const d = Number(item.length);
  const r = Number(item.width);
  const h = Number(item.height);
  const p = Number(item.piecesNumber || 1);

  if ([d, r, h, p].some(v => isNaN(v))) return 0;

  return Number(((d * r * h * p) / 1_000_000_000).toFixed(4));
};

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
          items: cartItems.map(i => {
            const volume = calcVolume(i);
            const finalPrice = Number(i.price) * volume;

            console.log("ORDER ITEM DEBUG", {
              productID: i.productId,
              unitPrice: i.price,
              volume,
              finalPrice
            });

            return {
              productID: i.productId,
              quantity: i.quantity,
              price: finalPrice
            };
          })
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
        <Box
          style={{
            maxHeight: 475,
            overflowY: "auto",
            marginBottom: 12,
            borderBottom: "1px solid #eee",
            paddingBottom: 8,
          }}
          >
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
              marginTop: 40,
            }}
          >
            <Typography variant="h6" style={{ marginBottom: 16 }}>
              Thông tin đơn hàng
            </Typography>

            <Box
              style={{
                maxHeight: 300,
                overflowY: "auto",
                marginBottom: 12,
                borderBottom: "1px solid #eee",
                paddingBottom: 8,
              }}
            >
              {cartItems.map((item, idx) => (
                <Box
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 8,
                  }}
                >
                  <Typography>
                    {item.name} x {item.quantity}
                  </Typography>
                  <Typography>{item.price.toLocaleString("vi-VN")} ₫</Typography>
                </Box>
              ))}
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
                fontSize: 16,
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
