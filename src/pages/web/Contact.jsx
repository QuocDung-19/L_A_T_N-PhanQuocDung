import Header from "../../components/Layout/Header";
import Footer from "../../components/Layout/Footer";
import Box from "../../components/common/Box";
import Typography from "../../components/common/Typography";

export default function Contact() {
  return (
    <>
      <Header />
      <Box style={{ width: "100%", padding: "40px 0", display: "flex",flexDirection: "row", justifyContent: "center", backgroundColor: "#f5f7f5" }}>
        <Box style={{ width: "100%", maxWidth: "1200px", display: "flex", flexDirection: "column", gap: "40px" }}>
          <Typography variant="h4" style={{ color: "#8CBF41" }}>Liên hệ WoodShop</Typography>

          <Box style={{ width: "100%", height: "400px", borderRadius: "8px", overflow: "hidden" }}>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.xxxxxxx!2d106.xxxxx!3d10.xxxxx!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529xxxx:0x123456789!2sC%C3%B4ng%20Ty%20HO%C3%80NG%20GIA%20PH%C3%81T!5e0!3m2!1sen!2s!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="WoodShop Location"
            ></iframe>
          </Box>

          <Box style={{ padding: "20px", border: "1px solid #8CBF41", borderRadius: "8px", background: "#fafafa" }}>
            <Typography variant="h5" style={{ marginBottom: "12px", color: "#8CBF41" }}>Thông tin liên hệ</Typography>
            <Typography variant="body2">Địa chỉ: 413/58, Nguyễn Kiệm, Phường 9, Quận Phú Nhuận, TPHCM</Typography>
            <Typography variant="body2">Hotline/Zalo: 0901 455 726</Typography>
            <Typography variant="body2">Email: info.vn</Typography>
            <Typography variant="body2">Messenger: m.me/ifo</Typography>
          </Box>
        </Box>
      </Box>
      <Footer />
    </>
  );
}
