// Seed default user
(function seedDefaultUser() {
  if (!localStorage.getItem('ft_users')) {
    const users = [{ email: 'admin@futhurtech.com', password: 'admin123', name: 'Admin' }];
    localStorage.setItem('ft_users', JSON.stringify(users));
  }
})();

document.addEventListener('DOMContentLoaded', () => {

  // Hamburger menu toggle
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
  }

  // Close menu on link click (mobile)
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
      });
    });
  }

  // Set active nav link based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // Accordion (FAQ)
  document.querySelectorAll('.accordion-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion-item.active').forEach(openItem => {
        if (openItem !== item) {
          openItem.classList.remove('active');
        }
      });

      item.classList.toggle('active');
    });
  });

  // Animated counters (stats)
  const counters = document.querySelectorAll('.stat-item h3');
  if (counters.length > 0) {
    const animateCounters = () => {
      counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const increment = target / 60;
        let current = 0;

        const updateCounter = () => {
          current += increment;
          if (current < target) {
            counter.textContent = Math.ceil(current) + '+';
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target + '+';
          }
        };
        updateCounter();
      });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          observer.disconnect();
        }
      });
    }, { threshold: 0.5 });

    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) observer.observe(statsBar);
  }

  // Budget simulator
  const budgetRadios = document.querySelectorAll('input[name="budget"]');
  const totalDisplay = document.getElementById('budget-total');

  if (budgetRadios.length > 0 && totalDisplay) {
    const updateBudget = () => {
      const selected = document.querySelector('input[name="budget"]:checked');
      if (selected) {
        const price = parseInt(selected.dataset.price);
        totalDisplay.textContent = '$' + price.toLocaleString('es-AR');

        document.querySelectorAll('.budget-option').forEach(opt => {
          opt.classList.toggle('selected', opt.querySelector('input').checked);
        });
      }
    };

    budgetRadios.forEach(radio => {
      radio.addEventListener('change', updateBudget);
    });

    updateBudget();
  }

  // Contact form validation
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      let valid = true;
      const fields = contactForm.querySelectorAll('input[required], textarea[required], select[required]');

      fields.forEach(field => {
        const error = field.parentElement.querySelector('.error-message');
        if (error) error.remove();

        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = '#EA4F51';
          const msg = document.createElement('small');
          msg.className = 'error-message';
          msg.style.color = '#EA4F51';
          msg.style.fontSize = '0.8rem';
          msg.style.marginTop = '4px';
          msg.style.display = 'block';
          msg.textContent = 'Este campo es obligatorio';
          field.parentElement.appendChild(msg);
        } else {
          field.style.borderColor = '#e0e0e0';
        }
      });

      if (valid) {
        const btn = contactForm.querySelector('button[type="submit"]');
        btn.textContent = '✓ Mensaje enviado';
        btn.style.background = '#00A79F';
        setTimeout(() => {
          btn.textContent = 'Enviar mensaje';
          btn.style.background = '';
          contactForm.reset();
        }, 3000);
      }
    });

    contactForm.querySelectorAll('input, textarea, select').forEach(field => {
      field.addEventListener('input', () => {
        field.style.borderColor = '#e0e0e0';
        const error = field.parentElement.querySelector('.error-message');
        if (error) error.remove();
      });
    });
  }

  // Login form
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value.trim();
      const errorEl = document.getElementById('loginError');

      const users = JSON.parse(localStorage.getItem('ft_users') || '[]');
      const user = users.find(u => u.email === email && u.password === password);

      if (user) {
        localStorage.setItem('ft_session', JSON.stringify({ email: user.email, name: user.name }));
        window.location.href = 'dashboard.html';
      } else {
        if (errorEl) errorEl.style.display = 'block';
      }
    });
  }

  // Password toggle
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('loginPassword');
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  // Dashboard session check
  if (window.location.pathname.includes('dashboard.html')) {
    const session = JSON.parse(localStorage.getItem('ft_session') || 'null');
    if (!session) {
      window.location.href = 'login.html';
      return;
    }
    const welcomeEl = document.getElementById('dashboardWelcome');
    const emailEl = document.getElementById('dashboardEmail');
    if (welcomeEl) welcomeEl.textContent = '¡Bienvenido de nuevo, ' + session.name + '!';
    if (emailEl) emailEl.textContent = session.email;
  }

  // Logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('ft_session');
      window.location.href = 'login.html';
    });
  }

  // Redirect to dashboard if already logged in (on login page)
  if (window.location.pathname.includes('login.html')) {
    const session = JSON.parse(localStorage.getItem('ft_session') || 'null');
    if (session) {
      window.location.href = 'dashboard.html';
    }
  }

});
