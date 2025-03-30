import { Link } from "react-router-dom";

const NotFoundPage = () => {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            padding: "20px",
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            textAlign: "center"
        }}>
            <div style={{
                background: "white",
                padding: "40px",
                borderRadius: "16px",
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)",
                maxWidth: "600px",
                width: "100%"
            }}>
                <div style={{
                    fontSize: "120px",
                    fontWeight: "700",
                    color: "#ff4d4d",
                    lineHeight: "1",
                    marginBottom: "20px",
                    background: "linear-gradient(45deg, #ff4d4d, #ff9999)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                }}>404</div>
                
                <h1 style={{
                    fontSize: "2.5rem",
                    color: "#2c3e50",
                    marginBottom: "15px",
                    fontWeight: "600"
                }}>Oops! Page Not Found</h1>
                
                <p style={{
                    fontSize: "1.2rem",
                    color: "#7f8c8d",
                    marginBottom: "30px",
                    lineHeight: "1.6"
                }}>
                    The page you're looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                
                <div style={{
                    display: "flex",
                    gap: "15px",
                    justifyContent: "center",
                    flexWrap: "wrap"
                }}>
                    <Link
                        to="/"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "12px 30px",
                            backgroundColor: "#4a6baf",
                            color: "white",
                            textDecoration: "none",
                            fontSize: "1.1rem",
                            borderRadius: "50px",
                            transition: "all 0.3s ease",
                            boxShadow: "0 4px 15px rgba(74, 107, 175, 0.3)",
                            border: "none",
                            cursor: "pointer",
                            fontWeight: "500"
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#3a5a9f";
                            e.target.style.transform = "translateY(-2px)";
                            e.target.style.boxShadow = "0 6px 20px rgba(74, 107, 175, 0.4)";
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = "#4a6baf";
                            e.target.style.transform = "translateY(0)";
                            e.target.style.boxShadow = "0 4px 15px rgba(74, 107, 175, 0.3)";
                        }}
                    >
                        Return to Home
                    </Link>
                    
                    {/* <Link
                        to="/contact"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "12px 30px",
                            backgroundColor: "transparent",
                            color: "#4a6baf",
                            textDecoration: "none",
                            fontSize: "1.1rem",
                            borderRadius: "50px",
                            transition: "all 0.3s ease",
                            border: "2px solid #4a6baf",
                            cursor: "pointer",
                            fontWeight: "500"
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = "#f8f9fa";
                            e.target.style.transform = "translateY(-2px)";
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = "transparent";
                            e.target.style.transform = "translateY(0)";
                        }}
                    >
                        Contact Support
                    </Link> */}
                </div>
            </div>
            
            <p style={{
                marginTop: "40px",
                color: "#95a5a6",
                fontSize: "0.9rem"
            }}>
                Error code: 404 | Page not found
            </p>
        </div>
    );
};

export default NotFoundPage;