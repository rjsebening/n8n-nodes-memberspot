# Memberspot API Key Setup

To use the **Memberspot Node in n8n**, you need to create an **API Key** from your Memberspot admin account.

## 🔑 Create an API Key

1. Log in at [https://app.memberspot.de](https://app.memberspot.de) with your admin credentials.
2. In the left-hand menu, go to **Settings → Integrations**.
3. Select the section **API Keys**.
4. Click **Create API Key**.
5. Copy the **Secret Key** immediately after creation – it will only be shown once!
6. If you lose the key, you must create a new one.
7. Deleted keys become invalid immediately.

## ⚙️ Use in n8n

1. Open n8n and go to **Credentials → New → Memberspot API**
2. Enter the following:
   - **API Key**: your generated secret key
   - **Base URL**: Default: `https://api.memberspot.de`
3. Click **Test** → if everything is correct, you’ll get a confirmation.

## 📌 Notes

- API Keys have full access to your Memberspot account – keep them safe and private.
- You can create multiple keys (e.g. for different systems or environments).
- Keys can be revoked at any time.
