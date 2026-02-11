---
description: Build the complete React frontend for CineBook movie reservation system
---

# 🎬 CineBook React Frontend - Build Workflow

> Follow these steps sequentially to build the complete React frontend.
> Reference: `/booking-app/FRONTEND_IMPLEMENTATION_GUIDE.md`

---

## Phase 1: Project Initialization

### Step 1.1: Create React Project with Vite
// turbo
```bash
cd /Users/abhishekbisht/Desktop/backend\ movie\ reservation/booking-app && npx -y create-vite@latest frontend-react --template react
```

### Step 1.2: Navigate to project and install dependencies
// turbo
```bash
cd /Users/abhishekbisht/Desktop/backend\ movie\ reservation/booking-app/frontend-react && npm install
```

### Step 1.3: Install required packages
// turbo
```bash
cd /Users/abhishekbisht/Desktop/backend\ movie\ reservation/booking-app/frontend-react && npm install react-router-dom axios zustand framer-motion lucide-react react-hot-toast react-hook-form zod @hookform/resolvers date-fns
```

### Step 1.4: Create folder structure
Create these directories:
- `src/components/common`
- `src/components/layout`
- `src/components/auth`
- `src/components/movies`
- `src/components/booking`
- `src/components/theaters`
- `src/components/profile`
- `src/components/admin`
- `src/context`
- `src/hooks`
- `src/pages`
- `src/pages/admin`
- `src/services`
- `src/utils`
- `src/styles`
- `src/assets`

