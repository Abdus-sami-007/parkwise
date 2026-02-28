# ParkWise - Smart Parking Management

This is a production-ready Next.js application for managing parking properties, guards, and customer bookings.

## 🚀 Free Hosting Guide (GitHub)

The easiest way to host this app for free is using **Vercel** or **Firebase App Hosting**.

### Option 1: Vercel (Recommended for Next.js)
1.  **Push to GitHub**: Create a new repository on GitHub and push this code.
2.  **Sign up for Vercel**: Go to [vercel.com](https://vercel.com) and sign in with GitHub.
3.  **Import Project**: Click "Add New" > "Project" and select your `ParkWise` repository.
4.  **Environment Variables**: If you have a Gemini API Key, add `GOOGLE_GENAI_API_KEY` in the "Environment Variables" section.
5.  **Deploy**: Click "Deploy". Your app will be live on a `.vercel.app` subdomain!

### Option 2: Firebase App Hosting
1.  **Firebase Console**: Go to the [Firebase Console](https://console.firebase.google.com/).
2.  **Build > App Hosting**: Click "Get Started" and connect your GitHub repository.
3.  **Configuration**: Follow the wizard to set up your root directory and settings.
4.  **Deploy**: Firebase will automatically build and deploy your Next.js app.

## 🛠 Features
- **Owner Dashboard**: Manage lands and view analytics.
- **Guard Dashboard**: Real-time patrol and vehicle logging with AI fallbacks.
- **Customer Dashboard**: Find and book spots instantly.
- **AI Integration**: Powered by Google Gemini via Genkit.

## 💻 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **State**: Zustand (Local-first for high performance)
- **AI**: Genkit 1.x