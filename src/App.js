import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./services/api/AuthContext";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/RecoverPassword";
import ProtectedRoute from "./components/auth/ProtectedRoute";

import MainLayout from "./components/Layout/MainLayout";

import Home from "./pages/web/Home";
import Products from "./pages/web/Products";
import ProductDetail from "./pages/web/ProductDetail";
import News from "./pages/web/News";
import NewsDetail from "./pages/web/NewsDetail";
import Contact from "./pages/web/Contact";
import Profile from "./pages/web/Profile";
import Staff from "./pages/web/Staff";
import { CartProvider } from "./pages/web/CartItemList";
import CartPage from "./pages/web/CartPage";


import Admin from "./pages/web/Admin/Admin";
import AdminCategories from "./pages/web/Admin/AdminCategories";
import AdminManageAccounts from "./pages/web/Admin/AdminManageAccounts";
import AdminProducts from "./pages/web/Admin/AdminProducts";
import AdminOrders from "./pages/web/Admin/AdminOrders";
import AdminNews from "./pages/web/Admin/AdminNews";
import CheckoutPage from "./pages/web/CheckoutPage";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider> 
        <Routes>

        
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

     
          <Route
            path="/admin"
            element={
              <ProtectedRoute roles={["admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminManageAccounts />} />
            <Route path="manage-accounts" element={<AdminManageAccounts />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="news" element={<AdminNews />} />
          </Route>

        
          <Route
            path="/staff"
            element={
              <ProtectedRoute roles={["staff"]}>
                <Staff />
              </ProtectedRoute>
            }
          />

        
          <Route path="/" element={<MainLayout><Home /></MainLayout>} />
          <Route path="/products" element={<MainLayout><Products /></MainLayout>} />
          <Route path="/news" element={<MainLayout><News /></MainLayout>} />
          <Route path="/contact" element={<MainLayout><Contact /></MainLayout>} />
          <Route path="/profile" element={<MainLayout> <ProtectedRoute><Profile /></ProtectedRoute></MainLayout>} />
          <Route path="/payment/:orderID" element={<MainLayout> <CheckoutPage /> </MainLayout>} />

          <Route
            path="/products/:id"
            element={
              <ProtectedRoute>
                <ProductDetail />
              </ProtectedRoute>
            }
          />

          <Route
          path="/news"
          element={
            <ProtectedRoute>
              <News />
            </ProtectedRoute>
          }
        />

        <Route
          path="/news/:id"
          element={
            <ProtectedRoute>
              <NewsDetail />
            </ProtectedRoute>
          }
        />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CartPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />


        </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
