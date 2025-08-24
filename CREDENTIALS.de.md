# Memberspot API Key erstellen

Um die **Memberspot Node in n8n** zu nutzen, benötigst du einen **API Key** aus deinem Memberspot Admin-Account.

## 🔑 API Key anlegen

1. Melde dich an unter [https://app.memberspot.de](https://app.memberspot.de) mit deinem Admin-Login.
2. Gehe links im Menü zu **Einstellungen → Integrationen**.
3. Wähle den Bereich **API Keys**.
4. Klicke auf **API Key erstellen**.
5. Kopiere dir den **Secret Key** direkt nach der Erstellung – er wird **nur einmalig angezeigt**!
6. Falls du den Key verlierst, musst du einen neuen erstellen.
7. Gelöschte Keys werden sofort ungültig.

## ⚙️ Verwendung in n8n

1. Öffne n8n und gehe zu **Credentials → New → Memberspot API**
2. Trage dort ein:
   - **API Key**: dein generierter Secret Key
   - **Base URL**: Standard: `https://api.memberspot.de`
3. Klicke auf **Test** → wenn alles korrekt ist, bekommst du eine Bestätigung.

## 📌 Hinweise

- API Keys haben volle Rechte für dein Memberspot-Konto – halte sie geheim.
- Du kannst mehrere Keys anlegen (z. B. für verschiedene Systeme oder Umgebungen).
- Keys können jederzeit widerrufen werden.
