import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div style={{ textAlign: "center", marginTop: "50px", fontFamily: "Arial, sans-serif" }}>
          <h1 style={{ fontSize: "3rem", color: "#ff4d4d", marginBottom: "10px" }}>404 - Page Not Found</h1>
          <p style={{ fontSize: "1.2rem", color: "#555" }}>The page you are looking for doesn't exist.</p>
          <Link
            to="/"
            style={{
              display: "inline-block",
              marginTop: "20px",
              padding: "10px 20px",
              backgroundColor: "#007bff",
              color: "white",
              textDecoration: "none",
              fontSize: "1.1rem",
              borderRadius: "5px",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Go to Home
          </Link>
        </div>
      );
};

export default NotFoundPage;
