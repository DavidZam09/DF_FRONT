import React, { useState, useEffect } from 'react';
import './loading.css';

const ProgressCircle = ({ progress }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <radialGradient id="gradiente" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
                    <stop offset="50%" stopColor="transparent" />
                    <stop offset="50%" stopColor="#03bb2b" />
                    <stop offset="100%" stopColor="#006917" />
                </radialGradient>
            </defs>
            <circle cx="100" cy="100" r="70" fill="url(#gradiente)" stroke="#006917" />
            <polygon points="130,60 167,40 167,101" fill="#006917" stroke="#006917" strokeWidth="6" />
            <circle
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke="#fff"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="progress-circle"
            />
            <text
                x="50%"
                y="190"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="30"
                fontFamily="Montserrat, sans-serif"
                fontWeight="bold"
                fill="#2c2c2c"
                strokeWidth="2"
                textShadow="2px 2px 2px rgba(0,0,0,0.5)"
            >
                Crédito Fácil
            </text>
        </svg>
    );
};

const LoadingComponent = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prevProgress + 10;
            });
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-container">
            <ProgressCircle progress={progress} />
        </div>
    );
};

export default LoadingComponent;
