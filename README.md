# ParkWise - Smart Parking Management

ParkWise is a production-ready Next.js application for managing parking properties, guards, and customer bookings with zero-latency role-based dashboards.

## 🚀 Quick Start Guide

### 1. Choose Your Role
On the landing page, select your persona to enter the specialized dashboard:
- **Property Owner**: For managing multiple parking sites and revenue.
- **Security Guard**: For real-time patrol and vehicle logging.
- **Driver (Customer)**: For finding and booking available spots.

### 2. Explore the Owner Portal
- **Dashboard**: View portfolio-wide revenue and occupancy. Use the **"Reset Mock Data"** button to see the charts in action.
- **Manage Lands**: Create new parking zones with custom slot counts and pricing.
- **Recruit Guards**: Browse verified security personnel for your properties.

### 3. Explore the Guard Portal
- **Active Patrol**: Select a site to see its live map. Click slots to log license plates or mark them as available.
- **AI Assistant**: Look at the top alerts. If the AI is busy, the system automatically falls back to local logic to keep you moving.
- **Reports**: Submit your shift summary before logging out.

### 4. Explore the Customer Portal
- **Find Parking**: Search for locations and see real-time availability.
- **Instant Booking**: Select a site, pick a green slot, and confirm your reservation.
- **Wallet**: Check your balance and view past booking history.

## 🛠 Features
- **Zero-Latency Entry**: Instant role-based access without database bottlenecks.
- **Smart Guard Assistant**: AI-powered recommendations for parking flow with local fallback.
- **Interactive Maps**: Real-time slot monitoring and vehicle logging.
- **Unified Analytics**: Deep insights for property owners.

## 💻 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS + ShadCN UI
- **State Management**: Zustand (Local-first for high performance)
- **AI**: Google Gemini via Genkit 1.x

## 🌐 Hosting Guide (GitHub)

To host this for free with automatic updates:

### Option 1: Vercel (Recommended)
1. Push your code to a GitHub repository.
2. Sign in to [vercel.com](https://vercel.com).
3. Click "Add New" > "Project" and import your repo.
4. Click "Deploy". Your app is live!

### Option 2: Firebase App Hosting
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Navigate to "App Hosting" and connect your GitHub repo.
3. Firebase will automatically detect the Next.js settings and deploy your app.
