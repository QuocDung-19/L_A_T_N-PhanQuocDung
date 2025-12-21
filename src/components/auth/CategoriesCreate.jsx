import { useState } from "react";
import Box from "../common/Box";
import Typography from "../common/Typography";
import TextField from "../common/TextField";
import Button from "../common/Button";
import { createCategory } from "../../services/api/categoryApi";

export default function CategoriesCreate({ onSuccess, onClose }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      alert("Tên danh mục không được để trống");
      return;
    }

    try {
      setLoading(true);

      const created = await createCategory({
        name,
        description,
      });

      alert("Tạo danh mục thành công");

      // callback cho component cha
      onSuccess?.(created);

      // reset
      setName("");
      setDescription("");
      onClose?.();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box style={{ padding: 20, width: 400 }}>
      <Typography variant="h5" style={{ marginBottom: 15 }}>
        Thêm danh mục
      </Typography>

      <TextField
        label="Tên danh mục"
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ marginBottom: 15 }}
      />

      <TextField
        label="Mô tả"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={{ marginBottom: 20 }}
      />

      <Box style={{ display: "flex", gap: 10 }}>
        <Button style={{ flex: 1 }} onClick={onClose}>
          Hủy
        </Button>
        <Button
          style={{ flex: 1, backgroundColor: "#8CBF41", color: "#fff" }}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Đang lưu..." : "Lưu"}
        </Button>
      </Box>
    </Box>
  );
}
