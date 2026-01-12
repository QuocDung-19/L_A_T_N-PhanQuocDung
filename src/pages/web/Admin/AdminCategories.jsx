import { useEffect, useState } from "react";
import Box from "../../../components/common/Box";
import Typography from "../../../components/common/Typography";
import Button from "../../../components/common/Button";
import TextField from "../../../components/common/TextField";
import CategoriesCreate from "../../../components/auth/CategoriesCreate";
import trashIcon from "../../../assets/images/trash.png";

import {
  getCategories,
  deleteCategory,
} from "../../../services/api/categoryApi";

export default function AdminCategories() {

  console.log = () => {};

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const data = await getCategories();
      setCategories(data);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

const handleDelete = async (id) => {
  if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) return;
  try {
    await deleteCategory(id);
    setCategories(categories.filter((c) => c.categoryId !== id));
    setSuccessMessage("Xóa danh mục thành công");
    setTimeout(() => setSuccessMessage(""), 3000);
  } catch (err) {
    alert(err.message);
  }
};

  const filteredCategories = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );
console.log("CATEGORIES RAW:", categories);
  return (
    <Box style={{ padding: 20 }}>
      <Typography variant="h4" style={{ marginBottom: 20 }}>
        Quản lý danh mục sản phẩm
      </Typography>

      {successMessage && (
        <Typography style={{ background: "#d4edda", padding: 10 }}>
          {successMessage}
        </Typography>
      )}

      <Box style={{ display: "flex", gap: 10, marginBottom: 15 }}>
        <Button
          style={{ backgroundColor: "#8CBF41", color: "#fff" }}
          onClick={() => setModalOpen(true)}
        >
          + Thêm danh mục
        </Button>

        <TextField
          placeholder="Tìm theo tên danh mục"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      <table width="100%">
        <thead>
          <tr>
            <th align="left">ID</th>
            <th align="left">Tên</th>
            <th align="left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.map((c) => (
            <tr key={c.categoryId}>
              <td>{c.categoryId}</td>
              <td>{c.name}</td>
              <td style={{ padding: 8, display: "flex", gap: 10 }}>
                <Button
                  style={{
                    backgroundColor: "#dc3545",
                    padding: 6,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onClick={() => handleDelete(c.categoryId)}
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

        {modalOpen && (
          <div
            onClick={() => setModalOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              style={{
                background: "#fff",
                padding: 20,
                borderRadius: 8,
                minWidth: 400,
              }}
            >
              <CategoriesCreate
                onClose={() => setModalOpen(false)}
                onSuccess={(created) => {
                  setCategories([...categories, created]);
                }}
              />
            </div>
          </div>
        )}

    </Box>
  );
}
