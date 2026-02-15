// courses.js – filter, search, bookmarks, modal, dark mode, animations

document.addEventListener('DOMContentLoaded', () => {
    'use strict';

    // ----- DARK MODE (same as home) -----
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

    // ----- SCROLL ANIMATIONS (Intersection Observer) -----
    const animatedElements = document.querySelectorAll('.fade-up, .slide-left, .zoom-in');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -50px 0px' });
    animatedElements.forEach(el => observer.observe(el));

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

    // ----- COURSE FILTERING & SEARCH -----
    const courses = document.querySelectorAll('.course-card');
    const searchInput = document.getElementById('searchInput');
    const difficultyFilter = document.getElementById('difficultyFilter');
    const categoryFilter = document.getElementById('categoryFilter');
    const durationFilter = document.getElementById('durationFilter');
    const resetBtn = document.getElementById('resetFilters');
    const resultsCount = document.getElementById('resultsCount');

    function filterCourses() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const difficulty = difficultyFilter.value;
        const category = categoryFilter.value;
        const duration = durationFilter.value;

        let visibleCount = 0;
        courses.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            const desc = card.querySelector('.course-desc')?.innerText.toLowerCase() || '';
            const matchesSearch = title.includes(searchTerm) || desc.includes(searchTerm);
            
            const cardDifficulty = card.dataset.difficulty;
            const cardCategory = card.dataset.category;
            const cardDuration = card.dataset.duration;

            const matchesDifficulty = difficulty === 'all' || cardDifficulty === difficulty;
            const matchesCategory = category === 'all' || cardCategory === category;
            const matchesDuration = duration === 'all' || cardDuration === duration;

            if (matchesSearch && matchesDifficulty && matchesCategory && matchesDuration) {
                card.style.display = 'flex';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });
        resultsCount.innerText = `${visibleCount} course${visibleCount !== 1 ? 's' : ''} found`;
    }

    searchInput.addEventListener('input', filterCourses);
    difficultyFilter.addEventListener('change', filterCourses);
    categoryFilter.addEventListener('change', filterCourses);
    durationFilter.addEventListener('change', filterCourses);

    resetBtn.addEventListener('click', () => {
        searchInput.value = '';
        difficultyFilter.value = 'all';
        categoryFilter.value = 'all';
        durationFilter.value = 'all';
        filterCourses();
    });

    // initial filter (show all)
    filterCourses();

    // ----- BOOKMARK (localStorage) -----
    const bookmarkIcons = document.querySelectorAll('.bookmark-icon');
    let bookmarks = JSON.parse(localStorage.getItem('courseBookmarks')) || []; // array of course IDs

    function updateBookmarkUI() {
        bookmarkIcons.forEach(icon => {
            const card = icon.closest('.course-card');
            const id = card.dataset.id;
            if (bookmarks.includes(id)) {
                icon.classList.add('bookmarked');
                icon.innerHTML = '<i class="fas fa-star"></i>';
            } else {
                icon.classList.remove('bookmarked');
                icon.innerHTML = '<i class="far fa-star"></i>';
            }
        });
    }

    bookmarkIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            e.stopPropagation(); // prevent card click
            const card = icon.closest('.course-card');
            const id = card.dataset.id;
            if (bookmarks.includes(id)) {
                bookmarks = bookmarks.filter(b => b !== id);
            } else {
                bookmarks.push(id);
            }
            localStorage.setItem('courseBookmarks', JSON.stringify(bookmarks));
            updateBookmarkUI();
        });
    });

    updateBookmarkUI();

    // ----- MODAL PREVIEW (card click) -----
    const modal = document.getElementById('courseModal');
    const modalTitle = document.getElementById('modalCourseTitle');
    const modalDesc = document.getElementById('modalCourseDesc');
    const modalDifficulty = document.getElementById('modalDifficulty');
    const modalDuration = document.getElementById('modalDuration');
    const modalLessons = document.getElementById('modalLessons');
    const modalClose = document.querySelector('.modal-close');
    const overlay = document.querySelector('.modal-overlay');

    // sample lessons per course (for demo)
    const lessonsData = {
        '1': ['Intro to UI', 'Hierarchy', 'Color in UI', 'Hands‑on'],
        '2': ['User interviews', 'Personas', 'Usability testing'],
        '3': ['Color psychology', 'Contrast', 'Accessible palettes'],
        '4': ['Type classification', 'Pairing', 'Vertical rhythm'],
        '5': ['Wireframing', 'Prototyping', 'Mobile patterns'],
        '6': ['WCAG overview', 'Screen readers', 'Inclusive forms'],
        '7': ['Figma basics', 'Wireframing', 'Clickable prototype'],
        '8': ['Design tokens', 'Components', 'Documentation']
    };

    function openModal(card) {
        const id = card.dataset.id;
        const title = card.querySelector('h3').innerText;
        const desc = card.querySelector('.course-desc').innerText;
        const difficulty = card.querySelector('.badge').innerText;
        const duration = card.querySelector('.duration').innerText;
        
        modalTitle.innerText = title;
        modalDesc.innerText = desc;
        modalDifficulty.innerText = difficulty;
        modalDuration.innerText = duration;

        // fill lessons
        const lessons = lessonsData[id] || ['Lesson 1', 'Lesson 2', 'Lesson 3'];
        modalLessons.innerHTML = lessons.map(l => `<li>${l}</li>`).join('');

        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    courses.forEach(card => {
        card.addEventListener('click', (e) => {
            // ignore if click on bookmark or link
            if (e.target.closest('.bookmark-icon') || e.target.closest('.card-btn')) return;
            openModal(card);
        });
    });

    modalClose.addEventListener('click', closeModal);
    overlay.addEventListener('click', closeModal);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') {
            closeModal();
        }
    });

    // also "Start course" links should open modal? or just dummy
    document.querySelectorAll('.start-course').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const card = link.closest('.course-card');
            openModal(card);
        });
    });

    // ----- ensure visible elements (in case observer misses) -----
    setTimeout(() => {
        animatedElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight - 100) el.classList.add('visible');
        });
    }, 200);
});