// =============================================
// SONAR DOT GENERATOR
// =============================================
const sonarDotsContainer = document.getElementById('sonar-dots');
const heroSection = document.getElementById('hero');

function createSonarDot() {
    const dot = document.createElement('div');
    dot.classList.add('sonar-dot');

    // Random position within hero bounds
    const heroRect = heroSection.getBoundingClientRect();
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    dot.style.left = x + '%';
    dot.style.top = y + '%';

    // Random animation delay and duration for organic feel
    const duration = 3 + Math.random() * 3;
    const delay = Math.random() * 4;
    dot.style.animationDuration = duration + 's';
    dot.style.animationDelay = delay + 's';

    sonarDotsContainer.appendChild(dot);

    // Remove dot after its animation completes to avoid DOM bloat
    setTimeout(() => {
        dot.remove();
    }, (duration + delay) * 1000 + 200);
}

// Spawn a batch of dots periodically
function spawnDots() {
    const count = 4 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
        setTimeout(createSonarDot, i * 200);
    }
}

// Initial spawn + recurring
spawnDots();
setInterval(spawnDots, 2500);


// =============================================
// WAITLIST COUNTER
// =============================================
const counterEl = document.getElementById('waitlist-counter');
let count = 247;

setInterval(() => {
    count += 1;
    if (counterEl) counterEl.textContent = count;
}, 45000);


// =============================================
// INTERSECTION OBSERVER — Dividers only
// =============================================

// Animated dividers (fade in from center)
const dividers = document.querySelectorAll('.animate-divider');
const dividerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            dividerObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });
dividers.forEach(d => dividerObserver.observe(d));


// =============================================
// CATEGORY PILLS — More popup & selection
// =============================================
const moreBtnEl = document.getElementById('pill-more-btn');
const popupEl = document.getElementById('categories-popup');
const noEventsEl = document.getElementById('no-events-msg');
const noEventsCatEl = document.getElementById('no-events-category');
const dismissBtn = document.getElementById('no-events-dismiss');
let activeCategory = null;

// Toggle the "More" popup
if (moreBtnEl && popupEl) {
    moreBtnEl.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !popupEl.classList.contains('hidden');
        popupEl.classList.toggle('hidden');
        moreBtnEl.setAttribute('aria-expanded', String(!isOpen));
        moreBtnEl.textContent = isOpen ? 'More +' : 'Less −';
    });

    // Close popup when clicking outside
    document.addEventListener('click', (e) => {
        if (!popupEl.classList.contains('hidden') &&
            !popupEl.contains(e.target) &&
            e.target !== moreBtnEl) {
            popupEl.classList.add('hidden');
            moreBtnEl.setAttribute('aria-expanded', 'false');
            moreBtnEl.textContent = 'More +';
        }
    });
}

// Handle category pill clicks (main + popup pills)
function selectCategory(pill) {
    const cat = pill.dataset.category;

    // If clicking same category, deselect it
    if (activeCategory === cat) {
        activeCategory = null;
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        if (noEventsEl) noEventsEl.classList.add('hidden');
        return;
    }

    // Set active
    activeCategory = cat;
    document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
    pill.classList.add('active');

    // Close popup if open
    if (popupEl) {
        popupEl.classList.add('hidden');
        if (moreBtnEl) {
            moreBtnEl.setAttribute('aria-expanded', 'false');
            moreBtnEl.textContent = 'More +';
        }
    }

    // Show "no events" message (since the app isn't live yet)
    if (noEventsEl && noEventsCatEl) {
        noEventsCatEl.textContent = cat;
        noEventsEl.classList.remove('hidden');
        // Smooth scroll to message
        noEventsEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

document.querySelectorAll('.pill[data-category]').forEach(pill => {
    pill.addEventListener('click', () => selectCategory(pill));
});

// Dismiss button clears category
if (dismissBtn) {
    dismissBtn.addEventListener('click', () => {
        activeCategory = null;
        document.querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
        if (noEventsEl) noEventsEl.classList.add('hidden');
    });
}


// =============================================
// FORM HANDLING (Formspree)
// =============================================
const forms = [
    document.getElementById('hero-form'),
    document.getElementById('newsletter-form')
];

const messageContainer = document.getElementById('form-message');
const successContent = messageContainer ? messageContainer.querySelector('.success-content') : null;
const errorContent = messageContainer ? messageContainer.querySelector('.error-content') : null;

// IMPORTANT: Replace 'YOUR_FORM_ID' with your real Formspree ID
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/YOUR_FORM_ID';

forms.forEach(form => {
    if (!form) return;
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;
        const submitBtn = form.querySelector('button');

        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            });

            if (response.ok) {
                hideAllForms();
                if (messageContainer) messageContainer.classList.remove('hidden');
                if (successContent) successContent.classList.remove('hidden');
                if (errorContent) errorContent.classList.add('hidden');
            } else {
                throw new Error('Submission failed');
            }
        } catch (err) {
            if (messageContainer) messageContainer.classList.remove('hidden');
            if (errorContent) errorContent.classList.remove('hidden');
            if (successContent) successContent.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.innerText = 'Try Again';
            console.error('Submission error:', err);
        }
    });
});

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function hideAllForms() {
    forms.forEach(f => {
        if (!f) return;
        f.style.display = 'none';
        if (f.id === 'hero-form') {
            const h1 = f.closest('.hero-content').querySelector('h1');
            if (h1) h1.innerHTML = '<span class="h1-line">Thank you</span><span class="h1-line">for joining!</span>';
        }
    });
    const waitlistSection = document.getElementById('waitlist');
    if (waitlistSection) {
        const h2 = waitlistSection.querySelector('h2');
        const p = waitlistSection.querySelector('p');
        if (h2) h2.style.display = 'none';
        if (p) p.style.display = 'none';
    }
}


// =============================================
// STICKY NAVBAR SCROLL EFFECT
// =============================================
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 0';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    } else {
        navbar.style.padding = '20px 0';
        navbar.style.boxShadow = 'none';
    }
});
