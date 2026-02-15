// home.js – all interactive features

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ----- DARK MODE -----
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
    // close on link click (mobile)
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('show');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });

    // ----- SCROLL ANIMATIONS (Intersection Observer) -----
    const animatedElements = document.querySelectorAll('.fade-up, .slide-left, .zoom-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // optionally unobserve after reveal
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    animatedElements.forEach(el => observer.observe(el));

    // ----- MODAL PREVIEW (gallery) -----
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modalImage');
    const modalClose = document.querySelector('.modal-close');
    const overlay = document.querySelector('.modal-overlay');
    const galleryItems = document.querySelectorAll('.gallery-item');

    function openModal(src) {
        modalImg.src = src;
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; // prevent scrolling
    }
    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    galleryItems.forEach(item => {
        item.addEventListener('click', () => {
            const img = item.querySelector('img');
            if (img) openModal(img.src);
        });
    });

    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

    // ----- SMOOTH SCROLL for anchor links -----
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

    // ----- NEWSLETTER (prevent default, just simulate) -----
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('✨ Thanks for subscribing! (demo)');
            newsletterForm.reset();
        });
    }

    // ----- additional: ripple removal (CSS handles it) -----
    // button-ripple class is already in CSS

    // ensure visible class for elements already in view (in case observer misses)
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) el.classList.add('visible');
        });
    }, 200);
});