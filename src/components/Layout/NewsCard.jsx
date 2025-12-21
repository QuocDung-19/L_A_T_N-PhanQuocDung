import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../services/api/AuthContext";

import Card, { CardMedia, CardContent } from "../common/Card";
import Typography from "../common/Typography";
import Box from "../common/Box";

export default function NewsCard({ news }) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleClick = () => {
    if (!user) {
      setShowLoginPopup(true);
      return;
    }
    navigate(`/news/${news.id}`);
  };

  return (
    <>
      <div onClick={handleClick} style={{ cursor: "pointer" }}>
        <Card style={{ overflow: "hidden" }}>
          <CardMedia
            src={news.image}
            alt={news.title}
            style={{ height: 180 }}
          />

          <CardContent>
            <Typography
              variant="subtitle1"
              style={{ fontWeight: 700, marginBottom: 6 }}
            >
              {news.title}
            </Typography>

            <Typography
              variant="body2"
              style={{
                color: "#666",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {news.summary}
            </Typography>
          </CardContent>
        </Card>
      </div>

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
          <Box
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              padding: 25,
              borderRadius: 10,
              width: 350,
              textAlign: "center",
            }}
          >
            <Typography variant="h3" style={{ marginBottom: 10 }}>
              Bạn cần đăng nhập
            </Typography>
            <Typography variant="body1" style={{ marginBottom: 20 }}>
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
          </Box>
        </div>
      )}
    </>
  );
}
