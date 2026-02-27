# edtech-frontend 🎓

> **Connect with Expert Tutors, Learn Anything**  
> A Next.js 15 frontend for the  EdTech platform — enabling students to discover and book tutors, tutors to manage their teaching profile, and admins to oversee the platform.

---

## 📁 Folder Structure

```
edtech-frontend/
├── public/                          # Static assets (images, icons, fonts)
├── src/
│   ├── app/                         # Next.js App Router
│   │   ├── layout.tsx               # Root layout (fonts, global providers)
│   │   ├── not-found.tsx            # Global 404 page
│   │   │
│   │   ├── (common)/                # Public-facing route group
│   │   │   ├── layout.tsx           # Shared layout (Navbar + Footer)
│   │   │   ├── page.tsx             # Home page (/)
│   │   │   ├── about/
│   │   │   │   ├── page.tsx         # About page
│   │   │   │   ├── loading.tsx      # About loading skeleton
│   │   │   │   └── error.tsx        # About error boundary
│   │   │   ├── findTutor/
│   │   │   │   ├── layout.tsx       # Find tutor layout
│   │   │   │   ├── page.tsx         # Find tutor listing page
│   │   │   │   └── loading.tsx      # Find tutor loading skeleton
│   │   │   ├── tutors/
│   │   │   │   ├── page.tsx         # Browse all tutors (/tutors)
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx     # Individual tutor profile (/tutors/:id)
│   │   │   ├── login/
│   │   │   │   └── page.tsx         # Login page
│   │   │   └── signup/
│   │   │       └── page.tsx         # Registration page
│   │   │
│   │   └── (dashboard)/             # Protected dashboard route group
│   │       ├── layout.tsx           # Dashboard shell layout (sidebar)
│   │       ├── not-found.tsx        # Dashboard-level 404
│   │       │
│   │       ├── booking/
│   │       │   ├── layout.tsx       # Booking flow layout
│   │       │   └── page.tsx         # Booking page
│   │       │
│   │       ├── student/             # Student-specific dashboard pages
│   │       │   ├── layout.tsx       # Student layout
│   │       │   ├── default.tsx      # Student default view
│   │       │   ├── dashboard/
│   │       │   │   └── page.tsx     # Student dashboard overview
│   │       │   ├── bookings/
│   │       │   │   └── page.tsx     # Student booking history
│   │       │   ├── profile/
│   │       │   │   └── page.tsx     # Student profile management
│   │       │   └── review/
│   │       │       └── page.tsx     # Leave a review
│   │       │
│   │       ├── tutor/               # Tutor-specific dashboard pages
│   │       │   ├── layout.tsx       # Tutor layout
│   │       │   ├── dashboard/
│   │       │   │   └── page.tsx     # Tutor dashboard overview
│   │       │   ├── availability/
│   │       │   │   └── page.tsx     # Manage availability slots
│   │       │   └── profile/
│   │       │       └── page.tsx     # Tutor profile management
│   │       │
│   │       └── admin/               # Admin-specific dashboard pages
│   │           ├── dashboard/
│   │           │   └── page.tsx     # Admin analytics dashboard
│   │           ├── getAlUsers/
│   │           │   └── page.tsx     # View & manage all users
│   │           ├── AllBooking/
│   │           │   └── page.tsx     # View all bookings
│   │           ├── createCategory/
│   │           │   └── page.tsx     # Create a new category
│   │           ├── getCategory/
│   │           │   └── page.tsx     # View all categories
│   │           ├── updateCategory/
│   │           │   └── page.tsx     # Edit a category
│   │           └── UpdateStatus/
│   │               └── page.tsx     # Update user status (ban/unban)
│   │
│   ├── components/
│   │   ├── layout/                  # Shared layout components
│   │   │   ├── Navbar.tsx           # Top navigation bar
│   │   │   ├── Footer.tsx           # Footer
│   │   │   ├── HeroSection.tsx      # Landing page hero
│   │   │   ├── HomePage.tsx         # Home page composition
│   │   │   ├── Searchsection.tsx    # Tutor search bar section
│   │   │   ├── DynamiccontentSection.tsx  # Dynamic feature sections
│   │   │   ├── About.tsx            # About section component
│   │   │   ├── Animation.tsx        # Reusable animation wrapper
│   │   │   ├── ModeToggle.tsx       # Dark/light mode toggle
│   │   │   └── Profileinfocard.tsx  # Generic profile info card
│   │   │
│   │   ├── modules/                 # Feature-specific components
│   │   │   ├── authentication/
│   │   │   │   ├── login-form.tsx   # Login form with validation
│   │   │   │   └── signup-form.tsx  # Signup form with role selection
│   │   │   │
│   │   │   ├── student/
│   │   │   │   ├── dashboard.tsx          # Student dashboard widgets
│   │   │   │   ├── Bookingcard.tsx        # Individual booking card
│   │   │   │   ├── BookingPageSkeleton.tsx # Booking page skeleton loader
│   │   │   │   ├── DurationSelector.tsx   # Session duration picker
│   │   │   │   ├── PricePreview.tsx       # Booking price preview
│   │   │   │   ├── ProfileCard.tsx        # Student profile card
│   │   │   │   ├── profile-form.tsx       # Student profile edit form
│   │   │   │   ├── profile-info-card.tsx  # Read-only profile info
│   │   │   │   ├── SuccessState.tsx       # Post-booking success state
│   │   │   │   └── TutorSummary.tsx       # Tutor summary in booking flow
│   │   │   │
│   │   │   ├── tutor/
│   │   │   │   ├── TutorCard.tsx          # Tutor listing card
│   │   │   │   ├── TutorProfilePage.tsx   # Full tutor profile view
│   │   │   │   ├── TutorHeroSection.tsx   # Tutor profile hero banner
│   │   │   │   ├── TutorFiltersBar.tsx    # Subject/rating/price filters
│   │   │   │   ├── TutorStateBar.tsx      # Tutor status/stats bar
│   │   │   │   ├── TutorSectionHeading.tsx # Section heading component
│   │   │   │   ├── TutorEmptyState.tsx    # No tutors found state
│   │   │   │   ├── Profilecard.tsx        # Tutor dashboard profile card
│   │   │   │   ├── ProfileSection.tsx     # Editable profile section
│   │   │   │   ├── ProfileImageUpload.tsx # Profile image uploader
│   │   │   │   ├── ProfileToast.tsx       # Profile save toast notification
│   │   │   │   ├── Bookingrow.tsx         # Booking row in tutor sessions
│   │   │   │   ├── Sessionspanel.tsx      # Sessions management panel
│   │   │   │   ├── Reviewscard.tsx        # Student review display card
│   │   │   │   ├── Startcard.tsx          # Getting-started onboarding card
│   │   │   │   └── Helpers.tsx            # Tutor module helper utils
│   │   │   │
│   │   │   └── admin/
│   │   │       ├── UserTable.tsx          # Users data table
│   │   │       └── iconpicker.tsx         # Icon picker for categories
│   │   │
│   │   └── ui/                      # shadcn/ui base components
│   │       ├── accordion.tsx
│   │       ├── alert.tsx
│   │       ├── avatar.tsx
│   │       ├── badge.tsx
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── field.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── navigation-menu.tsx
│   │       ├── progress.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── skeleton.tsx
│   │       ├── sonner.tsx
│   │       ├── tabs.tsx
│   │       └── textarea.tsx
│   │
│   ├── providers/
│   │   └── ThemeProvider.tsx        # next-themes dark/light mode provider
│   │
│   └── routes/                      # Role-based route config
│       ├── adminRoutes.tsx          # Admin protected routes definition
│       ├── studentRoutes.tsx        # Student protected routes definition
│       └── tutorRoutes.tsx          # Tutor protected routes definition
│
├── components.json                  # shadcn/ui component registry config
├── next.config.ts                   # Next.js configuration
├── postcss.config.mjs               # PostCSS / Tailwind config
├── eslint.config.mjs                # ESLint configuration
├── tsconfig.json                    # TypeScript configuration
├── pnpm-lock.yaml                   # pnpm lockfile
├── pnpm-workspace.yaml              # pnpm workspace config
└── package.json                     # Project dependencies & scripts
```

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 15](https://nextjs.org/) (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| UI Components | [shadcn/ui](https://ui.shadcn.com/) |
| Icons | Lucide React |
| Notifications | Sonner |
| Theme | next-themes (dark/light mode) |
| Package Manager | pnpm |

---

## ⚙️ Getting Started

### Prerequisites

- Node.js `>= 18`
- pnpm `>= 9`

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd edtech-frontend

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Variables

Create a `.env.local` file in the root with the following:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> `NEXT_PUBLIC_API_BASE_URL` should point to your backend server.

### Running the Dev Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm start
```

---

## 🗺️ Pages & Routes

### Public Routes

| Route | Page | Description |
|---|---|---|
| `/` | Home | Hero section, search, featured tutors |
| `/tutors` | Browse Tutors | Tutor listing with filters |
| `/tutors/:id` | Tutor Profile | Full profile, reviews, booking CTA |
| `/findTutor` | Find a Tutor | Search-focused tutor discovery |
| `/login` | Login | Authentication form |
| `/signup` | Register | Registration with role selection |
| `/about` | About | Platform info page |

### Student Routes (Protected)

| Route | Page | Description |
|---|---|---|
| `/student/dashboard` | Dashboard | Booking overview & stats |
| `/student/bookings` | My Bookings | Booking history (upcoming & past) |
| `/student/profile` | Profile | Edit personal info |
| `/student/review` | Leave Review | Review a completed session |

### Tutor Routes (Protected)

| Route | Page | Description |
|---|---|---|
| `/tutor/dashboard` | Dashboard | Session stats & overview |
| `/tutor/availability` | Availability | Manage available time slots |
| `/tutor/profile` | Profile | Edit tutor profile & subjects |

### Admin Routes (Protected)

| Route | Page | Description |
|---|---|---|
| `/admin/dashboard` | Dashboard | Platform-wide analytics |
| `/admin/getAlUsers` | All Users | View & manage all users |
| `/admin/AllBooking` | All Bookings | View all platform bookings |
| `/admin/getCategory` | Categories | View all categories |
| `/admin/createCategory` | Create Category | Add a new subject category |
| `/admin/updateCategory` | Edit Category | Update an existing category |
| `/admin/UpdateStatus` | Update User Status | Ban or unban users |

---

## 🔐 Role-Based Access

Users register as one of three roles. Route protection is handled via the route config files in `src/routes/`:

| Role | Access |
|---|---|
| **Student** | Public routes + `/student/*` dashboard |
| **Tutor** | Public routes + `/tutor/*` dashboard |
| **Admin** | Public routes + `/admin/*` dashboard (seeded account) |

---

## 🎨 UI & Design System

This project uses **shadcn/ui** on top of **Tailwind CSS**. All base components live in `src/components/ui/`. To add a new shadcn component:

```bash
pnpm dlx shadcn@latest add <component-name>
```

Dark mode is supported out of the box via `next-themes`, toggled with the `ModeToggle` component in the navbar.

---

## 📦 Key Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Create production build
pnpm start        # Start production server
pnpm lint         # Run ESLint
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is part of the **edtech-platform** EdTech platform. See the root repository for license details.