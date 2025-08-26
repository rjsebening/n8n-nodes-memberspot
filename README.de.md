
# n8n-nodes-memberspot

  

[![n8n](https://img.shields.io/badge/n8n-1.107.3%2B-brightgreen)](https://n8n.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
![Memberspot Node](https://img.shields.io/badge/n8n-community--node-FF6D5A)

  

Eine n8n Community Node für die **Memberspot API**, die es ermöglicht, deine Memberspot Instanz nahtlos in n8n Workflows zu integrieren.

  

## Was ist n8n?

  

n8n ist ein einfach zu bedienendes Tool, mit dem du Aktionen zwischen verschiedenen Web-Apps, wie Memberspot, automatisieren kannst.

  

Das Erstellen von sogenannten "Workflows" zwischen Apps automatisiert viele der manuellen Aufgaben.

  

So kannst du dir oder deinem Team enorm viel Zeit sparen.

  

## ⚖️ Rechtlicher Hinweis

  

Diese Community Node verwendet die öffentliche Memberspot API und ist nicht mit Memberspot verbunden oder von Memberspot gesponsert.

  

Alle Markenzeichen gehören ihren jeweiligen Eigentümern.

  

**Hinweis**: Dies ist eine von der Community entwickelte Node für die Memberspot API. Für offiziellen Support wende dich bitte direkt an Memberspot.

  

## 🚀 Features

  

-  **5 Ressourcen** vollständig unterstützt (User, Offer, Chapter, Exam, Custom Property)

  

-  **11+ Operationen** für maximale Flexibilität

  

-  **Dropdown-Auswahl** für Offers mit Live-Abfrage via `/v1/offers`

  

-  **TypeScript** Implementation für beste Entwicklererfahrung

  

-  **Einfache Authentifizierung** via API Key

  

## 📋 Unterstützte Operationen

  

### 👤 **User**

  

- List Users

  

- Find by Email

  

- Grant Offer by Email (inkl. `firstname`, `lastname`, `email`, `offerId`, `orderId`)

  

- Set Offer State (aktiv/inaktiv)

  

- Set Order State (aktiv/inaktiv)

  

- Set Custom Properties

  

- Delete Users

  

- List Course Progress

  

- Get Course Progress (für spezifischen Kurs)

  

- Get Login Token

  

### 🎁 **Offer**

  

- Get All Offers

  

### 📚 **Chapter**

  

- Enable Chapter Access

  

### 🛠 **Custom Property**

  

- List Custom User Properties

  

### 📝 **Exam**

  

- List Exam Results

  

## 💡 Beispiele für Anwendungsfälle

  

### Automatisierte Mitgliederverwaltung

  

Lege automatisiert neue Mitglieder an und weise ihnen Offers zu – ganz ohne manuelle Eingaben im Memberspot Backend.

  

### E-Commerce Integration

  

Verbinde Copecart, Digistore oder Stripe per Webhook mit n8n und vergebe nach dem Kauf automatisch Zugriff auf Kurse und Offers in Memberspot.

  

### Fortschritts-Monitoring

  

Überwache automatisch den Lernfortschritt deiner Teilnehmer und sende personalisierte Erinnerungen oder Glückwünsche.

  

### Single-Sign-On Links

  

Erzeuge per Workflow Login-Links für User und verschicke diese automatisch per E-Mail oder Messenger.

  

## 🛠️ Installation

  

> Sie können **unscoped** oder **scoped** installieren. Scoped wird empfohlen.

  

### A) Bereichsunabhängig (Community-Nodes-Benutzeroberfläche)

 1. Öffnen Sie **Einstellungen → Community-Nodes** in n8n

2. Installieren Sie: `n8n-nodes-memberspot`

3. Starten Sie n8n neu


### B) Unscoped (Standard)

```bash

# in Ihrem n8n-Datenverzeichnis (z. B. /home/node/.n8n oder eine bind-gemountete /data-Datei)

npm  i  n8n-nodes-memberspot

```

  

### C) Scoped (persönliches Scope)

  

```bash

npm  i  @rjsebening/n8n-nodes-memberspot

```

  

### D) Docker-Schnellstart

  

```bash
docker  run  -it  --rm  \

--name  n8n  \

-p  5678:5678  \

-e  N8N_CUSTOM_EXTENSIONS="/data/custom"  \

-v  ~/.n8n:/data  \

docker.n8n.io/n8nio/n8n

# Anschließend im gemounteten Verzeichnis /data/custom:

# npm i n8n-nodes-memberspot (oder @rjsebening/n8n-nodes-memberspot)

```

  

Starten Sie n8n nach der Installation neu.

  

## 🔐 Authentifizierung einrichten

  

### API Key generieren

  

1. Melde dich in deiner **Memberspot Instanz** an: [https://app.memberspot.de](https://app.memberspot.de)

  

2. Gehe zu **Einstellungen** → **Integrationen**

  

3. Im Bereich **API Keys** auf **"API Key erstellen"** klicken

  

4. Kopiere den generierten API Key (Secret wird nur **einmalig** angezeigt!)

  

### Credentials in n8n konfigurieren

  

1. Öffne n8n und gehe zu **Credentials**

  

2. Klicke **"New Credential"**

  

3. Suche nach **"Memberspot API"**

  

4. Fülle folgende Felder aus:

  

-  **API Key**: Dein generierter Secret Key

  

-  **Base URL**: `https://api.memberspot.de` (Standard)

  

5. Teste die Verbindung und speichere

  

## 📖 Verwendung

  

### Basic User Operation

```

1. Füge einen "Memberspot" Node hinzu

2. Wähle Resource: "User"

3. Wähle Operation: "Find by Email"

4. Gib die E-Mail Adresse ein

5. Führe den Workflow aus

```

  

### Offer Dropdown nutzen

```

1. Füge einen "Memberspot" Node hinzu

2. Resource: "User"

3. Operation: "Grant Offer by Email"

4. Wähle das gewünschte Offer aus dem Dropdown

5. Ergänze firstname, lastname, email

```

  

## 🔧 API Referenz

  

Die Node basiert auf der **Memberspot API v1.0** und unterstützt alle öffentlich verfügbaren Endpunkte.

  

**Base URL**: `https://api.memberspot.de/v1`

  

**Authentifizierung**: API Key über `X-API-KEY` Header

  

Vollständige API Dokumentation verfügbar unter: [Memberspot API Docs](https://api.memberspot.de/api)

  

## 🤝 Contributing

  

Beiträge sind willkommen! Bitte beachte folgende Guidelines:

  

### Development Setup


```bash
# Repository klonen

git  clone  https://github.com/rjsebening/n8n-nodes-memberspot.git

cd  n8n-nodes-memberspot

# Dependencies installieren

npm  install

# TypeScript kompilieren

npm  run  build

# Tests ausführen

npm  test

```

  

### Pull Request Guidelines

  

1.  **Fork** das Repository

  

2. Erstelle einen **Feature Branch** (`git checkout -b feature/amazing-feature`)

  

3.  **Committe** deine Änderungen (`git commit -m 'Add amazing feature'`)

  

4.  **Push** zum Branch (`git push origin feature/amazing-feature`)

  

5. Öffne einen **Pull Request**

  

### Code Style

  

- TypeScript für alle neuen Features

  

- ESLint Konfiguration befolgen

  

- Tests für neue Funktionalität hinzufügen

  

- Dokumentation aktualisieren

  

## 📝 Changelog

  

### Version 1.0.0 (2025-08-24)

  

#### 🎉 Initial Release

  

- ✅ Vollständige Memberspot API Integration

  

- ✅ 5 Ressourcen mit 11+ Operationen

  

- ✅ Offer-Dropdown via `/v1/offers`

  

- ✅ TypeScript Implementation

  

- ✅ Umfassendes Error Handling

  

## 🛠️ Kompatibilität

  

-  **n8n Version**: 1.107.3+ (getestet mit latest)

  

-  **Node Version**: 14+

  

-  **TypeScript**: 4.0+

  

## 📄 Lizenz

  

Dieses Projekt ist unter der [MIT Lizenz](LICENSE) lizenziert.

  

## ❓ Support

  

### Probleme melden

  

Für Bugs oder Feature Requests, bitte ein [GitHub Issue](https://github.com/rjsebening/n8n-nodes-memberspot/issues) erstellen.

  

### FAQ

  

**Q: Kann ich mehrere Memberspot Instanzen verwenden?**

  

A: Ja, erstelle einfach mehrere Credentials mit unterschiedlichen API Keys und Base URLs.

  

**Q: Werden alle API Endpoints unterstützt?**

  

A: Die Node deckt alle öffentlichen API v1.0 Endpunkte ab.

  

**Q: Wie finde ich meine Memberspot API Base URL?**

  

A: Die Standard URL ist `https://api.memberspot.de/v1`.

  

⭐ **Gefällt dir diese Node?** Gib uns einen Stern auf GitHub!

  

💡 **Feature Request?** Öffne ein Issue - wir sind immer offen für Verbesserungen!

  

## 📬 Über den Autor

  

Ich bin [Rezk Jörg Sebening](https://github.com/rjsebening) – **Business Automation Experte für den DACH-Markt**.

Ich entwickle Prozesse, Systeme und n8n-Nodes, die Agenturen & Coaches von manueller Arbeit befreien.

  

👉 Folge mir hier auf GitHub, um weitere **exklusive DACH-Integrationen** nicht zu verpassen.

  
  

## 📋 Haftungsausschluss

  

Diese inoffizielle Community Node ist nicht mit Memberspot verbunden, von Memberspot unterstützt oder gesponsert.

  

Sie nutzt ausschließlich die öffentlich verfügbare Memberspot API gemäß deren Nutzungsbedingungen.

  

**Wichtige Hinweise:**

  

- Diese Node wird von der Community entwickelt und gepflegt

  

- Für Probleme mit der Memberspot API wende dich an den offiziellen Memberspot Support

  

- Alle Memberspot Markenzeichen und Logos gehören Memberspot

  

- Diese Node stellt lediglich eine Schnittstelle zur öffentlichen API dar