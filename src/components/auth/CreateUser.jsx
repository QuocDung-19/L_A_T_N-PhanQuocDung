import { useState } from "react";
import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import TextField from "../../components/common/TextField";
import Select from "../../components/common/Select";
import Button from "../../components/common/Button";
import { createAccount } from "../../services/api/accountApi";

export default function CreateUser({ onClose, onCreated }) {
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    role: "CUSTOMER",
  });

  const handleCreateUser = async () => {
    const { username, password, fullName, email, phone, address, role } = newUser;
    if (!username || !password || !fullName || !email || !phone || !address) {
      alert("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      const createdUser = await createAccount({ username, password, fullName, email, phone, address, role });
      onCreated(createdUser);
      onClose();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Box style={{ padding: 20, width: 400, backgroundColor: "#fff", borderRadius: 8 }}>
      <Typography variant="h5" style={{ marginBottom: 15, color: "#323232" }}>
        Thêm người dùng
      </Typography>

      <TextField
        placeholder="Username"
        value={newUser.username}
        onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
        style={{ marginBottom: 10 }}
      />
      <TextField
        placeholder="Password"
        type="password"
        value={newUser.password}
        onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
        style={{ marginBottom: 10 }}
      />
      <TextField
        placeholder="Full Name"
        value={newUser.fullName}
        onChange={(e) => setNewUser({ ...newUser, fullName: e.target.value })}
        style={{ marginBottom: 10 }}
      />
      <TextField
        placeholder="Email"
        value={newUser.email}
        onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
        style={{ marginBottom: 10 }}
      />
      <TextField
        placeholder="Phone"
        value={newUser.phone}
        onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
        style={{ marginBottom: 10 }}
      />
      <TextField
        placeholder="Address"
        value={newUser.address}
        onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}
        style={{ marginBottom: 10 }}
      />

      <Select
        value={newUser.role}
        onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
        style={{ marginBottom: 10 }}
      >
        <option value="ADMIN">Admin</option>
        <option value="STAFF">Staff</option>
        <option value="CUSTOMER">Customer</option>
      </Select>

      <Box style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
        <Button
          style={{ backgroundColor: "#8CBF41", color: "#fff" }}
          onClick={handleCreateUser}
        >
          Tạo
        </Button>
        <Button
          style={{ backgroundColor: "#323232", color: "#fff" }}
          onClick={onClose}
        >
          Hủy
        </Button>
      </Box>
    </Box>
  );
}
