import React, { useEffect, useState } from "react";
import { getOrders } from "../../services/api/orderApi";

const row = {
  display: "flex",
  padding: "10px",
  borderBottom: "1px solid #ddd",
  alignItems: "center"
};

const col = flex => ({ flex, textAlign: "center" });

export default function PaymentHistory() {
  const [paidOrders, setPaidOrders] = useState([]);

  useEffect(() => {
    getOrders().then(data => {
      const completed = data.filter(o => o.status === "COMPLETED");
      setPaidOrders(completed);
    });
  }, []);

  return (
    <div>
      <h2>Lịch sử thanh toán</h2>

      <div style={{ ...row, fontWeight: "bold", background: "#f5f5f5" }}>
        <div style={col(1)}>Order ID</div>
        <div style={col(2)}>User</div>
        <div style={col(2)}>Ngày thanh toán</div>
        <div style={col(2)}>Số tiền</div>
        <div style={col(2)}>Trạng thái</div>
      </div>

      <div style={{ maxHeight: 300, overflowY: "auto" }}>
        {paidOrders.map(o => (
          <div key={o.orderID} style={row}>
            <div style={col(1)}>#{o.orderID}</div>
            <div style={col(2)}>{o.userID}</div>
            <div style={col(2)}>{o.updatedAt || o.orderDate}</div>
            <div style={col(2)}>
              {o.totalAmount?.toLocaleString("vi-VN")} ₫
            </div>
            <div style={{ ...col(2), color: "green" }}>
              Đã thanh toán
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
