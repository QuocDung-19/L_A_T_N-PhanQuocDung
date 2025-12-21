import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";

import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import Grid from "../../components/common/Grid";
import FormControl from "../../components/Layout/FormControl";
import Select from "../../components/common/Select";
import MenuItem from "../../components/common/MenuItem";
import Divider from "../../components/common/Divider";
import CartItemList, { useCart } from "./CartItemList";

import ProductsSidebar from "../../components/Layout/ProductsSidebar";
import ProductCard from "../../components/Layout/ProductCard";

import { getPublicProducts } from "../../services/api/productPublicApi";

export default function Products() {
  const [sort, setSort] = useState("default");
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    getPublicProducts()
      .then(data => {
        console.log("PUBLIC PRODUCTS:", data);

        const mapped = data.map(p => ({
          id: p.productID,
          name: p.name,
          price: p.price,
          image: p.imageUrl || "/images/no-image.png",
          description: p.description || "Mô tả sản phẩm...",
          stock: p.stock,
          status: p.status,
          height: p.height, 
          width: p.width,  
          length: p.length, 
        }));

        setProducts(mapped);
      })
      .catch(err => console.error("Lỗi load products:", err));
  }, []);

  const handleSortChange = (e) => setSort(e.target.value);

  const sortedProducts = useMemo(() => {
    let productsCopy = [...products];

    if (sort === "priceAsc") {
      productsCopy.sort((a, b) => a.price - b.price);
    } else if (sort === "priceDesc") {
      productsCopy.sort((a, b) => b.price - a.price);
    }

    return productsCopy;
  }, [sort, products]);

  return (
    <>
      <Header />

      <Box style={{ width: "100%", display: "flex", justifyContent: "center", padding: "40px 0", backgroundColor: "#f5f7f5" }}>
        <Box style={{ width: "100%", maxWidth: "1200px", margin: "0 auto", padding: "0 20px", display: "flex", gap: 30, alignItems: "flex-start", flexDirection: "row" }}>
          
          <Box style={{ width: 280 }}>
            <ProductsSidebar />
          </Box>

          <Box style={{ flex: 1 }}>
            <Box style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 18 }}>
              <Typography variant="body1" style={{ color: "#333" }}>
                Hiển thị {products.length} sản phẩm
              </Typography>

              <FormControl>
                <Select value={sort} onChange={handleSortChange} style={{ minWidth: 200, borderColor: "#8CBF41" }}>
                  <MenuItem value="default">Thứ tự mặc định</MenuItem>
                  <MenuItem value="priceAsc">Giá: thấp → cao</MenuItem>
                  <MenuItem value="priceDesc">Giá: cao → thấp</MenuItem>
                </Select>
              </FormControl>
            </Box>

            <Divider style={{ borderColor: "#8CBF41" }} />

            <Box style={{ marginTop: 20 }}>
              <Grid container spacing={15}>
                {sortedProducts.map((p) => (
                  <Grid item key={p.id} columns={4}>
                    <ProductCard product={p} primaryColor="#8CBF41" />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>
        </Box>
        <Box style={{ marginTop: 30, display: "flex", flexDirection: "row", gap: 20, justifyContent: "center", width: "100%" }}>
            <Box style={{ marginTop: 30, width: "80%" }}>
              <Typography variant="h6">Giỏ hàng</Typography>
              <CartItemList mode="mini" />
            </Box>
          </Box>
      </Box>


      <Footer />
    </>
  );
}
