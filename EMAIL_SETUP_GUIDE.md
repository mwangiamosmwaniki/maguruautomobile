# Email Setup for Car Inquiry Notifications

## Overview
When users submit car inquiry forms through CarDetails.jsx, the form data is saved to Firestore. Cloud Functions automatically trigger an email notification to mwangiamos703@gmail.com with all inquiry details.

## Architecture

### 1. Frontend (CarDetails.jsx)
- User fills out inquiry form (name, email, phone, message)
- Form submits to `createInquiry()` from firebaseService.js
- Data includes: `adminEmail: "mwangiamos703@gmail.com"`
- User sees confirmation toast

### 2. Firebase Firestore
- Inquiry saved to `inquiries` collection
- Fields: name, email, phone, message, carId, carTitle, adminEmail, createdAt, status

### 3. Cloud Function (functions/index.js)
- Triggered automatically on new inquiry creation
- Sends 3 emails:
  1. **To Admin** (mwangiamos703@gmail.com) - Full inquiry details
  2. **To Customer** - Confirmation + car details
  3. **Optional WhatsApp** - Admin notification via Twilio

## Setup Instructions

### Step 1: Generate Gmail App Password (Recommended)
**Important:** We use Gmail App Password (NOT your regular email password) for security.

1. Go to your Gmail account: https://myaccount.google.com/
2. Navigate to: **Security** → **App passwords**
3. Select **Mail** and **Windows Computer** (or your device type)
4. Google will generate a 16-character app-specific password
5. Copy this password - you'll need it to deploy Cloud Functions

### Step 2: Set Environment Variables for Firebase Deployment
When you deploy Cloud Functions to Firebase, set these environment variables:

```bash
firebase functions:config:set gmail.email="mwangiamos703@gmail.com" gmail.password="your_16_char_app_password"
```

Or deploy with environment variables:
```bash
ADMIN_EMAIL=mwangiamos703@gmail.com ADMIN_EMAIL_PASSWORD=your_16_char_app_password firebase deploy --only functions
```

### Step 3: Update Cloud Function Code
Ensure `functions/index.js` reads from environment variables:
```javascript
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.ADMIN_EMAIL,
    pass: process.env.ADMIN_EMAIL_PASSWORD,
  },
});
```

### Step 4: Deploy Cloud Functions
```bash
cd functions
npm install
firebase deploy --only functions
```

### Step 5: Verify Firestore Security Rules
Ensure rules allow inquiry writes:
```javascript
match /inquiries/{inquiryId} {
  allow create: if request.auth != null || true; // Allow from frontend
  allow read, update, delete: if request.auth != null; // Only authenticated users
}
```

### Step 6: Test the Form
1. Go to any car detail page
2. Click "Send Inquiry"
3. Fill out the form and submit
4. Check mwangiamos703@gmail.com for the notification email

## Email Templates

### Admin Email
- Inquiry ID
- Customer Name, Email, Phone
- Car Title
- Full Message
- Timestamp

### Customer Confirmation Email
- Thank you message
- Car details
- Assurance of follow-up

## Optional: WhatsApp Notifications

To enable WhatsApp notifications to admin:

1. Sign up for Twilio: https://www.twilio.com
2. Get WhatsApp Sandbox number
3. Add to `functions/.env`:
   ```
   TWILIO_ACCOUNT_SID=your_sid
   TWILIO_AUTH_TOKEN=your_token
   TWILIO_PHONE_NUMBER=+1234567890
   ADMIN_PHONE=+254700000000
   ```
4. Redeploy functions

## Troubleshooting

### Emails not sending?
- Verify Gmail App Password is correct (not your regular password)
- Confirm you set environment variables before deploying:
  ```bash
  firebase functions:config:get
  ```
- Check Cloud Functions logs: `firebase functions:log`
- Ensure the app password has "Mail" permission enabled

### Custom email address needed?
- Update `mwangiamos703@gmail.com` in:
  1. CarDetails.jsx (line 117)
  2. Firebase environment variable: `ADMIN_EMAIL`
  3. Firestore inquiry document field: `adminEmail`

### Cloud Function not triggering?
- Check Firestore has `inquiries` collection created
- Verify security rules allow writes
- Check Cloud Functions logs for errors

## File References
- Frontend: `/frontend/src/pages/CarDetails.jsx`
- Firebase Service: `/frontend/src/lib/firebaseService.js`
- Cloud Function: `/functions/index.js`

## Security Best Practices

**Never commit credentials to git:**
- Gmail App Password is set via environment variables during deployment
- Never store in code or .env files committed to version control
- Firebase handles secure storage of environment variables
