const API_URL = "http://localhost:8080/api/order";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
  "Content-Type": "application/json",
});


export const getOrders = async () => {
  const res = await fetch(API_URL, {
    headers: getHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error("Không tải được danh sách đơn hàng");

  return data.result || data;
};


export const updateOrderStatus = async (orderId, status) => {
  const res = await fetch(
    `${API_URL}/${orderId}/status/${status}`,
    {
      method: "PATCH",
      headers: getHeaders(),
    }
  );

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Đổi trạng thái thất bại");

  return data.result || data;
};


export const createOrder = async (orderData) => {
  console.log("ORDER DATA:", orderData);
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(orderData),
  });

  

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Tạo đơn hàng thất bại");

  return data.result || data;
};

export const getOrderById = async (orderId) => {
  const res = await fetch(`${API_URL}/${orderId}`, {
    headers: getHeaders(),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Không tải được chi tiết đơn hàng");

  return data.result || data;
};


export const getOrdersByUser = async (userID) => {
  if (!userID) throw new Error("userID không hợp lệ");

  const res = await fetch(`${API_URL}/user/${userID}`, {
    headers: getHeaders(),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Lỗi lấy danh sách đơn hàng");
  }

  return data.result || data;
};