# WriteSpace

Your creative writing space. A full-featured blogging platform built with React, Vite, and Tailwind CSS. Users can register, log in, write and manage blog posts, while admins have access to a dashboard and user management tools.

## Tech Stack

- **Vite** — Fast build tool and development server
- **React 18** — UI library with functional components and hooks
- **React Router v6** — Client-side routing with protected routes
- **Tailwind CSS** — Utility-first CSS framework
- **localStorage** — Client-side data persistence for users, posts, and sessions
- **Vitest** — Unit testing framework
- **React Testing Library** — Component testing utilities

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- npm (included with Node.js)

### Installation

```bash
npm install
```

### Development

Start the local development server on port 3000:

```bash
npm run dev
```

The app will open automatically at [http://localhost:3000](http://localhost:3000).

### Build

Create a production build in the `dist/` directory:

```bash
npm run build
```

### Preview

Preview the production build locally:

```bash
npm run preview
```

### Testing

Run all tests:

```bash
npm run test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## Folder Structure

```
writespace/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── vercel.json                 # Vercel deployment configuration
├── src/
│   ├── main.jsx                # React entry point
│   ├── App.jsx                 # Root component with route definitions
│   ├── index.css               # Tailwind CSS imports
│   ├── setupTests.js           # Test setup (jest-dom matchers)
│   ├── components/
│   │   ├── Avatar.jsx          # Role-based avatar component
│   │   ├── BlogCard.jsx        # Blog post card for list views
│   │   ├── Navbar.jsx          # Authenticated navigation bar
│   │   ├── ProtectedRoute.jsx  # Route guard for auth and role checks
│   │   ├── PublicNavbar.jsx     # Guest navigation bar
│   │   ├── StatCard.jsx        # Dashboard stat card
│   │   └── UserRow.jsx         # User management row component
│   ├── pages/
│   │   ├── AdminDashboard.jsx  # Admin dashboard with stats and recent posts
│   │   ├── Home.jsx            # Blog listing page
│   │   ├── LandingPage.jsx     # Public landing page with hero and features
│   │   ├── LoginPage.jsx       # Login form
│   │   ├── ReadBlog.jsx        # Full blog post reader
│   │   ├── RegisterPage.jsx    # Registration form
│   │   ├── UserManagement.jsx  # Admin user management page
│   │   └── WriteBlog.jsx       # Blog create and edit form
│   └── utils/
│       ├── auth.js             # Authentication logic (login, register, logout)
│       └── storage.js          # localStorage helpers for users, posts, sessions
```

## Usage

### Default Admin Account

A hard-coded admin account is available out of the box:

- **Username:** `admin`
- **Password:** `admin123`

### Roles

- **Admin** — Full access to all posts, admin dashboard, and user management. Can edit and delete any post.
- **User** — Can create, read, edit, and delete their own posts. Can browse all posts.

### Routes

| Path | Access | Description |
|---|---|---|
| `/` | Public | Landing page |
| `/login` | Public | Login form |
| `/register` | Public | Registration form |
| `/blogs` | Authenticated | Blog listing |
| `/blogs/:id` | Authenticated | Read a blog post |
| `/blogs/write` | Authenticated | Create a new post |
| `/blogs/edit/:id` | Authenticated | Edit an existing post |
| `/admin/dashboard` | Admin only | Platform overview and stats |
| `/admin/users` | Admin only | User management |

### Data Storage

All data is stored in the browser's `localStorage` under the following keys:

- `writespace_users` — Array of registered user objects
- `writespace_posts` — Array of blog post objects
- `writespace_session` — Current user session object

## Deployment

### Vercel

The project includes a `vercel.json` configuration that rewrites all routes to `index.html` for client-side routing support.

1. Push the repository to GitHub, GitLab, or Bitbucket.
2. Import the project in [Vercel](https://vercel.com/).
3. Vercel will auto-detect the Vite framework and apply the correct build settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Deploy.

### Other Platforms

For any static hosting platform, build the project with `npm run build` and serve the `dist/` directory. Ensure all routes are redirected to `index.html` to support client-side routing.

## License

This project is private and proprietary. All rights reserved.