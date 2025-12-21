const PRODUCT_URL = "http://localhost:8080/api/product";
const CATEGORY_URL = "http://localhost:8080/api/category";

const getHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});


export const getCategories = async () => {
  const res = await fetch(CATEGORY_URL, {
    headers: getHeaders(),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || "Không tải được danh mục");
  }


  return data.result ?? data;
};


export const getProducts = async () => {
  const res = await fetch(PRODUCT_URL, {
    headers: getHeaders(),
  });

  const data = await res.json();

  console.log("RAW response từ API:", data);

  if (!res.ok) {
    throw new Error(data.message || "Không tải được sản phẩm");
  }

  const products = data.result ?? data;

  console.log("DANH SÁCH PRODUCTS (CHƯA MAP):", products);

  return products.map(p => {
    console.log("PRODUCT RAW:", p);

    console.log("FIELDS CHECK:", {
       productId: p.productID,  
        name: p.name,
        price: p.price,
        description: p.description,
        stock: p.stock,
        status: p.status,
        imageUrl: p.imageUrl,     
        videoUrl: p.videosUrl,    
        height: p.height,
        width: p.width,
        length: p.length,
    });

    const mappedProduct = {
      productId: p.productID,   
        name: p.name,
        price: p.price,
        description: p.description,
        stock: p.stock,
        status: p.status,
        imageUrl: p.imageUrl,    
        videoUrl: p.videosUrl,    
        height: p.height,
        width: p.width,
        length: p.length,
    };

    console.log("PRODUCT SAU KHI MAP:", mappedProduct);

    return mappedProduct;
  });
};

export const createProduct = async (formData) => {
  const res = await fetch(PRODUCT_URL, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    console.error("Không parse được JSON từ backend");
  }

  console.log("CREATE PRODUCT RESPONSE:", {
    status: res.status,
    data,
  });

  if (!res.ok) {
    throw new Error(data?.message || "Tạo sản phẩm thất bại");
  }

  return data.result ?? data;
};



export const updateProduct = async (id, product) => {
  const res = await fetch(`${PRODUCT_URL}/${id}`, {
    method: "PUT",
    headers: {
      ...getHeaders(),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(product), // ✅ JSON
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.message || "Cập nhật sản phẩm thất bại");
  }

  return data.result ?? data;
};

export const deleteProduct = async (id) => {
  const res = await fetch(`${PRODUCT_URL}/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  if (!res.ok) {
    throw new Error("Xóa sản phẩm thất bại");
  }

  return true;
};
