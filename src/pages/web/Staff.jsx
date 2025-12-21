import React, { useEffect, useState } from "react";
import { useAuth } from "../../services/api/AuthContext";

import StaffHeader from "../../components/Layout/StaffHeader";
import StaffSidebar from "../../components/Layout/StaffSidebar";
import Footer from "../../components/Layout/Footer";

import OrderList from "./OrderList";
import UploadExcel from "./UploadExcel";
import OrderHistory from "./OrderHistory";
import PaymentHistory from "./PaymentHistory";

import { getOrders } from "../../services/api/orderApi";

export default function Staff() {
  const { user } = useAuth();
  const [active, setActive] = useState("confirm");

  const [stats, setStats] = useState({
    pending: 0,
    confirmed: 0,
    total: 0,
  });

  // ✅ TÁCH RA HÀM RIÊNG
  const fetchStats = async () => {
    try {
      const orders = await getOrders();

      setStats({
        pending: orders.filter(o => o.status === "PENDING").length,
        confirmed: orders.filter(o => o.status === "CONFIRMED").length,
        total: orders.length,
      });
    } catch (err) {
      console.error("Lỗi lấy thống kê staff:", err);
    }
  };

  // chỉ gọi lần đầu
  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f4" }}>
      <StaffHeader user={user} />

      <div style={{ display: "flex" }}>
        <StaffSidebar active={active} setActive={setActive} />

        <main style={{ flex: 1, padding: 28 }}>
          {/* ===== STATS ===== */}
          <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
            <StatCard title="Đơn chờ xác nhận" value={stats.pending} bg="#e8f3da" />
            <StatCard title="Đơn đang xử lý" value={stats.confirmed} bg="#f0f0f0" />
            <StatCard title="Tổng đơn" value={stats.total} bg="#eef6ff" />
          </div>

          {/* ===== CONTENT ===== */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 14,
              padding: 24,
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            }}
          >
            {active === "confirm" && (
              <OrderList type="confirm" onReloadStats={fetchStats} />
            )}

            {active === "update" && (
              <OrderList type="update" onReloadStats={fetchStats} />
            )}

            {active === "excel" && <UploadExcel />}
          </div>
        </main>
      </div>

      <div style={{ padding: 28 }}>
        <OrderHistory />
        <PaymentHistory />
      </div>

      <Footer />
    </div>
  );
}

function StatCard({ title, value, bg }) {
  return (
    <div
      style={{
        flex: 1,
        background: bg,
        borderRadius: 14,
        padding: 20,
      }}
    >
      <div style={{ fontSize: 14, color: "#555" }}>{title}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: "#323232" }}>
        {value}
      </div>
    </div>
  );
}
