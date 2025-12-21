import React, { useEffect, useState } from "react";
import Footer from "../../../components/Layout/Footer";
import AdminSidebar from "../../../components/Layout/AdminSidebar";
import AdminHeader from "../../../components/Layout/AdminHeader";

import AdminAccounts from "./AdminManageAccounts";
import AdminCategories from "./AdminCategories";
import AdminProducts from "./AdminProducts";
import AdminOrders from "./AdminOrders";
import AdminNews from "./AdminNews";

// ===== API =====
import { getAccounts } from "../../../services/api/accountApi";
import { getProducts } from "../../../services/api/productApi";
import { getOrders } from "../../../services/api/orderApi";
import { getNewsList } from "../../../services/api/newsApi";

export default function Admin() {
  const [active, setActive] = useState("accounts");

  const [stats, setStats] = useState({
    accounts: 0,
    products: 0,
    orders: 0,
    news: 0,
  });

    const fetchStats = async () => {
      try {
        const [accounts, products, orders, news] = await Promise.all([
          getAccounts(),
          getProducts(),
          getOrders(),
          getNewsList(),
        ]);

        setStats({
          accounts: accounts?.length || 0,
          products: products?.length || 0,
          orders: orders?.length || 0,
          news: news?.length || 0,
        });
      } catch (err) {
        console.error("Lỗi lấy thống kê admin:", err);
      }
    };

    useEffect(() => {
  fetchStats();
}, []);


  return (
    <div style={{ minHeight: "100vh", background: "#f4f6f4" }}>
      <AdminHeader />

      <div style={{ display: "flex" }}>
        <AdminSidebar active={active} setActive={setActive} />

        <main style={{ flex: 1, padding: 28, height: 850 }}>
          {/* ===== STAT CARDS ===== */}
          <div style={{ display: "flex", gap: 20, marginBottom: 24 }}>
            <StatCard title="Tài khoản" value={stats.accounts} />
            <StatCard title="Sản phẩm" value={stats.products} />
            <StatCard title="Đơn hàng" value={stats.orders} />
            <StatCard title="Tin tức" value={stats.news} />
          </div>

          {/* ===== MAIN CONTENT ===== */}
          <div
            style={{
              background: "#ffffff",
              borderRadius: 14,
              padding: 24,
              boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
              maxHeight: 800,
              overflow: "hidden",
            }}
          >
            {active === "accounts" && (<AdminAccounts onReloadStats={fetchStats} />)}
            {active === "categories" && <AdminCategories />}
            {active === "products" && (<AdminProducts onReloadStats={fetchStats} />)}
            {active === "orders" && <AdminOrders />}
            {active === "news" && (<AdminNews onReloadStats={fetchStats} />)}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}

// ===== STAT CARD =====
function StatCard({ title, value }) {
  return (
    <div
      style={{
        flex: 1,
        background: "#e8f3da",
        borderRadius: 14,
        padding: 20,
      }}
    >
      <div style={{ fontSize: 14, color: "#555" }}>{title}</div>
      <div style={{ fontSize: 26, fontWeight: 700, color: "#323232" }}>
        {value}
      </div>
    </div>
  );
}
