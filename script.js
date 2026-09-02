document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Typewriter Animation ---
  const typewriterElement = document.getElementById('typewriter');
  const titles = [
    'Electronic Engineer',
    'Quality Assurance (IPQC) Specialist',
    'Plant Reliability & Production Leader',
    'McKinsey.org Forward Participant (2026)',
    'Telecom & Optical Systems Engineer'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 90;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isDeleting) {
      typewriterElement.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 45;
    } else {
      typewriterElement.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 90;
    }

    if (!isDeleting && charIndex === currentTitle.length) {
      // Pause at full word
      typingSpeed = 1800;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      titleIndex = (titleIndex + 1) % titles.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  if (typewriterElement) {
    type();
  }

  // --- 2. Mobile Navigation Toggle ---
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });

    // Close menu when clicking any nav link
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
      });
    });
  }

  // --- 3. Active Link Scrollspy ---
  const sections = document.querySelectorAll('section[id]');
  const navItems = document.querySelectorAll('.nav-link');

  function highlightNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 100;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        navItems.forEach(item => {
          item.classList.remove('active');
          if (item.getAttribute('href') === `#${sectionId}`) {
            item.classList.add('active');
          }
        });
      }
    });
  }

  window.addEventListener('scroll', highlightNav);

  // --- 4. Recommendation Form & Dynamic Cards ---
  const recommendationForm = document.getElementById('recommendationForm');
  const recommendationList = document.getElementById('recommendationList');
  const popup = document.getElementById('popup');
  const popupClose = document.getElementById('popupClose');

  // Load custom recommendations from localStorage if available
  const savedRecs = JSON.parse(localStorage.getItem('uf_custom_recs') || '[]');
  savedRecs.forEach(rec => renderRecommendation(rec.name, rec.title, rec.message));

  if (recommendationForm) {
    recommendationForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const name = document.getElementById('recName').value.trim();
      const title = document.getElementById('recTitle').value.trim();
      const message = document.getElementById('recMessage').value.trim();

      if (name && title && message) {
        // Render new recommendation card
        renderRecommendation(name, title, message);

        // Save to localStorage
        savedRecs.push({ name, title, message });
        localStorage.setItem('uf_custom_recs', JSON.stringify(savedRecs));

        // Reset form
        recommendationForm.reset();

        // Show popup
        showPopup();
      }
    });
  }

  function renderRecommendation(name, title, message) {
    const card = document.createElement('div');
    card.className = 'rec-card new-rec';

    // Extract initials for avatar
    const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'UF';

    card.innerHTML = `
      <div class="rec-quote-mark">“</div>
      <p class="rec-text">${escapeHTML(message)}</p>
      <div class="rec-author">
        <div class="author-avatar">${initials}</div>
        <div>
          <strong>${escapeHTML(name)}</strong>
          <small>${escapeHTML(title)}</small>
        </div>
      </div>
    `;

    if (recommendationList) {
      recommendationList.appendChild(card);
    }
  }

  function showPopup() {
    if (popup) {
      popup.classList.remove('hidden');
    }
  }

  function hidePopup() {
    if (popup) {
      popup.classList.add('hidden');
    }
  }

  if (popupClose) {
    popupClose.addEventListener('click', hidePopup);
  }

  if (popup) {
    popup.querySelector('.popup-backdrop')?.addEventListener('click', hidePopup);
  }

  function escapeHTML(str) {
    const p = document.createElement('p');
    p.appendChild(document.createTextNode(str));
    return p.innerHTML;
  }

});
