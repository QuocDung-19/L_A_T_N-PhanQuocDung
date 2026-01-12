import React from "react";
import { useParams } from "react-router-dom";

import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import Grid from "../../components/common/Grid";
import Card, { CardMedia, CardContent } from "../../components/common/Card";
import Carousel from "../../components/Layout/Carousel";
import { useNavigate } from "react-router-dom";
import CartItemList, { useCart } from "./CartItemList";

import { getPublicProducts } from "../../services/api/productPublicApi";

export default function ProductDetail() {
  const { id } = useParams();
  const [products, setProducts] = React.useState([]);
  const navigate = useNavigate();
  const { addToCart } = useCart();

  
  React.useEffect(() => {
    getPublicProducts().then(data => {
      const mapped = data.map(p => ({
        id: p.productID,
        name: p.name,
        price: p.price,
        image: p.imageUrl || "/images/no-image.png",
        videoUrl: p.videosUrl || "",
        description: p.description || "Mô tả sản phẩm...",
        rating: p.rating || 4,
        reviews: p.reviews || 0,
        stock: p.stock,
        status: p.status,
        piecesNumber: p.piecesNumber,
        height: p.height, 
        width: p.width,  
        length: p.length, 
      }));
      setProducts(mapped);
    });
  }, []);

  const product = products.find(p => p.id === parseInt(id));

  if (!product) return <Typography variant="h5" style={{ textAlign: "center", marginTop: 50 }}>Sản phẩm không tồn tại</Typography>;

    const isOutOfStock = product.status === "OUT_OF_STOCK";

  const relatedProducts = products.filter(p => p.id !== product.id).slice(0, 6);

  return (
    <>
      <Header />
      <Box style={{ width: "100%", display: "flex", flexDirection: "row", justifyContent: "center", padding: "40px 0", backgroundColor: "#f5f7f5" }}>
        <Box style={{ width: "100%", maxWidth: "1200px", padding: "0 20px", display: "flex", flexDirection: "column", gap: "40px" }}>
          <Typography variant="body1" style={{ opacity: 0.7 }}>
            Trang chủ / Phôi Gỗ / <strong>{product.name}</strong>
          </Typography>

          <Grid container spacing={40} style={{ display: "flex", flexWrap: "nowrap" }}>
            <Grid item columns={6}>
              <Box style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    maxWidth: "400px",
                    maxHeight: "350px",
                    width: "100%",
                    objectFit: "contain",
                  }}
                />

                <Box
                  style={{
                    border: "1px solid #ddd",
                    borderRadius: 8,
                    padding: 12,
                    background: "#fafafa",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: 700, marginBottom: 8 }}
                  >
                    Video review sản phẩm
                  </Typography>

                  {product.videoUrl ? (
                    <video
                      src={product.videoUrl}
                      controls
                      poster={product.image} 
                      style={{
                      width: "100%",
                      height: 200,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                    />

                  ) : (
                    <Typography variant="body2" style={{ color: "#777" }}>
                      Chưa có video review cho sản phẩm này
                    </Typography>
                  )}
                </Box>

              </Box>
            </Grid>


            <Grid item columns={6}>
              <Box style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                <Typography variant="h4" style={{ color: "#8CBF41" }}>{product.name}</Typography>
                <Typography variant="body2" style={{ color: "#555", fontSize: 20, fontWeight: 500, margin: "8px 0" }}>
                            {product.height} x {product.length} x {product.width} Mm = {product.piecesNumber} thanh
                </Typography>
                  <Typography variant="body2" style={{ color: "#555", fontSize: 16, fontWeight: 500 }}>
                            Tình trạng: {isOutOfStock ? "Hết hàng" : "Còn hàng"}
                  </Typography>
             
                <Typography variant="h3" style={{ color: "#d35400", fontWeight: "bold" }}>{product.price?.toLocaleString("vi-VN")} ₫</Typography>
                <Typography
                  variant="body1"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {product.description}
                </Typography>
                  <button
                    onClick={() => addToCart(product, 1)}
                    disabled={isOutOfStock}
                    style={{
                      marginTop: "20px",
                      padding: "12px 20px",
                      fontSize: "16px",
                      background: isOutOfStock ? "#ccc" : "#8CBF41",
                      color: "#fff",
                      border: "none",
                      borderRadius: "6px",
                      cursor: isOutOfStock ? "not-allowed" : "pointer",
                      width: "200px",
                    }}
                  >
                    {isOutOfStock ? "Hết hàng" : "Thêm vào giỏ"}
                  </button>

              </Box>
            </Grid>
          </Grid>

          <Box style={{ display: "flex", flexDirection: "column", gap: "30px" }}>
            <Box style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px", background: "#fafafa", lineHeight: 1.8 }}>
              <Typography variant="h5" style={{ marginBottom: "16px", color: "#8CBF41" }}>
                Thông tin chi tiết sản phẩm
              </Typography>

              <Typography variant="body2" style={{ marginBottom: "12px", fontStyle: "italic" }}>
                Giá trên website là giá tham khảo. Để biết thông tin giá chính xác vui lòng liên hệ:
                <strong> Hotline/Zalo: 0901 455 726</strong>
              </Typography>

              <Typography variant="body1"><strong>Phôi Cao Su Ván:</strong></Typography>
              <Typography variant="body2">Tên sản phẩm: Phôi Cao Su Tẩm Sấy</Typography>
              <Typography variant="body2">
                Quy cách: Phôi Cao Su Ván – 21×45-75×200-350/400-600
              </Typography>
              <Typography variant="body2">hất lượng: AB – Phôi Thân</Typography>
              <Typography variant="body2">Số lượng: SL lớn, cung cấp theo đơn</Typography>
              <Typography variant="body2">Giá rẻ tại xưởng</Typography>
              <Typography variant="body2">Có lựa theo quy cách yêu cầu</Typography>

              <Typography variant="body2" style={{ marginTop: "12px" }}>
     
              </Typography>

              <Typography variant="body2">1 Container ~ 36 – 38 m³</Typography>
              <Typography variant="body2">1 m³ gỗ phần thân ~ 720 – 750 kg</Typography>
              <Typography variant="body2">1 m³ gỗ phần gốc ~ 620 – 650 kg</Typography>
              <Typography variant="body2">
                Phạm vi giao hàng: Toàn quốc (64 Tỉnh Thành)
              </Typography>

              <Typography variant="body2" style={{ marginTop: "10px", fontWeight: "bold", color: "#d35400" }}>
                FREE SHIP khi mua từ 5 m³ trở lên
              </Typography>

              <Typography variant="body2" style={{ marginTop: "12px" }}>
                Công ty chuyên sản xuất và cung cấp Phôi Cao Su tẩm sấy: Phôi Thân – Phôi Gốc
              </Typography>

              <Typography variant="body2" style={{ marginTop: "8px" }}>
                <strong>CÔNG TY TNHH SX – TM – DV – XNK HOÀNG GIA PHÁT</strong>
              </Typography>
              <Typography variant="body2">
                Địa chỉ: 413/58 Nguyễn Kiệm, Phường 9, Quận Phú Nhuận, TP.HCM
              </Typography>
              <Typography variant="body2">MST: 0318203040</Typography>
              <Typography variant="body2">Hotline: 0901 455 726</Typography>
              <Typography variant="body2">Email: info@hoangggiaphat.vn</Typography>
            </Box>

              <Box style={{ padding: "20px", border: "1px solid #ddd", borderRadius: "8px" }}>
                <Typography variant="h5" style={{ marginBottom: "12px", color: "#8CBF41" }}>
                  Bình luận
                </Typography>

                <textarea
                  placeholder="Nhập bình luận của bạn..."
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "10px",
                    borderRadius: "6px",
                    border: "1px solid #ccc",
                    fontSize: "14px",
                    resize: "vertical"
                  }}
                />
              </Box>
          </Box>

          <Box style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="h5" style={{ color: "#8CBF41" }}>Sản phẩm liên quan</Typography>
              <Carousel showThumbs={false} showIndicators={false} infiniteLoop={true} centerMode={true} centerSlidePercentage={30} swipeable emulateTouch style={{ marginTop: "12px" }}>
                  {relatedProducts.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => navigate(`/products/${p.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                      <Card style={{ minWidth: "220px", flexDirection: "column", margin: "0 8px" }}>
                        <CardMedia src={p.image} height={160} />
                        <CardContent>
                          <Typography variant="subtitle1">{p.name}</Typography>
                          <Typography variant="body2">{p.price?.toLocaleString("vi-VN")} ₫</Typography>
                        </CardContent>
                      </Card>
                    </div>
                  ))}
                </Carousel>
          </Box>
        </Box>
      </Box>
          <Box style={{ marginTop: 30, display: "flex", flexDirection: "row", gap: 20, justifyContent: "center", width: "100%" }}>
            <Box style={{ marginTop: 30, width: "80%",paddingBottom:40 }}>
              <Typography variant="h6">Giỏ hàng</Typography>
              <CartItemList mode="mini" />
            </Box>
          </Box>
      <Footer />
    </>
  );
}
