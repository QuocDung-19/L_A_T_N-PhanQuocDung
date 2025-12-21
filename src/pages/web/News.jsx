import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";
import Divider from "../../components/common/Divider";
import { getNewsList } from "../../services/api/newsApi";

export default function News() {
  const [newsList, setNewsList] = useState([]);
  const [sort, setSort] = useState("default");
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [selectedNewsId, setSelectedNewsId] = useState(null);

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    getNewsList()
      .then((data) => setNewsList(data))
      .catch((err) => console.error("Lỗi load news:", err));
  }, []);

  const sortedNews = useMemo(() => {
    let copy = [...newsList];
    if (sort === "dateAsc") {
      copy.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sort === "dateDesc") {
      copy.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return copy;
  }, [sort, newsList]);

  const handleViewDetail = (newsId) => {
    if (!isLoggedIn) {
      setSelectedNewsId(newsId);
      setShowLoginPopup(true);
      return;
    }
    navigate(`/news/${newsId}`);
  };

  return (
    <>
      <Header />
      <Box
        p={2}
        style={{
          backgroundColor: "#ffffff",
          minHeight: "100vh",
          paddingTop: "20px",
        }}
      >
        <Typography
          variant="h4"
          mb={4}
          style={{ textAlign: "center", color: "#323232" }}
        >
          Tin tức
        </Typography>

        <Box
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            flexDirection: "row",
            gap: 20,
            maxWidth: 1000,
            margin: "0 auto",
            justifyContent: "flex-start",
          }}
        >
          {sortedNews.map((news) => (
            <Box
              key={news.newsID}
              style={{
                width: 300,
                height: 200,
                border: "1px solid #8CBF41",
                borderRadius: 10,
                overflow: "hidden",
                position: "relative", 
                cursor: "pointer",
                boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
              onClick={() => handleViewDetail(news.newsID)}
            >
              {/* Ảnh nền */}
              {news.imageUrl && (
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                    zIndex: 0,
                    filter: "brightness(0.6)", 
                  }}
                />
              )}

        
              <Box
                p={2}
                style={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  width: "100%",
                  color: "#fff",
                  zIndex: 1,
                  background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
                }}
              >
                <Typography
                  variant="subtitle1"
                  style={{
                    paddingLeft: 10,
                    fontWeight: "bold",
                    marginBottom: 4,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {news.title}
                </Typography>

                <Typography
                  style={{
                    fontSize: 13,
                    overflow: "hidden",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {news.summary}
                </Typography>
              <Box style={{display: "flex", flexDirection: "row", justifyContent: "center", marginTop: 8}}>
                <Box
                  style={{
                    background: "#8CBF41",
                    color: "#fff",
                    padding: "4px 8px",
                    borderRadius: 5,
                    fontSize: 13,
                    marginTop: 6,
                    display: "inline-block",
                    width: "fit-content",
                  }}
                >
                  Xem chi tiết
                </Box>
               </Box>
            </Box>



              <Divider style={{ borderColor: "#8CBF41" }} />
            </Box>
          ))}
        </Box>
      </Box>

      {/* LOGIN POPUP */}
      {showLoginPopup && (
        <div
          onClick={() => setShowLoginPopup(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 500,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 25,
              borderRadius: 10,
              width: 350,
              textAlign: "center",
            }}
          >
            <Typography variant="h3" mb={2}>
              Bạn cần đăng nhập
            </Typography>
            <Typography mb={3}>
              Vui lòng đăng nhập để xem chi tiết bài viết.
            </Typography>
            <button
              onClick={() => (window.location.href = "/login")}
              style={{
                padding: "10px 15px",
                background: "#8CBF41",
                color: "#fff",
                borderRadius: 6,
                border: "none",
                cursor: "pointer",
              }}
            >
              Đăng nhập
            </button>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}
