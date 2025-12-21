import { useState } from "react";
import Box from "../common/Box";
import TextField from "../common/TextField";
import Button from "../common/Button";
import Typography from "../common/Typography";
import Textarea from "../common/Textarea";

export default function CreateProduct({ product, onClose, onCreated }) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price ?? 0);
  const [stock, setStock] = useState(product?.stock ?? 0);
  const [length, setLength] = useState(product?.length ?? 0);
  const [width, setWidth] = useState(product?.width ?? 0);
  const [height, setHeight] = useState(product?.height ?? 0);

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [videoFile, setVideoFile] = useState(null);
  const [videosUrl, setVideosUrl] = useState(product?.videosUrl || "");

  const [status, setStatus] = useState(product?.status || "ACTIVE");
  const [uploading, setUploading] = useState(false);

  const CLOUD_NAME = "ddyu7bjsd";      
  const UPLOAD_PRESET = "product_upload";

 
  const uploadToCloudinary = async (file, type = "image") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${type}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!res.ok) throw new Error("Upload thất bại");

    const data = await res.json();
    return data.secure_url;
  };


  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImageFile(file);
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "image");
      setImageUrl(url); 
    } catch (err) {
      console.error("Upload ảnh thất bại", err);
      alert("Upload ảnh thất bại");
    } finally {
      setUploading(false);
    }
  };


  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setVideoFile(file);
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, "video");
      setVideosUrl(url);
    } catch (err) {
      console.error("Upload video thất bại", err);
      alert("Upload video thất bại");
    } finally {
      setUploading(false);
    }
  };


  const handleSubmit = async () => {
    if (!name || price <= 0) {
      alert("Vui lòng nhập tên và giá hợp lệ");
      return;
    }

    const productObj = {
      name,
      description,
      price,
      stock,
      length,
      width,
      height,
      status,
      imageUrl,
      videosUrl,
    };

    if (product?.productId) {
      productObj.productID = product.productId;
    }

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(productObj)], { type: "application/json" })
    );

    if (videoFile) formData.append("video", videoFile);

    if (product?.productId) {
      await onCreated(productObj);
    } else {
      await onCreated(formData);
    }
  };

  return (
    <Box
      style={{
        width: "90vw",
        maxWidth: 800,
        maxHeight: "85vh",
        overflowY: "auto",
        backgroundColor: "#fff",
        borderRadius: 8,
        padding: 20,
      }}
    >
      <Typography variant="h5" style={{ marginBottom: 15 }}>
        {product ? "Cập nhật sản phẩm" : "Thêm sản phẩm"}
      </Typography>

      <Box style={{ marginBottom: 15, textAlign: "center" }}>
        {uploading ? (
          <Typography variant="body2">Đang upload...</Typography>
        ) : imageUrl || imageFile ? (
          <img
            src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
            alt="Preview"
            style={{
              maxWidth: "100%",
              maxHeight: 200,
              objectFit: "contain",
              borderRadius: 8,
            }}
          />
        ) : (
          <Box
            style={{
              width: "100%",
              height: 200,
              border: "1px dashed #ccc",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 8,
              color: "#aaa",
            }}
          >
            Ảnh xem trước
          </Box>
        )}
      </Box>

      <Box style={{ display: "flex", gap: 20 }}>
        <Box style={{ flex: 1 }}>
          <TextField label="Tên sản phẩm" value={name} onChange={(e) => setName(e.target.value)} />
          <Box mb={2}>
          <Textarea
            label="Mô tả sản phẩm"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Nhập mô tả chi tiết sản phẩm..."
            minHeight={120}
            maxHeight={300}
          />
        </Box>
          <TextField
            label="Giá (VNĐ)"
            type="number"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />

          <Typography variant="body2" style={{ marginTop: 10 }}>
            Hình ảnh
          </Typography>
          <input type="file" accept="image/*" onChange={handleImageChange} />
          <TextField label="Hoặc URL ảnh" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />

          <Typography variant="body2" style={{ marginTop: 10 }}>
            Video
          </Typography>
          <input type="file" accept="video/*" onChange={handleVideoChange} />
          <TextField label="Hoặc URL video" value={videosUrl} onChange={(e) => setVideosUrl(e.target.value)} />
        </Box>

        <Box style={{ flex: 1 }}>
          <TextField
            label="Số lượng tồn kho"
            type="number"
            value={stock}
            onChange={(e) => setStock(Number(e.target.value))}
          />

          <Typography variant="body2" style={{ marginTop: 10 }}>
            Kích thước (cm)
          </Typography>
          <TextField label="Chiều dài" type="number" value={length} onChange={(e) => setLength(Number(e.target.value))} />
          <TextField label="Chiều rộng" type="number" value={width} onChange={(e) => setWidth(Number(e.target.value))} />
          <TextField label="Mặt" type="number" value={height} onChange={(e) => setHeight(Number(e.target.value))} />

          <Typography variant="body2" style={{ marginTop: 10 }}>
            Trạng thái
          </Typography>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            style={{ width: "100%", padding: 8 }}
          >
            <option value="ACTIVE">hàng mới</option>
            <option value="INACTIVE">Còn hàng</option>
            <option value="OUT_OF_STOCK">Hết hàng</option>
          </select>
        </Box>
      </Box>

      <Box style={{ display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 20 }}>
        <Button style={{ backgroundColor: "#323232", color: "#fff" }} onClick={onClose}>
          Hủy
        </Button>
        <Button style={{ backgroundColor: "#8CBF41", color: "#fff" }} onClick={handleSubmit}>
          Lưu
        </Button>
      </Box>
    </Box>
  );
}
