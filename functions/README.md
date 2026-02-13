# Cloud Functions Setup for Email and WhatsApp Notifications

This directory contains Firebase Cloud Functions that automatically send email and WhatsApp notifications when a customer submits an inquiry.

## Prerequisites

1. Firebase CLI installed
2. Node.js 18+
3. Gmail account with app password
4. Twilio account (for WhatsApp)

## Setup Instructions

### Step 1: Install Dependencies

```bash
cd functions
npm install
```

### Step 2: Create .env File

In `/home/amosjnr/Documents/maguruAuto/functions/.env`, add:

```
ADMIN_EMAIL=your-admin@gmail.com
ADMIN_EMAIL_PASSWORD=your-app-password
ADMIN_PHONE=+254712345678
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=+1234567890
```

### Step 3: Get Gmail App Password

1. Go to https://myaccount.google.com/security
2. Enable 2-Factor Authentication
3. Go to **App passwords** (near the bottom)
4. Select Mail and Windows Computer
5. Copy the 16-character password
6. Paste in .env as `ADMIN_EMAIL_PASSWORD`

### Step 4: Set Up Twilio Account

1. Go to https://www.twilio.com/
2. Sign up for a free trial
3. Get your Account SID and Auth Token from the dashboard
4. Get a WhatsApp-enabled Twilio phone number
5. Add to .env file

### Step 5: Create Admin Settings in Firestore

1. Go to Firestore Database
2. Create a collection called `settings`
3. Create a document with ID `admin`
4. Add fields:
   - `email` (String): your-admin@gmail.com
   - `whatsappPhone` (String): +254712345678

### Step 6: Deploy Functions

```bash
firebase deploy --only functions
```

## How It Works

1. **User submits inquiry** on the car details page
2. **Inquiry saved** to Firestore (`inquiries` collection)
3. **Cloud Function triggers** automatically
4. **Email sent** to admin with inquiry details
5. **WhatsApp sent** to admin with inquiry summary
6. **Confirmation email sent** to customer

## Testing

### Test Email Only

```bash
npm run serve
```

Then submit an inquiry from the app.

### Manual Trigger

```javascript
// In browser console (logged in as admin):
const sendNotification = firebase
  .functions()
  .httpsCallable("manuallyTriggerNotification");
await sendNotification({ inquiryId: "your-inquiry-id" });
```

## Environment Variables

| Variable               | Description                   | Example              |
| ---------------------- | ----------------------------- | -------------------- |
| `ADMIN_EMAIL`          | Admin email address           | admin@maguruauto.com |
| `ADMIN_EMAIL_PASSWORD` | Gmail app password (16 chars) | abcd efgh ijkl mnop  |
| `ADMIN_PHONE`          | Admin WhatsApp number         | +254712345678        |
| `TWILIO_ACCOUNT_SID`   | Twilio account ID             | ACxxxxxxxxxxxxx      |
| `TWILIO_AUTH_TOKEN`    | Twilio auth token             | your-auth-token      |
| `TWILIO_PHONE_NUMBER`  | Twilio WhatsApp number        | +1234567890          |

## Troubleshooting

### "Failed to authenticate" error

- Check Gmail app password is correct (16 characters)
- Make sure 2FA is enabled on Gmail
- Use app-specific password, not regular password

### "Twilio unavailable" error

- Check Account SID and Auth Token
- Verify Twilio number is WhatsApp-enabled
- Ensure admin phone number has correct format (+country code)

### No notifications received

- Check Cloud Functions logs: `firebase functions:log`
- Verify settings document exists in Firestore
- Check that inquiry was saved to Firestore
- Verify email/phone numbers in settings document

## Files

- `index.js` - Main Cloud Function code
- `package.json` - Dependencies
- `.env` - Environment variables (create this file)

## Notes

- Free Gmail allows ~500 emails/day
- Twilio free trial includes $15 credit
- Keep `.env` file private and add to `.gitignore`
- Cloud Functions run in Firebase's backend