### Step 1.5: Create environment file
Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_RAZORPAY_KEY_ID=
```

### Step 1.6: Update vite.config.js
Update with path aliases and proxy configuration as documented in FRONTEND_IMPLEMENTATION_GUIDE.md

---

## Phase 2: Core Setup

### Step 2.1: Create Design System
Create `src/styles/variables.css` with the color palette, spacing, and typography variables from the guide.

### Step 2.2: Create Global Styles
Create `src/styles/index.css` with base styles:
- CSS reset
- Global styles
- Utility classes
- Animation keyframes

### Step 2.3: Create API Service
Create `src/services/api.js` with:
- Axios instance
- Base URL configuration
- Request interceptor (auth token)
- Response interceptor (token refresh, error handling)

### Step 2.4: Create All Service Files
Create these service files:
- `src/services/authService.js`
- `src/services/movieService.js`
- `src/services/showtimeService.js`
- `src/services/bookingService.js`
- `src/services/paymentService.js`
- `src/services/profileService.js`
- `src/services/searchService.js`
- `src/services/adminService.js`

### Step 2.5: Create Auth Context
Create `src/context/AuthContext.jsx` with:
- User state
- Login/logout/register functions
- Token management
- Protected route support

### Step 2.6: Create Booking Context
Create `src/context/BookingContext.jsx` with:
- Booking state (movie, showtime, seats, etc.)
- Step management
- Actions for each booking stage

### Step 2.7: Create Utility Files
- `src/utils/constants.js` - App constants
- `src/utils/helpers.js` - Helper functions
- `src/utils/formatters.js` - Date/currency formatters
- `src/utils/validators.js` - Validation schemas

---

## Phase 3: Common Components

### Step 3.1: Create Button Component
Create `src/components/common/Button.jsx` with CSS

### Step 3.2: Create Input Component
Create `src/components/common/Input.jsx` with CSS

### Step 3.3: Create Modal Component
Create `src/components/common/Modal.jsx` with CSS

### Step 3.4: Create Card Component
Create `src/components/common/Card.jsx` with CSS

### Step 3.5: Create Loader/Skeleton Components
Create `src/components/common/Loader.jsx` and `Skeleton.jsx`

### Step 3.6: Create Toast/Notification Setup
Configure react-hot-toast in App.jsx

### Step 3.7: Create Error Boundary
Create `src/components/common/ErrorBoundary.jsx`

---

## Phase 4: Layout Components

### Step 4.1: Create Navbar
Create `src/components/layout/Navbar.jsx`:
- Logo
- Navigation links (Movies, Theaters)
- Search bar
- Auth buttons / User menu
- Mobile responsive

### Step 4.2: Create Footer
Create `src/components/layout/Footer.jsx`

### Step 4.3: Create Layout Wrapper
Create `src/components/layout/Layout.jsx` with Outlet

### Step 4.4: Create Admin Layout
Create `src/components/layout/AdminLayout.jsx` with sidebar

---

## Phase 5: Auth Components & Pages

### Step 5.1: Create Login Form
Create `src/components/auth/LoginForm.jsx`

### Step 5.2: Create Register Form
Create `src/components/auth/RegisterForm.jsx`

### Step 5.3: Create Forgot Password Form
Create `src/components/auth/ForgotPasswordForm.jsx`

### Step 5.4: Create Protected Route
Create `src/components/auth/ProtectedRoute.jsx`

### Step 5.5: Create Auth Pages
- `src/pages/Login.jsx`
- `src/pages/Register.jsx`
- `src/pages/ForgotPassword.jsx`
- `src/pages/ResetPassword.jsx`

---

## Phase 6: Movie Components & Pages

### Step 6.1: Create Movie Card
Create `src/components/movies/MovieCard.jsx`:
- Poster image
- Title, rating, age rating
- Duration, language
- Genre tags
- Book Now button

### Step 6.2: Create Movie Grid
Create `src/components/movies/MovieGrid.jsx`:
- Grid layout
- Loading skeletons
- Empty state

### Step 6.3: Create Hero Carousel
Create `src/components/movies/HeroCarousel.jsx`:
- Featured movies slider
- Auto-play
- Gradient overlay
- Movie info overlay

### Step 6.4: Create Movie Filters
Create `src/components/movies/MovieFilters.jsx`:
- Genre filter (checkboxes/pills)
- Language filter
- Age rating filter
- Sort options

### Step 6.5: Create Search Bar
Create `src/components/movies/SearchBar.jsx`:
- Autocomplete dropdown
- Debounced API calls
- Keyboard navigation
- Result highlighting

### Step 6.6: Create Movie Details Component
Create `src/components/movies/MovieDetails.jsx`:
- Full movie information
- Cast list
- Trailer embed (optional)
- Book Now CTA

### Step 6.7: Create Movie Pages
- `src/pages/Home.jsx` - Hero + Movies grid
- `src/pages/Movies.jsx` - Full movies list with filters
- `src/pages/MovieDetail.jsx` - Single movie page

---

## Phase 7: Booking Components & Page

### Step 7.1: Create Date Selector
Create `src/components/booking/DateSelector.jsx`:
- Next 7 days as pills
- Today/Tomorrow labels
- Day name + date

### Step 7.2: Create Showtime Selector
Create `src/components/booking/ShowtimeSelector.jsx`:
- Theater/screen grouping
- Time pills
- Price display
- Available seats count

### Step 7.3: Create Seat Map
Create `src/components/booking/SeatMap.jsx`:
- Visual seat grid
- Row labels (A, B, C...)
- Seat status colors
- Click to select/deselect
- Max seats limit

### Step 7.4: Create Seat Legend
Create `src/components/booking/SeatLegend.jsx`

### Step 7.5: Create Booking Summary
Create `src/components/booking/BookingSummary.jsx`:
- Movie info
- Showtime details
- Selected seats
- Price breakdown
- Convenience fee

### Step 7.6: Create Payment Section
Create `src/components/booking/PaymentSection.jsx`:
- Summary display
- Razorpay integration
- Mock payment button (dev)

### Step 7.7: Create Booking Confirmation
Create `src/components/booking/BookingConfirmation.jsx`:
- Success animation
- Booking ID
- QR code placeholder
- Download ticket button
- Email confirmation note

### Step 7.8: Create Booking Page
Create `src/pages/Booking.jsx`:
- Multi-step wizard
- Step indicator
- Back/Continue navigation
- Integrate all booking components

---

## Phase 8: Theater Components & Page

### Step 8.1: Create City Selector
Create `src/components/theaters/CitySelector.jsx`:
- Dropdown with search
- Popular cities
- Persist selection

### Step 8.2: Create Theater Card
Create `src/components/theaters/TheaterCard.jsx`:
- Theater name and address
- Amenities (IMAX, 4DX, Dolby)
- Halls count

### Step 8.3: Create Theater List
Create `src/components/theaters/TheaterList.jsx`

### Step 8.4: Create Theaters Page
Create `src/pages/Theaters.jsx`

---

## Phase 9: Profile Components & Pages

### Step 9.1: Create Profile Card
Create `src/components/profile/ProfileCard.jsx`

### Step 9.2: Create Booking History
Create `src/components/profile/BookingHistory.jsx`:
- Tabs: Upcoming / Past / Cancelled
- Booking cards
- View details / Cancel buttons

### Step 9.3: Create Payment History
Create `src/components/profile/PaymentHistory.jsx`

### Step 9.4: Create Edit Profile Form
Create `src/components/profile/EditProfileForm.jsx`:
- Name, phone editing
- Password change

### Step 9.5: Create Profile Pages
- `src/pages/Profile.jsx`
- `src/pages/MyBookings.jsx`

---

## Phase 10: Admin Components & Pages

### Step 10.1: Create Admin Dashboard
Create `src/components/admin/Dashboard.jsx`:
- Stats cards (revenue, bookings, users)
- Quick actions
- Recent activity

### Step 10.2: Create Analytics Charts
Create `src/components/admin/AnalyticsCharts.jsx`:
- Revenue chart
- Occupancy chart

### Step 10.3: Create Movie Manager
Create `src/components/admin/MovieManager.jsx`:
- Movies table
- Add/Edit movie modal
- Delete confirmation

### Step 10.4: Create Showtime Manager
Create `src/components/admin/ShowtimeManager.jsx`:
- Showtimes table
- Add/Edit showtime form
- Hall/movie selection

### Step 10.5: Create Booking Manager
Create `src/components/admin/BookingManager.jsx`:
- Bookings table with filters
- Booking details modal

### Step 10.6: Create User Manager
Create `src/components/admin/UserManager.jsx`:
- Users table
- User details

### Step 10.7: Create Admin Pages
- `src/pages/admin/AdminDashboard.jsx`
- `src/pages/admin/AdminMovies.jsx`
- `src/pages/admin/AdminShowtimes.jsx`
- `src/pages/admin/AdminBookings.jsx`
- `src/pages/admin/AdminPayments.jsx`
- `src/pages/admin/AdminUsers.jsx`

---

## Phase 11: Router & App Setup

### Step 11.1: Create Router
Create `src/router.jsx` with all routes as documented

### Step 11.2: Update App.jsx
Update `src/App.jsx`:
- Import providers (Auth, Booking)
- Import Toaster
- Wrap with providers
- Render router

### Step 11.3: Update main.jsx
Ensure React 18 setup with StrictMode

### Step 11.4: Update index.html
- Add Google Fonts
- Add Razorpay SDK script
- Update title and meta tags

---

## Phase 12: Testing & Polish

### Step 12.1: Test all flows
- Registration → Login → Logout
- Browse movies → View details
- Booking flow (date → showtime → seats → payment)
- View/cancel bookings
- Profile update
- Admin operations

### Step 12.2: Add loading states
Ensure all async operations show loading indicators

### Step 12.3: Add error handling
- Error boundaries
- Toast notifications for errors
- Fallback UI

### Step 12.4: Responsive testing
Test on mobile, tablet, desktop

### Step 12.5: Start dev server
// turbo
```bash
cd /Users/abhishekbisht/Desktop/backend\ movie\ reservation/booking-app/frontend-react && npm run dev
```

---

## 🎯 Key API Endpoints Reference

Backend running at: `http://localhost:3000`

