# GitMate – Find Your Coding Partner 🚀

<br/>
<p align="center">
  <img src="https://readme-typing-svg.herokuapp.com?font=Fira+Code&size=22&pause=1000&color=4F46E5&center=true&vCenter=true&width=600&lines=Connecting+Developers;Hackathons+to+Projects;Find+Your+Perfect+Coding+Partner" alt="Typing SVG" />
</p>

GitMate is a **developer collaboration platform** that helps developers find coding partners based on skills, goals, experience, and availability. Whether for hackathons, open-source projects, or learning, GitMate simplifies collaboration and matches developers efficiently.

---

## The Promise

- **Instant partner recommendations**  
  Find the right coding partner using smart AI-based embeddings.

- **Developer-first design**  
  Seamless experience for creating profiles, browsing matches, and managing collaborations.

- **AI-powered matching**  
  Uses vector embeddings to compute similarity between profiles for the best matches.

- **Secure & flexible authentication**  
  OAuth login via Google or GitHub, with secure sessions.

---

## What It Does

1. Users create their profile with skills, goals, experience, and availability.  
2. Profile data is converted into embeddings for similarity matching.  
3. GitMate backend queries the embeddings table and calculates match scores.  
4. The system returns a ranked list of potential coding partners.  
5. Users can accept matches, chat, or collaborate on projects.

---

## Tech Stack

- **Backend**: NestJS, Node.js  
- **Database**: PostgreSQL with Prisma ORM hosted on NeonDB, pgvector for embeddings  
- **Authentication**: OAuth (Google & GitHub)  
- **AI / Recommendation**: OpenAI embeddings API  

---

## Folder Structure

```text
gitmate/
├─ dist/
├─ generated/
├─ node_modules/
├─ prisma/
│ ├─ migrations/
│ │ └─ 20260315040140_init/
│ └─ schema.prisma
├─ seeds/
│ └─ seed.ts
├─ src/
│ ├─ auth/
│ │ ├─ guards/
│ │ │ ├─ github.guard.ts
│ │ │ ├─ google.guard.ts
│ │ │ └─ jwt.guard.ts
│ │ ├─ strategies/
│ │ │ ├─ github.strategy.ts
│ │ │ └─ google.strategy.ts
│ │ ├─ auth.controller.ts
│ │ ├─ auth.controller.spec.ts
│ │ ├─ auth.module.ts
│ │ ├─ auth.service.ts
│ │ └─ auth.service.spec.ts
│ ├─ app.controller.ts
│ ├─ app.controller.spec.ts
│ ├─ app.module.ts
│ ├─ app.service.ts
│ └─ main.ts
├─ test/
│ ├─ app.e2e-spec.ts
│ └─ jest-e2e.json
├─ .env
├─ .gitignore
├─ package.json
├─ pnpm-lock.yaml
├─ prisma.config.ts
├─ README.md
├─ tsconfig.build.json
├─ tsconfig.json
└─ eslint.config.mjs

```

## Tech Stack

- **Backend**: NestJS, Node.js  
- **Database**: PostgreSQL with Prisma ORM, pgvector for embeddings  
- **Authentication**: OAuth (Google & GitHub)  
- **AI / Recommendation**: OpenAI embeddings API  

---

## Getting Started

### Prerequisites
- Node.js ≥ 20  
- PostgreSQL (Neon or local)  
- pnpm / npm / yarn  ( preferrably pnpm)

### Installation

```bash
# Clone the repo
git clone https://github.com/abubakar-dahir/gitmate-backend.git
cd gitmate-backend

# Install dependencies
pnpm install

# Initialize Prisma & generate client
pnpm dlx prisma generate
pnpm dlx prisma migrate dev --name init

# Start development server
pnpm start:dev
```

## Environment Variables

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host:port/dbname"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
EMBEDDING_API_KEY="your-embedding-api-key"

```

## Status

Fully functional backend and frontend, AI matching integrated, actively iterating features, and improving the recommendation engine.

---


## Author

Developed and maintained by **Abubakar, Aniket, Ayush, and Yagna**

---

## License

MIT License © GitMate Team

---
