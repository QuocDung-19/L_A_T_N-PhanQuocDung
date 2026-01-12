import React, { useEffect, useState } from "react";
import { getOrders, updateOrderStatus, getOrderById,} from "../../services/api/orderApi";
import { getProducts } from "../../services/api/productApi";
import Button from "../../components/common/Button";
import { getUserById } from "../../services/api/userApi";

export default function OrderList({ type, onReloadStats }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [products, setProducts] = useState([]);
  const [userMap, setUserMap] = useState({});



  useEffect(() => {
    getProducts()
      .then(data => setProducts(data))
      .catch(err => console.error(err));
  }, []);


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
      setSelectedOrder(null);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [type]);

  const openOrderDetail = async (orderID) => {
    try {
      const data = await getOrderById(orderID);
      setSelectedOrder(data);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      alert("Cập nhật thành công");
      await fetchOrders();
      onReloadStats?.();
    } catch (err) {
      alert(err.message);
    }
  };

      useEffect(() => {
      const loadUsers = async () => {
        const missingUserIds = orders
          .map(o => o.userID)
          .filter(id => id && !userMap[id]);

        if (missingUserIds.length === 0) return;

        const newUsers = {};

        for (const userID of missingUserIds) {
          try {
              const res = await getUserById(userID);
              newUsers[userID] = res.result || res;

          } catch (err) {
            console.error("Không load được user:", userID);
          }
        }

        if (Object.keys(newUsers).length > 0) {
          setUserMap(prev => ({ ...prev, ...newUsers }));
        }
      };

      if (orders.length > 0) {
        loadUsers();
      }
    }, [orders]);


  const getProductName = (productID) => {
    const product = products.find(
      p => String(p.productId) === String(productID)
    );
    return product ? product.name : "Không xác định";
  };

  if (loading) return <div>Đang tải đơn hàng...</div>;
  if (orders.length === 0) return <div>Không có đơn phù hợp</div>;

      const getUsername = (userID) => {
        return userMap[userID]?.username || "Đang tải...";
      };

  return (
    <>
  
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
            <div
              style={{ ...col(1), cursor: "pointer", color: "#2980b9" }}
              onClick={() => openOrderDetail(order.orderID)}
            >
              #{order.orderID}
            </div>
            <div style={col(2)}>
              {getUsername(order.userID)}
              <div style={{ fontSize: 12, color: "#888" }}>
                #{order.userID}
              </div>
            </div>
            <div style={col(2)}>{order.orderDate}</div>
            <div style={col(2)}>
              {order.totalAmount.toLocaleString("vi-VN")} ₫
            </div>
            <div style={col(2)}>{order.status}</div>

            <div style={col(3)}>
              {type === "confirm" && (
                <>
                  <Button
                    onClick={() =>
                      handleStatus(order.orderID, "CONFIRMED")
                    }
                  >
                    Xác nhận
                  </Button>

                  <Button
                    style={{ background: "#e74c3c", marginLeft: 8 }}
                    onClick={() => {
                      if (window.confirm("Bạn có chắc muốn huỷ đơn này?")) {
                        handleStatus(order.orderID, "CANCELLED");
                      }
                    }}
                  >
                    Huỷ đơn
                  </Button>
                </>
              )}

              {type === "update" && (
                <Button
                  style={{ background: "#27ae60" }}
                  onClick={() =>
                    handleStatus(order.orderID, "COMPLETED")
                  }
                >
                  Đã thanh toán
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {selectedOrder && (
        <div
          style={{
            marginTop: 20,
            padding: 20,
            border: "1px solid #ddd",
            borderRadius: 6,
            background: "#fafafa",
          }}
        >
          <h3>Chi tiết đơn hàng #{selectedOrder.orderID}</h3>

          <table width="100%" style={{ marginTop: 10 }}>
            <thead>
              <tr>
                <th align="left">Sản phẩm</th>
                <th align="left">SL</th>
                <th align="left">Giá</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((i, idx) => (
                <tr key={idx}>
                  <td>
                    {getProductName(i.productID)}
                    <div style={{ fontSize: 12, color: "#888" }}>
                      #{i.productID}
                    </div>
                  </td>
                  <td>{i.quantity}</td>
                  <td>{i.price.toLocaleString()} đ</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: 15, fontWeight: 600 }}>
            Tổng tiền: {selectedOrder.totalAmount.toLocaleString()} đ
          </div>
        </div>
      )}
    </>
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
