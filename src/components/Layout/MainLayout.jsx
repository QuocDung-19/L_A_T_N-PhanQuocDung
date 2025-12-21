export default function MainLayout({ children }) {
  return (
    <>
      <main style={{ minHeight: "80vh" }}>
        {children}
      </main>
    </>
  );
}
