// Inicializa un usuario predeterminado en localStorage
// y corrige datos antiguos si detecta valores obsoletos.
(function seedDefaultUser() {
  if (!localStorage.getItem('ft_users')) {
    const users = [{
      email: 'admin@futhurtech.com',
      password: 'admin123',
      name: 'Admin',
      birthdate: '',
      course: 'Robótica Inicial',
      bio: ''
    }];
    localStorage.setItem('ft_users', JSON.stringify(users));
  }

  // La lógica para corregir datos antiguos de 'phone' y 'location' se elimina
  // ya que estos campos ya no serán utilizados.
})();

document.addEventListener('DOMContentLoaded', () => {

  // Alterna el menú hamburguesa en dispositivos móviles
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');

  if (hamburger) {
    hamburger.addEventListener('click', () => {
      navLinks.classList.toggle('open');
      hamburger.classList.toggle('open');
    });
  }

  // Cierra el menú móvil cuando se hace clic en un enlace
  if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        if (hamburger) hamburger.classList.remove('open');
      });
    });
  }

  // Marca en la navegación el enlace activo según la página actual
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navLinks.querySelectorAll('a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // Controla el acordeón de preguntas frecuentes en las secciones FAQ
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

  // Contadores animados que se activan cuando entra la sección en pantalla
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

  // Simulador de presupuesto con selección de opciones y total dinámico
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

  // Validación del formulario de contacto y mensajes de error amigables
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

  // Manejo del formulario de inicio de sesión y verificación de credenciales
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

  // Alterna la visibilidad de la contraseña en la página de login
  const toggleBtn = document.getElementById('togglePassword');
  const passwordInput = document.getElementById('loginPassword');
  if (toggleBtn && passwordInput) {
    toggleBtn.addEventListener('click', () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      toggleBtn.textContent = type === 'password' ? '👁️' : '🙈';
    });
  }

  // Verifica que exista sesión activa al ingresar al panel de usuario
  if (window.location.pathname.includes('dashboard.html')) {
    const session = JSON.parse(localStorage.getItem('ft_session') || 'null');
    if (!session) {
      window.location.href = 'login.html';
      return;
    }
    const users = JSON.parse(localStorage.getItem('ft_users') || '[]');
    const user = users.find(u => u.email === session.email) || session;
    const welcomeEl = document.getElementById('dashboardWelcome');
    const emailEl = document.getElementById('dashboardEmail');
    if (welcomeEl) welcomeEl.textContent = '¡Bienvenido de nuevo, ' + user.name + '!';
    if (emailEl) emailEl.textContent = user.email;
  }

  // Lógica específica para la página de perfil y actualización de datos del usuario
  if (window.location.pathname.includes('perfil.html')) {
    const session = JSON.parse(localStorage.getItem('ft_session') || 'null');
    if (!session) {
      window.location.href = 'login.html';
      return;
    }

    const users = JSON.parse(localStorage.getItem('ft_users') || '[]');
    const userIndex = users.findIndex(u => u.email === session.email);
    const user = users[userIndex] || session;

    const profileForm = document.getElementById('profileForm');
    const fields = {
      name: document.getElementById('profileName'),
      email: document.getElementById('profileEmail'),
      birthdate: document.getElementById('profileBirthdate'),
      course: document.getElementById('profileCourse'),
      bio: document.getElementById('profileBio')
    };
    const savedEl = document.getElementById('profileSaved');
    const avatarEl = document.getElementById('profileAvatar');
    const summaryNameEl = document.getElementById('profileSummaryName');
    const summaryCourseEl = document.getElementById('profileSummaryCourse');
    const sessionEmailEl = document.getElementById('profileSessionEmail');

    const updateSummary = () => {
      const name = fields.name.value.trim() || 'Usuario';
      const course = fields.course.value || 'Sin curso asignado';
      const initials = name.split(' ').filter(Boolean).slice(0, 2).map(part => part[0]).join('').toUpperCase();
      if (avatarEl) avatarEl.textContent = initials || 'FT';
      if (summaryNameEl) summaryNameEl.textContent = name;
      if (summaryCourseEl) summaryCourseEl.textContent = course;
      if (sessionEmailEl) sessionEmailEl.textContent = fields.email.value;
    };

    fields.name.value = user.name || '';
    fields.email.value = user.email || session.email;
    fields.birthdate.value = user.birthdate || '';
    fields.course.value = user.course || '';
    fields.bio.value = user.bio || '';
    updateSummary();

    Object.values(fields).forEach(field => {
      field.addEventListener('input', updateSummary);
    });

    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const updatedUser = {
          ...user,
          name: fields.name.value.trim(),
          email: fields.email.value.trim(),
          birthdate: fields.birthdate.value,
          course: fields.course.value,
          bio: fields.bio.value.trim()
        };

        if (userIndex >= 0) {
          users[userIndex] = updatedUser;
        } else {
          users.push(updatedUser);
        }

        localStorage.setItem('ft_users', JSON.stringify(users));
        localStorage.setItem('ft_session', JSON.stringify({ email: updatedUser.email, name: updatedUser.name }));
        updateSummary();

        if (savedEl) {
          savedEl.textContent = 'Cambios guardados correctamente';
          setTimeout(() => {
            savedEl.textContent = '';
          }, 3000);
        }
      });
    }
  }

  // Cierra la sesión eliminando los datos de sesión de localStorage
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('ft_session');
      window.location.href = 'login.html';
    });
  }

  // Redirige automáticamente al panel si el usuario ya tiene sesión iniciada
  if (window.location.pathname.includes('login.html')) {
    const session = JSON.parse(localStorage.getItem('ft_session') || 'null');
    if (session) {
      window.location.href = 'dashboard.html';
    }
  }

  // Cambiar título cuando el usuario cambia de pestaña
  const originalTitle = document.title;
  const hiddenTitle = '¡Volvé a FuthurTech!';

  const handleVisibilityChange = () => {
    if (document.hidden) {
      document.title = hiddenTitle;
    } else {
      document.title = originalTitle;
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);
  window.addEventListener('focus', () => {
    document.title = originalTitle;
  });

});
