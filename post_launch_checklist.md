# 🚀 Post-Domain Launch Checklist

This document outlines the steps to take once you have purchased your domain (e.g., `vdrop.com`) and set up a professional email (e.g., `hello@vdrop.com`).

---

## 1. Supabase Authentication (Critical)
Currently, emails come from `20BMIIT066@gmail.com`. To make them professional:

- [ ] **Configure Custom SMTP**:
    1.  Go to **Supabase Dashboard** -> **Auth** -> **SMTP Settings**.
    2.  Toggle **"Enable Custom SMTP"**.
    3.  Enter your new email provider details (e.g., Google Workspace, Zoho, or Resend).
    4.  **Sender Email**: Set to `no-reply@vdrop.com`.
    5.  **Sender Name**: Set to `Vdrop Security`.

- [ ] **Update URL Configuration**:
    1.  Go to **Supabase Dashboard** -> **Auth** -> **URL Configuration**.
    2.  **Site URL**: Change from `localhost` to `https://vdrop.com`.
    3.  **Redirect URLs**: Add `https://vdrop.com/**`.

---

## 2. Transactional Emails (The Edge Function)
Currently, your "Book Pickup" and "Contact" emails come from your personal Gmail.

- [ ] **Option A: Professional Gmail/Zoho (Easiest)**
    1.  Log in to your new `hello@vdrop.com` account.
    2.  Create a new **App Password**.
    3.  Go to **Supabase Secrets**.
    4.  Update `SMTP_USER` to `hello@vdrop.com`.
    5.  Update `SMTP_PASS` to the new App Password.
---

## 3. Frontend Code Updates
Some email addresses are hardcoded in the codebase.

- [ ] **Update Contact Form (`src/pages/Contact.tsx`)**:
    *   Change the "To" address from `20bmiit066@gmail.com` to your new admin email (e.g., `admin@vdrop.com`).
    *   Find this line: `to: "20bmiit066@gmail.com"`

- [ ] **Update Footer Info**:
    *   Update displayed email in `src/components/landing/Footer.tsx`.

---

## 4. DNS & Hosting
- [ ] **Connect Domain to Vercel (Frontend)**:
    *   Go to your Vercel Dashboard -> Project Settings -> Domains.
    *   Add `vdrop.ca`.
    *   Vercel will give you DNS (A Record / CNAME) to add to Porkbun.
    *   **Note**: This is FREE and hosts your main website.

- [ ] **Supabase (Backend)**:
    *   You do **NOT** need the "Custom Domain" add-on for Supabase ($25/mo) right now.
    *   The app will simply talk to `your-project.supabase.co` in the background. This is standard for apps.

- [ ] **SPF/DKIM/DMARC Records**:
    *   **Crucial**: To prevent your emails from going to Spam, you must add these TXT records to your DNS provider (GoDaddy/Namecheap). Your email provider (Google/Resend) will give you the exact values to copy-paste.

---

## 5. Future Features (Post-Revenue)
These features require a payment processor (Stripe) to work correctly.

1.  **Implement Real Receipts**:
    *   Currently, the "Receipt" button is hidden in the History page.
    *   Once Stripe is active, use the Stripe API to generate a PDF receipt url.
    *   Add the "View Receipt" button back to `src/pages/History.tsx`.
