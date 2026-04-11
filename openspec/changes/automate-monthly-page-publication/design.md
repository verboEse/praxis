## Context

Die Website arbeitet mit monatsspezifischen Inhalten, bei denen jeweils eine Monatsseite aktiv sein soll. Bisher erfolgt die Umstellung manuell, was zu verspaeteten Wechseln, doppelter Sichtbarkeit oder fehlender aktueller Monatsseite fuehren kann.

Der Change fuehrt eine automatisierte Umschaltung am ersten Tag jedes Monats ein. Die Loesung muss in die bestehende Build-/Deployment-Umgebung passen (Eleventy-Website, vorhandene Skripte und ggf. externe Content-Quelle) und mit minimalem Betriebsaufwand stabil laufen.

## Goals / Non-Goals

**Goals:**
- Am Monatsersten automatisiert die Zielseite fuer den aktuellen Monat veroeffentlichen.
- Die zuvor aktive Monatsseite im selben Lauf deaktivieren, sodass genau eine Monatsseite aktiv ist.
- Deterministische Zuordnung zwischen Monat und Zielseite bereitstellen.
- Robustes Verhalten bei Sonderfaellen (fehlende Seite, Ausfuehrungsfehler) und nachvollziehbare Protokollierung.

**Non-Goals:**
- Keine inhaltliche Generierung neuer Monatsbeitraege.
- Keine Aenderung des redaktionellen Workflows fuer die Erstellung der Monatsseiten.
- Keine Echtzeit-Umschaltung waehrend des Tages; eine geplante Batch-Ausfuehrung reicht aus.

## Decisions

1. Scheduler-gesteuerte Ausfuehrung statt manueller Schalter
- Entscheidung: Ein geplanter Job (z. B. CI-Schedule oder Hosting-Cron) startet den Monatswechsel am 1. Tag.
- Warum: Entkoppelt die Ausfuehrung von menschlicher Verfuegbarkeit und reduziert Bedienfehler.
- Alternative: Manueller Trigger durch Redaktion. Verworfen wegen hoher Fehleranfaelligkeit.

2. Explizites Mapping Monat -> Seitenkennung
- Entscheidung: Monat wird ueber ein klares Mapping auf genau eine Zielseite abgebildet.
- Warum: Verhindert uneindeutige Auswahl und macht Verhalten testbar.
- Alternative: Heuristische Auswahl ueber Datumsstrings in Titeln/Slugs. Verworfen wegen Fragilitaet.

3. Zwei-Phasen-Umschaltung in einem Lauf
- Entscheidung: Zuerst neue Monatsseite aktivieren, danach vorherige deaktivieren; bei Fehlern klarer Abbruch mit Logging.
- Warum: Stellt sicher, dass der Zielzustand konsistent ist und Ausfaelle sichtbar bleiben.
- Alternative: Nur aktivieren ohne explizites Deaktivieren. Verworfen, da mehrere aktive Monatsseiten moeglich waeren.

4. Idempotente Ausfuehrung
- Entscheidung: Mehrfaches Ausfuehren am selben Tag darf den Endzustand nicht veraendern oder verschlechtern.
- Warum: Scheduler-Retries und manuelle Wiederholungen muessen sicher sein.
- Alternative: Nicht-idempotente Einmal-Logik. Verworfen wegen Betriebsrisiko.

## Risks / Trade-offs

- [Monatsseite fehlt oder ist unvollstaendig] -> Mitigation: Validierung vor Umschaltung; Lauf mit Fehlerstatus und eindeutiger Meldung beenden.
- [Scheduler laeuft zu spaet/frueh wegen Zeitzone] -> Mitigation: Zeitzone explizit konfigurieren und in Logs ausgeben.
- [Teilweiser Fehler in externer Quelle/API] -> Mitigation: Retries mit begrenzter Anzahl; keine stillen Fehler.
- [Technischer Mehraufwand fuer robuste Logs/Checks] -> Mitigation: Schlanke, strukturierte Logfelder und klare Exit-Codes.

## Migration Plan

1. Mapping und Umschaltlogik in bestehende Skript-/Build-Struktur integrieren.
2. Trockenlauf gegen Testdaten ausfuehren und erwarteten Zielzustand pruefen.
3. Scheduler auf monatliche Ausfuehrung konfigurieren.
4. Ersten produktiven Lauf begleiten und Ergebnis protokolliert verifizieren.
5. Rollback: Scheduler deaktivieren und bei Bedarf manuelle Umschaltung verwenden.

## Open Questions

- Wo wird die Publikationswahrheit final gesetzt (lokale Content-Dateien, CMS/WordPress, oder beides)?
- Welche genaue Zeitzone ist fachlich gewuenscht (z. B. Europe/Berlin)?
- Soll bei fehlender Zielseite der Vormonat aktiv bleiben oder ein harter Fehler erzwungen werden?