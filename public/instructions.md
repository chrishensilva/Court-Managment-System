# 👤 My Account Section: Feature Requirements & Specifications

This section serves as the central hub for users to manage their personal profile, security, and application-specific configurations like automated email notifications.

---

## 1. Personal Profile Management
* **User Information**: Fields for Full Name, Email Address, and Phone Number.
* **Role Identification**: A non-editable badge displaying the user's current role (**Admin** or **Editor**).
* **Profile Customization**: Option to upload a profile picture to personalize the system's "Activity Log."

---

## 2. Security Hub
* **Password Update**: A secure form to change the account password. 
    * *Requirement*: Passwords must be hashed using **bcrypt** before storage (addressing Version 1.0 known issues).
* **Two-Factor Authentication (2FA)**: Option to enable/disable 2FA for enhanced protection of sensitive legal data.
* **Login Activity Log**: A table showing the last 5 successful logins, including date, time, and device type (IP address logging).

---

## 3. 📧 Automated Email Configuration (Admin Only)
*This section allows the firm to use their own Gmail account to send notifications to lawyers and clients.*

* **Sender Email Address**: The Gmail account used for outgoing system emails.
* **Gmail App Password**: A password-masked input field for the 16-digit Google App Password.
* **"Test Connection" Button**: A function that sends a verification email to the user to ensure the credentials are valid.
* **Setup Guide**: A link or tooltip explaining how to generate an App Password via Google Security settings.

> **⚠️ Technical Note**: Unlike user passwords, the Gmail App Password **must not be hashed**. It must be **encrypted** (e.g., using AES-256) so the server can decrypt it to authenticate with the Gmail SMTP server.

---

## 4. Subscription & Billing (Admin Only)
*This is essential for the "Monthly Renew" business model.*

* **Current Plan Status**: Shows the active tier (e.g., *Starter, Professional, or Enterprise*).
* **Renewal Date**: Displays the date of the next monthly charge.
* **Invoice Archive**: A list of past monthly payments with "Download PDF" links for firm accounting.
* **Payment Method**: Securely manage or update the credit card on file.

---

## 5. Permissions & Preferences
* **Permission Summary (Editors)**: A read-only list showing which modules the Editor can access (e.g., "Access to: Case Management, Reports").
* **Notification Toggles**: Choose which system events trigger an email (e.g., "New Case Assigned," "Next Date Reminder").
* **Language Toggle**: Switch the interface between **English, Sinhala, and Tamil** (as planned for v1.1).

---

## 🛡️ Implementation Security Requirements

| Feature | Logic | Data Storage |
| :--- | :--- | :--- |
| **Account Password** | Hashing | Store as a One-Way Bcrypt Hash |
| **Gmail App Password** | Encryption | Store as Encrypted String (AES-256) |
| **Access Control** | JWT | Validate Role Permissions on every request |
| **Credentials** | Env Vars | Keep Encryption Keys in `.env` (Railway.app) |