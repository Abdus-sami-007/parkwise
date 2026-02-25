# **App Name**: ParkWise

## Core Features:

- Secure Role-Based Authentication: Manages Land Owner, Guard, and User accounts and authentication via Firebase Auth to ensure secure access based on defined roles.
- Interactive Parking Land Management: Land Owners can intuitively define parking areas and individual slots on an interactive Google Maps interface, setting dynamic pricing which is stored in Firestore.
- Real-time Guard Status Updates: Guards update parking slot statuses (Available, Booked, Occupied) in real-time on a color-coded map view, enabling manual vehicle check-ins/outs with Firestore updates.
- Generative Guard Assistant: An AI tool that generates concise, actionable recommendations for guards based on real-time parking events or specific booking details (e.g., 'Vehicle expected in slot B in 10 mins', 'Assist VIP leaving slot C').
- User-Friendly Slot Booking: Customers can browse nearby parking lands, filter by criteria, book specific slots with a calendar picker, view real-time availability, and manage their booking history through Firestore.
- Integrated Payment Processing: Facilitates booking payments through a mock integration with Razorpay/Stripe, leading to a confirmation and updating booking status.
- Owner Dashboard & Analytics: Provides Land Owners with a dashboard displaying occupancy statistics, revenue summaries, and a comprehensive list of active bookings fetched from Firestore.

## Style Guidelines:

- Primary brand color: A deep, professional blue (#2E61CC) conveying reliability and technology, setting a tone of efficiency.
- Background color: A very light, clean blue-grey (#F2F4F8) that visually supports the primary blue and offers a fresh, open canvas for map and dashboard content.
- Accent color: A vibrant, clear cyan (#1AC5CC) to highlight interactive elements, calls to action, and convey real-time status effectively, creating a modern contrast.
- Body and headline font: 'Inter' (sans-serif) for its modern, neutral, and highly readable characteristics across all dashboard elements, maps, and text.
- Modern, clear, and action-oriented icons from 'Lucide React' to maintain consistency and clarity, particularly for interactive map markers and status indicators.
- Mobile-first responsive design with intuitive, role-based dashboards. Focus on clean data presentation and clear calls to action, especially around map interactions, booking flows, and status updates.
- Subtle transitions and feedback animations for real-time updates (e.g., parking slot status changes), user interactions (e.g., booking confirmation, form submissions), and efficient loading states to enhance user experience.