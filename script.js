(function(){
  'use strict';

  /* ---------- шапка при скролле ---------- */
  var header = document.querySelector('.site-header');
  function onScroll(){ header.classList.toggle('scrolled', window.scrollY > 24); }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------- мобильное меню ---------- */
  var burger = document.querySelector('.burger');
  var mobileLinks = document.querySelectorAll('.mobile-menu a');
  burger.addEventListener('click', function(){
    var open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
    var label = open ? burger.dataset.labelClose : burger.dataset.labelOpen;
    if (label) burger.setAttribute('aria-label', label);
  });
  mobileLinks.forEach(function(link){
    link.addEventListener('click', function(){
      document.body.classList.remove('menu-open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- reveal при появлении во вьюпорте ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealEls = document.querySelectorAll('[data-reveal]');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach(function(el){ el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(function(el){ io.observe(el); });
  }

  /* ---------- слайдер отзывов ---------- */
  var track = document.querySelector('.reviews-track');
  if (track) {
    var sliderBtns = document.querySelectorAll('.slider-btn');
    var cardStep = function(){
      var card = track.querySelector('.review-card');
      var gap = parseFloat(getComputedStyle(track).columnGap) || 0;
      return card.getBoundingClientRect().width + gap;
    };
    sliderBtns.forEach(function(btn){
      btn.addEventListener('click', function(){
        track.scrollBy({ left: cardStep() * Number(btn.dataset.dir), behavior: 'smooth' });
      });
    });
    var updateSlider = function(){
      var max = track.scrollWidth - track.clientWidth - 1;
      sliderBtns[0].disabled = track.scrollLeft <= 1;
      sliderBtns[1].disabled = track.scrollLeft >= max;
    };
    track.addEventListener('scroll', updateSlider, { passive:true });
    window.addEventListener('resize', updateSlider);
    updateSlider();
  }

  /* ---------- «читать полностью» + попап ---------- */
  var modal = document.querySelector('.review-modal');
  if (modal) {
    var modalText = modal.querySelector('.modal-text');
    var modalName = modal.querySelector('.modal-name');
    var lastFocus = null;

    var openModal = function(card){
      modalText.textContent = card.querySelector('.review-text').textContent.trim();
      modalName.textContent = card.querySelector('.review-name').textContent;
      lastFocus = document.activeElement;
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      modal.querySelector('.modal-close').focus();
    };
    var closeModal = function(){
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastFocus) lastFocus.focus();
    };

    document.querySelectorAll('.review-more').forEach(function(btn){
      btn.addEventListener('click', function(){ openModal(btn.closest('.review-card')); });
    });
    modal.querySelectorAll('[data-close]').forEach(function(el){
      el.addEventListener('click', closeModal);
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });

    /* прячем «читать полностью» у отзывов, которые поместились целиком */
    var updateMoreBtns = function(){
      document.querySelectorAll('.review-card').forEach(function(card){
        var text = card.querySelector('.review-text');
        var btn = card.querySelector('.review-more');
        if (text && btn) btn.hidden = text.scrollHeight <= text.clientHeight + 2;
      });
    };
    window.addEventListener('load', updateMoreBtns);
    window.addEventListener('resize', updateMoreBtns);
    updateMoreBtns();
  }

  /* ---------- аккордеон FAQ ---------- */
  document.querySelectorAll('.faq-q').forEach(function(btn){
    btn.addEventListener('click', function(){
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(function(other){
        other.classList.remove('open');
        other.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();
