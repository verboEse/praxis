/**
 * Consent Management für Vercel Speed Insights
 * Speichert Einwilligung in localStorage
 */

(function() {
  'use strict';

  const CONSENT_KEY = 'vercel_speed_insights_consent';
  const CONSENT_GRANTED = 'granted';
  const CONSENT_DENIED = 'denied';

  /**
   * Aktuellen Consent-Status abrufen
   * @returns {string|null} 'granted', 'denied' oder null
   */
  function getConsent() {
    try {
      return localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      console.warn('localStorage nicht verfügbar:', e);
      return null;
    }
  }

  /**
   * Consent-Status speichern
   * @param {string} status - 'granted' oder 'denied'
   */
  function setConsent(status) {
    try {
      localStorage.setItem(CONSENT_KEY, status);
    } catch (e) {
      console.warn('Fehler beim Speichern der Einwilligung:', e);
    }
  }

  /**
   * Prüft, ob Einwilligung erteilt wurde
   * @returns {boolean}
   */
  function hasConsent() {
    return getConsent() === CONSENT_GRANTED;
  }

  /**
   * Speed Insights Script laden
   */
  function loadSpeedInsights() {
    // Prüfen ob bereits geladen
    if (document.querySelector('script[src*="speed-insights"]')) {
      return;
    }

    const script = document.createElement('script');
    script.src = '/_vercel/speed-insights/script.js';
    script.defer = true;
    document.body.appendChild(script);
  }

  /**
   * Speed Insights Script entfernen
   */
  function removeSpeedInsights() {
    const script = document.querySelector('script[src*="speed-insights"]');
    if (script) {
      script.remove();
    }
  }

  /**
   * Consent-Banner anzeigen
   */
  function showConsentBanner() {
    // Banner-HTML erstellen falls nicht vorhanden
    if (document.getElementById('consent-banner')) {
      document.getElementById('consent-banner').style.display = 'block';
      return;
    }

    const banner = document.createElement('div');
    banner.id = 'consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-labelledby', 'consent-title');
    banner.setAttribute('aria-describedby', 'consent-message');
    
    banner.innerHTML = `
      <div class="consent-content">
        <h2 id="consent-title">Datenschutzeinstellungen</h2>
        <p id="consent-message">
          Wir möchten die technische Performance unserer Website mit Vercel Speed Insights analysieren.
          Dabei werden technische Daten wie Ladezeiten und Performance-Kennzahlen erfasst.
          Ihre Einwilligung ist freiwillig und kann jederzeit widerrufen werden.
        </p>
        <div class="consent-buttons">
          <button id="consent-accept" class="consent-btn consent-btn-primary">
            Einwilligen
          </button>
          <button id="consent-deny" class="consent-btn consent-btn-secondary">
            Ablehnen
          </button>
        </div>
      </div>
    `;
    
    document.body.appendChild(banner);

    // Event-Listener für Buttons
    document.getElementById('consent-accept').addEventListener('click', function() {
      setConsent(CONSENT_GRANTED);
      loadSpeedInsights();
      banner.style.display = 'none';
    });

    document.getElementById('consent-deny').addEventListener('click', function() {
      setConsent(CONSENT_DENIED);
      removeSpeedInsights();
      banner.style.display = 'none';
    });
  }

  /**
   * Consent-Einstellungen zurücksetzen (für Widerruf)
   */
  function resetConsent() {
    try {
      localStorage.removeItem(CONSENT_KEY);
      removeSpeedInsights();
      showConsentBanner();
    } catch (e) {
      console.warn('Fehler beim Zurücksetzen der Einwilligung:', e);
    }
  }

  // Auf globales Objekt verfügbar machen
  window.ConsentManager = {
    getConsent: getConsent,
    setConsent: setConsent,
    hasConsent: hasConsent,
    showConsentBanner: showConsentBanner,
    resetConsent: resetConsent
  };

  // Bei Seitenaufruf prüfen
  document.addEventListener('DOMContentLoaded', function() {
    const consent = getConsent();
    
    if (consent === null) {
      // Noch keine Entscheidung getroffen
      showConsentBanner();
    } else if (consent === CONSENT_GRANTED) {
      // Einwilligung erteilt
      loadSpeedInsights();
    }
    // Bei CONSENT_DENIED: nichts laden
  });

})();
