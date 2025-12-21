import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus } from "../../services/api/orderApi";
import Button from "../../components/common/Button";

export default function OrderList({ type, onReloadStats }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await getOrders();

      let filtered = data;

      if (type === "confirm") {
        filtered = data.filter(o => o.status === "PENDING");
      }

      if (type === "update") {
        filtered = data.filter(o => o.status === "CONFIRMED");
      }

      setOrders(filtered);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [type]);

  const handleStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      alert("Cập nhật thành công");

      await fetchOrders();    // reload list
      onReloadStats?.();      // ✅ reload stats
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <div>Đang tải đơn hàng...</div>;
  if (orders.length === 0) return <div>Không có đơn phù hợp</div>;

  return (
    <div style={{ maxHeight: 400, overflowY: "auto" }}>
      <div style={rowHeader}>
        <div style={col(1)}>Mã đơn</div>
        <div style={col(2)}>Khách</div>
        <div style={col(2)}>Ngày tạo</div>
        <div style={col(2)}>Tổng tiền</div>
        <div style={col(2)}>Trạng thái</div>
        <div style={col(3)}>Hành động</div>
      </div>

      {orders.map(order => (
        <div key={order.orderID} style={row}>
          <div style={col(1)}>#{order.orderID}</div>
          <div style={col(2)}>{order.userID}</div>
          <div style={col(2)}>{order.orderDate}</div>
          <div style={col(2)}>
            {order.totalAmount.toLocaleString("vi-VN")} ₫
          </div>
          <div style={col(2)}>{order.status}</div>

          <div style={col(3)}>
            {type === "confirm" && (
              <Button onClick={() => handleStatus(order.orderID, "CONFIRMED")}>
                Xác nhận đơn
              </Button>
            )}

            {type === "update" && (
              <Button
                style={{ background: "#27ae60" }}
                onClick={() => handleStatus(order.orderID, "COMPLETED")}
              >
                Đã thanh toán
              </Button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

const rowHeader = {
  display: "flex",
  padding: "12px 0",
  fontWeight: 600,
  borderBottom: "2px solid #ddd",
};

const row = {
  display: "flex",
  padding: "14px 0",
  borderBottom: "1px solid #eee",
  alignItems: "center",
};

const col = flex => ({
  flex,
  paddingRight: 12,
});
