### **Project Requirements Document: Minimal Passkey Authentication System**

*   **Version:** 1.0
*   **Date:** 28 October 2025

**1. Introduction**

This document specifies the requirements for a minimal web application designed to demonstrate a passwordless authentication system using the Web Authentication API (WebAuthn), commonly known as Passkeys. The primary purpose of this project is to serve as a clear, educational tool for developers implementing passkey authentication in a Node.js and Express.js stack. The application will showcase the core user flows: passkey creation (attestation) and passkey-based login (assertion).

**2. Target Audience**

This project and its accompanying tutorial are intended for web developers who have a foundational understanding of Node.js, Express.js, and web development principles, and who are looking to learn and implement modern, passwordless authentication methods.

**3. Project Scope**

The project scope is intentionally constrained to focus on the core implementation of WebAuthn.

**3.1. In Scope**

*   User registration using only an email address and a passkey.
*   User authentication (login) using a previously registered passkey.
*   A basic, protected user dashboard accessible only after successful authentication.
*   A logout mechanism to terminate the authenticated session.
*   A fully containerized development environment using Docker for one-command setup and execution.
*   Support for Conditional UI (also known as passkey autofill) on the login page for an enhanced user experience.

**3.2. Out of Scope**

*   Traditional password-based authentication.
*   Account recovery or "forgot passkey" functionality.
*   Management of multiple passkeys per user account.
*   Advanced user profile features (e.g., changing email).
*   Production-grade security hardening (e.g., rate limiting, advanced input sanitization).
*   Comprehensive front-end form validation and error handling.
*   Automated testing (unit, integration, or end-to-end).

**4. Functional Requirements (FRs)**

**FR1: User Registration (Attestation Flow)**
*   **FR1.1:** The system shall provide a registration page with a single input field for an email address.
*   **FR1.2:** Upon form submission, the backend (Relying Party) must generate a unique, cryptographically secure challenge.
*   **FR1.3:** The frontend shall use this challenge to invoke the `navigator.credentials.create()` API, which will prompt the user to create a new passkey using their device's native authenticator (e.g., Face ID, Touch ID, Windows Hello, security key).
*   **FR1.4:** Upon successful passkey creation, the backend shall receive the public key credential data.
*   **FR1.5:** The backend must validate the received credential. On successful validation, it shall create and persist a new `User` record and an associated `PublicKeyCredentials` record in the database.
*   **FR1.6:** Following a successful registration, the user shall be automatically authenticated and redirected to their dashboard.

**FR2: User Authentication (Assertion Flow)**
*   **FR2.1:** The system shall provide a login page for existing users.
*   **FR2.2:** The login page will support Conditional UI, enabling the browser to proactively suggest available passkeys for seamless authentication.
*   **FR2.3:** To initiate a login attempt, the backend must generate a new, unique, and cryptographically secure challenge.
*   **FR2.4:** The frontend shall use this challenge to invoke the `navigator.credentials.get()` API, prompting the user to verify their identity with their existing passkey.
*   **FR2.5:** Upon successful user verification, the backend shall receive the signed challenge (assertion).
*   **FR2.6:** The backend must validate the assertion's signature against the user's stored public key.
*   **FR2.7:** On successful validation, the system shall create an authenticated session for the user and redirect them to the dashboard.

**FR3: Session Management & Access Control**
*   **FR3.1:** The system shall maintain a user's authenticated state using a secure, server-side session.
*   **FR3.2:** The dashboard route (`/`) shall be protected. Unauthenticated users attempting to access it must be redirected to the public welcome page.
*   **FR3.3:** A logout mechanism shall be available on the dashboard. Activating it must invalidate the user's session and redirect them to the public welcome page.

**5. Non-Functional Requirements (NFRs)**

**NFR1: Usability & User Experience**
*   **NFR1.1:** The user interface shall be minimal and intuitive, focusing entirely on demonstrating the passkey flows.
*   **NFR1.2:** The application will rely on the native UI of the browser and operating system for all passkey prompts to ensure a familiar, consistent, and trusted user experience.

**NFR2: Security**
*   **NFR2.1:** The user's private key must never be transmitted to or stored on the server. All cryptographic operations involving the private key must be performed client-side by the authenticator.
*   **NFR2.2:** All challenges generated by the server must be cryptographically random and single-use to prevent replay attacks.
*   **NFR2.3:** User sessions shall be managed with secure, HTTP-only cookies to protect against cross-site scripting (XSS) attacks.

**NFR3: Compatibility**
*   **NFR3.1:** The application must be functional on modern desktop and mobile browsers that support the WebAuthn API, including the latest versions of Google Chrome, Apple Safari, Microsoft Edge, and Firefox.

**NFR4: Containerization & Developer Experience**
*   **NFR4.1: Fully Orchestrated Environment:** The entire application stack, including the Node.js service and the PostgreSQL database, must be defined and orchestrated using a `docker-compose.yml` file.
*   **NFR4.2: One-Command Setup:** A developer must be able to build and run the complete application environment with a single command (`docker-compose up`).
*   **NFR4.3: Application Container:** The Node.js application shall be containerized using a `Dockerfile`. This will define the environment, install dependencies from `package.json`, and set the command to start the server.
*   **NFR4.4: Database Service:** The `docker-compose.yml` file must define a separate service for a PostgreSQL database.
*   **NFR4.5: Data Persistence:** The PostgreSQL service must use a named Docker volume to ensure that database data persists even if the container is stopped and removed.
*   **NFR4.6: Environment Configuration:** Application and database configurations (e.g., database credentials, session secret) must be managed via an `.env` file at the project root. The `docker-compose.yml` file will be responsible for loading these variables into the appropriate container environments.
*   **NFR4.7: Live Reloading:** The setup must support an efficient development workflow. The application's source code directory shall be mounted into the `web` container as a volume, allowing `nodemon` to automatically restart the server when code changes are detected on the host machine.
