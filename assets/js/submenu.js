/**
 * Submenu accessibility handler
 * Manages aria-expanded for keyboard navigation.
 * CSS display:none already removes hidden submenus from both tab order
 * and the accessibility tree — aria-hidden is not needed on display:none elements.
 */

document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.querySelector('.menu-toggle');
  const mainNavigation = document.querySelector('#main-navigation');

  if (menuToggle && mainNavigation) {
    menuToggle.addEventListener('click', () => {
      const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
      menuToggle.setAttribute('aria-expanded', String(!expanded));
      mainNavigation.classList.toggle('is-open', !expanded);
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        menuToggle.setAttribute('aria-expanded', 'false');
        mainNavigation.classList.remove('is-open');
      }
    });
  }

  const menuItems = document.querySelectorAll('.has-submenu');

  menuItems.forEach(item => {
    const link = item.querySelector('a[aria-expanded]');
    const submenu = item.querySelector('.submenu');

    if (!link || !submenu) return;

    // Update aria-expanded to reflect open state
    function setExpanded(expanded) {
      link.setAttribute('aria-expanded', String(expanded));
    }

    link.addEventListener('focus', () => setExpanded(true));

    item.addEventListener('mouseleave', () => setExpanded(false));

    item.addEventListener('focusout', () => {
      // Defer so focus can move within the submenu first
      setTimeout(() => {
        if (!item.contains(document.activeElement)) {
          setExpanded(false);
        }
      }, 0);
    });

    // Close submenu on Escape, return focus to trigger
    submenu.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setExpanded(false);
        link.focus();
      }
    });
  });
});
