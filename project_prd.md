# SyntaxSpace PRD

**Tagline:** Connect with Expert Tutors, Learn Anything
**Stack:** React, Node.js/Express, PostgreSQL, Stripe
**UI Color:** Indigo #4F46E5 — same across all pages

---

## Roles
- **Student** — browse, book, pay, review
- **Tutor** — profile, availability, sessions, payouts
- **Admin** — manage users/categories/payments (seeded in DB)

---

## Database Tables

**Users:** id, name, email, password_hash, role (student|tutor|admin), avatar_url, status (active|banned)

**TutorProfiles:** id, user_id (FK), bio, hourly_rate, subjects, avg_rating, stripe_account_id, stripe_onboarded

**Categories:** id, name, icon

**Availability:** id, tutor_id (FK), start_time, end_time, is_booked

**Bookings:** id, student_id, tutor_id, slot_id, status (confirmed|completed|cancelled), payment_status (pending|paid|refunded|transferred), stripe_payment_intent_id, amount, platform_fee, tutor_payout, session_date

**Reviews:** id, booking_id, student_id, tutor_id, rating (1-5), comment

---

## API Endpoints

### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET  /api/auth/me

### Public
- GET /api/tutors (filters: subject, rating, price)
- GET /api/tutors/:id
- GET /api/categories

### Bookings (Private)
- POST   /api/bookings — create booking + trigger payment
- GET    /api/bookings — user's bookings
- PATCH  /api/bookings/:id/cancel — cancel + refund
- PATCH  /api/bookings/:id/complete — tutor marks done

### Tutor (Tutor only)
- GET/PUT /api/tutor/profile
- GET/PUT /api/tutor/availability
- DELETE  /api/tutor/availability/:id
- GET     /api/tutor/earnings

### Payments
- POST /api/payments/create-intent
- POST /api/payments/refund/:bookingId
- POST /api/payments/connect/onboard — Stripe Connect for tutor
- GET  /api/payments/connect/status
- POST /api/webhooks/stripe

### Reviews
- POST /api/reviews
- GET  /api/reviews/tutor/:id

### Admin
- GET    /api/admin/users
- PATCH  /api/admin/users/:id (ban/unban)
- GET    /api/admin/bookings
- GET/POST/PUT/DELETE /api/admin/categories
- GET    /api/admin/payments
- GET    /api/admin/stats

---

## Pages & Routes

### Public
- / — Home, search, featured tutors
- /tutors — Browse with filters
- /tutors/:id — Tutor profile + book
- /login, /register

### Student (Private)
- /dashboard — Overview
- /dashboard/bookings — Booking history
- /dashboard/profile — Edit profile
- /checkout/:bookingId — Stripe payment

### Tutor (Private)
- /tutor/dashboard
- /tutor/availability
- /tutor/profile
- /tutor/sessions
- /tutor/earnings

### Admin (Private)
- /admin — Stats
- /admin/users
- /admin/bookings
- /admin/categories
- /admin/payments

---

## Payment Flow (Stripe)

**Student pays:**
1. Select slot → POST /api/bookings → create PaymentIntent
2. Stripe Checkout → payment captured
3. Booking status → CONFIRMED
4. Cancel 24h+ before → full refund; within 24h → no refund

**Tutor receives:**
1. Session marked COMPLETED → platform deducts fee (e.g. 10%)
2. Net amount transferred to tutor Stripe Connect account
3. Tutor views earnings on /tutor/earnings

**Webhook events to handle:** payment_intent.succeeded, payment_intent.payment_failed, transfer.created, charge.refunded

---

## Booking Status
- CONFIRMED → (tutor marks done) → COMPLETED
- CONFIRMED → (student cancels) → CANCELLED + refund

---

## Auth Rules
- JWT (7 days expiry)
- bcrypt for passwords
- Role-based middleware on all private routes
- Stripe webhook signature verification

---

## ENV Variables

**Backend:** DATABASE_URL, JWT_SECRET, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, STRIPE_PLATFORM_FEE_PERCENT, CLOUDINARY_URL, CLIENT_URL

**Frontend:** NEXT_PUBLIC_API_URL, NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY