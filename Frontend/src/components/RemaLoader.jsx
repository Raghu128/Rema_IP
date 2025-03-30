import React, { useState, useEffect } from "react";
import "../styles/RemaLoader.css"; // Make sure this path is correct

const RemaLoader = () => {
    const [fadeOut, setFadeOut] = useState(false);
    const [dots, setDots] = useState('');

    useEffect(() => {
        const fadeTimer = setTimeout(() => setFadeOut(true), 4000);

        const dotInterval = setInterval(() => {
            setDots(prevDots => {
                if (prevDots.length === 3) {
                    return '';
                } else {
                    return prevDots + '.';
                }
            });
        }, 300);

        return () => {
            clearTimeout(fadeTimer);
            clearInterval(dotInterval);
        }
    }, []);

    return (
        <div className={`rema-loader-container ${fadeOut ? "fade-out" : ""}`}>
            <div className="rema-loader-logo">
                <span className="rema-letter r">R</span>
                <span className="rema-letter e">e</span>
                <span className="rema-letter m">m</span>
                <span className="rema-letter a">a</span>
            </div>
            {/* <div className="rema-loader-spinner">
                <FontAwesomeIcon icon={faSpinner} spin />
             </div> */}
               {/*  Subtle, animated background shapes  */}
            <div className="rema-loader-shapes">
                <div className="shape circle"></div>
                <div className="shape square"></div>
                <div className="shape triangle"></div>
            </div>

            <p className="rema-loader-text">Loading{dots}</p>
        </div>
    );
};

export default RemaLoader;