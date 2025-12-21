import React, { useState } from "react";
import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import Button from "../../components/common/Button";
import CartItemList, { useCart } from "../cart/CartItemList";
import { createOrder } from "../../services/api/orderApi";
import { createPayment } from "../../services/api/paymentApi";
import { useNavigate } from "react-router-dom";

export default function CheckoutPage() {
  const { cartItems, totalPrice } = useCart();
  const navigate = useNavigate();
  const [method, setMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    try {
      setLoading(true);

      const order = await createOrder({
        items: cartItems.map(i => ({
          productId: i.productId,
          quantity: i.quantity
        }))
      });

      await createPayment({
        orderId: order.id,
        method,
        amount: totalPrice
      });

      alert("Đặt hàng thành công!");
      localStorage.removeItem("cart");
      navigate("/orders");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ padding: 32, maxWidth: 1100, margin: "0 auto" }}>
      <Typography variant="h4" style={{ marginBottom: 20 }}>
        💳 Thanh toán
      </Typography>

      <CartItemList editable={false} />

      <Box style={{ marginTop: 20 }}>
        <Typography>Phương thức thanh toán</Typography>
        <select
          value={method}
          onChange={e => setMethod(e.target.value)}
          style={{ padding: 10, marginTop: 10, width: 220 }}
        >
          <option value="COD">Thanh toán khi nhận hàng</option>
          <option value="VNPAY">VNPay</option>
        </select>
      </Box>

      <Button
        onClick={handleCheckout}
        disabled={loading}
        style={{
          marginTop: 24,
          background: "#8CBF41",
          color: "#fff",
          padding: "12px 32px"
        }}
      >
        {loading ? "Đang xử lý..." : "Xác nhận thanh toán"}
      </Button>
    </Box>
  );
}
