const API_URL = "http://localhost:8080/api/user";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});


export const getUserById = async (userID) => {
  const res = await fetch(`${API_URL}/${userID}`, {
    headers: getHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Lỗi lấy thông tin người dùng");
  }

  return data.result || data;
};


export const updateUserById = async (userID, payload) => {
  const res = await fetch(`${API_URL}/${userID}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(payload),
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {}

  if (!res.ok) {
    throw new Error(
      data.message || "Cập nhật thất bại (không có message từ server)"
    );
  }

  return data.result || data;
};
