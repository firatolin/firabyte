# Firabyte — Tech Blog Platform

A modern, fast, and SEO-optimized technology blogging platform built with **Next.js 16, TypeScript, and Tailwind CSS**. Firabyte provides a clean, content-first reading experience with dark mode, full-text search, comments, newsletter subscriptions, authentication, and image management.

**Live Site:** https://firabyte.tech | https://www.firabyte.tech

---

##  Tech Stack

### Core Technologies

| Technology          | Purpose                         |
| ------------------- | ------------------------------- |
| **Next.js 16**      | React framework with App Router |
| **TypeScript**      | Type-safe development           |
| **Tailwind CSS v4** | Utility-first styling           |
| **shadcn/ui**       | UI component library            |
| **Prisma ORM**      | Database access                 |
| **Neon PostgreSQL** | Serverless PostgreSQL database  |
| **NextAuth.js**     | Authentication                  |
| **Cloudinary**      | Image upload and optimization   |
| **Resend**          | Email delivery                  |
| **Vercel**          | Hosting and deployment          |

### Additional Packages

* **MDX** — Content authoring with JSX components
* **Fuse.js** — Fuzzy search
* **React Syntax Highlighter** — Code syntax highlighting
* **date-fns** — Date formatting
* **Lucide React** — Icons

---

##  Features

###  Blog

* **MDX Content Pipeline** — Write posts using MDX and JSX components
* **Syntax Highlighting** — Beautiful code blocks
* **Table of Contents** — Automatically generated from headings
* **Reading Time** — Estimated reading time for posts
* **Cover Images** — Upload and optimize images through Cloudinary
* **Categories & Tags** — Organize and discover content

###  User Features

* **Authentication** — Email/password and Google OAuth
* **Comments** — Threaded comments and replies
* **Search** — Fast fuzzy full-text search
* **Newsletter** — Email subscriptions and welcome emails
* **Dark/Light Mode** — Persistent theme preferences

###  Admin Features

* **Post Management** — Create, edit, and delete posts
* **Image Upload** — Cloudinary-powered image management
* **Analytics** — View post statistics and performance data

###  SEO & Performance

* **Dynamic Open Graph Images**
* **JSON-LD Structured Data**
* **Automatic Sitemap**
* **Robots.txt Configuration**
* **Static Generation**
* **Incremental Static Regeneration (ISR)**
* **Performance-optimized pages**

---

##  Project Structure

```text
firabyte/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── posts/
│   │   ├── categories/
│   │   ├── tags/
│   │   └── about/
│   ├── auth/
│   ├── admin/
│   ├── api/
│   ├── manage-posts/
│   ├── newsletter/
│   └── search/
├── components/
│   ├── posts/
│   ├── shared/
│   ├── ui/
│   └── admin/
├── content/
│   └── posts/
├── lib/
│   ├── mdx.ts
│   ├── search.ts
│   ├── cloudinary.ts
│   ├── email-templates.ts
│   └── prisma.ts
├── prisma/
│   └── schema.prisma
├── public/
├── types/
├── .env.example
└── .env.local
```

---

##  Installation

### Prerequisites

Make sure you have:

* Node.js 20+
* npm
* PostgreSQL database — Neon recommended
* Cloudinary account
* Resend account

### 1. Clone the Repository

```bash
git clone https://github.com/firatolin/firabyte.git
cd firabyte
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create your local environment file:

```bash
cp .env.example .env.local
```

Then configure the required variables:

```env
# Database
DATABASE_URL=your_postgresql_url

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# Cloudinary
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Resend
RESEND_API_KEY=your_resend_api_key
NEWSLETTER_EMAIL=newsletter@yourdomain.com
```

### 4. Set Up the Database

```bash
npx prisma db push
npx prisma generate
```

### 5. Start the Development Server

```bash
npm run dev
```

The application will be available at:

```text
http://localhost:3000
```

---

##  Creating a Blog Post

### 1. Create an MDX File

```bash
touch content/posts/your-post-slug.mdx
```

### 2. Add Frontmatter

```mdx
---
title: "Your Post Title"
date: "2026-08-20"
excerpt: "A brief description of your post"
tags: ["tag1", "tag2"]
category: "Category Name"
author: "Firatol Esayas Tefera"
coverImage: "https://res.cloudinary.com/..."
---

# Your Post Title

Content here...
```

### 3. Commit and Push

```bash
git add .
git commit -m "feat: add new post"
git push
```

If connected to Vercel, the new version will be automatically deployed.

---

##  Deployment

### Deploy with Vercel

1. Push the repository to GitHub.
2. Open Vercel.
3. Create a new project.
4. Import the Firabyte GitHub repository.
5. Configure all required environment variables.
6. Deploy the application.
7. Add `firabyte.tech` as the custom domain.
8. Configure the required DNS records with your domain provider.

---

## 🧪 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run TypeScript checks
npm run type-check

# Run ESLint
npm run lint

# Push Prisma schema to database
npx prisma db push

# Generate Prisma Client
npx prisma generate

# Open Prisma Studio
npx prisma studio
```

---

## 🤝 Contributing

1. Fork the repository.
2. Create a feature branch:

```bash
git checkout -b feature/amazing-feature
```

3. Make your changes.
4. Commit your changes:

```bash
git commit -m "feat: add amazing feature"
```

5. Push the branch:

```bash
git push origin feature/amazing-feature
```

6. Open a Pull Request.

---

## 📄 License

This project is private and is not open for redistribution.

---

## Author

### Firatol Esayas Tefera

* **Website:** https://firatolin.tech
* **GitHub:** https://github.com/firatolin
* **LinkedIn:** https://www.linkedin.com/in/firatol-esayas-tefera

---

## Acknowledgments

* **Next.js** — React framework
* **Vercel** — Hosting and deployment
* **Neon** — PostgreSQL database
* **shadcn/ui** — UI components
* **Cloudinary** — Image management

---

## Contact

* **Blog:** [contact@firabyte.tech](mailto:contact@firabyte.tech)
* **Personal:** [teferafiratolesayas@gmail.com](mailto:teferafiratolesayas@gmail.com)
* **Alternative:** [contact@firatolin.tech](mailto:contact@firatolin.tech)
* **WhatsApp:** +251 963 535 322

---

## Built With

**Next.js · TypeScript · Tailwind CSS · Prisma · PostgreSQL · NextAuth · Cloudinary · Resend · Vercel**

**Built by Firatol Esayas Tefera**
