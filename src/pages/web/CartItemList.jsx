import React, { createContext, useContext, useEffect, useState } from "react";
import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import Button from "../../components/common/Button";
import { useNavigate } from "react-router-dom";


const CartContext = createContext(null);
const fetchProductById = async (id) => {
  const res = await fetch(`http://localhost:8080/api/product/${id}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  if (!res.ok) throw new Error("Không lấy được product");

  const data = await res.json();
  return data.result || data;
};


export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart phải được dùng bên trong <CartProvider>");
  }
  return ctx;
};

export function CartProvider({ children }) {
      const clearCart = () => {
      setCartItems([]);
      localStorage.removeItem("cart");
    };

  const [cartItems, setCartItems] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    if (!product || product.price == null) {
      console.warn(" Product không hợp lệ (thiếu price):", product);
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(i => i.productId === product.id);

      if (existing) {
        return prev.map(i =>
          i.productId === product.id
            ? {
                ...i,
                quantity: Math.min(
                  i.quantity + quantity,
                  i.stock ?? i.quantity + quantity
                )
              }
            : i
        );
      }

      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: Number(product.price) || 0,
          image: product.image,

          stock: product.stock ?? Infinity,
          height: product.height,
          width: product.width,
          length: product.length,

          quantity
        }
      ];
    });
  };

  const increase = id => {
    setCartItems(prev =>
      prev.map(i =>
        i.productId === id && i.quantity < (i.stock ?? Infinity)
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  };

  const decrease = id => {
    setCartItems(prev =>
      prev.map(i =>
        i.productId === id && i.quantity > 1
          ? { ...i, quantity: i.quantity - 1 }
          : i
      )
    );
  };

  const remove = id => {
    setCartItems(prev => prev.filter(i => i.productId !== id));
  };

  const totalPrice = cartItems.reduce(
    (sum, i) => sum + (Number(i.price) || 0) * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        increase,
        decrease,
        remove,
        clearCart,
        totalPrice
      }}
    >
      {children}
    </CartContext.Provider>
  );
}



export default function CartItemList({ editable = true, showCheckoutButton = true }) {
  const { cartItems, increase, decrease, remove, totalPrice } = useCart();
  const navigate = useNavigate();
  const [dimensions, setDimensions] = useState({});

    useEffect(() => {
      const loadDimensions = async () => {
        const missingItems = cartItems.filter(
          (i) => i.height == null || i.width == null || i.length == null
        );

        if (!missingItems.length) return;

        const results = await Promise.all(
          missingItems.map(async (item) => {
            try {
              const product = await fetchProductById(item.productId);
              return {
                productId: item.productId,
                height: product.height,
                width: product.width,
                length: product.length,
              };
            } catch {
              return null;
            }
          })
        );

    setDimensions((prev) => {
      const next = { ...prev };
      results.forEach((r) => {
        if (r) next[r.productId] = r;
      });
      return next;
    });
  };

  loadDimensions();
}, [cartItems]);
  if (!cartItems || cartItems.length === 0) {
    return (
      <Box style={{ padding: 16 }}>
        <Typography>Giỏ hàng trống</Typography>
      </Box>
    );
  }

  return (
    <Box
      style={{
        height: "80%",
        background: "#fff",
        padding: 16,
        borderRadius: 8,
        maxHeight: 400,
        overflowY: "auto",
        border: "1px solid #8CBF41",
      }}
    >
      {cartItems.map(item => {
        const dim = dimensions[item.productId] || item;

        return (
          <div
            key={item.productId}
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 16,
              padding: "12px 0",
              borderBottom: "1px solid #eee"
            }}
          >

         
          <img
            src={item.image || "/images/no-image.png"}
            alt={item.name}
            style={{
              width: 70,
              height: 70,
              objectFit: "cover",
              borderRadius: 6
            }}
          />

          <div style={{ flex: 1 }}>
            <Typography style={{ fontWeight: 500 }}>
              {item.name}
            </Typography>

            {(dim.length != null || dim.width != null || dim.height != null) && (
              <Typography style={{ fontSize: 15, color: "#323232",fontWeight: "500" }}>
                KT: {dim.length ?? "-"} × {dim.width ?? "-"} × {dim.height ?? "-"} cm
              </Typography>
            )}
          </div>

          <div style={{ width: 120, textAlign: "right" }}>
            <Typography>
              {Number(item.price).toLocaleString("vi-VN")} ₫
            </Typography>
          </div>

     
          {editable && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6
              }}
            >
              <Button onClick={() => decrease(item.productId)}>-</Button>
              <Typography>{item.quantity}</Typography>
              <Button
                onClick={() => increase(item.productId)}
                disabled={item.quantity >= item.stock}
              >
                +
              </Button>
            </div>
          )}

    
          {editable && (
            <Button
              onClick={() => remove(item.productId)}
              style={{ color: "#dc3545" }}
            >
              ✕
            </Button>
          )}
          </div>
        );
      })}

      <div style={{ textAlign: "right", marginTop: 16 }}>
        <Typography variant="h6">
          Tổng tiền: {totalPrice.toLocaleString("vi-VN")} ₫
        </Typography>
      </div>
        {showCheckoutButton && (
          <div
            style={{
              marginTop: 20,
              display: "flex",
              justifyContent: "flex-end",
              gap: 12
            }}
          >
            <Button
              onClick={() => navigate("/cart")}
              style={{
                background: "#8CBF41",
                color: "#fff",
                padding: "10px 24px"
              }}
            >
              Xác nhận đơn hàng →
            </Button>
          </div>
        )}
    </Box>
  );
}