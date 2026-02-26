/**
 * ═══════════════════════════════════════════════════════════
 * NATURALFOOD - Main Entry Point
 * Agricultural Management Platform
 * 
 * Architecture: MVC (Model-View-Controller)
 * ═══════════════════════════════════════════════════════════
 */

import './styles/main.css';
import './styles/new_landing.css';
import { AppController } from './controllers/AppController.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const app = new AppController();
    app.init();

    // Scroll Management for New Header
    window.addEventListener('scroll', () => {
        const header = document.getElementById('mainHeader');
        if (header) {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });

    // Mobile Menu Toggle for New Landing (delegation since it's dynamic)
    document.addEventListener('click', (e) => {
        if (e.target.id === 'btnMenu') {
            const nav = document.querySelector('.menu-menu-principal-container');
            if (nav) nav.classList.toggle('open');
        }
    });
});
