## Why

Aktuell muss die jeweils passende Monatsseite manuell veröffentlicht und die vorherige Seite manuell zurückgezogen werden. Ein automatischer Monatswechsel reduziert Betriebsaufwand und verhindert veraltete oder doppelte Monatsinhalte auf der Website.

## What Changes

- Einführung eines zeitgesteuerten Monatswechsel-Workflows, der am 1. Kalendertag automatisch die neue Monatsseite veröffentlicht.
- Automatisches Zurückziehen der zuvor aktiven Monatsseite im selben Lauf, damit immer genau eine Monatsseite aktiv ist.
- Definition von Regeln für die Zuordnung Monat → Zielseite sowie für das Verhalten bei fehlender Monatsseite.
- Ergänzung von Nachvollziehbarkeit durch klare Ergebnis- und Fehlermeldungen für den Monatswechsel.

## Capabilities

### New Capabilities
- `monthly-page-publication-automation`: Automatische Aktivierung der aktuellen Monatsseite und Deaktivierung der vorherigen Monatsseite zum Monatsbeginn inklusive Fallback- und Fehlerregeln.

### Modified Capabilities
- None.

## Impact

- Affected code: Build-/Publish-Logik für Seitenstatus und ggf. vorhandene Content-Skripte.
- APIs/Systems: Zeitsteuerung (z. B. Cron/Scheduler in Hosting oder CI) und ggf. WordPress-/Content-Quelle für Veröffentlichungsstatus.
- Operations: Weniger manuelle Eingriffe; regelmäßige automatische Ausführung am Monatsersten.