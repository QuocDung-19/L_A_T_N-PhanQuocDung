import { useState, useEffect } from "react";
import Box from "../common/Box";
import TextField from "../common/TextField";
import Button from "../common/Button";
import Typography from "../common/Typography";
import Textarea from "../common/Textarea";
import { getCategories } from "../../services/api/categoryApi";

export default function CreateProduct({ product, onClose, onCreated }) {

  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [price, setPrice] = useState(product?.price ?? "");
  const [stock, setStock] = useState(product?.stock ?? "");
  const [piecesNumber, setPiecesNumber] = useState(product?.piecesNumber ?? "");
  const [length, setLength] = useState(product?.length ?? "");
  const [width, setWidth] = useState(product?.width ?? "");
  const [height, setHeight] = useState(product?.height ?? "");

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || "");
  const [videoFile, setVideoFile] = useState(null);
  const [videosUrl, setVideosUrl] = useState(product?.videosUrl || "");

  const [status, setStatus] = useState(product?.status || "ACTIVE");
  const [categoryId, setCategoryId] = useState(product?.categoryId ?? "");
  const [uploading, setUploading] = useState(false);

  const [categories, setCategories] = useState([]);

  const CLOUD_NAME = "ddyu7bjsd";      
  const UPLOAD_PRESET = "product_upload";

  const [showStockList, setShowStockList] = useState(false);
  const [showPiecesList, setShowPiecesList] = useState(false);
  const [showLengthList, setShowLengthList] = useState(false);
  const [showWidthList, setShowWidthList] = useState(false);
  const [showHeightList, setShowHeightList] = useState(false);
    
      const stockOptions = Array.from(
        { length: (100 - 10) / 10 + 1 },
        (_, i) => 10 + i * 10
      );

      const piecesOptions = Array.from(
        { length: (2000 - 100) / 100 + 1 },
        (_, i) => 100 + i * 100
      );

      const heightOptions = Array.from(
        { length: 75 - 18 + 1 },
        (_, i) => 18 + i
      );

     const widthOptions = Array.from(
        { length: 105 - 21 + 1 },
        (_, i) => 21 + i
      );

      const lengthOptions = Array.from(
        { length: (2000 - 100) / 100 + 1 },
        (_, i) => 100 + i * 100
      );

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (e) {
        alert("Không tải được danh mục");
      }
    };
    fetchCategories();
  }, []);

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
    if (!name || price <= 0) return alert("Vui lòng nhập tên và giá hợp lệ");
    if (!categoryId) return alert("Vui lòng chọn danh mục");

    const productObj = {
      name,
      description,
      price,
      stock,
      piecesNumber,
      length,
      width,
      height,
      status,
      imageUrl,
      videosUrl,
      categoryId: Number(categoryId),
    };

    const formData = new FormData();
    formData.append(
      "product",
      new Blob([JSON.stringify(productObj)], { type: "application/json" })
    );

    try {
      const result = await onCreated(formData);
      return result;
    } catch (err) {
      alert("Lưu sản phẩm thất bại");
      console.error(err);
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

        <Box style={{ marginBottom: 15 }}>
          <Typography>Danh mục</Typography>
          <select
            value={categoryId ?? ""}
            onChange={(e) => setCategoryId(e.target.value)}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((c) => (
              <option key={c.categoryId} value={c.categoryId}>
                {c.name}
              </option>
            ))}
          </select>
        </Box>

        <Box style={{ flex: 1 }}>
          <Box style={{ position: "relative" }}>
            <TextField
              label="Số kiện tồn kho"
              type="number"
              value={stock}
              onFocus={() => setShowStockList(true)}
              onChange={(e) => setStock(Number(e.target.value))}
              onBlur={() => setTimeout(() => setShowStockList(false), 150)}
            />

            {showStockList && (
              <Box
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  maxHeight: 150,
                  overflowY: "auto",
                  zIndex: 20,
                  marginTop: 4,
                }}
              >
                {stockOptions.map(v => (
                  <Box
                    key={v}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setStock(v);
                      setShowStockList(false);
                    }}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                    }}
                  >
                    {v}
                  </Box>
                ))}
              </Box>
            )}
          </Box>


          <Box style={{ position: "relative" }}>
            <TextField
              label="Số thanh trong 1 kiện"
              type="number"
              value={piecesNumber}
              onFocus={() => setShowPiecesList(true)}
              onChange={(e) => setPiecesNumber(Number(e.target.value))}
              onBlur={() => setTimeout(() => setShowPiecesList(false), 150)}
            />

            {showPiecesList && (
              <Box
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  maxHeight: 180,
                  overflowY: "auto",
                  zIndex: 20,
                  marginTop: 4,
                }}
              >
                {piecesOptions.map(v => (
                  <Box
                    key={v}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setPiecesNumber(v);
                      setShowPiecesList(false);
                    }}
                    style={{ padding: "8px 12px", cursor: "pointer" }}
                  >
                    {v}
                  </Box>
                ))}
              </Box>
            )}
          </Box>



          <Typography variant="body2" style={{ marginTop: 10 }}>
            Kích thước (cm)
          </Typography>
          <Box style={{ position: "relative" }}>
            <TextField
              label="Chiều dài (mm)"
              type="number"
              value={length}
              onFocus={() => setShowLengthList(true)}
              onChange={(e) => setLength(Number(e.target.value))}
              onBlur={() => setTimeout(() => setShowLengthList(false), 150)}
            />

            {showLengthList && (
              <Box
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  maxHeight: 200,
                  overflowY: "auto",
                  zIndex: 20,
                  marginTop: 4,
                }}
              >
                {lengthOptions.map(v => (
                  <Box
                    key={v}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setLength(v);
                      setShowLengthList(false);
                    }}
                    style={{ padding: "8px 12px", cursor: "pointer" }}
                  >
                    {v}
                  </Box>
                ))}
              </Box>
            )}
          </Box>

          <Box style={{ position: "relative" }}>
            <TextField
              label="Chiều rộng (mm)"
              type="number"
              value={width}
              onFocus={() => setShowWidthList(true)}
              onChange={(e) => setWidth(Number(e.target.value))}
              onBlur={() => setTimeout(() => setShowWidthList(false), 150)}
            />

            {showWidthList && (
              <Box
                style={{
                  position: "absolute",
                  top: "100%",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: 6,
                  maxHeight: 200,
                  overflowY: "auto",
                  zIndex: 20,
                  marginTop: 4,
                }}
              >
                {widthOptions.map((v) => (
                  <Box
                    key={v}
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => {
                      setWidth(v);
                      setShowWidthList(false);
                    }}
                    style={{ padding: "8px 12px", cursor: "pointer" }}
                  >
                    {v}
                  </Box>
                ))}
              </Box>
            )}
          </Box>


          <datalist id="width-list">
            {widthOptions.map(v => (
              <option key={v} value={v} />
            ))}
          </datalist>

          <Box style={{ position: "relative" }}>
          <TextField
            label="Chiều dày / Mặt (mm)"
            type="number"
            value={height}
            onFocus={() => setShowHeightList(true)}
            onChange={(e) => setHeight(Number(e.target.value))}
            onBlur={() => setTimeout(() => setShowHeightList(false), 150)}
          />

          {showHeightList && (
            <Box
              style={{
                position: "absolute",
                top: "100%",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: 6,
                maxHeight: 200,
                overflowY: "auto",
                zIndex: 20,
                marginTop: 4,
              }}
            >
              {heightOptions.map((v) => (
                <Box
                  key={v}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => {
                    setHeight(v);
                    setShowHeightList(false);
                  }}
                  style={{ padding: "8px 12px", cursor: "pointer" }}
                >
                  {v}
                </Box>
              ))}
            </Box>
          )}
        </Box>

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
