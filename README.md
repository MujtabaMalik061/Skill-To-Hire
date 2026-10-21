# Skill To Hire

Skill To Hire connects candidates with employers. Candidates can browse and apply for jobs, and employers can publish openings and manage applications. Application and notification inbox updates arrive live through Firestore listeners. Email and browser push alerts are sent through the configured push notification service.

## Requirements

- Node.js and npm
- A Firebase project with Authentication and Cloud Firestore enabled
- The Email/Password, Google, GitHub, and Apple sign-in providers enabled in Firebase Authentication
- A `dev-push-notification` API key for email and browser push delivery

## Run locally

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and fill in the Firebase web app settings and `VITE_Push_Notification`.
3. Add your local and deployed app domains to Firebase Authentication's authorized domains.
4. Start the Vite app with `npm run dev`.

Vite exposes `VITE_` variables to browser code. Use Firebase web app configuration values here, and do not put server credentials or private service account keys in this file.

## Firebase setup

Deploy the Firestore rules in `firestore.rules` using the Firebase Console or Firebase CLI. The app uses Firebase Authentication, Cloud Firestore, and Firebase Cloud Messaging through `dev-push-notification`; it does not require Cloud Functions or a separate server for its current flows. Firestore reads and real-time listeners are capped in the app to keep normal browsing bounded.

Browser push requires HTTPS (localhost is supported for development), notification permission, and a working service worker. The service worker is `public/dpn-sw.js`. Users enable notifications from the bell control after signing in. Email and push delivery also depend on the push service account's own configuration and limits.

## Account and data flows

- Students and employees can create profiles and apply to published jobs.
- Job providers can create an account and publish jobs directly.
- The `Users` document ID is the custom ID returned by `generateCustomId`; it also stores both `docId` and Firebase's `authId`.
- Each application has a deterministic ID based on the job ID and candidate custom ID, preventing duplicate applications to the same job.
- Notifications are written to the recipient's Firestore inbox first. Email and push delivery are attempted after that write, so a delivery problem does not undo an application or status change.
- Private email addresses and FCM tokens live in `UserPrivate/{customId}`. A candidate and hiring provider can read each other's private contact data only after an application creates their connection.

## Project layout

```text
src/
|-- assets/
|   |-- images/
|   `-- styles/
|-- auth/                 # Authentication screens, when split from pages
|-- components/           # Reusable interface components
|-- hooks/                # Shared React hooks and auth context
|-- layouts/              # Shared page layouts
|-- pages/                # Main route pages
|-- routes/               # Public, protected, and role-aware routes
|-- services/             # Authentication, jobs, applications, users, alerts
|-- utils/                # Firebase setup, IDs, push helper
|-- App.jsx
`-- main.jsx
```

Styles are kept in `src/assets/styles`. Firebase client configuration is read from environment variables in `src/utils/FirebaseConfig.js`. `.env` is ignored by Git; share `.env.example` with collaborators instead.
