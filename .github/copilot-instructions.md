# Backend Developer Portfolio Project

## Project Overview
A professional Next.js 14 portfolio website for backend developers with a comprehensive admin dashboard for managing all content dynamically.

## ✅ Completed Features

### Frontend (Public Pages)
- [x] Home page with sidebar layout
- [x] Dynamic hero section with customizable background
- [x] About page with skills and experience (database-driven)
- [x] Portfolio/Projects showcase page (database-driven)
- [x] Project detail pages (dynamic with slug routing)
- [x] Resume page with downloadable PDF (database-driven)
- [x] Services page
- [x] Contact page with form (saves to database)
- [x] Responsive sidebar navigation
- [x] Dark theme with glassmorphism effects

### Admin Panel
- [x] Login page with NextAuth authentication
- [x] Dashboard with real stats from database
- [x] Profile management (update images, bio, social links)
- [x] Projects CRUD interface with create/edit/delete
- [x] Project creation page (/admin/projects/new)
- [x] Project edit page (/admin/projects/[id])
- [x] Messages page to view contact form submissions
- [x] Admin sidebar navigation
- [x] Protected routes with authentication

### Backend/API
- [x] NextAuth authentication setup
- [x] User profile API endpoints (Prisma integrated)
- [x] Projects CRUD API routes (Prisma integrated)
- [x] Skills API endpoint (Prisma integrated)
- [x] Experience API endpoint (Prisma integrated)
- [x] Contact form API (Prisma integrated)
- [x] Prisma schema (User, Project, Technology, Skill, Experience, ContactMessage, Testimonial)
- [x] All data fully dynamic from PostgreSQL database

### Tech Stack
- Next.js 14 (App Router with Server Components)
- TypeScript
- Tailwind CSS
- Prisma ORM
- NextAuth.js
- Framer Motion
- PostgreSQL (database)

## 🚀 How to Use

### Development
```bash
npm install
npm run dev
```
Visit http://localhost:3001

### Database Setup
```bash
npx prisma generate
npx prisma db push
```

### Admin Access
- URL: http://localhost:3001/admin/login
- Default credentials: admin@example.com / admin123

### Key Features
- All images (avatar, hero background) are dynamically loaded from API
- Update everything from admin dashboard
- No static content - all managed through database
- Sidebar layout on all public pages
- Glassmorphism UI with smooth animations
- Server-side rendering with ISR (revalidate: 60)

## 📝 Pages Structure

### Public Pages
- `/` - Home with hero section
- `/about` - About me, skills, and experience timeline
- `/projects` - Projects showcase grid
- `/projects/[slug]` - Individual project details
- `/services` - Services offered
- `/contact` - Contact form

### Admin Pages
- `/admin/login` - Authentication
- `/admin/dashboard` - Overview with stats
- `/admin/profile` - Update profile, images, bio
- `/admin/projects` - Projects list with CRUD
- `/admin/projects/new` - Create new project
- `/admin/projects/[id]` - Edit existing project
- `/admin/messages` - View contact form submissions
- `/admin/settings` - Application settings

## 📊 Database Models
- User: Profile data, authentication
- Project: Portfolio projects with technologies
- Technology: Tech stack items
- Skill: Technical skills by category
- Experience: Work history
- Testimonial: Client testimonials
- ContactMessage: Form submissions

## 🎯 Current Status
✅ Fully functional and dynamic
✅ All pages connected to database
✅ Complete CRUD operations
✅ Authentication working
✅ Real-time stats on dashboard
✅ ISR for optimal performance

## 📝 Next Steps (Optional)
- [ ] Deploy to production (Vercel + Database)
- [ ] Add file upload for images (AWS S3 or Cloudinary)
- [ ] Implement Skills management admin page
- [ ] Implement Experience management admin page
- [ ] Add blog functionality
- [ ] Add analytics tracking
- [ ] Setup email notifications for contact form
- [ ] Add testimonials management

