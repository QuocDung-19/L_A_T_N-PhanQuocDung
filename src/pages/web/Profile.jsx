import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import Box from "../../components/common/Box";
import Card from "../../components/common/Card";
import Typography from "../../components/common/Typography";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";

import { getUserById, updateUserById } from "../../services/api/userApi";
import { getOrdersByUser, getOrderById } from "../../services/api/orderApi";
import { getProducts } from "../../services/api/productApi";
import CartOrderList from "./CartOrderList";

export default function Profile() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUser, setEditUser] = useState(null);

const [productMap, setProductMap] = useState({});
const storedUser = JSON.parse(localStorage.getItem("user"));
const userID = storedUser?.userID;

    const fetchData = async () => {
      try {
        if (!userID) throw new Error("Không tìm thấy userID");

        const userData = await getUserById(userID);
        setUser(userData);

        const orderData = await getOrdersByUser(userID);
        setOrders(
          orderData.filter(o =>
            ["CONFIRMED", "SHIPPING", "COMPLETED"].includes(o.status)
          )
        );

        const products = await getProducts();
        const map = {};
        products.forEach(p => {
          map[p.productId] = p.name;
        });
        setProductMap(map);

      } catch (err) {
        alert(err.message);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const goToPayment = (orderID) => {
  navigate(`/payment/${orderID}`);
};

const handleUpdateProfile = async () => {
  if (!user) return;

  try {
    await updateUserById(user.userID, {
      username: user.username, 
      role: user.role,         
      password: user.password || "", 
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
    });

    alert("Cập nhật thông tin thành công!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


  const openOrderDetail = async (orderID) => {
    try {
      const data = await getOrderById(orderID);
      setSelectedOrder(data);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <Header />

      <Box style={{ padding: 40, background: "#f5f7f5" }}>

        {user && (
          <Card style={{ padding: 30, marginBottom: 30 }}>
            <Typography variant="h3" style={{ color: "#8CBF41" }}>
              Thông tin cá nhân
            </Typography>

            <TextField label="Username" value={user.username} disabled />
            <TextField label="Họ và tên" value={user.fullName || ""} disabled />
            <TextField label="Email" value={user.email || ""} disabled />
            <TextField label="Số điện thoại" value={user.phone || ""} disabled />
            <TextField label="Địa chỉ" value={user.address || ""} disabled />


        <Button
          style={{
            marginTop: 20,
            backgroundColor: "#8CBF41",
            width: "100%",
          }}
          onClick={() => {
            setEditUser({ ...user });
            setShowEditForm(true);
          }}
        >
          Cập nhật thông tin
        </Button>
          </Card>
        )}
        {showEditForm && (
          <Box
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 999,
            }}
          >
            <Card style={{ width: 500, padding: 30 }}>
              <Typography variant="h4" style={{ marginBottom: 20 }}>
                Cập nhật thông tin
              </Typography>

              <TextField
                label="Họ và tên"
                value={editUser.fullName || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, fullName: e.target.value })
                }
              />

              <TextField
                label="Email"
                value={editUser.email || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />

              <TextField
                label="Số điện thoại"
                value={editUser.phone || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, phone: e.target.value })
                }
              />

              <TextField
                label="Địa chỉ"
                value={editUser.address || ""}
                onChange={(e) =>
                  setEditUser({ ...editUser, address: e.target.value })
                }
              />

              <Box style={{ display: "flex", gap: 10, marginTop: 20 }}>
                <Button
                  style={{ flex: 1 }}
                  onClick={() => setShowEditForm(false)}
                >
                  Hủy
                </Button>

                  <Button
                    style={{ flex: 1, backgroundColor: "#8CBF41" }}
                    onClick={async () => {
                      try {
                        await updateUserById(userID, {
                      
                          username: user.username,
                          role: user.role,
                          password: user.password,

                    
                          fullName: editUser.fullName,
                          email: editUser.email,
                          phone: editUser.phone,
                          address: editUser.address,
                        });

                     
                        setUser({
                          ...user,
                          fullName: editUser.fullName,
                          email: editUser.email,
                          phone: editUser.phone,
                          address: editUser.address,
                        });

                        setShowEditForm(false);
                        alert("Cập nhật thành công!");
                      } catch (err) {
                        alert(err.message);
                      }
                    }}
                  >
                    Lưu
                  </Button>

              </Box>
            </Card>
          </Box>
        )}



          <Card style={{ flex: 1, padding: 30 }}>
            <Typography variant="h4">Lịch sử đơn hàng</Typography>

            <Box style={{ maxHeight: 300, overflowY: "auto", marginTop: 15 }}>
              <table width="100%" style={{ borderCollapse: "collapse" }}>
                <thead style={{ background: "#f4f6f8" }}>
                  <tr>
                    <th align="left">Order</th>
                    <th align="left">Ngày</th>
                    <th align="left">Tổng</th>
                    <th></th>
                  </tr>
                </thead>

                <tbody>
                  {orders.map(o => (
                    <tr key={o.orderID}>
                      <td>#{o.orderID}</td>
                      <td>{o.orderDate}</td>
                      <td>{o.totalAmount.toLocaleString()} đ</td>
                      <td>
                        <Button onClick={() => openOrderDetail(o.orderID)}>
                          Chi tiết
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Box>

            {selectedOrder && (
              <Box style={{ marginTop: 20 }}>
                <Typography variant="h5" style={{ marginBottom: 10 }}>
                  Chi tiết đơn #{selectedOrder.orderID}
                </Typography>
                <Box
                  style={{
                    maxHeight: 300,
                    overflowY: "auto",
                    marginBottom: 12,
                    borderBottom: "1px solid #eee",
                    paddingBottom: 8,
                  }}>
                <CartOrderList order={selectedOrder} />
                </Box>
                {selectedOrder.paymentStatus === "UNPAID" && (
                  <Box
                    style={{
                      marginTop: 20,
                      display: "flex",
                      justifyContent: "flex-end",
                    }}
                  >
                    <Button
                      style={{
                        backgroundColor: "#8CBF41",
                        color: "#fff",
                        padding: "10px 28px",
                      }}
                      onClick={() => goToPayment(selectedOrder.orderID)}
                    >
                      Thanh toán đơn hàng →
                    </Button>
                  </Box>
                )}
              </Box>
            )}
          </Card>

        </Box>

      <Footer />
    </>
  );
}
