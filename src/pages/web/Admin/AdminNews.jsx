import React, { useEffect, useState } from "react";
import Box from "../../../components/common/Box";
import Typography from "../../../components/common/Typography";
import Button from "../../../components/common/Button";
import { getNewsList, createNews, updateNews, deleteNews } from "../../../services/api/newsApi";
import CreateNews from "../../../components/auth/AdminNewsCreate";
import editIcon from "../../../assets/images/edit.png";
import trashIcon from "../../../assets/images/trash.png";

export default function AdminNews({ onReloadStats }) {

  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;
  const totalPages = Math.ceil(newsList.length / PAGE_SIZE);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const data = await getNewsList();
      setNewsList(data);
    } catch (err) {
      alert("Không thể tải danh sách tin tức");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const openCreate = () => {
    setEditingNews(null);
    setModalOpen(true);
  };

  const openEdit = (news) => {
    setEditingNews(news);
    setModalOpen(true);
  };

  const handleDelete = async (newsID) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;
    try {
      await deleteNews(newsID);
      setNewsList(newsList.filter(n => n.newsID !== newsID));
      onReloadStats?.();
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  const currentData = newsList.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <Box style={{ padding: 20 }}>
      <Typography variant="h4" style={{ marginBottom: 20 }}>Quản lý tin tức</Typography>

      <Button onClick={openCreate} style={{ backgroundColor: "#8CBF41", color: "#fff", marginBottom: 15 }}>
        + Tạo tin tức mới
      </Button>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>ID</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Tiêu đề</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Hình ảnh</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Trạng thái</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} style={{ textAlign: "center", padding: 10 }}>Đang tải...</td></tr>
          ) : currentData.length === 0 ? (
            <tr><td colSpan={5} style={{ textAlign: "center", padding: 10 }}>Không có dữ liệu</td></tr>
          ) : currentData.map(n => (
            <tr key={n.newsID}>
              <td style={{ padding: 8 }}>{n.newsID}</td>
              <td style={{ padding: 8 }}>{n.title}</td>
              <td style={{ padding: 8 }}>
                {n.imageUrl && <img src={n.imageUrl} alt={n.title} width={60} style={{ objectFit: "cover", borderRadius: 4 }} />}
              </td>
              <td style={{ padding: 8 }}>{n.status}</td>
              <td style={{ padding: 8, display: "flex", gap: 10 }}>
                <Button
                    style={{
                      backgroundColor: "#17a2b8",
                      padding: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => openEdit(n)}
                  >
                    <img
                      src={editIcon}
                      alt="edit"
                      style={{ width: 18, height: 18 }}
                    />
                  </Button>

                  <Button
                    style={{
                      backgroundColor: "#dc3545",
                      padding: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => handleDelete(n.newsID)}
                  >
                    <img
                      src={trashIcon}
                      alt="delete"
                      style={{ width: 18, height: 18 }}
                    />
                  </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* pagination */}
      {totalPages > 1 && (
        <Box style={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 10, marginTop: 10 }}>
          <Button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</Button>
          <Typography>{page} / {totalPages}</Typography>
          <Button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</Button>
        </Box>
      )}

      {/* modal */}
      {modalOpen && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 9999
        }} onClick={() => setModalOpen(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "#fff", borderRadius: 8, padding: 20, minWidth: 400 }}>
            <CreateNews
              news={editingNews}
              onClose={() => setModalOpen(false)}
              onCreated={async (formData) => {
                try {
                  if (editingNews) {
                    const updated = await updateNews(formData);
                    setNewsList(newsList.map(n => n.newsID === editingNews.newsID ? updated : n));
                  } else {
                    const created = await createNews(formData);
                    setNewsList([...newsList, created]);
                    onReloadStats?.();
                  }
                  setModalOpen(false);
                } catch (err) {
                  alert(err.message);
                }
              }}
            />
          </div>
        </div>
      )}
    </Box>
  );
}
