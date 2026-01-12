import { useEffect, useState } from "react";
import Box from "../../../components/common/Box";
import Typography from "../../../components/common/Typography";
import Button from "../../../components/common/Button";

import { getOrders, getOrderById, updateOrderStatus } from "../../../services/api/orderApi";
import { getProducts } from "../../../services/api/productApi";
import { getUserById } from "../../../services/api/userApi";
const ORDER_STATUS = ["PENDING", "CONFIRMED", "SHIPPING", "COMPLETED", "CANCELLED"];
const ROWS_PER_PAGE = 5;

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [userMap, setUserMap] = useState({});

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [status, setStatus] = useState("");

  const [products, setProducts] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    getProducts()
      .then(data => setProducts(data))
      .catch(err => console.error("Lỗi load product:", err));
  }, []);


  const fetchOrders = async () => {
    setLoadingOrders(true);
    try {
      const data = await getOrders();
      setOrders(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);


  const quickUpdate = async (orderID, newStatus) => {
    try {
      const updated = await updateOrderStatus(orderID, newStatus);
      setOrders(prev => prev.map(o => (o.orderID === updated.orderID ? updated : o)));

      if (selectedOrder?.orderID === updated.orderID) {
        setSelectedOrder(updated);
        setStatus(updated.status);
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const openDetail = async (order) => {
    try {
      setLoadingDetail(true);
      const fullOrder = await getOrderById(order.orderID);
      setSelectedOrder(fullOrder);
      setStatus(fullOrder.status);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    try {
      const updated = await updateOrderStatus(selectedOrder.orderID, status);
      setOrders(prev => prev.map(o => (o.orderID === updated.orderID ? updated : o)));
      setSelectedOrder(updated);
    } catch (err) {
      alert(err.message);
    }
  };

  const getProductName = (productID) => {
      const product = products.find(
        p => String(p.productId) === String(productID)
      );
      return product ? product.name : "Không xác định";
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
          const user = await getUserById(userID);
          newUsers[userID] = user;
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

    const getUsername = (userID) => {
      return userMap[userID]?.username || "Đang tải...";
    };

  const totalPages = Math.ceil(orders.length / ROWS_PER_PAGE);
  const paginateOrders = orders.slice((currentPage - 1) * ROWS_PER_PAGE, currentPage * ROWS_PER_PAGE);

  return (
    <Box style={{ padding: 20 }}>
      <Box style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <Typography variant="h4">Quản lý đơn hàng</Typography>
      </Box>

      <Box style={{ display: "flex", gap: 20 }}>

        <Box style={{ flex: 1 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#f4f6f8" }}>
                <th align="left">OrderID</th>
                <th align="left">Khách hàng</th>
                <th align="left">Tổng tiền</th>
                <th align="left">Trạng thái</th>
                <th align="left">Ngày tạo</th>
                <th align="left">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {loadingOrders ? (
                <tr>
                  <td colSpan="6">Đang tải...</td>
                </tr>
              ) : paginateOrders.length === 0 ? (
                <tr>
                  <td colSpan="6">Không có đơn hàng</td>
                </tr>
              ) : (
                paginateOrders.map((o) => (
                  <tr
                    key={o.orderID}
                    style={{ borderBottom: "1px solid #eee", background: selectedOrder?.orderID === o.orderID ? "#f1f8ff" : "" }}
                  >
                    <td>#{o.orderID}</td>
                    <td>
                      {o.orderID && getUsername(o.userID)}
                      <div style={{ fontSize: 12, color: "#888" }}>
                        #{o.user?.userID || o.userID}
                      </div>
                    </td>
                    <td>{o.totalAmount?.toLocaleString()} đ</td>
                    <td>{o.status}</td>
                    <td>{o.orderDate ? new Date(o.orderDate).toLocaleDateString() : "-"}</td>
                    <td style={{ display: "flex", gap: 6 }}>
                      {o.status === "PENDING" && (
                        <>
                          <Button onClick={() => quickUpdate(o.orderID, "CONFIRMED")}>Xác nhận</Button>
                          <Button style={{ background: "#dc3545" }} onClick={() => quickUpdate(o.orderID, "CANCELLED")}>Huỷ</Button>
                        </>
                      )}
                      {o.status === "CONFIRMED" && (
                        <Button onClick={() => quickUpdate(o.orderID, "SHIPPING")}>Đang giao</Button>
                      )}
                      {o.status === "SHIPPING" && (
                        <Button onClick={() => quickUpdate(o.orderID, "COMPLETED")}>Hoàn tất</Button>
                      )}
                      <Button style={{ background: "#6c757d" }} onClick={() => openDetail(o)}>Chi tiết</Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {totalPages > 1 && (
            <Box style={{ marginTop: 15, display: "flex", flexDirection: "row", justifyContent: "center", gap: 10 }}>
              <Button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1}>Previous</Button>
              <Typography variant="body1">{currentPage} / {totalPages}</Typography>
              <Button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}>Next</Button>
            </Box>
          )}
        </Box>

        <Box style={{ flex: 1, border: "1px solid #ddd", borderRadius: 8, padding: 8, maxHeight: 300, minHeight: 200 }}>
          {!selectedOrder ? (
            <Typography>Chọn đơn hàng để xem chi tiết</Typography>
          ) : loadingDetail ? (
            <Typography>Đang tải chi tiết đơn hàng...</Typography>
          ) : (
            <>
              <Typography variant="h5">
                Đơn hàng #{selectedOrder.orderID}
              </Typography>

              <Typography style={{ fontSize: 14, color: "#555", marginTop: 4 }}>
                Khách hàng: <b>{getUsername(selectedOrder.userID)}</b>
                <span style={{ marginLeft: 6, color: "#999" }}>
                  (#{selectedOrder.userID})
                </span>
              </Typography>

              <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ width: "100%", padding: 8, marginTop: 8 }}>
                {ORDER_STATUS.map((s) => (<option key={s} value={s}>{s}</option>))}
              </select>

              <Button style={{ marginTop: 10, backgroundColor: "#8CBF41", color: "#fff" }} onClick={handleUpdateStatus}>
                Lưu trạng thái
              </Button>

              <Typography variant="h6" style={{ marginTop: 5 }}>Chi tiết sản phẩm</Typography>
              <div style={{ maxHeight: 200, overflowY: "auto", marginTop: 10 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", marginTop: 10,height: '200' }}>
                <thead>
                  <tr style={{ background: "#f4f6f8" }}>
                    <th align="left">Sản phẩm</th>
                    <th align="left">Số lượng</th>
                    <th align="left">Giá</th>
                  </tr>
                </thead>
                
                <tbody>
                  {selectedOrder.items?.length > 0 ? (
                    selectedOrder.items.map((item, index) => (
                      <tr key={index}>
                        <td>
                          {getProductName(item.productID)}
                          <div style={{ fontSize: 12, color: "#888" }}>
                            #{item.productID}
                          </div>
                        </td>
                        <td>{item.quantity}</td>
                        <td>{item.price.toLocaleString()} đ</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4}>Không có sản phẩm</td>
                    </tr>
                  )}
                </tbody>
                
              </table>
                  <div style={{ marginTop: 15, fontWeight: 600 }}>
                     Tổng tiền: {selectedOrder.totalAmount.toLocaleString()} đ
                  </div>
              </div>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
