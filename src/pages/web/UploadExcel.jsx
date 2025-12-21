import React, { useState } from "react";
import Card, { CardContent } from "../../components/common/Card";
import Typography from "../../components/common/Typography";
import Button from "../../components/common/Button";

export default function UploadExcel() {
  const [file, setFile] = useState(null);

  const handleUpload = () => {
    if (!file) return alert("Chọn file Excel trước khi upload!");
    alert(`Đã upload file: ${file.name}`);
  };

  return (
    <Card style={{ padding: 30, borderRadius: 8, maxWidth: 600, margin: "0 auto" }}>
      <CardContent>
        <Typography variant="h6" style={{ marginBottom: 20, color: "#8CBF41" }}>
          Nhập dữ liệu đơn hàng / sản phẩm từ file Excel
        </Typography>

        <input
          type="file"
          accept=".xlsx"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginBottom: 20 }}
        />

        <Button
          style={{ backgroundColor: "#8CBF41", color: "#fff", borderRadius: 6 }}
          onClick={handleUpload}
        >
          Upload
        </Button>
      </CardContent>
    </Card>
  );
}
