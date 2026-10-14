<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:009e86,100:00c9a7&height=220&section=header&text=Gitmate%20API&fontSize=68&fontColor=ffffff&fontAlignY=38&desc=The%20matching%20engine%20behind%20gitmate.org&descSize=22&descAlignY=60" alt="Gitmate API" width="100%" />

**NestJS backend for Gitmate, the platform that matches developers based on real code, not resumes.**

<br />

[![Live](https://img.shields.io/badge/🌐_Live-gitmate.org-009e86?style=for-the-badge)](https://gitmate.org)
[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io)

[**Live App**](https://gitmate.org) · [**Frontend Repo**](https://github.com/ABUBAKAR-DAHIR/gitmate) · [**Report a Bug**](../../issues)

</div>

<br />

## 💡 What is this?

This is the API that powers [Gitmate](https://gitmate.org). It handles sign-in, developer profiles, the matching engine, real-time chat, and projects.

The core idea: every developer profile is turned into a **vector embedding**. Finding a coding partner then becomes a similarity search, so you see people whose goals, experience, and availability genuinely resemble yours.

<br />

## ✨ What it does

<table>
  <tr>
    <td width="50%" valign="top">
      <h3>🔐 OAuth Sign-in</h3>
      Log in with <b>GitHub</b> or <b>Google</b>. Sessions are secured with JWT and guarded routes.
    </td>
    <td width="50%" valign="top">
      <h3>🧠 AI Matching</h3>
      Profiles become embeddings stored in PostgreSQL with <b>pgvector</b>, then ranked by similarity score.
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>🎯 Recommendations</h3>
      A ranked feed of developers who fit you, with similar-profile lookups.
    </td>
    <td width="50%" valign="top">
      <h3>🤝 Matches</h3>
      Like, pass, or star. Mutual interest becomes a match.
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h3>💬 Chat</h3>
      Matched developers can message each other directly.
    </td>
    <td width="50%" valign="top">
      <h3>📁 Projects</h3>
      Create projects and find collaborators for them.
    </td>
  </tr>
</table>

<br />

## ⚙️ How matching works

```mermaid
flowchart LR
    A[Developer fills in<br/>profile + syncs GitHub] --> B[Profile text sent to<br/>embeddings API]
    B --> C[(Vector stored in<br/>PostgreSQL + pgvector)]
    C --> D[Similarity search<br/>against other profiles]
    D --> E[Ranked feed with<br/>similarity scores]
    E --> F{Like / Pass / Star}
    F -->|Mutual like| G[🎉 Match + Chat]

    style A fill:#009e86,stroke:#009e86,color:#fff
    style C fill:#336791,stroke:#336791,color:#fff
    style G fill:#00c9a7,stroke:#00c9a7,color:#fff
```

<br />

## 🧩 Modules

| Module | Responsibility |
|---|---|
| `auth` | GitHub and Google OAuth strategies, JWT guards |
| `user` | Accounts and user data |
| `profile` | Developer profiles, GitHub sync |
| `embeddings` | Turning profiles into vectors |
| `recommendations` | Similarity search and the discovery feed |
| `matches` | Likes, stars, passes, and mutual matches |
| `chat` | Conversations between matches |
| `projects` | Projects and collaborator discovery |
| `prisma` | Database client and schema access |

<br />

## 🛠️ Tech Stack

<div align="center">

<img src="https://skillicons.dev/icons?i=nestjs,nodejs,ts,postgres,prisma,aws,terraform,githubactions&perline=8" alt="Tech stack" />

</div>

| Layer | Technology |
|---|---|
| **Framework** | NestJS, Node.js, TypeScript |
| **Database** | PostgreSQL on Neon, Prisma ORM |
| **Vector search** | pgvector |
| **AI** | OpenAI embeddings API |
| **Auth** | OAuth 2.0 (GitHub, Google), JWT |
| **Infrastructure** | AWS, Application Load Balancer, Terraform |
| **CI/CD** | GitHub Actions |

<br />

## 🏗️ Architecture

```mermaid
flowchart LR
    C([🌐 Frontend<br/>gitmate.org]) --> ALB[AWS Application<br/>Load Balancer]
    ALB --> API[NestJS API]
    API --> DB[(Neon PostgreSQL<br/>+ pgvector)]
    API --> AI[OpenAI<br/>Embeddings]
    API --> OA[GitHub / Google<br/>OAuth]

    style C fill:#00c9a7,stroke:#00c9a7,color:#fff
    style ALB fill:#232f3e,stroke:#ff9900,color:#fff
    style API fill:#e0234e,stroke:#e0234e,color:#fff
    style DB fill:#336791,stroke:#336791,color:#fff
    style AI fill:#10a37f,stroke:#10a37f,color:#fff
    style OA fill:#181717,stroke:#ffffff,color:#fff
```

Infrastructure lives in its own repository, [`gitmate-infrastructure`](https://github.com/ABUBAKAR-DAHIR/gitmate-infrastructure), and deployments run through GitHub Actions.

<br />

## 🚦 Run it locally

**Prerequisites:** Node.js 20+, pnpm, and a PostgreSQL database with pgvector (a free [Neon](https://neon.tech) database works well).

```bash
# Clone
git clone https://github.com/ABUBAKAR-DAHIR/gitmate-backend.git
cd gitmate-backend

# Install
pnpm install

# Set up the database
pnpm dlx prisma generate
pnpm dlx prisma migrate dev

# Start the dev server
pnpm start:dev
```

### Environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL="postgresql://user:password@host:port/dbname"

GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

EMBEDDING_API_KEY="your-embedding-api-key"
```

> [!WARNING]
> Never commit your `.env` file. It contains secrets.

### Scripts

| Command | Description |
|---|---|
| `pnpm start:dev` | Start with hot reload |
| `pnpm build` | Build for production |
| `pnpm start:prod` | Run the production build |
| `pnpm test` | Run unit tests |
| `pnpm lint` | Lint the codebase |

<br />

## 📍 Status

Backend and frontend are live. AI matching is integrated and the recommendation engine is being improved.

<br />

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository
2. Create a branch: `git checkout -b feat/your-feature`
3. Commit your changes
4. Open a pull request

<br />

## 👥 Team

<div align="center">

Built by the **Abubakar Dahir Hassan**

[![GitHub](https://img.shields.io/badge/GitHub-ABUBAKAR--DAHIR-181717?style=for-the-badge&logo=github)](https://github.com/ABUBAKAR-DAHIR)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Abubakar_Dahir_Hassan-0A66C2?style=for-the-badge&logo=linkedin)](https://www.linkedin.com/in/abubakar-dahir/)

<br />

MIT License © Gitmate Team

⭐ **If you like Gitmate, give it a star!**

<img src="https://capsule-render.vercel.app/api?type=waving&color=0:009e86,100:00c9a7&height=100&section=footer" alt="" width="100%" />

</div>