const PRODUCT_URL = "http://localhost:8080/api/product";
const CATEGORY_URL = "http://localhost:8080/api/category";
console.log = () => {};
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
        productId: Number(p.productID),
        name: p.name,
        price: p.price,
        description: p.description,
        stock: p.stock,
        piecesNumber: p.piecesNumber ?? "",
        length: p.length ?? "",
        width: p.width ?? "",
        height: p.height ?? "",
        status: p.status,
        imageUrl: p.imageUrl,
        videoUrl: p.videosUrl,
        categoryId: p.categoryId ?? null,    
    });

    const mappedProduct = {
          productId: Number(p.productID),
          name: p.name,
          price: p.price,
          description: p.description,
          stock: p.stock,
          piecesNumber: p.piecesNumber ?? "",  
          length: p.length ?? "",              
          width: p.width ?? "",                
          height: p.height ?? "",
          status: p.status,
          imageUrl: p.imageUrl,
          videoUrl: p.videosUrl,
          categoryId: p.categoryId ?? null,    
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
     return data.result;
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



export const updateProduct = async (id, formData) => {
  const res = await fetch(`${PRODUCT_URL}/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: formData,
  });

  const data = await res.json();

  if (!res.ok) throw new Error(data?.message || "Cập nhật sản phẩm thất bại");

  const p = data.result ?? data;
  return {
    productId: Number(p.productID),
    name: p.name,
    price: p.price,
    description: p.description,
    stock: p.stock,
    piecesNumber: p.piecesNumber ?? "",
    length: p.length ?? "",
    width: p.width ?? "",
    height: p.height ?? "",
    status: p.status,
    imageUrl: p.imageUrl,
    videoUrl: p.videosUrl,
    categoryId: p.categoryId ?? null,
  };
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
