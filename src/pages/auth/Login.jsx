import Box from "../../components/common/Box";
import LoginForm from "../../components/auth/LoginForm";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

export default function Login() {
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
        <LoginForm />
      </Box>
      <Footer />
    </>
  );
}