### Auth
- POST `/api/auth/register` - `{ firstName, lastName, email, password }`
- POST `/api/auth/login` - `{ email, password }`
- POST `/api/auth/logout`
- POST `/api/auth/forgot-password` - `{ email }`
- POST `/api/auth/reset-password` - `{ token, newPassword }`

### Movies
- GET `/api/movies` - Query: genre, language, ageRating, page, limit
- GET `/api/movies/featured`
- GET `/api/movies/search?q=query`
- GET `/api/movies/:movieId`

### Showtimes
- GET `/api/showtime/movie/:movieId?date=YYYY-MM-DD`
- GET `/api/showtime/:showtimeId`
- GET `/api/showtime/:showtimeId/seats`
- POST `/api/showtime/:showtimeId/reserve` - `{ selectedSeats: ['A1', 'A2'] }`

### Bookings (Auth Required)
- POST `/api/booking` - `{ showtimeId, selectedSeats }`
- GET `/api/booking/me`
- GET `/api/booking/:bookingId`
- PATCH `/api/booking/:bookingId/cancel` - `{ reason }`

### Payments (Auth Required)
- POST `/api/payment` - `{ reservationId }`
- POST `/api/payment/mock` - `{ reservationId }` (dev only)
- POST `/api/payment/:paymentId/confirm` - Razorpay data
- GET `/api/payment/history`

### Profile (Auth Required)
- GET `/api/profile`
- PUT `/api/profile` - `{ firstName, lastName, phone, currentPassword, newPassword }`

### Search
- GET `/api/search?q=query&limit=5`

---

## Notes

1. Backend must be running at localhost:3000
2. Use localStorage for token: `localStorage.getItem('token')`
3. All protected API calls need `Authorization: Bearer <token>` header
4. Seat IDs format: `A1`, `B5` (row letter + seat number)
5. Dates format: `YYYY-MM-DD`
6. Check FRONTEND_IMPLEMENTATION_GUIDE.md for detailed component code
