import React, { useEffect, useState } from "react";
import { getOrders } from "../../services/api/orderApi";

const row = {
  display: "flex",
  padding: "10px",
  borderBottom: "1px solid #ddd",
  alignItems: "center"
};

const col = flex => ({ flex, textAlign: "center" });

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders().then(setOrders);
  }, []);

  return (
    <div>
      <h2>Lịch sử tạo đơn</h2>

      {/* Header */}
      <div style={{ ...row, fontWeight: "bold", background: "#f5f5f5" }}>
        <div style={col(1)}>Order ID</div>
        <div style={col(2)}>User</div>
        <div style={col(2)}>Ngày tạo</div>
        <div style={col(2)}>Tổng tiền</div>
        <div style={col(2)}>Trạng thái</div>
      </div>

      <div style={{ maxHeight: 300, overflowY: "auto" }}>
        {orders.map(o => (
          <div key={o.orderID} style={row}>
            <div style={col(1)}>#{o.orderID}</div>
            <div style={col(2)}>{o.userID}</div>
            <div style={col(2)}>{o.orderDate}</div>
            <div style={col(2)}>
              {o.totalAmount?.toLocaleString("vi-VN")} ₫
            </div>
            <div style={col(2)}>{o.status}</div>
          </div>
        ))}
      </div>
    </div>
  );
}