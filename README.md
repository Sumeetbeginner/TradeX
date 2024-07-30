# TradingZone

## Overview

TradingZone is a stock market simulation platform where users can trade stocks in real-time with virtual money. It provides a learning environment for users to understand market dynamics without any financial risk.

## Setup Instructions

### Client Setup

1. Navigate to the client directory:
    ```bash
    cd client
    ```

2. Install the required npm packages:
    ```bash
    npm install
    ```

3. Run the development server:
    ```bash
    npm run dev
    ```

### Server Setup

1. Navigate to the server directory:
    ```bash
    cd server
    ```

2. Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

3. Start the server:
    ```bash
    python main.py
    ```

### Firebase Configuration

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).

2. Obtain your Firebase configuration credentials.

3. Create an `.env` file in the root of your `client` directory and add your Firebase credentials:
    ```env
    VITE_FIREBASE_API_KEY=your_api_key
    VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
    VITE_FIREBASE_DATABASE_URL=your_database_url
    VITE_FIREBASE_PROJECT_ID=your_project_id
    VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
    VITE_FIREBASE_APP_ID=your_app_id
    VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
    ```

4. Replace the contents of `firebase.js` in the `src` directory with the following:
    ```javascript
    import { initializeApp } from "firebase/app";
    import { getAuth } from "firebase/auth";
    import { getFirestore } from "firebase/firestore";
    import { getDatabase } from "firebase/database";

    const firebaseConfig = {
        apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
        databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL,
        projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE_APP_ID,
        measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    };

    const app = initializeApp(firebaseConfig);
    export const auth = getAuth(app);
    export const firestore = getFirestore(app);
    export const database = getDatabase(app);
    ```

### Notes

- Ensure that your `.env` file is included in the root directory of your project.
- Do not share your Firebase credentials publicly.

## Usage

- Run the client and server as instructed above.
- Interact with the TradingZone platform via the provided UI.

Happy trading!!!
