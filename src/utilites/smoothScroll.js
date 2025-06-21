// Smooth scroll utility with customizable duration, easing, and offset.

const easings = {
  linear: t => t,
  easeInQuad: t => t * t,
  easeOutQuad: t => t * (2 - t),
  easeInOutQuad: t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2),
  easeInCubic: t => t * t * t,
  easeOutCubic: t => 1 - Math.pow(1 - t, 3),
  easeInOutCubic: t =>
    t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2,
};

// /**
//  * Smoothly scrolls the page to the given target element or Y position.
//  *
//  * @param {Element|number} target - DOM element or Y offset to scroll to.
//  * @param {Object} options
//  * @param {number} [options.duration=1500] - Duration of the scroll in milliseconds.
//  * @param {string} [options.easing='easeOutCubic'] - Easing function name.
//  * @param {number} [options.offset=0] - Additional offset (in pixels) from the top.
//  */
function smoothScroll(target, options = {}) {
  const {
    duration = 1500,
    easing = 'easeOutCubic',
    offset = 0,
  } = options;

  const startY = window.pageYOffset;
  const targetY =
    typeof target === 'number'
      ? target + offset
      : target.getBoundingClientRect().top + window.pageYOffset + offset;
  const distance = targetY - startY;
  const startTime = performance.now();
  const easeFunc = easings[easing] || easings.easeOutCubic;

  function step(currentTime) {
    const timeElapsed = currentTime - startTime;
    const progress = Math.min(timeElapsed / duration, 1);
    const eased = easeFunc(progress);

    window.scrollTo(0, startY + distance * eased);

    if (timeElapsed < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

export default smoothScroll;
