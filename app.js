(() => {
  'use strict';

  const arrival = document.querySelector('#arrival');
  const reading = document.querySelector('#letter');
  const openButton = document.querySelector('#open-button');
  const envelopeTrigger = document.querySelector('#envelope-trigger');
  const backButton = document.querySelector('#back-button');
  const letterTitle = document.querySelector('#letter-title');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const gsap = window.gsap;
  let busy = false;
  let timeline;
  let lastTrigger = openButton;

  // Without JavaScript, both sections remain available and the links are anchors.
  reading.hidden = true;

  function resetEnvelope() {
    if (!gsap) return;
    gsap.set(['.wax-seal', '.envelope-flap', '.letter-peek', '.envelope-trigger', '.intro', '.opening-controls', '.arrival-footer'], { clearProps: 'all' });
  }

  function revealLetter(animate) {
    arrival.hidden = true;
    arrival.inert = false;
    reading.hidden = false;
    window.scrollTo(0, 0);
    letterTitle.focus({ preventScroll: true });
    if (animate && gsap) {
      timeline = gsap.timeline({ onComplete: () => { busy = false; } })
        .fromTo('.letter-paper', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: .65, ease: 'power3.out', clearProps: 'transform,opacity' })
        .fromTo('.reading-toolbar, .reading-footer', { opacity: 0 }, { opacity: 1, duration: .3, stagger: .05, clearProps: 'opacity' }, .2);
    } else {
      busy = false;
    }
  }

  function openLetter(event) {
    event.preventDefault();
    if (busy || !reading.hidden) return;
    lastTrigger = event.currentTarget;
    busy = true;
    // Keyboard users and reduced-motion users get the letter immediately.
    if (!gsap || reduceMotion.matches || event.detail === 0) {
      revealLetter(false);
      return;
    }
    arrival.inert = true;
    timeline = gsap.timeline({ onComplete: () => revealLetter(true) })
      .to('.wax-seal', { opacity: 0, scale: 1.08, duration: .2, ease: 'power2.out' })
      .to('.envelope-flap', { rotationX: -180, duration: .55, ease: 'power2.inOut' }, .1)
      .set('.envelope-flap', { zIndex: 0 }, .38)
      .to('.letter-peek', { yPercent: -36, duration: .55, ease: 'power3.out' }, .42)
      .to('.intro, .opening-controls, .arrival-footer', { opacity: 0, duration: .25 }, .63)
      .to('.envelope-trigger', { y: 28, opacity: 0, duration: .3, ease: 'power2.inOut' }, .85);
  }

  function closeLetter(event) {
    event.preventDefault();
    if (busy) return;
    timeline?.kill();
    reading.hidden = true;
    arrival.hidden = false;
    resetEnvelope();
    window.scrollTo(0, 0);
    lastTrigger.focus({ preventScroll: true });
  }

  openButton.addEventListener('click', openLetter);
  envelopeTrigger.addEventListener('click', openLetter);
  backButton.addEventListener('click', closeLetter);

  // A change to the OS preference mid-transition must not leave a half-open page.
  reduceMotion.addEventListener('change', () => {
    if (reduceMotion.matches && busy) {
      timeline?.kill();
      if (gsap) gsap.set('.letter-paper, .reading-toolbar, .reading-footer', { clearProps: 'all' });
      revealLetter(false);
    }
  });

  if (location.hash === '#letter') revealLetter(false);
  else if (gsap && !reduceMotion.matches) {
    gsap.from('.intro', { y: 12, opacity: 0, duration: .7, ease: 'power3.out' });
    gsap.from('.envelope-trigger', { y: 16, opacity: 0, duration: .85, ease: 'power3.out', delay: .08 });
  }
})();
