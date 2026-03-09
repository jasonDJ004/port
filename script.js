// =============================================
//  PORTFOLIO DATABASE (localStorage)
// =============================================
const DB_KEY = 'portfolio_messages';

function getMessages() {
    return JSON.parse(localStorage.getItem(DB_KEY) || '[]');
}

function saveMessage(msg) {
    const messages = getMessages();
    msg.id = Date.now();
    msg.timestamp = new Date().toLocaleString();
    messages.unshift(msg);
    localStorage.setItem(DB_KEY, JSON.stringify(messages));
    return msg;
}

function clearMessages() {
    localStorage.removeItem(DB_KEY);
}

function renderMessages() {
    const messages = getMessages();
    const list = document.getElementById('messages-list');
    const count = document.getElementById('msg-count');
    count.textContent = messages.length;

    if (messages.length === 0) {
        list.innerHTML = '<p style="color:var(--text-muted); text-align:center; padding: 20px 0;">No messages yet.</p>';
        return;
    }

    list.innerHTML = messages.map(m => `
        <div class="msg-item">
            <div class="msg-item-header">
                <span class="msg-item-name"><i class="fas fa-user-circle"></i> ${m.name}</span>
                <span class="msg-item-date">${m.timestamp}</span>
            </div>
            <div class="msg-item-email"><i class="fas fa-envelope"></i> ${m.email}</div>
            <div class="msg-item-subject"><i class="fas fa-tag"></i> ${m.subject}</div>
            <div class="msg-item-body">${m.message}</div>
        </div>
    `).join('');
}

// =============================================
//  WEB3FORMS CONFIG — Replace with your key!
//  Get free key at: https://web3forms.com
//  Enter email: divinejasond2005@gmail.com
// =============================================
const WEB3FORMS_KEY = '4a03dbcc-3678-44cb-a334-e0d9aea2c6cb';

// =============================================
//  CONTACT FORM SUBMIT
// =============================================
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submit-btn');
const successEl = document.getElementById('form-success');

if (contactForm) {
    contactForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name    = document.getElementById('contact-name').value.trim();
        const email   = document.getElementById('contact-email').value.trim();
        const subject = document.getElementById('contact-subject').value.trim();
        const message = document.getElementById('contact-message').value.trim();

        // 1) Save to localStorage (local backup)
        saveMessage({ name, email, subject, message });
        renderMessages();

        // 2) Send via Web3Forms to divinejasond2005@gmail.com
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        try {
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    name,
                    email,
                    subject: `Portfolio Contact: ${subject}`,
                    message,
                    from_name: 'Divine Jason Portfolio'
                })
            });

            const data = await response.json();

            if (data.success) {
                contactForm.reset();
                successEl.innerHTML = '<i class="fas fa-check-circle"></i> Message sent! I\'ll get back to you soon.';
                successEl.style.background = '#ecfdf5';
                successEl.style.color = '#059669';
            } else {
                throw new Error('Send failed');
            }
        } catch (err) {
            // Still saved locally — show warning
            successEl.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Message saved locally. Email delivery needs Web3Forms key setup.';
            successEl.style.background = '#fffbeb';
            successEl.style.color = '#d97706';
        }

        successEl.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
        setTimeout(() => successEl.classList.add('hidden'), 5000);
    });
}

// =============================================
//  INBOX PASSWORD GATE
// =============================================
const INBOX_PASSWORD = 'Divine@2005';
const SESSION_KEY = 'inbox_unlocked';

const toggleInbox = document.getElementById('toggle-inbox');
const messagesPanel = document.getElementById('messages-panel');
const inboxModal = document.getElementById('inbox-modal');
const modalClose = document.getElementById('modal-close');
const inboxPasswordInput = document.getElementById('inbox-password');
const inboxSubmit = document.getElementById('inbox-submit');
const inboxError = document.getElementById('inbox-error');

function openInbox() {
    messagesPanel.classList.remove('hidden');
    renderMessages();
    sessionStorage.setItem(SESSION_KEY, '1');
}

function tryUnlock() {
    if (inboxPasswordInput.value === INBOX_PASSWORD) {
        inboxModal.classList.add('hidden');
        inboxError.classList.add('hidden');
        inboxPasswordInput.value = '';
        openInbox();
    } else {
        inboxError.classList.remove('hidden');
        inboxPasswordInput.value = '';
        inboxPasswordInput.focus();
        inboxPasswordInput.style.borderColor = '#dc2626';
        setTimeout(() => inboxPasswordInput.style.borderColor = '', 1500);
    }
}

if (toggleInbox) {
    toggleInbox.addEventListener('click', () => {
        // Already unlocked this session — toggle directly
        if (sessionStorage.getItem(SESSION_KEY)) {
            if (messagesPanel.classList.contains('hidden')) {
                openInbox();
            } else {
                messagesPanel.classList.add('hidden');
            }
        } else {
            // Show password modal
            inboxModal.classList.remove('hidden');
            setTimeout(() => inboxPasswordInput.focus(), 100);
        }
    });
}

if (modalClose) {
    modalClose.addEventListener('click', () => {
        inboxModal.classList.add('hidden');
        inboxError.classList.add('hidden');
        inboxPasswordInput.value = '';
    });
}

if (inboxModal) {
    inboxModal.addEventListener('click', (e) => {
        if (e.target === inboxModal) {
            inboxModal.classList.add('hidden');
            inboxError.classList.add('hidden');
            inboxPasswordInput.value = '';
        }
    });
}

if (inboxSubmit) {
    inboxSubmit.addEventListener('click', tryUnlock);
}

if (inboxPasswordInput) {
    inboxPasswordInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') tryUnlock();
    });
}

// Clear inbox
const clearMsgs = document.getElementById('clear-msgs');
if (clearMsgs) {
    clearMsgs.addEventListener('click', () => {
        if (confirm('Are you sure you want to clear all messages?')) {
            clearMessages();
            renderMessages();
        }
    });
}

// =============================================
//  MOBILE MENU
// =============================================
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.replace('fa-bars', 'fa-times');
    } else {
        icon.classList.replace('fa-times', 'fa-bars');
    }
});

document.querySelectorAll('.nav-item').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.querySelector('i').classList.replace('fa-times', 'fa-bars');
    });
});

// =============================================
//  NAVBAR SCROLL & ACTIVE STATE
// =============================================
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section');
const navItemEls = document.querySelectorAll('.nav-item');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 4px 6px -1px rgba(0,0,0,0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }

    let current = '';
    sections.forEach(section => {
        if (pageYOffset >= section.offsetTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navItemEls.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').slice(1) === current) {
            item.classList.add('active');
        }
    });
});

// =============================================
//  SCROLL REVEAL & PROGRESS BARS
// =============================================
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    reveals.forEach(el => {
        const top = el.getBoundingClientRect().top;
        if (top < window.innerHeight - 100) {
            el.classList.add('active');
            if (el.closest('.skills')) {
                document.querySelectorAll('.progress').forEach(bar => {
                    bar.style.width = bar.getAttribute('data-width');
                });
            }
        }
    });
}

window.addEventListener('scroll', reveal);
reveal();
