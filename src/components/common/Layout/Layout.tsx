import React from 'react';
import './Layout.css';

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
    return (
        <div className="layout">
            <div className="background-particles">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="particle"
                        style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 5}s`,
                            width: `${Math.random() * 6 + 2}px`,
                            height: `${Math.random() * 6 + 2}px`
                        }}
                    />
                ))}
            </div>
            <div className="container">
                {title && <h1 className="fade-in">{title}</h1>}
                <div className="content fade-in">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;