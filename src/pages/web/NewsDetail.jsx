import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import { getNewsById } from "../../services/api/newsApi";

export default function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [news, setNews] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (!id) return;

    if (!isLoggedIn) {
      setShowLoginPopup(true);
      return;
    }

    getNewsById(id)
      .then(setNews)
      .catch(console.error);
  }, [id, isLoggedIn]);

  return (
    <>
      <Header />

      {showLoginPopup && (
        <div
          onClick={() => navigate(-1)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 30,
              borderRadius: 10,
              width: 360,
              textAlign: "center",
            }}
          >
            <Typography variant="h3" mb={2}>
              Bạn cần đăng nhập
            </Typography>
            <Typography mb={3}>
              Vui lòng đăng nhập để xem nội dung bài viết.
            </Typography>

            <Box style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => navigate("/login")}
                style={{
                  padding: "10px 16px",
                  background: "#8CBF41",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Đăng nhập
              </button>

              <button
                onClick={() => navigate(-1)}
                style={{
                  padding: "10px 16px",
                  background: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  cursor: "pointer",
                }}
              >
                Quay lại
              </button>
            </Box>
          </div>
        </div>
      )}

      {isLoggedIn && news && (
        <Box
          style={{
            width: "100%",
            padding: "40px 0",
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#f5f7f5",
            flexDirection: "row",
          }}
        >
          <Box
            style={{
              width: "100%",
              maxWidth: "1200px",
              display: "flex",
              flexDirection: "column",
              gap: "30px",
            }}
          >
            <Typography variant="h4" style={{ color: "#8CBF41" }}>
              {news.title}
            </Typography>

            {news.imageUrl && (
              <Box
                style={{
                  width: "100%",
                  maxHeight: 450,
                  borderRadius: 8,
                }}
              >
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </Box>
            )}

            <Box
              style={{
                padding: 24,
                border: "1px solid #8CBF41",
                borderRadius: 8,
                background: "#fafafa",
              }}
            >
              <Typography
                style={{
                  fontSize: 16,
                  lineHeight: 1.9,
                  whiteSpace: "pre-line",
                }}
              >
                {news.content}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <Footer />
    </>
  );
}
