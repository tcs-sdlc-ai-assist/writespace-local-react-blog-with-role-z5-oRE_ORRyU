# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-08-20

### Added

- **Public Landing Page** — Hero section with call-to-action buttons, features overview (Write Freely, Community Driven, Role-Based Access), latest posts preview, and footer with navigation links.
- **Authentication System** — Login and registration forms with client-side validation. Hard-coded admin account (`admin` / `admin123`) available out of the box. Session persistence via `localStorage`.
- **Role-Based Routing** — `ProtectedRoute` component guards authenticated and admin-only routes. Unauthenticated users are redirected to `/login`. Non-admin users are redirected to `/blogs` when accessing admin routes.
- **Avatar System** — Role-based avatar component displaying crown emoji (👑) for admins and book emoji (📖) for regular users, with distinct background colors.
- **Blog CRUD Operations**
  - Create new blog posts with title and content fields.
  - Read full blog posts on a dedicated reader page with author info and formatted date.
  - Edit existing posts (restricted to post owner or admin).
  - Delete posts with confirmation dialog (restricted to post owner or admin).
- **Blog Listing Page** — Responsive grid of blog cards sorted newest first, with truncated excerpts, author avatars, formatted dates, and conditional edit icons based on ownership and role.
- **Admin Dashboard** — Platform overview with stat cards (total posts, total users, admin count, user count), quick-action buttons (Write New Post, Manage Users), and a list of the 5 most recent posts with edit and delete controls.
- **User Management** — Admin-only page to view all users (including hard-coded admin), create new users with display name, username, password, and role selection, and delete users with confirmation. Hard-coded admin and currently logged-in user cannot be deleted.
- **localStorage Persistence** — All data stored client-side under `writespace_users`, `writespace_posts`, and `writespace_session` keys with graceful error handling for read/write failures.
- **Responsive Tailwind UI** — Fully responsive design using Tailwind CSS utility classes with custom color palette (primary, secondary, accent), custom font families, and consistent component styling across all pages.
- **Navigation Bars** — `PublicNavbar` for guest users with Login and Get Started links. `Navbar` for authenticated users with Blogs, Write, and conditional Dashboard/Users links for admins, plus user avatar display and logout button.
- **Vercel Deployment** — `vercel.json` configuration with URL rewrites for client-side routing support. Production build via `npm run build` outputs to `dist/` directory.
- **Testing Infrastructure** — Vitest and React Testing Library setup with unit tests for authentication logic, localStorage storage utilities, protected route component, and home page rendering.