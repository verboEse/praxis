/**
 * Posts Carousel Navigation
 * Handles navigation through blog posts with arrow buttons and dot indicators
 */

(function() {
  const carousel = document.querySelector('.posts-carousel');
  const slides = document.querySelectorAll('.carousel-post');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dots = document.querySelectorAll('.carousel-dot');

  if (!carousel || slides.length === 0) {
    return;
  }

  let currentIndex = 0;

  /**
   * Show slide at given index
   */
  function showSlide(index) {
    // Wrap around
    if (index >= slides.length) {
      currentIndex = 0;
    } else if (index < 0) {
      currentIndex = slides.length - 1;
    } else {
      currentIndex = index;
    }

    // Update active slide
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    // Update active dot
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });

    // Update button states
    updateButtonStates();
  }

  /**
   * Update button disabled states (optional: disable at boundaries)
   * This creates a loop by default (remove this to disable wrapping)
   */
  function updateButtonStates() {
    // Always enabled for loop behavior
    prevBtn.disabled = false;
    nextBtn.disabled = false;
  }

  /**
   * Navigate to previous slide
   */
  function prevSlide() {
    showSlide(currentIndex - 1);
  }

  /**
   * Navigate to next slide
   */
  function nextSlide() {
    showSlide(currentIndex + 1);
  }

  /**
   * Event listeners
   */
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
    });
  });

  // Keyboard navigation (arrow keys)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
    }
  });

  // Initialize: show first slide
  showSlide(0);
})();
