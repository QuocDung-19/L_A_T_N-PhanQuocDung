import { useEffect, useState } from "react";
import Box from "../../../components/common/Box";
import Typography from "../../../components/common/Typography";
import Button from "../../../components/common/Button";

import { getProducts, createProduct, updateProduct, deleteProduct } from "../../../services/api/productApi";
import CreateProduct from "../../../components/auth/CreateProduct";
import editIcon from "../../../assets/images/edit.png";
import trashIcon from "../../../assets/images/trash.png";

export default function AdminProducts({ onReloadStats }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      alert("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
    setCurrentPage(1);
  };

  const openEdit = (product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Xóa sản phẩm này?")) return;
    try {
      await deleteProduct(productId);
      setProducts(products.filter(p => p.productId !== productId));

      onReloadStats?.();

      setCurrentPage(1);
    } catch (err) {
      alert("Xóa thất bại");
    }
  };

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const displayedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  return (
    <Box style={{ padding: 20 }}>
      <Typography variant="h4" style={{ marginBottom: 20 }}>Quản lý sản phẩm</Typography>

      <Button
        onClick={openCreate}
        style={{ backgroundColor: "#8CBF41", color: "#fff", marginBottom: 15 }}
      >
        + Thêm sản phẩm
      </Button>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
              
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>ID</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Tên</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Giá</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Ảnh</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr><td colSpan={5} style={{ textAlign: "center", padding: 10 }}>Đang tải...</td></tr>
          ) : products.length === 0 ? (
            <tr><td colSpan={5} style={{ textAlign: "center", padding: 10 }}>Không có dữ liệu</td></tr>
          ) : (
            displayedProducts.map(p => (
              <tr key={p.productId}>
                <td style={{ padding: 8 }}>{p.productId}</td>
                <td style={{ padding: 8 }}>{p.name}</td>
                <td style={{ padding: 8 }}>{p.price}</td>
                <td style={{ padding: 8 }}>
                  {p.imageUrl && <img src={p.imageUrl} width="60" alt={p.name} />}
                </td>
                <td style={{ padding: 8, display: "flex", gap: 10 }}>
                  <Button
                    style={{
                      backgroundColor: "#17a2b8",
                      padding: 6,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                    onClick={() => openEdit(p)}
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
                    onClick={() => handleDelete(p.productId)}
                  >
                    <img
                      src={trashIcon}
                      alt="delete"
                      style={{ width: 18, height: 18 }}
                    />
                  </Button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Box
              style={{
                marginTop: 15,
                display: "flex",
                justifyContent: "center",
                gap: 10,
                alignItems: "center",
                flexDirection: "row"
              }}
            >
              <Button
                onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>

              <Typography variant="body1">
                {currentPage} / {totalPages}
              </Typography>

              <Button
                onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
        </Box>

      {modalOpen && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex", justifyContent: "center", alignItems: "center",
          zIndex: 9999
        }}
        onClick={() => setModalOpen(false)}
        >
          <div onClick={(e)=>e.stopPropagation()} style={{
            backgroundColor: "#fff",
            borderRadius: 8,
            padding: 20,
            minWidth: 400
          }}>
            <CreateProduct
              product={editingProduct}
              onClose={() => setModalOpen(false)}
              onCreated={async (formDataOrObj) => {
                try {
                  if (editingProduct) {
                    const updated = await updateProduct(editingProduct.productId, formDataOrObj);
                    setProducts(products.map(p => p.productId === editingProduct.productId ? updated : p));
                  } else {
                    const created = await createProduct(formDataOrObj);
                    setProducts([...products, created]);
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
