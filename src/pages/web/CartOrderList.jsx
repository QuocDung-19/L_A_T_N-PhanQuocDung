import { useEffect, useState } from "react";
import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import { getProducts } from "../../services/api/productApi";


const calcVolume = (item) => {
  const d = Number(item.length);
  const r = Number(item.width);
  const l = Number(item.height);
  const p = Number(item.piecesNumber || 1);
  const q = Number(item.quantity || 1);

  if (!d || !r || !l) return 0;

  return Number(((d * r * l * p * q) / 1_000_000_000).toFixed(4));
};


export default function CartOrderList({ order }) {
  const [productMap, setProductMap] = useState({});

  useEffect(() => {
    const loadProducts = async () => {
      const products = await getProducts();
      const map = {};
      products.forEach((p) => {
        map[p.productId || p.id] = p;
      });
      setProductMap(map);
    };

    loadProducts();
  }, []);

  if (!order || !order.items?.length) {
    return (
      <Box style={{ padding: 16 }}>
        <Typography>Không có sản phẩm</Typography>
      </Box>
    );
  }

const totalPrice = order.items.reduce(
  (sum, item) => sum + Number(item.price || 0),
  0
);


  return (
    <Box
      style={{
        background: "#fff",
        padding: 16,
        borderRadius: 8,
        border: "1px solid #8CBF41",
      }}
    >
      {order.items.map((item, idx) => {
        const product = productMap[item.productId || item.productID];
        if (!product) return null;

        const volume = calcVolume({
          ...product,
          quantity: item.quantity,
        });

        const itemTotalPrice = Math.round(volume * Number(product.price || 0));


        return (
          <div
            key={idx}
            style={{
              display: "flex",
              gap: 16,
              padding: "12px 0",
              borderBottom: "1px solid #eee",
            }}
          >
          <img
            src={product.imageUrl || "/images/no-image.png"}
            alt={product.name}
            style={{
              width: 70,
              height: 70,
              objectFit: "cover",
              borderRadius: 6,
            }}
          />

            <div style={{ flex: 1 }}>
              <Typography style={{ fontWeight: 500 }}>
                {product.name}
              </Typography>

              <Typography style={{ fontSize: 14 }}>
                KT: {product.height ?? "-"} × {product.width ?? "-"} ×{" "}
                {product.length ?? "-"} mm
              </Typography>

              <Typography style={{ fontSize: 14 }}>
                Số thanh / kiện: {product.piecesNumber ?? "-"}
              </Typography>

              <Typography style={{ fontSize: 14 }}>
                Đơn giá: {Number(product.price).toLocaleString("vi-VN")} ₫ / m³
              </Typography>


              <Typography
                style={{
                  fontSize: 14,
                  fontWeight: 600,
                  color: "#2e7d32",
                }}
              >
                Số khối: {volume} m³
              </Typography>

              <Typography
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                  color: "#d32f2f",
                }}
              >
                Thành tiền:{" "}
                {itemTotalPrice.toLocaleString("vi-VN")} ₫
              </Typography>

              <Typography style={{ fontSize: 14 }}>
                Số lượng: {item.quantity}
              </Typography>
            </div>
          </div>
        );
      })}

      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Typography variant="h6">
          Tổng tiền:{" "}
          {Math.round(totalPrice).toLocaleString("vi-VN")} ₫
        </Typography>
      </div>
    </Box>
  );
}
