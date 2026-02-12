# Backend Developer Portfolio

A modern, professional portfolio website for backend developers with a comprehensive admin dashboard built with Next.js 14, TypeScript, Prisma, and Tailwind CSS.

## Features

- 🎨 **Sidebar Layout** with dynamic profile image and social links
- 🖼️ **Dynamic Hero Section** with customizable background image
- 📊 **Admin Dashboard** to manage all content
- 🔐 **Authentication** with NextAuth
- 💾 **Database** powered by Prisma & PostgreSQL
- 🎭 **Modern UI** with Tailwind CSS and Framer Motion animations
- 📱 **Fully Responsive** design

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and other credentials.

3. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── app/                # Next.js app directory
│   ├── api/           # API routes
│   ├── admin/         # Admin dashboard pages
│   └── page.tsx       # Home page
├── components/         # React components
├── lib/               # Utility functions
├── prisma/            # Database schema
└── public/            # Static assets
```

## Admin Panel

Access the admin panel at `/admin` to:
- Update profile information
- Change hero background image
- Manage projects, skills, and experience
- View contact messages
- Customize all content dynamically

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** NextAuth.js
- **Animations:** Framer Motion
- **Icons:** Lucide React

## License

MIT
# Portfolio
