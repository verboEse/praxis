// Lightbox navigation with arrow keys
(function () {
  const lightboxes = Array.from(document.querySelectorAll('.lightbox'));
  const totalImages = lightboxes.length;

  if (totalImages === 0) return;

  // Get current lightbox index from URL hash
  function getCurrentIndex() {
    const hash = window.location.hash;
    if (!hash) return -1;

    const currentLightbox = document.querySelector(hash);
    if (!currentLightbox || !currentLightbox.classList.contains('lightbox')) return -1;

    return lightboxes.indexOf(currentLightbox);
  }

  // Navigate to image by index
  function navigateToImage(index) {
    if (index < 0 || index >= totalImages) return;
    window.location.hash = lightboxes[index].id;
  }

  // Handle keyboard events
  document.addEventListener('keydown', function (e) {
    const currentIndex = getCurrentIndex();
    if (currentIndex === -1) return; // No lightbox is open

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        const prevIndex = currentIndex > 0 ? currentIndex - 1 : totalImages - 1;
        navigateToImage(prevIndex);
        break;

      case 'ArrowRight':
        e.preventDefault();
        const nextIndex = currentIndex < totalImages - 1 ? currentIndex + 1 : 0;
        navigateToImage(nextIndex);
        break;

      case 'Escape':
        e.preventDefault();
        window.location.hash = '';
        break;
    }
  });

  // Add navigation arrows to lightboxes
  lightboxes.forEach((lightbox, index) => {
    const prevIndex = index > 0 ? index - 1 : totalImages - 1;
    const nextIndex = index < totalImages - 1 ? index + 1 : 0;

    // Create previous arrow
    const prevArrow = document.createElement('a');
    prevArrow.href = '#' + lightboxes[prevIndex].id;
    prevArrow.className = 'lightbox-nav lightbox-prev';
    prevArrow.innerHTML = '‹';
    prevArrow.setAttribute('aria-label', 'Vorheriges Bild');

    // Create next arrow
    const nextArrow = document.createElement('a');
    nextArrow.href = '#' + lightboxes[nextIndex].id;
    nextArrow.className = 'lightbox-nav lightbox-next';
    nextArrow.innerHTML = '›';
    nextArrow.setAttribute('aria-label', 'Nächstes Bild');

    // Insert arrows into lightbox
    lightbox.appendChild(prevArrow);
    lightbox.appendChild(nextArrow);
  });
})();
