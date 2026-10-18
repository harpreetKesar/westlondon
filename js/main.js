(function () {
  'use strict';

  // Sticky header shadow + back-to-top visibility
  var header = document.getElementById('siteHeader');
  var toTop = document.getElementById('backToTop');
  function onScroll() {
    var y = window.scrollY || window.pageYOffset;
    if (header) header.classList.toggle('scrolled', y > 10);
    if (toTop) toTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  if (toTop) {
    toTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Mobile navigation drawer
  var toggle = document.getElementById('navToggle');
  var drawer = document.getElementById('mobileNav');
  function setMenu(open) {
    if (!drawer || !toggle) return;
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      var closeBtn = drawer.querySelector('.nav-close');
      if (closeBtn) closeBtn.focus();
    } else {
      toggle.focus({ preventScroll: true });
    }
  }
  if (toggle && drawer) {
    toggle.addEventListener('click', function () { setMenu(true); });
    drawer.querySelectorAll('[data-close]').forEach(function (el) {
      el.addEventListener('click', function () { setMenu(false); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && drawer.classList.contains('open')) setMenu(false);
    });
    window.addEventListener('resize', function () {
      if (window.innerWidth > 960 && drawer.classList.contains('open')) setMenu(false);
    });
  }

  // Highlight the menu item for the section currently in view (home page)
  var navLinks = document.querySelectorAll('.main-nav a, .mobile-nav-links a');
  var spySections = [];
  navLinks.forEach(function (a) {
    var hash = a.getAttribute('href').split('#')[1];
    var sec = hash && document.getElementById(hash);
    if (sec && spySections.indexOf(sec) === -1) spySections.push(sec);
  });
  spySections.sort(function (a, b) {
    return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
  });
  function setActive(id) {
    navLinks.forEach(function (a) {
      var href = a.getAttribute('href');
      var isHome = href === 'index.html' || href === './' || href === '#top';
      var match = id ? href.split('#')[1] === id : isHome;
      a.classList.toggle('active', match);
      if (match) a.setAttribute('aria-current', id ? 'location' : 'page');
      else a.removeAttribute('aria-current');
    });
  }
  function spy() {
    var offset = (header ? header.offsetHeight : 0) + 120;
    var current = null;
    spySections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= offset) current = sec.id;
    });
    // Last section may never reach the offset line; treat bottom of page as last section
    if ((window.innerHeight + window.scrollY) >= document.documentElement.scrollHeight - 4 && spySections.length) {
      current = spySections[spySections.length - 1].id;
    }
    setActive(current);
  }
  if (spySections.length) {
    window.addEventListener('scroll', spy, { passive: true });
    window.addEventListener('load', spy);
    spy();
  }

  // Reveal on scroll
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  // Footer year
  document.querySelectorAll('[data-year]').forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  // Enquiry form: validate, then open the visitor's email app with the details filled in
  var form = document.getElementById('enquiryForm');
  if (form) {
    var status = document.getElementById('formStatus');
    function showStatus(msg, ok) {
      status.textContent = msg;
      status.className = 'form-status show ' + (ok ? 'ok' : 'err');
    }
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var fields = {
        name: form.elements.name,
        phone: form.elements.phone,
        email: form.elements.email,
        service: form.elements.service,
        details: form.elements.details
      };
      var valid = true;
      ['name', 'phone', 'details'].forEach(function (k) {
        var bad = !fields[k].value.trim();
        fields[k].classList.toggle('invalid', bad);
        if (bad) valid = false;
      });
      var email = fields.email.value.trim();
      var badEmail = email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      fields.email.classList.toggle('invalid', !!badEmail);
      if (badEmail) valid = false;

      if (!valid) {
        showStatus('Please fill in the highlighted fields.', false);
        var firstBad = form.querySelector('.invalid');
        if (firstBad) firstBad.focus();
        return;
      }

      var subject = 'Website enquiry' + (fields.service.value ? ' – ' + fields.service.value : '');
      var body =
        'Name: ' + fields.name.value.trim() + '\n' +
        'Phone: ' + fields.phone.value.trim() + '\n' +
        'Email: ' + (email || '-') + '\n' +
        'Service: ' + (fields.service.value || '-') + '\n\n' +
        'Job details:\n' + fields.details.value.trim();

      window.location.href = 'mailto:info@westlondonelectricalservices.co.uk' +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);

      showStatus('Thanks! Your email app should open with your enquiry ready to send. If it doesn\'t, call us on 073 5557 3777.', true);
    });
    form.querySelectorAll('input, textarea').forEach(function (el) {
      el.addEventListener('input', function () { el.classList.remove('invalid'); });
    });
  }
})();
