import React, { useState, useEffect } from "react";
import "../styles/RemaLoader.css";

const RemaLoader = () => {
    const [fadeOut, setFadeOut] = useState(false);
    const [dots, setDots] = useState('');
    const [activeLetter, setActiveLetter] = useState(0);
    const [particles, setParticles] = useState([]);

    useEffect(() => {
        const fadeTimer = setTimeout(() => setFadeOut(true), 10000);

        // Dot animation
        const dotInterval = setInterval(() => {
            setDots(prevDots => prevDots.length === 3 ? '' : prevDots + '.');
        }, 300);

        // Letter focus animation
        const letterInterval = setInterval(() => {
            setActiveLetter(prev => (prev + 1) % 10); // Changed to 10 for all letters
        }, 800);

        // Particle effect
        const particleInterval = setInterval(() => {
            const newParticle = {
                id: Math.random().toString(36).substr(2, 9),
                x: Math.random() * 100,
                y: Math.random() * 100,
                size: Math.random() * 8 + 4,
                color: `hsl(${Math.random() * 360}, 80%, 60%)`,
                duration: Math.random() * 3 + 2
            };
            setParticles(prev => [...prev.slice(-20), newParticle]);
        }, 100);

        return () => {
            clearTimeout(fadeTimer);
            clearInterval(dotInterval);
            clearInterval(letterInterval);
            clearInterval(particleInterval);
        };
    }, []);

    return (
        <div className={`rema-loader-container ${fadeOut ? "rema-loader-fade-out" : ""}`}>
            {/* Animated background particles */}
            <div className="rema-loader-particles">
                {particles.map(particle => (
                    <div 
                        key={particle.id}
                        className="rema-loader-particle"
                        style={{
                            left: `${particle.x}%`,
                            top: `${particle.y}%`,
                            width: `${particle.size}px`,
                            height: `${particle.size}px`,
                            backgroundColor: particle.color,
                            animationDuration: `${particle.duration}s`
                        }}
                    />
                ))}
            </div>

            <div className="rema-loader-content">
                {/* Animated logo with floating effect */}
                <div className="rema-loader-logo">
                    {['R', 'e', 'm', 'a', ' ', 'P', 'o', 'r', 't', 'a', 'l'].map((letter, index) => (
                        <span 
                            key={index}
                            className={`rema-loader-letter 
                                ${letter === ' ' ? 'rema-loader-space' : `rema-loader-${letter.toLowerCase()}`} 
                                ${activeLetter === index ? 'rema-loader-active-letter' : ''}`}
                        >
                            {letter}
                        </span>
                    ))}
                </div>

                {/* Circular progress indicator */}
                <div className="rema-loader-circular-progress">
                    <svg className="rema-loader-progress-svg" viewBox="0 0 100 100">
                        <circle 
                            className="rema-loader-progress-circle"
                            cx="50" 
                            cy="50" 
                            r="45"
                        />
                    </svg>
                </div>

                {/* Modern loading text with gradient */}
                <p className="rema-loader-text">
                    <span className="rema-loader-gradient-text">Loading{dots}</span>
                </p>
            </div>
        </div>
    );
};

export default RemaLoader;