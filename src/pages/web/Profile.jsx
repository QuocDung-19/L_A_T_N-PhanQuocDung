import { useEffect, useState } from "react";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import Box from "../../components/common/Box";
import Card from "../../components/common/Card";
import Typography from "../../components/common/Typography";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";

import { getUserById, updateUserById } from "../../services/api/userApi";
import { getOrdersByUser, getOrderById } from "../../services/api/orderApi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUser, setEditUser] = useState(null);


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
      } catch (err) {
        alert(err.message);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);


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
                          password: user.password || "",

                    
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



      <Box style={{ display: "flex", gap: 20 }}>
        <Card style={{ flex: 1, padding: 30 }}>
          <Typography variant="h4">Lịch sử đơn hàng</Typography>

          <table width="100%" style={{ marginTop: 15, borderCollapse: "collapse" }}>
            <thead style={{ background: "#f4f6f8", position: "sticky", top: 0, zIndex: 1 }}>
              <tr>
                <th>Order</th>
                <th>Ngày</th>
                <th>Tổng</th>
                <th></th>
              </tr>
            </thead>

            <tbody style={{ display: "block", maxHeight: 300, overflowY: "auto" }}>
              {orders.map(o => (
                <tr key={o.orderID} style={{ display: "table", width: "100%", tableLayout: "fixed" }}>
                  <td>#{o.orderID}</td>
                  <td>{o.orderDate}</td>
                  <td>{o.totalAmount.toLocaleString()} đ</td>
                  <td>
                    <Button onClick={() => openOrderDetail(o.orderID)}>Chi tiết</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </Box>

          <Card style={{ flex: 1, padding: 30 }}>
            <Typography variant="h4">Chi tiết đơn hàng</Typography>

            {!selectedOrder ? (
              <Typography>Chọn đơn hàng để xem</Typography>
            ) : (
              <table width="100%" style={{ marginTop: 15 }}>
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>SL</th>
                    <th>Giá</th>
                    <th>Tổng</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((i, idx) => (
                    <tr key={idx}>
                      <td>#{i.productID}</td>
                      <td>{i.quantity}</td>
                      <td>{i.price.toLocaleString()} đ</td>
                      <td>
                        {(i.price * i.quantity).toLocaleString()} đ
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>
        </Box>

      <Footer />
    </>
  );
}
