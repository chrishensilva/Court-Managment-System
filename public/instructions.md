# Product Roadmap: Court Case Management System v1.1 (Market-Ready)

[cite_start]To transition this application from a technical project [cite: 3] to a **SaaS (Software as a Service)** model with monthly billing, the following enhancements are required to ensure security, reliability, and professional value.

---

## 🛡️ Phase 1: Critical Security Hardening
*These items must be completed before accepting any paying customers to protect sensitive legal data.*

* [cite_start]**Implement Password Hashing**: Replace the current plain-text storage [cite: 63, 145] [cite_start]with **bcrypt** to encrypt all Editor and Admin passwords in the `editors` table[cite: 62, 135].
* [cite_start]**Remove Hardcoded Admin**: Remove the hardcoded `admin/123` credentials from `server.js` [cite: 145] [cite_start]and move them to environment variables (`.env`)[cite: 53, 133].
* [cite_start]**Secure Session Management**: Transition from basic `localStorage` sessions [cite: 78] [cite_start]to **Secure JWT (JSON Web Tokens)** with expiration and HTTP-only cookies[cite: 136].
* [cite_start]**API Rate Limiting**: Implement middleware to prevent brute-force attacks on the `/api/login` endpoint[cite: 71, 146].

---

## 🎨 Phase 2: Professional UX & Localization
*Features designed to increase the "perceived value" for law firms.*

* [cite_start]**Interactive Calendar View**: Upgrade the dashboard to include a visual calendar showing "Next Date" hearings[cite: 139].
* [cite_start]**Advanced Data Handling**: Implement **Server-side Pagination** for the `getUsers` and `getLawyers` endpoints to maintain speed as the database grows[cite: 71, 137].
* [cite_start]**File Attachments**: Integrate cloud storage (like AWS S3) to allow users to upload and view **PDF court documents** linked to specific cases[cite: 138].

---

