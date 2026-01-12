import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import Button from "../../components/common/Button";
import TextField from "../../components/common/TextField";

import CartOrderList from "./CartOrderList";
import { useCart } from "./CartItemList";

import { getOrderById } from "../../services/api/orderApi";
import { createPayment } from "../../services/api/paymentApi";
import { getUserById } from "../../services/api/userApi";

export default function CheckoutPage() {
  const { orderID } = useParams();
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [order, setOrder] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("COD");

  const [customerInfo, setCustomerInfo] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  /* ================= LOAD USER (GIỐNG PROFILE) ================= */
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = JSON.parse(localStorage.getItem("user"));
        if (!storedUser?.userID) return;

        const userData = await getUserById(storedUser.userID);
        setUser(userData);

        setCustomerInfo({
          fullName: userData.fullName || "",
          phone: userData.phone || "",
          email: userData.email || "",
          address: userData.address || "",
        });
      } catch (err) {
        console.error("Không lấy được thông tin user", err);
      }
    };

    loadUser();
  }, []);

  /* ================= LOAD ORDER (NẾU THANH TOÁN TỪ PROFILE) ================= */
  useEffect(() => {
    const loadOrder = async () => {
      if (!orderID) return;
      try {
        const data = await getOrderById(orderID);
        setOrder(data);
      } catch (err) {
        alert("Không tải được đơn hàng");
      }
    };

    loadOrder();
  }, [orderID]);

  const itemsToDisplay = order?.items || cartItems;
  const totalToDisplay = order ? order.totalAmount : totalPrice;

  /* ================= CHECKOUT ================= */
  const handleCheckout = async () => {
    if (
      !customerInfo.fullName ||
      !customerInfo.phone ||
      !customerInfo.address
    ) {
      alert("Vui lòng nhập đầy đủ thông tin người nhận");
      return;
    }

    if (!itemsToDisplay || itemsToDisplay.length === 0) {
      alert("Không có sản phẩm để thanh toán");
      return;
    }

    try {
      setLoading(true);

      // COD
      if (method === "COD") {
        await createPayment({
          orderId: orderID || null,
          method: "COD",
          amount: Math.round(totalToDisplay),
          customer: customerInfo,
          orderInfo: "Thanh toán COD",
        });

        alert("Đặt hàng thành công!");
        clearCart();
        navigate("/profile");
        return;
      }

      // VNPAY
      if (method === "VNPAY") {
        const res = await createPayment({
          orderId: orderID || null,
          method: "VNPAY",
          amount: Math.round(totalToDisplay),
          customer: customerInfo,
          orderInfo: `Thanh toán đơn hàng #${
            orderID || "CART"
          } - ${customerInfo.fullName}`,
        });

        // Redirect sandbox VNPAY
        window.location.href = res.paymentUrl;
      }
    } catch (err) {
      console.error(err);
      alert("Thanh toán thất bại");
    } finally {
      setLoading(false);
    }
  };

  if (!itemsToDisplay || itemsToDisplay.length === 0) {
    return (
      <>
        <Header />
        <Box style={{ padding: 32 }}>
          <Typography variant="h5">Giỏ hàng đang trống</Typography>
        </Box>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <Box style={{ padding: 32, maxWidth: 1200, margin: "0 auto" }}>
        <Typography variant="h4" style={{ marginBottom: 24 }}>
          Thanh toán đơn hàng
        </Typography>

        <Box style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          {/* LEFT */}
          <Box>
            <Typography variant="h6" style={{ marginBottom: 12 }}>
              Thông tin người nhận
            </Typography>

            <TextField
              label="Họ và tên"
              value={customerInfo.fullName}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, fullName: e.target.value })
              }
            />

            <TextField
              label="Số điện thoại"
              value={customerInfo.phone}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, phone: e.target.value })
              }
            />

            <TextField
              label="Email"
              value={customerInfo.email}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, email: e.target.value })
              }
            />

            <TextField
              label="Địa chỉ"
              value={customerInfo.address}
              onChange={(e) =>
                setCustomerInfo({ ...customerInfo, address: e.target.value })
              }
            />

            <Typography variant="h6" style={{ margin: "20px 0 10px" }}>
              Sản phẩm
            </Typography>

            <Box
              style={{
                maxHeight: 300,
                overflowY: "auto",
                borderBottom: "1px solid #eee",
                paddingBottom: 8,
              }}
            >
              <CartOrderList order={{ items: itemsToDisplay }} />
            </Box>
          </Box>

          {/* RIGHT */}
          <Box
            style={{
              border: "1px solid #8CBF41",
              padding: 24,
              borderRadius: 8,
              height: "fit-content",
            }}
          >
            <Typography variant="h6">Thanh toán</Typography>

            <Typography
              variant="h5"
              style={{ color: "#8CBF41", margin: "16px 0" }}
            >
              {totalToDisplay.toLocaleString("vi-VN")} ₫
            </Typography>

            <label>
              <input
                type="radio"
                checked={method === "COD"}
                onChange={() => setMethod("COD")}
              />{" "}
              Thanh toán khi nhận hàng (COD)
            </label>

            <br />

            <label>
              <input
                type="radio"
                checked={method === "VNPAY"}
                onChange={() => setMethod("VNPAY")}
              />{" "}
              Thanh toán qua VNPay
            </label>

            <Button
              fullWidth
              onClick={handleCheckout}
              disabled={loading}
              style={{
                marginTop: 20,
                background: "#8CBF41",
                color: "#fff",
              }}
            >
              {loading ? "Đang xử lý..." : "Thanh toán"}
            </Button>
          </Box>
        </Box>
      </Box>

      <Footer />
    </>
  );
}
