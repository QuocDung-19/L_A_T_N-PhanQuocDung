const API_URL = "http://localhost:8080/api/product";
const CATEGORY_URL = "http://localhost:8080/api/category";

// USER KHÔNG CÓ TOKEN

export const getPublicCategories = async () => {
  const res = await fetch(CATEGORY_URL);
  const data = await res.json();
  if (!res.ok) throw new Error("Không tải được danh mục");
  return data.result || data;
};

export const getPublicProducts = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  if (!res.ok) throw new Error("Không tải được sản phẩm");
  return data.result || data;
};

export const getPublicProductById = async (id) => {
  const res = await fetch(`${API_URL}/${id}`);
  const data = await res.json();
  if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
  return data.result || data;
};
