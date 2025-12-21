import { useEffect, useState } from "react";

import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import Avatar from "../../components/common/Avatar";
import Grid from "../../components/common/Grid";
import Card, { CardMedia, CardContent } from "../../components/common/Card";
import Carousel from "../../components/Layout/Carousel";
import { useNavigate } from "react-router-dom";
import bannerImg from "../../assets/banner/banner.png";

import video1 from "../../assets/images/video1.mp4";
import video2 from "../../assets/images/video2.mp4";
import video3 from "../../assets/images/video3.mp4";
import video4 from "../../assets/images/video4.mp4";
import video5 from "../../assets/images/video5.mp4";

import {
  getPublicProducts,
} from "../../services/api/productPublicApi";
import { getNewsList } from "../../services/api/newsApi";

const testimonials = [
  { id: 1, name: "Nguyễn Văn A", avatar: "/images/avatar1.jpg", comment: "Sản phẩm rất chất lượng!" },
  { id: 2, name: "Trần Thị B", avatar: "/images/avatar2.jpg", comment: "Dịch vụ tốt, hỗ trợ nhanh." },
  { id: 3, name: "Lê Văn C", avatar: "/images/avatar3.jpg", comment: "Đóng gói cẩn thận, giao nhanh." },
  { id: 4, name: "Phạm Thị D", avatar: "/images/avatar3.jpg", comment: "Tôi rất hài lòng." },
];

const companyImages = [1, 2, 3, 4];

const videos = [
  { id: 1, title: "Quy trình sản xuất", src: video1 },
  { id: 2, title: "Showroom WoodShop", src: video2 },
  { id: 3, title: "Khách hàng trải nghiệm", src: video3 },
  { id: 4, title: "Thiết kế nội thất", src: video4 },
  { id: 5, title: "Sản phẩm mới", src: video5 },
];


