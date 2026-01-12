const API_URL = "http://localhost:8080/api/category";

const getHeaders = () => {
  const token = localStorage.getItem("token");

  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};


export const getCategories = async () => {
  const res = await fetch(API_URL, {
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Không tải được danh mục");
  }

  return data.result ?? data;
};


export const createCategory = async (category) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(category),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Tạo danh mục thất bại");
  return data.result || data;
};


export const updateCategory = async (id, category) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(category),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Cập nhật thất bại");
  return data.result || data;
};


export const deleteCategory = async (id) => {
  const res = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Xóa danh mục thất bại");
  return true;
};
