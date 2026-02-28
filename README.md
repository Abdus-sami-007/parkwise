# ParkWise - Smart Parking Management

ParkWise is a production-ready Next.js application for managing parking properties, guards, and customer bookings with zero-latency role-based dashboards.

## 🚀 Free Hosting Guide

To host this application for free with automatic updates from your GitHub repository, we recommend **Vercel** or **Firebase App Hosting**.

### Option 1: Vercel (Recommended)
1.  **Push to GitHub**: Commit your changes and push them to your repository.
2.  **Import to Vercel**:
    *   Sign in to [vercel.com](https://vercel.com) using your GitHub account.
    *   Click "Add New" > "Project".
    *   Import your `ParkWise` repository.
3.  **Environment Variables**:
    *   Add `GOOGLE_GENAI_API_KEY` (if using AI features).
4.  **Deploy**: Click "Deploy". Your app will be live on a `.vercel.app` domain!

### Option 2: Firebase App Hosting
1.  **Firebase Console**: Go to [console.firebase.google.com](https://console.firebase.google.com/).
2.  **App Hosting**: Navigate to "Build" > "App Hosting" and click "Get Started".
3.  **Connect GitHub**: Select your repository and the branch you want to deploy.
4.  **Finish Setup**: Firebase will automatically detect the Next.js settings and build your app.

## 🛠 Features
- **Zero-Latency Entry**: Instant role-based access for Owners, Guards, and Customers.
- **Smart Guard Assistant**: AI-powered recommendations for parking flow (with local system fallback).
- **Interactive Map**: Real-time slot monitoring and vehicle logging.
- **Unified Wallet**: Mock payment integration for seamless bookings.

## 💻 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **State Management**: Zustand (Local-first for high performance)
- **AI**: Google Gemini via Genkit 1.x