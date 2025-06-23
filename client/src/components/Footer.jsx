import React, { useState, useEffect } from 'react';
import '../styles/footer.css';

const Footer = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
            if (window.scrollY > 50) { // 50px pra considerar scroll "down"
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <footer className={`footer ${scrolled ? 'footer-expanded' : ''}`}>
            <div className="footer-content">
                <div className="footer-section footer-text">
                    © 2025 IPT - Instituto Politécnico de Tecnologia - Plataforma Horários
                </div>
            </div>
        </footer>
    );
};

export default Footer;
