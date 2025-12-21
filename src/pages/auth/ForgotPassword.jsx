import Box from "../../components/common/Box";
import Card from "../../components/common/Card";
import Typography from "../../components/common/Typography";
import TextField from "../../components/common/TextField";
import Button from "../../components/common/Button";
import Link from "../../components/common/Link";
import { useState } from "react";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import logo from "../../assets/images/Logo.png";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    alert(`Gửi link reset mật khẩu tới: ${email}`);
  };

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
          padding: "20px",
        }}
      >
        <Card style={{ width: "100%", maxWidth: 400, padding: "30px", borderRadius: 8 }}>
     
          <Box style={{ display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, gap: 10 }}>
            <img src={logo} alt="Logo" style={{ width: "30%", height: "30%" }} />
            <Typography variant="h2" style={{ color: "#8CBF41" }}>
              Forgot Password
            </Typography>
          </Box>

          <TextField
            label="Email"
            placeholder="Nhập email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginBottom: 20 }}
          />

          <Button
            style={{ width: "100%", backgroundColor: "#8CBF41", color: "#fff" }}
            onClick={handleSubmit}
          >
            Gửi Email
          </Button>

          <Box style={{ marginTop: 12, textAlign: "center" }}>
            <Link href="/login" style={{ color: "#8CBF41" }}>
              Quay lại đăng nhập
            </Link>
          </Box>
        </Card>
      </Box>
      <Footer />
    </>
  );
}
