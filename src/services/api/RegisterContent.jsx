import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function RegisterContent() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 

  const handleRegister = async () => {
    if (!name || !email || !phone || !password) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    setSuccessMessage(""); 

    try {
     
      const res = await fetch("http://localhost:8080/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: email,
          password,
          role: "CUSTOMER",
          fullName: name,
          email,
          phone,
          address,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Đăng ký thất bại");
      }

  
      const loginRes = await login({ username: email, password });
      if (!loginRes.success) {
        throw new Error(loginRes.message || "Đăng nhập tự động thất bại");
      }

   
      setSuccessMessage("Đăng ký thành công! Bạn đã được đăng nhập tự động.");

   
      setTimeout(() => {
        navigate("/"); 
      }, 2000);

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
    email,
    setEmail,
    phone,
    setPhone,
    password,
    setPassword,
    address,
    setAddress,
    loading,
    handleRegister,
    successMessage,
  };
}
