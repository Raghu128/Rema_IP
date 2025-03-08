import React, { useState, useEffect } from "react";
import "../styles/RemaLoader.css"; // Ensure to create this CSS file

const RemaLoader = () => {
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Simulate a loading time before fading out
        const timer = setTimeout(() => setFadeOut(true), 4000); // Increased to 4s for longer animation

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className={`rema-loader-container ${fadeOut ? "fade-out" : ""}`}>
            <div className="rema-loader-logo">
                <span className="rema-letter r">R</span>
                <span className="rema-letter e">e</span>
                <span className="rema-letter m">m</span>
                <span className="rema-letter a">a</span>
            </div>
            <div className="rema-loader-spinner"></div> {/* Added spinner */}
        </div>
    );
};

export default RemaLoader;