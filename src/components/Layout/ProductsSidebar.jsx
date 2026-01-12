import { useEffect, useState } from "react";
import { getCategories } from "../../services/api/categoryApi";
import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import Divider from "../../components/common/Divider";
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

         <CustomLink to="/products" style={{color: "#8CBF41",}} >
            Tất cả sản phẩm
          </CustomLink>

        <Box style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {loading ? (
            <Typography variant="body2">Đang tải...</Typography>
          ) : categories.length === 0 ? (
            <Typography variant="body2" style={{fontWeight: "700"}}>Phôi Cao Su - Phôi Thân</Typography>
          ) : (
              categories.map((c) => {
                const id = c.categoryId ?? c.id;

                return (
                  <CustomLink
                    key={id}
                    to={`/products?category=${id}`}
                  >
                    {c.name}
                  </CustomLink>
                );
              })

          )}
        </Box>
      </Box>
      <Box>
        <Divider />
        <Box
          style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 8 }}
        >
        </Box>
      </Box>
    </Box>
  );
}
