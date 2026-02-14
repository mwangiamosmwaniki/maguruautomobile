# Maguru Auto - Car Dealership Platform

Modern car dealership web application built with React, Firebase, and Cloud Functions.

## Project Structure

```
maguruAuto/
├── frontend/                 # React web application
│   ├── src/                 # Source code
│   │   ├── pages/          # Page components
│   │   ├── assets/         # Images, components, utilities
│   │   ├── lib/            # Helper functions
│   │   ├── firebase.js     # Firebase configuration
│   │   └── App.jsx         # Root component
│   ├── package.json        # Dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind CSS config
│   └── eslint.config.js    # ESLint rules
│
├── functions/              # Firebase Cloud Functions
│   ├── index.js           # Cloud Function handlers
│   └── package.json       # Dependencies
│
└── package.json           # Root scripts
```

## Features

- 🚗 **Car Inventory Management** - Add, edit, delete cars
- 📝 **Customer Inquiries** - Form submission with email notifications
- 🔐 **Admin Dashboard** - Secure admin panel for management
- 🔥 **Firebase Integration** - Firestore database, Authentication
- ⚡ **Real-time Updates** - Live data synchronization
- 📱 **Responsive Design** - Mobile-friendly interface

## Quick Start

### Prerequisites

- Node.js 16+
- Firebase account
- Git

### Installation

```bash
# Clone repository
git clone <repo-url>
cd maguruAuto

# Install root dependencies
npm install

# Install frontend dependencies
cd frontend && npm install && cd ..

# Install functions dependencies
cd functions && npm install && cd ..
```

### Configuration

1. **Frontend Environment** (frontend/.env.local):

```
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_PROJECT_ID=your_project_id
# ... other Firebase config
```

2. **Functions Environment** (functions/.env - local only):

```
SENDGRID_API_KEY=your_sendgrid_key
ADMIN_EMAIL=admin@example.com
```

### Development

```bash
# Run frontend dev server
npm run frontend

# Run Cloud Functions locally
cd functions && npm run serve

# Build frontend
npm run frontend:build

# Deploy to Firebase
firebase deploy --only functions
```

## Technologies

### Frontend

- **React 19** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Firebase SDK** - Backend integration
- **Framer Motion** - Animations
- **Lucide React** - Icons

### Backend

- **Firebase Firestore** - Database
- **Firebase Authentication** - User auth
- **Cloud Functions** - Serverless compute
- **SendGrid** - Email service

## API Endpoints (Cloud Functions)

### sendInquiryNotifications

- **Trigger**: Firestore document creation (inquiries/{id})
- **Action**: Sends admin and customer emails via SendGrid
- **Environment**: Requires SENDGRID_API_KEY, ADMIN_EMAIL

### manuallyTriggerNotification

- **Type**: HTTP callable function
- **Params**: inquiryId (string)
- **Action**: Re-sends notification for existing inquiry

## Database Schema

### Collections

**cars**

```
{
  title: string
  price: number
  description: string
  image: string
  condition: string
  mileage: number
  year: number
  transmission: string
  fuelType: string
  ...
}
```

**inquiries**

```
{
  name: string
  email: string
  phone: string
  carTitle: string
  message: string
  createdAt: timestamp
  notificationsSent: boolean
  emailSentAt: timestamp
}
```

**users** (admin)

```
{
  email: string
  role: admin
  createdAt: timestamp
}
```

## Deployment

### Firebase Blaze Plan Required

Cloud Functions require Firebase Blaze (pay-as-you-go) plan.

- First 2M invocations/month free
- Pay only for what you use

### Deploy to Firebase

```bash
firebase use maguruauto
firebase deploy --only functions
```

## Environment Variables

### Frontend (.env.local)

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_MEASUREMENT_ID`

### Functions (.env - Local Only)

- `SENDGRID_API_KEY`
- `ADMIN_EMAIL`
- `SENDER_EMAIL`

## Security

- ✅ API keys never exposed in frontend code
- ✅ Cloud Functions authenticate with Firebase Admin SDK
- ✅ Firestore security rules control access
- ✅ Environment variables protect sensitive data
- ✅ SendGrid API key stored securely

## File Cleanup

The following unnecessary files have been removed:

- ❌ Old setup documentation
- ❌ Unused config files
- ❌ node_modules (regenerated when needed)
- ❌ Package lock files (regenerated)
- ❌ Sensitive credential files

## Contributing

1. Create feature branch
2. Make changes
3. Test thoroughly
4. Submit pull request

## Support & Documentation

- [Firebase Documentation](https://firebase.google.com/docs)
- [React Documentation](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [SendGrid API](https://docs.sendgrid.com)

## License

Proprietary - Maguru Auto

---

**Status**: Production Ready  
**Last Updated**: February 14, 2026  
**Maintainer**: Development Team
