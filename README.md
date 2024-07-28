# TradingZone

Welcome to TradingZone, a real-time simulated trading platform where you can learn and practice trading in the Indian stock market with virtual money. Our platform provides a realistic trading experience, including a portfolio and real-time updates. Users receive a monthly virtual salary credited to their trading accounts, enhancing the learning experience.

## Project Setup Instructions

## Client Setup

1. Navigate to the client directory:
    ```bash
    cd client
    ```

2. Install the necessary npm packages:
    ```bash
    npm install
    ```

3. Start the development server:
    ```bash
    npm run dev
    ```

## Server Setup

1. Navigate to the server directory:
    ```bash
    cd server
    ```

2. Install the required Python packages:
    ```bash
    pip install -r requirements.txt
    ```

3. Run the Python server:
    ```bash
    python main.py
    ```

## Firebase Setup

1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).

2. Navigate to the project settings and generate a new Web App.

3. Copy the Firebase configuration credentials.

4. Replace the `firebaseConfig` object in `/client/src/firebase.js` with your Firebase credentials:
    ```javascript
    const firebaseConfig = {
        apiKey: "YOUR_API_KEY",
        authDomain: "YOUR_AUTH_DOMAIN",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_STORAGE_BUCKET",
        messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
        appId: "YOUR_APP_ID",
        measurementId: "YOUR_MEASUREMENT_ID"
    };
    ```

---

### Additional Notes

- Ensure you have Node.js and npm installed for the client setup.
- Ensure you have Python and pip installed for the server setup.
- Adjust the configurations in the respective directories if needed.
- Follow Firebase documentation for additional setup and configurations.
