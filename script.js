// Particle Effect for Hero Background
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');

let particles = [];
const particleCount = 80;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
            this.reset();
        }
    }

    draw() {
        ctx.fillStyle = `rgba(255, 215, 0, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

initParticles();
animate();

// Form Handling
const forms = [
    document.getElementById('hero-form'),
    document.getElementById('newsletter-form')
];

const messageContainer = document.getElementById('form-message');
const successContent = messageContainer.querySelector('.success-content');
const errorContent = messageContainer.querySelector('.error-content');

// IMPORTANT: Replace 'YOUR_FORM_ID' with your real Formspree ID
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xaqdadyk';

forms.forEach(form => {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const emailInput = form.querySelector('input[type="email"]');
        const email = emailInput.value;
        const submitBtn = form.querySelector('button');

        // Basic Validation
        if (!validateEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        // UI State: Loading
        submitBtn.disabled = true;
        submitBtn.innerText = 'Sending...';

        try {
            const response = await fetch(FORMSPREE_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            });

            if (response.ok) {
                // UI State: Success
                hideAllForms();
                messageContainer.classList.remove('hidden');
                successContent.classList.remove('hidden');
                errorContent.classList.add('hidden');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            // UI State: Error
            messageContainer.classList.remove('hidden');
            errorContent.classList.remove('hidden');
            successContent.classList.add('hidden');
            submitBtn.disabled = false;
            submitBtn.innerText = 'Try Again';
            console.error('Submission error:', error);
        }
    });
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function hideAllForms() {
    forms.forEach(f => {
        f.style.display = 'none';
        // If it's the hero form, we might want to keep the context but hide the inputs
        if (f.id === 'hero-form') {
            f.closest('.hero-content').querySelector('h1').innerText = 'Thank you for joining!';
        }
    });

    // Also hide headings/subtext in the newsletter section if needed
    const newsletterSection = document.getElementById('waitlist');
    const header = newsletterSection.querySelector('h2');
    const subtext = newsletterSection.querySelector('p');
    if (header) header.style.display = 'none';
    if (subtext) subtext.style.display = 'none';
}

// Sticky Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 50) {
        navbar.style.padding = '10px 0';
        navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
    } else {
        navbar.style.padding = '20px 0';
        navbar.style.boxShadow = 'none';
    }
});
