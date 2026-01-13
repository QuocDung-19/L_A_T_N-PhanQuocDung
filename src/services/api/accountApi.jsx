const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:8080/api";

const API_URL = `${API_BASE_URL}/user`;

const getToken = () => localStorage.getItem("token");

const getHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const getAccounts = async () => {
  try {
    const res = await fetch(API_URL, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Bạn không có quyền truy cập");
    return data.result || [];
  } catch (err) {
    console.error("getAccounts error:", err);
    throw err;
  }
};

export const createAccount = async (user) => {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify(user),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Tạo user thất bại");
    return data.result;
  } catch (err) {
    console.error("createAccount error:", err);
    throw err;
  }
};

export const deleteAccount = async (userID) => {
  try {
    const res = await fetch(`${API_URL}/${userID}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Xóa user thất bại");
    }
    return true;
  } catch (err) {
    console.error("deleteAccount error:", err);
    throw err;
  }
};
