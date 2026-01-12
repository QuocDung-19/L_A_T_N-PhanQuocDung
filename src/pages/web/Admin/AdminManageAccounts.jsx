import { useEffect, useState } from "react";
import Box from "../../../components/common/Box";
import Typography from "../../../components/common/Typography";
import Button from "../../../components/common/Button";
import TextField from "../../../components/common/TextField";
import Select from "../../../components/common/Select";
import { getAccounts, deleteAccount } from "../../../services/api/accountApi";
import CreateUser from "../../../components/auth/CreateUser";
import { updateUserById } from "../../../services/api/userApi";
import editIcon from "../../../assets/images/edit.png";
import trashIcon from "../../../assets/images/trash.png";

export default function AdminManageAccounts({ onReloadStats }) {

  console.log = () => {};

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [successMessage, setSuccessMessage] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editUser, setEditUser] = useState(null);


  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchAccountsList = async () => {
    setLoading(true);
    try {
      const data = await getAccounts();
      setAccounts(data);
    } catch {
      alert("Không thể tải danh sách tài khoản");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountsList();
  }, []);

  const handleDelete = async (userID) => {
    if (!window.confirm("Bạn có chắc muốn xóa tài khoản này?")) return;
    try {
      await deleteAccount(userID);
      setAccounts(accounts.filter((acc) => acc.userID !== userID));

      onReloadStats?.();

      setSuccessMessage("Xóa tài khoản thành công");

      setTimeout(() => setSuccessMessage(""), 3000);
    } catch {
      alert("Xóa thất bại");
    }
  };

    const handleUserCreated = (createdUser) => {
      setAccounts([...accounts, createdUser]);

      onReloadStats?.();

      setSuccessMessage("Tạo tài khoản thành công");
    };

  const filteredAccounts = accounts.filter((acc) => {
    const matchesSearch =
      acc.username.toLowerCase().includes(search.toLowerCase()) ||
      acc.userID?.toString().toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "ALL" || acc.role.toUpperCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
  const displayedAccounts = filteredAccounts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box style={{ padding: 20 }}>
      <Typography variant="h4" style={{ marginBottom: 20 }}>Quản lý tài khoản</Typography>

      {successMessage && (
        <Typography
          variant="body1"
          style={{ color: "#323232", backgroundColor: "#d4edda", padding: 10, borderRadius: 6, marginBottom: 15 }}
        >
          {successMessage}
        </Typography>
      )}

      <Box style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <Button onClick={() => {console.log("Click Thêm người dùng"); setModalOpen(true)}} style={{ backgroundColor: "#8CBF41", color: "#fff" }}>
          + Thêm người dùng
        </Button>
        <TextField
          placeholder="Tìm kiếm (User ID hoặc Username)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="ALL">All</option>
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Staff</option>
          <option value="CUSTOMER">Customer</option>
        </Select>
      </Box>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th align="left" style={{ borderBottom: "1px solid #ccc", padding: 8 }}>User ID</th>
            <th align="left" style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Username</th>
            <th align="left" style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Role</th>
            <th align="left" style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 10 }}>Đang tải...</td>
            </tr>
          ) : displayedAccounts.length === 0 ? (
            <tr>
              <td colSpan={5} style={{ textAlign: "center", padding: 10 }}>Không có dữ liệu</td>
            </tr>
          ) : (
            displayedAccounts.map((acc) => (
              <tr key={acc.userID}>
                <td style={{ padding: 8 }}>{acc.userID}</td>
                <td style={{ padding: 8 }}>{acc.username}</td>
                <td style={{ padding: 8 }}>{acc.role}</td>
                <td style={{ padding: 8, display: "flex", gap: 10 }}>
                <Button
                  style={{
                    backgroundColor: "#17a2b8",
                    padding: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => {
                    setSelectedUser(acc);
                    setEditUser({ ...acc, password: "" });
                    setEditOpen(true);
                  }}
                >
                  <img
                    src={editIcon}
                    alt="edit"
                    style={{ width: 18, height: 18 }}
                  />
                </Button>

                <Button
                  style={{
                    backgroundColor: "#dc3545",
                    padding: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => handleDelete(acc.userID)}
                >
                  <img
                    src={trashIcon}
                    alt="delete"
                    style={{ width: 18, height: 18 }}
                  />
                </Button>


                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <Box style={{ marginTop: 15, display: "flex", flexDirection: "row", justifyContent: "center", gap: 10 }}>
        <Button
          onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <Typography variant="body1">{currentPage} / {totalPages}</Typography>
        <Button
          onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </Box>

        {modalOpen && (
          <div style={{
            position: "fixed",
            top: 0, left: 0,
            width: "100%", height: "100%",
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex", justifyContent: "center", alignItems: "center",
            zIndex: 9999
          }}>
            <div onClick={(e)=>e.stopPropagation()} style={{
              backgroundColor: "#fff",
              borderRadius: 8,
              padding: 20,
              minWidth: 400
            }}>
              <CreateUser onClose={() => setModalOpen(false)} onCreated={handleUserCreated} />
            </div>
          </div>
        )}
        {editOpen && editUser && (
          <div
            onClick={() => setEditOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 10000,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                padding: 24,
                borderRadius: 10,
                width: 450,
              }}
            >
              <Typography variant="h4" style={{ marginBottom: 15 }}>
                Chỉnh sửa người dùng
              </Typography>

              <TextField
                label="Username"
                value={editUser.username}
                onChange={(e) =>
                  setEditUser({ ...editUser, username: e.target.value })
                }
              />

              <Select
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
              >
                <option value="ADMIN">ADMIN</option>
                <option value="STAFF">STAFF</option>
                <option value="CUSTOMER">CUSTOMER</option>
              </Select>

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
                <Button onClick={() => setEditOpen(false)} style={{ flex: 1 }}>
                  Hủy
                </Button>

                <Button
                  style={{ flex: 1, backgroundColor: "#8CBF41", color: "#fff" }}
                  onClick={async () => {
                    try {
                      await updateUserById(editUser.userID, {
                        username: editUser.username, 
                        role: editUser.role,         
                        fullName: editUser.fullName,
                        email: editUser.email,
                        phone: editUser.phone,
                        address: editUser.address,
                      });

                      setAccounts((prev) =>
                        prev.map((u) =>
                          u.userID === editUser.userID ? editUser : u
                        )
                      );

                      setEditOpen(false);
                      alert("Cập nhật thành công!");
                    } catch (err) {
                      alert(err.message);
                    }
                  }}
                >
                  Lưu
                </Button>
              </Box>
            </div>
          </div>
        )}


    </Box>
  );
}
