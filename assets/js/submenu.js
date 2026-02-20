/**
 * Submenu accessibility handler
 * Manages aria-expanded and aria-hidden attributes for keyboard navigation
 */

document.addEventListener('DOMContentLoaded', () => {
  const menuItems = document.querySelectorAll('.has-submenu');

  menuItems.forEach(item => {
    const link = item.querySelector('a');
    const submenu = item.querySelector('.submenu');

    if (!link || !submenu) return;

    // Show/hide submenu on focus
    link.addEventListener('focus', () => {
      link.setAttribute('aria-expanded', 'true');
      submenu.setAttribute('aria-hidden', 'false');
    });

    // Hide submenu on blur (if focus leaves the parent)
    item.addEventListener('mouseleave', () => {
      link.setAttribute('aria-expanded', 'false');
      submenu.setAttribute('aria-hidden', 'true');
    });

    item.addEventListener('focusout', (e) => {
      // Only hide if focus doesn't move to another element within the menu item
      setTimeout(() => {
        if (!item.contains(document.activeElement)) {
          link.setAttribute('aria-expanded', 'false');
          submenu.setAttribute('aria-hidden', 'true');
        }
      }, 0);
    });

    // Show/hide submenu on Enter/Space
    link.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const isExpanded = link.getAttribute('aria-expanded') === 'true';
        link.setAttribute('aria-expanded', !isExpanded);
        submenu.setAttribute('aria-hidden', isExpanded);
      }
    });

    // Close submenu on Escape
    submenu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        link.setAttribute('aria-expanded', 'false');
        submenu.setAttribute('aria-hidden', 'true');
        link.focus();
      }
    });
  });
});
