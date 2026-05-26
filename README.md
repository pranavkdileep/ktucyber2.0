# KTU Cyber

KTU Cyber is a student-focused study material platform for discovering, sharing,
and managing academic resources. It is built for KTU and other university
communities, with subject-based browsing, document uploads, user profiles, and
a beta Study Agents experience for generating study notes from supported books.

## Features

- Browse recent documents and trending subjects from the home page.
- Search subjects and view public materials grouped by subject.
- Upload PDF, DOCX, PPTX, and XLSX files with generated or custom previews.
- Bookmark and download documents from the document viewer.
- Create accounts, verify email addresses, sign in, and reset passwords.
- Manage uploads, downloads, bookmarks, and account settings from a dashboard.
- View public profiles and follow other contributors.
- Use Study Agents to chat with book-specific assistants and export generated
  notes as PDF.

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | Next.js 15 App Router, React 19, TypeScript |
| Styling | Tailwind CSS 4, Radix UI, Lucide React |
| Database | PostgreSQL through `postgres` |
| Authentication | JWT cookies with `jose`, password hashing with `bcrypt` |
| Validation | Zod and React Hook Form |
| Object storage | Cloudflare R2 through the AWS S3 SDK |
| Document preview | PDF.js and Sharp |
| Email | Nodemailer |
| Agent integration | External streaming HTTP/SSE API |

## Getting Started

### Prerequisites

- Node.js 18.18 or newer
- npm
- A PostgreSQL database
- A Cloudflare R2 bucket for uploads
- An SMTP/mail configuration for account verification and password recovery
- Optional: an agent backend service for the `/agents` pages

### Installation

```bash
git clone <repository-url>
cd ktucyber2.0
npm install
```

Create a `.env.local` file in the project root:

```env
# PostgreSQL
POSTGRES_URL=postgresql://USER:PASSWORD@HOST:5432/DATABASE

# Authentication
JWT_SECRET=replace-with-a-long-random-secret

# Cloudflare R2 / S3-compatible storage
R2_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your-access-key-id
R2_SECRET_ACCESS_KEY=your-secret-access-key
R2_BUCKET_NAME=ktucyber
R2_PUBLIC_URL=https://your-public-bucket-domain/

# Public HTTPS host used in verification and reset emails
MAIL_DOMAIN=your-domain.example

# Optional Study Agents backend
AGENT_API_BASE=http://127.0.0.1:8000
NEXT_PUBLIC_AGENT_API_BASE=http://127.0.0.1:8000
```

`POSTGRES_URL`, `JWT_SECRET`, and the R2 variables are required for the main
application flows. The agent variables are optional; without them the app
tries a local backend at `http://127.0.0.1:8000`.

### Database Setup

The database schema contains users, documents, subjects, universities,
bookmarks, downloads, followers, and notifications. A schema initialization
helper is available at `actions/db_init.ts`, but this repository does not
currently expose it as an npm command or migration.

Before using the application, create the tables using that schema in your
PostgreSQL database or connect the helper to a trusted one-time setup workflow.
Subject and university records are needed before users can associate uploaded
documents with existing catalog entries; the upload UI can also create them.

### Email Setup

Verification and password reset messages are sent through Nodemailer in
`actions/mail.ts`. `MAIL_DOMAIN` controls the links included in emails.
Email URLs are built with an `https://` prefix, so set it to an HTTPS-enabled
host when testing those flows.
The current SMTP transport configuration is defined in that file; move SMTP
credentials to environment variables before deploying or sharing the project.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server with Turbopack. |
| `npm run build` | Create an optimized production build. |
| `npm run start` | Run the production build. |
| `npm run lint` | Run Next.js linting; the first run prompts for an ESLint configuration. |

## Main Routes

| Route | Purpose |
| --- | --- |
| `/` | Search, recent documents, and trending subjects |
| `/[subject-slug]` | Subject document listing |
| `/[subject-slug]/[document-slug]` | Document viewer and interactions |
| `/signup`, `/login` | User authentication |
| `/forgot-password`, `/reset-password` | Password recovery |
| `/user/dashboard` | Private account and document dashboard |
| `/user/upload` | Upload study materials |
| `/user/settings` | Edit profile settings |
| `/profile/[username]` | Public contributor profile |
| `/agents` | Browse Study Agents |
| `/agent/[bookid]` | Stream agent responses and export notes |

## Project Structure

```text
app/                   Next.js routes, pages, and API handlers
actions/               Server actions for auth, documents, profiles, and R2
components/            Shared UI and document/agent components
lib/                   Database, storage client, schemas, and utilities
public/                Static files, including the PDF.js worker
middleware.ts          JWT-based redirects for authentication pages
```

## External Services

### PostgreSQL

Application content and account activity are persisted in PostgreSQL through
`lib/db.ts`. The connection is configured to use SSL certificate verification.

### Cloudflare R2

Documents, document previews, university images, and profile pictures are
stored in R2. Ensure `R2_PUBLIC_URL` is a publicly readable base URL so that
uploaded media can be displayed in the interface.

If your public R2 image hostname differs from the one currently configured in
`next.config.ts`, add it to `images.remotePatterns`.

### Study Agent API

The beta Study Agents UI expects an external API with:

- `GET /bookids` for available agents.
- `POST /chat/stream` for server-sent chat events.
- Reachable image paths for images referenced by generated notes.

The application includes proxy routes for the stream and for mixed-content
agent images.

## Deployment Notes

1. Configure all production environment variables, using a strong
   `JWT_SECRET`.
2. Initialize the PostgreSQL schema before serving traffic.
3. Configure R2 public access and the appropriate image hostname.
4. Replace source-defined SMTP credentials with secret environment variables.
5. Configure ESLint if it has not been initialized yet, then run a
   production check:

```bash
npm run lint
npm run build
```

## License

No license file is currently included in this repository.