export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [newsList, setNewsList] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getPublicProducts();
      
        const mapped = data.map(p => ({
          productId: p.productID, 
          name: p.name,
          price: p.price,
          imageUrl: p.imageUrl || "/images/default-product.jpg",
          description: p.description || "Mô tả sản phẩm...",
          height: p.height,
          width: p.width,
          length: p.length,
        }));
        setProducts(mapped);
      } catch (err) {
        setError(err.message || "Không tải được sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);
useEffect(() => {
  const fetchNews = async () => {
    try {
      const data = await getNewsList();

      const mapped = data.map((n) => ({
        id: n.newsID,
        title: n.title,
        summary: n.summary,
        imageUrl: n.imageUrl || "/images/default-news.jpg",
        createdAt: n.createdAt,
      }));

      setNewsList(mapped);
    } catch (err) {
      setNewsError(err.message || "Không tải được tin tức");
    } finally {
      setNewsLoading(false);
    }
  };

  fetchNews();
}, []);


  return (
    <>
      <Header />

      <Box
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          padding: "40px 0",
          flexDirection: "row"
        }}
      >
        <Box
          style={{
            width: "100%",
            maxWidth: "1200px",
            padding: "0 20px",
            display: "flex",
            flexDirection: "column",
            gap: "50px",
          }}
        >

          <Card style={{ width: "1200px", height: "615px" }}>
              <img
                src={bannerImg}
                alt="Banner"
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
          </Card>

          <Box
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginTop: "40px",
              gap: "30px",
            }}
          >
            {[
              {
                title: "CHẤT LƯỢNG NHẤT",
                desc: "P.Q.D luôn đảm bảo chất lượng cao cho từng sản phẩm trước khi đến tay khách hàng.",
                color: "#f1c40f",
                icon: "🛡️",
              },
              {
                title: "GIÁ TỐT NHẤT",
                desc: "Sản phẩm đến tay khách hàng với mức giá cạnh tranh nhất trên thị trường.",
                color: "#3498db",
                icon: "💰",
              },
              {
                title: "UY TÍN NHẤT",
                desc: "Chúng tôi đặt chữ tín lên hàng đầu, phát triển bền vững cùng đối tác.",
                color: "#9b59b6",
                icon: "🏆",
              },
              {
                title: "GIAO NHANH NHẤT",
                desc: "Cam kết giao hàng nhanh chóng, an toàn với chi phí tối ưu.",
                color: "#e74c3c",
                icon: "🚚",
              },
            ].map((item, index) => (
              <Box
                key={index}
                style={{
                  flex: 1,
                  textAlign: "center",
                  padding: "20px",
                }}
              >
                <Box
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: `5px solid ${item.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    margin: "0 auto 15px",
                  }}
                >
                  {item.icon}
                </Box>

                <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
                  {item.title}
                </Typography>
                <Typography
                  variant="body2"
                  style={{ color: "#666", marginTop: "8px" }}
                >
                  {item.desc}
                </Typography>
              </Box>
            ))}
          </Box>


          <Box style={{ flexDirection: "column", gap: "10px" }}>
            <Typography variant="h4">Giới thiệu về P.Q.D</Typography>

            <Typography>
              <strong>P.Q.D</strong> chuyên cung cấp các sản phẩm từ gỗ cao su chất lượng cao
              như: phôi gỗ cao su, ván ghép gỗ tràm, ván ghép gỗ cao su, ván ghép gỗ thông,
              phôi bào chi tiết và các sản phẩm đồ gỗ nội thất.
            </Typography>

            <Typography>
              Nhằm đáp ứng nhu cầu đa dạng của thị trường, P.Q.D phát triển mạnh lĩnh vực
              gia công chi tiết gỗ bao gồm: chân gỗ tiện, chân bàn, chân ghế, diềm bàn,
              diềm ghế, mặt bàn, mặt ghế, mặt kệ, ván ghép chi tiết và các sản phẩm phôi
              bào 4 mặt từ gỗ cao su.
            </Typography>

            <Typography>
              P.Q.D cam kết cung cấp đầy đủ hồ sơ, giấy tờ lâm sản hợp lệ, đạt chuẩn theo
              quy định của Nhà nước, đáp ứng nhu cầu xuất khẩu và thi công các công trình
              nhà nước, cơ quan, trường học.
            </Typography>

            <Typography>
              Với uy tín và kinh nghiệm lâu năm trong ngành gỗ, chúng tôi tự tin đáp ứng
              mọi yêu cầu khắt khe của đối tác trong và ngoài nước về các sản phẩm gỗ cao
              su tẩm sấy, ván ghép xẻ sấy và gỗ ghép thanh với chất lượng vượt trội.
            </Typography>
          </Box>



          <Box style={{ flexDirection: "column", gap: "10px" }}>
            <Typography variant="h5">Sản phẩm nổi bật</Typography>

            {loading && <Typography>Đang tải sản phẩm...</Typography>}
            {error && <Typography style={{ color: "red" }}>{error}</Typography>}

          {!loading && !error && (
            <Carousel itemsPerView={5} autoPlay={120000}>
              {products.map((p) => (
                <div
                  key={p.productId}
                  onClick={() => navigate(`/products/${p.productId}`)}
                  style={{ cursor: "pointer" }}
                >
                  <Card style={{ flexDirection: "column" }}>
                    <CardMedia
                      src={p.imageUrl || "/images/default-product.jpg"}
                      height={160}
                    />
                    <CardContent>
                      <Typography variant="subtitle1">{p.name}</Typography>
                      <Typography variant="body2">
                        {p.price?.toLocaleString()} đ
                      </Typography>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </Carousel>
          )}

          </Box>


          <Box style={{ flexDirection: "column", gap: "20px" }}>
            <Typography variant="h5">Ý kiến khách hàng</Typography>
            <Grid container spacing={20}>
              {testimonials.map((t) => (
                <Grid item columns={4} key={t.id}>
                  <Card style={{ padding: "20px" }}>
                    <Box style={{ flexDirection: "row", gap: "10px", alignItems: "center" }}>
                      <Avatar src={t.avatar} size={50} />
                      <Typography>{t.name}</Typography>
                    </Box>
                    <Typography style={{ marginTop: "10px" }}>{t.comment}</Typography>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>


          <Box style={{ flexDirection: "column", gap: "10px" }}>
            <Typography variant="h5">Hình ảnh công ty</Typography>
            <Carousel itemsPerView={5}>
              {companyImages.map((i) => (
                <Card key={i}>
                  <CardMedia src={`/images/company${i}.jpg`} height={200} />
                </Card>
              ))}
            </Carousel>
          </Box>

          <Box style={{ flexDirection: "column", gap: "10px" }}>
            <Typography variant="h5">Tin tức</Typography>

            {newsLoading && <Typography>Đang tải tin tức...</Typography>}
            {newsError && <Typography style={{ color: "red" }}>{newsError}</Typography>}

            {!newsLoading && !newsError && (
              <Carousel itemsPerView={4}>
                {newsList.map((n) => (
                  <Card
                    key={n.id}
                    style={{ cursor: "pointer" }}
                    onClick={() => navigate(`/news/${n.id}`)}
                  >
                    <CardMedia
                      src={n.imageUrl}
                      height={140}
                    />
                    <CardContent>
                      <Typography
                        style={{
                          fontWeight: 600,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {n.title}
                      </Typography>

                      <Typography
                        variant="body2"
                        style={{
                          color: "#666",
                          marginTop: 4,
                          overflow: "hidden",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {n.summary}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Carousel>
            )}
          </Box>


          <Box style={{ flexDirection: "column", gap: "10px" }}>
            <Typography variant="h5">Videos / Clips</Typography>

            <Carousel itemsPerView={3}>
              {videos.map((v) => (
                <Card key={v.id} style={{ padding: 10 }}>
                  <video
                    src={v.src}
                    controls
                    muted
                    preload="metadata"
                    style={{
                      width: "100%",
                      height: 180,
                      objectFit: "cover",
                      borderRadius: 6,
                    }}
                  />
                  <CardContent>
                    <Typography>{v.title}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Carousel>
          </Box>

        </Box>
      </Box>

      <Footer />
    </>
  );
}
