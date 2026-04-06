/* ============================================================
   turism-moldova.js
   Toate efectele JavaScript pentru Mini-Ghid Turism Moldova
   ============================================================ */


/* ────────────────────────────────────────
   1. SMOOTH SCROLL pentru linkurile din nav
──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var targetId = this.getAttribute('href');
    var target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      var headerOffset = 20;
      var elementPosition = target.getBoundingClientRect().top;
      var offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  });
});


/* ────────────────────────────────────────
   2. FADE-IN la scroll (Intersection Observer)
──────────────────────────────────────── */
var fadeElements = document.querySelectorAll('.fade-in');

var observer = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

fadeElements.forEach(function(el) {
  observer.observe(el);
});


/* ────────────────────────────────────────
   3. SLIDER / CAROUSEL
──────────────────────────────────────── */
var sliderTrack = document.getElementById('sliderTrack');
var slides = sliderTrack.querySelectorAll('.slide');
var dotsContainer = document.getElementById('sliderDots');
var prevBtn = document.getElementById('prevBtn');
var nextBtn = document.getElementById('nextBtn');
var currentSlide = 0;
var autoSlideInterval;

// Creează dots
slides.forEach(function(_, i) {
  var dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.setAttribute('aria-label', 'Slide ' + (i + 1));
  dot.addEventListener('click', function() { goToSlide(i); });
  dotsContainer.appendChild(dot);
});

function updateDots() {
  dotsContainer.querySelectorAll('.dot').forEach(function(d, i) {
    d.classList.toggle('active', i === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  sliderTrack.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
  updateDots();
}

prevBtn.addEventListener('click', function() {
  goToSlide(currentSlide - 1);
  resetAutoSlide();
});

nextBtn.addEventListener('click', function() {
  goToSlide(currentSlide + 1);
  resetAutoSlide();
});

function startAutoSlide() {
  autoSlideInterval = setInterval(function() {
    goToSlide(currentSlide + 1);
  }, 4000);
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

startAutoSlide();

// Swipe pe mobile
var touchStartX = 0;
sliderTrack.addEventListener('touchstart', function(e) {
  touchStartX = e.touches[0].clientX;
});
sliderTrack.addEventListener('touchend', function(e) {
  var diff = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    goToSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    resetAutoSlide();
  }
});


/* ────────────────────────────────────────
   4. TOOLTIP pe carduri (click → popup mic)
──────────────────────────────────────── */
document.querySelectorAll('.dest-card').forEach(function(card) {
  card.addEventListener('click', function() {
    var title = card.querySelector('h3').textContent;
    var desc = card.querySelector('p').textContent;
    showPopup(title, desc);
  });
});

function showPopup(title, desc) {
  var existing = document.getElementById('card-popup');
  if (existing) existing.remove();

  var popup = document.createElement('div');
  popup.id = 'card-popup';
  popup.style.cssText = [
    'position:fixed', 'bottom:2rem', 'left:50%',
    'transform:translateX(-50%) translateY(20px)',
    'background:var(--wine)', 'color:white',
    'padding:1rem 1.5rem', 'border-radius:10px',
    'box-shadow:0 8px 24px rgba(0,0,0,0.25)',
    'z-index:1000', 'max-width:340px', 'width:90%',
    'text-align:center', 'font-family:Lato,sans-serif',
    'transition:transform 0.3s ease, opacity 0.3s ease',
    'opacity:0'
  ].join(';');
  popup.innerHTML = '<strong style="font-family:Playfair Display,serif;font-size:1.1rem;">' + title + '</strong>'
    + '<p style="margin:0.4rem 0 0;font-size:0.88rem;opacity:0.9;line-height:1.5;">' + desc + '</p>';

  document.body.appendChild(popup);
  requestAnimationFrame(function() {
    popup.style.opacity = '1';
    popup.style.transform = 'translateX(-50%) translateY(0)';
  });

  setTimeout(function() {
    popup.style.opacity = '0';
    popup.style.transform = 'translateX(-50%) translateY(20px)';
    setTimeout(function() { popup.remove(); }, 300);
  }, 3000);
}


/* ────────────────────────────────────────
   5. BACK TO TOP buton
──────────────────────────────────────── */
var backToTopBtn = document.getElementById('back-to-top');

window.addEventListener('scroll', function() {
  if (window.pageYOffset > 400) {
    backToTopBtn.classList.add('show');
  } else {
    backToTopBtn.classList.remove('show');
  }
});

backToTopBtn.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


/* ────────────────────────────────────────
   6. VALIDARE FORMULAR cu JavaScript
──────────────────────────────────────── */
var form = document.getElementById('newsletterForm');

function setError(fieldId, errId, show) {
  var field = document.getElementById(fieldId);
  var err = document.getElementById(errId);
  if (show) {
    field.classList.add('error');
    err.classList.add('show');
  } else {
    field.classList.remove('error');
    err.classList.remove('show');
  }
  return !show;
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone) {
  // Optional: dacă e completat, verifică formatul
  if (!phone) return true;
  return /^[\+\d\s\-\(\)]{7,20}$/.test(phone);
}

// Validare live (la blur)
document.getElementById('fname').addEventListener('blur', function() {
  setError('fname', 'fname-err', this.value.trim().length < 2);
});
document.getElementById('lname').addEventListener('blur', function() {
  setError('lname', 'lname-err', this.value.trim().length < 2);
});
document.getElementById('email').addEventListener('blur', function() {
  setError('email', 'email-err', !validateEmail(this.value.trim()));
});
document.getElementById('phone').addEventListener('blur', function() {
  setError('phone', 'phone-err', !validatePhone(this.value.trim()));
});

// Submit
form.addEventListener('submit', function(e) {
  e.preventDefault();

  var fname = document.getElementById('fname').value.trim();
  var lname = document.getElementById('lname').value.trim();
  var email = document.getElementById('email').value.trim();
  var phone = document.getElementById('phone').value.trim();

  var valid = true;
  valid = setError('fname', 'fname-err', fname.length < 2) && valid;
  valid = setError('lname', 'lname-err', lname.length < 2) && valid;
  valid = setError('email', 'email-err', !validateEmail(email)) && valid;
  valid = setError('phone', 'phone-err', !validatePhone(phone)) && valid;

  if (!valid) return;

  // Afișează mesajul de succes
  form.style.display = 'none';
  var successDiv = document.getElementById('form-success');
  document.getElementById('success-name').textContent = fname + ' ' + lname;
  successDiv.style.display = 'block';

  // Scroll la success
  successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
});


/* ────────────────────────────────────────
   7. EFECT TIPĂRIT în header (typewriter)
──────────────────────────────────────── */
var headerP = document.querySelector('header p');
var originalText = headerP.textContent;
headerP.textContent = '';
var charIndex = 0;

function typeWriter() {
  if (charIndex < originalText.length) {
    headerP.textContent += originalText.charAt(charIndex);
    charIndex++;
    setTimeout(typeWriter, 28);
  }
}

// Pornește după 600ms
setTimeout(typeWriter, 600);
