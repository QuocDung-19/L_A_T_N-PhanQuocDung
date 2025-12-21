import { useState } from "react";
import Box from "../common/Box";
import TextField from "../common/TextField";
import Textarea from "../common/Textarea";
import Button from "../common/Button";
import Typography from "../common/Typography";

export default function CreateNews({ news, onClose, onCreated }) {
  const [title, setTitle] = useState(news?.title || "");
  const [content, setContent] = useState(news?.content || "");
  const [status, setStatus] = useState(news?.status || "ACTIVE");
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(news?.imageUrl || "");
  const [uploading, setUploading] = useState(false);

  const CLOUD_NAME = "ddyu7bjsd"; // thay bằng cloud name của bạn
  const UPLOAD_PRESET = "product_upload";

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data.secure_url;
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file);
      setImageUrl(url);
    } catch (err) {
      console.error("Upload thất bại", err);
      alert("Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("Vui lòng nhập tiêu đề và nội dung");
      return;
    }

    const newsObj = {
      title,
      content,
      status,
      imageUrl, // dùng url cloud
    };

    if (news?.newsID) newsObj.newsID = news.newsID;

    const formData = new FormData();
    formData.append("news", new Blob([JSON.stringify(newsObj)], { type: "application/json" }));

    await onCreated(formData);
  };

  return (
    <Box
      style={{
        width: "90vw",
        maxWidth: 700,
        maxHeight: "85vh",
        overflowY: "auto",
        backgroundColor: "#fff",
        borderRadius: 10,
        padding: 24,
      }}
    >
      <Typography variant="h5" style={{ marginBottom: 20, fontWeight: 600 }}>
        {news ? "Cập nhật tin tức" : "Tạo tin tức mới"}
      </Typography>

      <Box mb={2}>
        <TextField label="Tiêu đề" value={title} onChange={(e) => setTitle(e.target.value)} fullWidth />
      </Box>

      <Box mb={2}>
        <Textarea
          label="Nội dung bài viết"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Nhập nội dung bài viết..."
          minHeight={200}
          maxHeight={500}
        />
      </Box>

      <Box mb={2}>
        <Typography variant="body2" style={{ marginBottom: 6 }}>
          Hình ảnh đại diện
        </Typography>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {uploading && <Typography variant="body2">Đang upload...</Typography>}
        {imageUrl && (
          <Box style={{ marginTop: 10, textAlign: "center" }}>
            <img src={imageUrl} alt="Preview" style={{ maxWidth: 200, maxHeight: 120, objectFit: "contain", borderRadius: 6 }} />
          </Box>
        )}
      </Box>

      <Box mb={2}>
        <Typography variant="body2" style={{ marginBottom: 6 }}>Trạng thái</Typography>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={{ width: "100%", padding: 10, borderRadius: 6, border: "1px solid #ccc" }}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>
      </Box>

      <Box style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }}>
        <Button style={{ backgroundColor: "#6c757d", color: "#fff" }} onClick={onClose}>Hủy</Button>
        <Button style={{ backgroundColor: "#8CBF41", color: "#fff" }} onClick={handleSubmit}>Lưu</Button>
      </Box>
    </Box>
  );
}
