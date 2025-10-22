# Aplikasi Survei Digitalisasi Sekolah (Sekolah Digital)

This is a Next.js application for conducting a school digitalization survey, built with Firebase and Tailwind CSS.

## Features

- **Public Survey Form**: A multi-step form for anyone to submit survey data.
- **Real-time Feedback**: Users get immediate feedback based on their answers.
- **Automated Summary**: A final summary and recommendation level is generated upon completion.
- **Secure Admin Dashboard**: A private `/admin` route for authorized users to view survey analytics.
- **Data Visualization**: Charts and tables displaying aggregated survey results.
- **Secure Authentication**: Google Sign-In for admin access, protected by email allowlist and Firestore Security Rules.

## Tech Stack

- **Framework**: Next.js (App Router)
- **Database**: Cloud Firestore
- **Authentication**: Firebase Authentication (Google Sign-In)
- **Hosting**: Firebase Hosting
- **Styling**: Tailwind CSS with shadcn/ui
- **Charts**: Recharts
- **Form Handling**: React Hook Form with Zod

## Project Setup

### 1. Prerequisites

- Node.js (v18 or later)
- Firebase Account and a new Firebase Project

### 2. Installation

Clone the repository and install the dependencies:

```bash
git clone <repository_url>
cd sekolah-digital
npm install
```

### 3. Firebase Configuration

1.  In your Firebase project console, create a new Web App.
2.  Copy the Firebase configuration object.
3.  Create a `.env.local` file in the root of the project and add your Firebase configuration as environment variables:

    ```env
    # Firebase Web App Configuration
    NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
    NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
    NEXT_PUBLIC_FIREBASE_APP_ID=1:...:web:...
    ```

4.  Enable **Google Sign-In** in the Firebase console under **Authentication > Sign-in method**.
5.  Set up **Cloud Firestore**. Create a new database in production mode.

### 4. Configure Admin Access

Admin access to the `/admin` dashboard is restricted by an email allowlist.

-   Open the file `src/config/admin.ts`.
-   Modify the `ALLOWED_ADMIN_EMAILS` array to include the Google account emails of your administrators.

```typescript
// src/config/admin.ts
export const ALLOWED_ADMIN_EMAILS = [
  "admin1@example.com",
  "admin2@example.com",
];
```

### 5. Firestore Security Rules

Deploy the security rules to protect your database. The rules are located in `firestore.rules`.

You can deploy them using the Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

### 6. (Optional) Set Admin Custom Claims

For a more scalable approach, you can use custom claims. Here is an example script using the Firebase Admin SDK to set a custom claim for a user.

```javascript
// scripts/setAdmin.js
// This script requires `firebase-admin` to be installed.
// Run with: node scripts/setAdmin.js <user_email_to_make_admin>

const admin = require('firebase-admin');
const serviceAccount = require('./path/to/your/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const userEmail = process.argv[2];

if (!userEmail) {
  console.error('Please provide a user email.');
  process.exit(1);
}

admin.auth().getUserByEmail(userEmail)
  .then((user) => {
    return admin.auth().setCustomUserClaims(user.uid, { admin: true });
  })
  .then(() => {
    console.log(`Successfully set admin claim for ${userEmail}`);
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error setting custom claim:', error);
    process.exit(1);
  });
```

The security rules in `firestore.rules` are already configured to recognize this `admin: true` claim.

## Running the Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:9002`.

## Deployment

This application is configured for deployment on Firebase Hosting.

1.  Initialize Firebase in your project (if you haven't already):

    ```bash
    firebase init hosting
    ```
    - Select your Firebase project.
    - When asked for your public directory, enter `out`.
    - Configure as a single-page app (rewrite all urls to /index.html): **No**.
    - Set up automatic builds and deploys with GitHub: **No** (or as you prefer).

2.  Build the Next.js application:

    ```bash
    npm run build
    ```
    This will create a production-ready static export in the `out/` directory.

3.  Deploy to Firebase Hosting:
    ```bash
    firebase deploy --only hosting
    ```
