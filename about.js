// about.js – dark mode, mobile menu, scroll animations, counters, smooth scroll

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ----- DARK MODE (same as home/courses) -----
    const darkToggle = document.getElementById('darkModeToggle');
    const body = document.body;
    const moonIcon = '<i class="fas fa-moon"></i>';
    const sunIcon = '<i class="fas fa-sun"></i>';

    function setDarkModePref(enable) {
        if (enable) {
            body.classList.add('dark-mode');
            darkToggle.innerHTML = sunIcon;
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            darkToggle.innerHTML = moonIcon;
            localStorage.setItem('darkMode', 'disabled');
        }
    }

    const storedPref = localStorage.getItem('darkMode');
    if (storedPref === 'enabled') setDarkModePref(true);
    else setDarkModePref(false);

    darkToggle.addEventListener('click', () => {
        setDarkModePref(!body.classList.contains('dark-mode'));
    });

    // ----- MOBILE MENU -----
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-links');
    hamburger.addEventListener('click', (e) => {
        e.stopPropagation();
        const expanded = hamburger.getAttribute('aria-expanded') === 'true' ? false : true;
        hamburger.setAttribute('aria-expanded', expanded);
        navMenu.classList.toggle('show');
    });
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // ----- SCROLL ANIMATIONS (IntersectionObserver) -----
    const animatedElements = document.querySelectorAll('.fade-up, .slide-left, .zoom-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // optional
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    animatedElements.forEach(el => observer.observe(el));

    // ----- COUNTER ANIMATION -----
    const statNumbers = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target'), 10);
                if (isNaN(target)) return;
                let current = 0;
                const increment = target / 50; // smooth increment
                const updateCounter = () => {
                    current += increment;
                    if (current < target) {
                        el.innerText = Math.ceil(current);
                        requestAnimationFrame(updateCounter);
                    } else {
                        el.innerText = target + '+'; // add plus sign
                    }
                };
                updateCounter();
                obs.unobserve(el); // count only once
            }
        });
    }, { threshold: 0.5 });
    statNumbers.forEach(num => counterObserver.observe(num));

    // ----- SMOOTH SCROLL for anchor links (if any) -----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#') return;
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // (optional) force visible on elements already in view
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) el.classList.add('visible');
        });
    }, 200);
});