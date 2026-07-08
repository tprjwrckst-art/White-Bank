export default function HomePage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#ffffff"
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h1>🏦 White Bank</h1>

        <p>Modern Digital Banking Platform</p>

        <button
          style={{
            padding: "12px 30px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
            background: "#0A2540",
            color: "#fff"
          }}
        >
          Get Started
        </button>
      </div>
    </main>
  );
}