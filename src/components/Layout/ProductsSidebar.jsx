import { useEffect, useState } from "react";
import { getCategories } from "../../services/api/categoryApi";
import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import Divider from "../../components/common/Divider";
import Rating from "../../components/common/Rating";
import CustomLink from "../Layout/CustomLink";

export default function ProductsSidebar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await getCategories();
        setCategories(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Box style={{ display: "flex", flexDirection: "column", gap: 18 }}>
   
      <Box
        style={{
          display: "flex",
          flexDirection: "row",
          gap: 10,
          color: "#999",
          alignItems: "center",
        }}
      >
        <Typography variant="body2">TRANG CHỦ</Typography>
        <Typography variant="body2">/</Typography>
        <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
          DANH MỤC
        </Typography>
      </Box>

  
      <Box>
        <Typography variant="h6" style={{ color: "#666", fontWeight: 700 }}>
          DANH MỤC SẢN PHẨM
        </Typography>
        <Divider style={{ width: 40, marginTop: 8 }} />
      </Box>

      <Box style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <Typography variant="subtitle1" style={{ fontWeight: 700 }}>
          Danh mục
        </Typography>

        <Box style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {loading ? (
            <Typography variant="body2">Đang tải...</Typography>
          ) : categories.length === 0 ? (
            <Typography variant="body2" style={{fontWeight: "700"}}>Phôi Cao Su - Phôi Thân</Typography>
          ) : (
            categories.map((c) => (
              <CustomLink
                key={c.id}
                to={`/products?category=${c.id}`}
                style={{
                  color: "#333",
                  textDecoration: "none",
                }}
              >
                {c.name}
              </CustomLink>
            ))
          )}
        </Box>
      </Box>
      <Box>
        <Typography
          variant="subtitle1"
          style={{ fontWeight: 700, marginBottom: 8 }}
        >
          ĐÁNH GIÁ TRUNG BÌNH
        </Typography>
        <Divider />
        <Box
          style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}
        >
          <Rating value={5} />
          <Typography variant="body2" style={{ color: "#777" }}>
            (3)
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
