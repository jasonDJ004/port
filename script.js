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
//  CONTACT FORM SUBMIT
// =============================================
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const msg = {
            name: document.getElementById('contact-name').value.trim(),
            email: document.getElementById('contact-email').value.trim(),
            subject: document.getElementById('contact-subject').value.trim(),
            message: document.getElementById('contact-message').value.trim()
        };

        saveMessage(msg);
        contactForm.reset();

        const successEl = document.getElementById('form-success');
        successEl.classList.remove('hidden');
        setTimeout(() => successEl.classList.add('hidden'), 3500);

        renderMessages();
    });
}

// Inbox toggle
const toggleInbox = document.getElementById('toggle-inbox');
const messagesPanel = document.getElementById('messages-panel');
if (toggleInbox && messagesPanel) {
    toggleInbox.addEventListener('click', () => {
        messagesPanel.classList.toggle('hidden');
        const isHidden = messagesPanel.classList.contains('hidden');
        toggleInbox.innerHTML = isHidden
            ? '<i class="fas fa-inbox"></i> View Inbox'
            : '<i class="fas fa-inbox"></i> Hide Inbox';
        if (!isHidden) renderMessages();
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
