// src/pages/Register/Register.jsx
import Box from "../../components/common/Box";
import Card from "../../components/common/Card";
import Typography from "../../components/common/Typography";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";
import Link from "../../components/common/Link";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import { useState } from "react";
import logo from "../../assets/images/Logo.png";

import userIcon from "../../assets/images/user.png";
import emailIcon from "../../assets/images/email.png";
import phoneIcon from "../../assets/images/phone-call.png";
import mapIcon from "../../assets/images/map.png";
import viewIcon from "../../assets/images/view.png";
import noViewIcon from "../../assets/images/no-view.png";

import RegisterContent from "../../services/api/RegisterContent";

export default function Register() {
  const {
    name, setName,
    email, setEmail,
    phone, setPhone,
    password, setPassword,
    address, setAddress,
    loading,
    handleRegister,
    successMessage,
  } = RegisterContent();

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Vui lòng nhập tên";

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!/^[0-9]{9,11}$/.test(phone)) {
      newErrors.phone = "Số điện thoại phải từ 9–11 chữ số";
    }

    if (!address.trim()) newErrors.address = "Vui lòng nhập địa chỉ";

    if (!password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onRegister = async () => {
    if (!validate()) return;

    const result = await handleRegister();

    if (result?.code === "EMAIL_EXISTS") {
      setErrors({ email: "Email đã được sử dụng" });
    }
    if (result?.code === "PHONE_EXISTS") {
      setErrors({ phone: "Số điện thoại đã được sử dụng" });
    }
  };

  const Field = ({ icon, children }) => (
    <Box style={{ position: "relative" }}>
      {children}
      <img
        src={icon}
        alt=""
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
  );

  return (
    <>
      <Header />
      <Box
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0f4f0",
          padding: 20,
        }}
      >
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
                Register
              </Typography>
            </Box>

          {successMessage && (
            <Typography
              style={{
                backgroundColor: "#d4edda",
                padding: 10,
                borderRadius: 6,
                marginBottom: 15,
                textAlign: "center",
              }}
            >
              {successMessage}
            </Typography>
          )}

          <Field icon={userIcon}>
            <TextField label="Name" placeholder="Nhập tên" value={name} onChange={e => setName(e.target.value)} />
          </Field>
          {errors.name && <Typography style={{ color: "red", fontSize: 13, margin: "0px 0px 10px 0px" }}>{errors.name}</Typography>}

          <Field icon={emailIcon}>
            <TextField label="Email" placeholder="Nhập email" value={email} onChange={e => setEmail(e.target.value)} />
          </Field>
          {errors.email && <Typography style={{ color: "red", fontSize: 13, margin: "0px 0px 10px 0px" }}>{errors.email}</Typography>}

          <Field icon={phoneIcon}>
            <TextField label="Số điện thoại" placeholder="Nhập số điện thoại" value={phone} onChange={e => setPhone(e.target.value)} />
          </Field>
          {errors.phone && <Typography style={{ color: "red", fontSize: 13, margin: "0px 0px 10px 0px" }}>{errors.phone}</Typography>}

          <Field icon={mapIcon}>
            <TextField label="Địa chỉ" placeholder="Nhập địa chỉ" value={address} onChange={e => setAddress(e.target.value)} />
          </Field>
          {errors.address && <Typography style={{ color: "red", fontSize: 13, margin: "0px 0px 10px 0px" }}>{errors.address}</Typography>}

          <Box style={{ position: "relative" }}>
            <TextField
              label="Password"
              placeholder="Mật khẩu"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <img
              src={showPassword ? noViewIcon : viewIcon}
              alt={showPassword ? "Ẩn mật khẩu" : "Hiển thị mật khẩu"}
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: "absolute",
                right: 12,
                top: "49%",
                width: 15,
                cursor: "pointer",
              }}
            />
          </Box>
          {errors.password && <Typography style={{ color: "red", fontSize: 13, margin: "0px 0px 10px 0px" }}>{errors.password}</Typography>}

          <Button
            onClick={onRegister}
            disabled={loading}
            style={{ width: "100%", backgroundColor: "#8CBF41", color: "#fff", marginTop: 15 }}
          >
            {loading ? "Đang xử lý..." : "Đăng ký"}
          </Button>

          <Box style={{ textAlign: "center", marginTop: 12 }}>
            <Typography>
              Đã có tài khoản?{" "}
              <Link href="/login" style={{ color: "#8CBF41" }}>
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Card>
      </Box>
      <Footer />
    </>
  );
}
