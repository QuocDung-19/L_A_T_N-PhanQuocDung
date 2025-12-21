import Box from "../../components/common/Box";
import Card from "../../components/common/Card";
import Typography from "../../components/common/Typography";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";
import Link from "../../components/common/Link";
import { useState } from "react";
import { useAuth } from "../../services/api/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/Logo.png";

import userIcon from "../../assets/images/user.png";
import viewIcon from "../../assets/images/view.png";
import noViewIcon from "../../assets/images/no-view.png";

export default function LoginForm({ onClose }) {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
    general: "",
  });

  const validate = () => {
    let valid = true;
    const newErrors = { username: "", password: "", general: "" };

    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
      valid = false;
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setErrors({ username: "", password: "", general: "" });

    const result = await login({ username, password });

    setLoading(false);

    if (!result.success) {

      if (result.code === "USER_NOT_FOUND") {
        setErrors({ ...errors, username: "Tên đăng nhập không tồn tại" });
      } else if (result.code === "INVALID_PASSWORD") {
        setErrors({ ...errors, password: "Mật khẩu không đúng" });
      } else {
        setErrors({ ...errors, general: result.message || "Đăng nhập thất bại" });
      }
      return;
    }

    if (result.role === "admin") navigate("/admin");
    else if (result.role === "staff") navigate("/staff");
    else navigate("/");

    if (onClose) onClose();
  };

  return (
    <Card style={{ maxWidth: 400, padding: 30, borderRadius: 8 }}>

      <Box
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <img src={logo} alt="Logo" style={{ width: "30%" }} />
        <Typography variant="h2" style={{ color: "#8CBF41" }}>
          Login
        </Typography>
      </Box>


      <Box style={{ position: "relative"}}>
        <TextField
          label="Username"
          placeholder="Nhập username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <img
          src={userIcon}
          alt="user"
          style={{
            position: "absolute",
            right: 12,
            top: "57%",
            transform: "translateY(-50%)",
            width: 15,
            opacity: 0.6,
          }}
        />
      </Box>
      {errors.username && (
        <Typography style={{ color: "red", fontSize: 13, margin: "0px 0px 10px 0px" }}>
          {errors.username}
        </Typography>
      )}

      <Box style={{ position: "relative"}}>
        <TextField
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Nhập mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <img
          src={showPassword ? noViewIcon : viewIcon}
          alt="toggle"
          onClick={() => setShowPassword(!showPassword)}
          style={{
            position: "absolute",
            right: 12,
            top: "57%",
            transform: "translateY(-50%)",
            width: 15,
            cursor: "pointer",
            opacity: 0.7,
          }}
        />
      </Box>
      {errors.password && (
        <Typography style={{ color: "red", fontSize: 13, margin: "0px 0px 10px 0px" }}>
          {errors.password}
        </Typography>
      )}

      {errors.general && (
        <Typography style={{ color: "red", fontSize: 13, margin: "0px 0px 10px 0px" }}>
          {errors.general}
        </Typography>
      )}

      <Button
        onClick={handleLogin}
        disabled={loading}
        style={{ width: "100%", backgroundColor: "#8CBF41", color: "#fff" }}
      >
        {loading ? "Đang đăng nhập..." : "Đăng nhập"}
      </Button>

      <Box style={{ textAlign: "center", marginTop: 12 }}>
        <Link href="/forgot-password" style={{ color: "#8CBF41" }}>
          Quên mật khẩu?
        </Link>
      </Box>

      <Box style={{ textAlign: "center", marginTop: 8 }}>
        <Typography variant="body2">
          Chưa có tài khoản?{" "}
          <Link href="/register" style={{ color: "#8CBF41" }}>
            Đăng ký
          </Link>
        </Typography>
      </Box>
    </Card>
  );
}
