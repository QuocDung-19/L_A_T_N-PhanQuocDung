const API_URL = "http://localhost:8080/api/news";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getNewsList = async () => {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error("Không thể lấy danh sách tin tức");
  const data = await res.json();
  return data.result;
};

export const getNewsById = async (newsID) => {
  const res = await fetch(`${API_URL}/${newsID}`);
  if (!res.ok) throw new Error("Không thể lấy tin tức");
  const data = await res.json();
  return data.result;
};

export const createNews = async (formData) => {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(), 
    body: formData,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Tạo tin tức thất bại");
  }

  const data = await res.json();
  return data.result;
};

export const updateNews = async (formData) => {
  const res = await fetch(API_URL, {
    method: "PUT",
    headers: getAuthHeaders(), 
    body: formData,
  });

  if (!res.ok) throw new Error("Cập nhật tin tức thất bại");
  const data = await res.json();
  return data.result;
};

export const deleteNews = async (newsID) => {
  const res = await fetch(`${API_URL}/${newsID}`, {
    method: "DELETE",
    headers: getAuthHeaders(), 
  });

  if (!res.ok) throw new Error("Xóa tin tức thất bại");
  const data = await res.json();
  return data.result;
};
