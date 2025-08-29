// Counter Animation
function animateCounter(element, target, duration) {
  let start = 0;
  let stepTime = Math.abs(Math.floor(duration / target));
  let timer = setInterval(() => {
    start++;
    element.textContent = start + (element.dataset.target.endsWith('+') ? '+' : '%');
    if (start >= target) clearInterval(timer);
  }, stepTime);
}

// Intersection Observer to trigger when visible
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const counters = document.querySelectorAll(".stat b");
      counters.forEach(counter => {
        let target = parseInt(counter.getAttribute("data-target"));
        animateCounter(counter, target, 1500);
      });
      observer.disconnect(); // Run once
    }
  });
}, { threshold: 0.5 });

observer.observe(document.querySelector(".stats"));


(function () {
  // Guard: IntersectionObserver support
  if (typeof window.IntersectionObserver !== "function") {
    // If not supported, just show everything (no animation) to avoid errors.
    document.querySelectorAll('.folio, .about > div').forEach(function (el) {
      el.classList.add('show');
      el.style.transitionDelay = '0s';
    });
    return;
  }

  // Create one observer for all reveal elements
  const io = new IntersectionObserver(function (entries, observer) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  // Collect elements and apply staggered delays per section
  const revealEls = document.querySelectorAll('.folio, .about > div');
  Array.prototype.forEach.call(revealEls, function (el, i) {
    // Stagger: 110ms * index (cap to keep reasonable)
    const delay = Math.min(i * 150, 1500);
    el.style.transitionDelay = delay + 'ms';
    io.observe(el);
  });
})();


// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // close mobile menu
      document.getElementById('menu')?.classList.remove('open');
    }
  })
});

// Mobile menu toggle
function toggleMenu() { document.getElementById('menu').classList.toggle('open'); }

// Testimonials slider
const slides = document.getElementById('slides');
let index = 0;
function next() { index = Math.min(index + 1, slides.children.length - 1); slides.scrollTo({ left: slides.clientWidth * index, behavior: 'smooth' }); }
function prev() { index = Math.max(index - 1, 0); slides.scrollTo({ left: slides.clientWidth * index, behavior: 'smooth' }); }
// Auto-advance
setInterval(() => { index = (index + 1) % slides.children.length; slides.scrollTo({ left: slides.clientWidth * index, behavior: 'smooth' }); }, 6000);

// Contact form (frontend-only demo)
function handleSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const note = document.getElementById('formNote');
  if (!name || !email) { note.textContent = "Please enter your name and a valid email."; note.style.color = "crimson"; return false; }
  // Simulate success + store to localStorage for now
  const payload = {
    name, email,
    service: document.getElementById('service').value,
    message: document.getElementById('message').value,
    ts: new Date().toISOString()
  };
  const key = "c9-leads";
  const data = JSON.parse(localStorage.getItem(key) || "[]");
  data.push(payload);
  localStorage.setItem(key, JSON.stringify(data));
  note.textContent = "Thanks! Your message has been received. We’ll reach out shortly.";
  note.style.color = "green";
  e.target.reset();
  return false;
}

// Cookie banner
const cookieBox = document.getElementById('cookie');
const cookieKey = "c9-cookie-consent";
function showCookie() {
  if (!localStorage.getItem(cookieKey)) {
    cookieBox.style.display = "block";
  }
}
function hideCookie(accepted) {
  localStorage.setItem(cookieKey, accepted ? "accepted" : "denied");
  cookieBox.style.display = "none";
}

// document.addEventListener("contextmenu", e => e.preventDefault());
// document.addEventListener("keydown", e => {
//   if (e.key === "F12" || (e.ctrlKey && e.shiftKey && e.key === "I")) e.preventDefault();
// });

setTimeout(showCookie, 600);

// Year
document.getElementById('year').textContent = new Date().getFullYear();
