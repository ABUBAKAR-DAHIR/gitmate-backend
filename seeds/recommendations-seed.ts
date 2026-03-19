import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "../generated/prisma/client";
import { randomUUID } from "crypto";
import {OpenAI} from "openai"

// Prisma (Neon adapter)
const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
  }),
});

// console.log("api key: ", process.env.OPENAI_API_KEY)

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// })
const openai = new OpenAI({
  apiKey: "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"
})

// Create one user + profile + embedding
async function createUser(data: {
  name: string;
  email: string;
  skills: string;
  goals: string;
  experience: string;
  availability: string;
  timezone: string;
  bio?: string;
}): Promise<string> {

  // 1️⃣ Create or update user
  const user = await prisma.user.upsert({
    where: { email: data.email },
    update: { name: data.name },
    create: {
      name: data.name,
      email: data.email,
      provider: "seed",
      providerId: randomUUID(),
    },
  });

  // 2️⃣ Create or update profile
  const profile = await prisma.profile.upsert({
    where: { userId: user.id },
    update: {
      skills: data.skills,
      goals: data.goals,
      experience: data.experience as any,
      availability: data.availability,
      timezone: data.timezone,
      bio: data.bio,
    },
    create: {
      userId: user.id,
      skills: data.skills,
      goals: data.goals,
      experience: data.experience as any,
      availability: data.availability,
      timezone: data.timezone,
      bio: data.bio,
    },
  });

  // 3️⃣ Build embedding text
  const text = `
    Skills: ${profile.skills}
    Bio: ${profile.bio ?? ""}
    Goals: ${profile.goals}
    Experience: ${profile.experience}
    Availability: ${profile.availability}
    Timezone: ${profile.timezone}
    `;

  // 4️⃣ Generate MOCK embedding
  // const vector = mockEmbedding(text);

  const response = await openai.embeddings.create({
  model: 'text-embedding-3-small',
  input: text
});

const embedding = response.data[0].embedding;

const vectorString = `[${embedding.join(",")}]`;

  // Generate ID for Embedding row
  const embeddingId = randomUUID();

  // 5️⃣ Insert or update embedding
  await prisma.$executeRaw(
    Prisma.sql`
      INSERT INTO "Embedding"
      ("id","userId","embedding","createdAt","updatedAt")
      VALUES (
        ${embeddingId},
        ${user.id},
        ${Prisma.raw(`'${vectorString}'::vector`)},
        now(),
        now()
      )
      ON CONFLICT ("userId") DO UPDATE
      SET embedding = ${Prisma.raw(`'${vectorString}'::vector`)},
          "updatedAt" = now();
    `
  );

  console.log("✅ Created:", user.name);

  return user.id;
}
// MAIN
async function main() {

  const users = [
  // 🧠 AI / ML
  {
    name: "Ibrahim",
    email: "ibrahim@test.com",
    skills: "Python TensorFlow NLP Deep Learning",
    goals: "Build AI SaaS",
    experience: "ADVANCED",
    availability: "Full-time",
    timezone: "Asia/Kolkata",
    bio: "AI engineer focused on NLP systems",
  },
  {
    name: "Sara",
    email: "sara@test.com",
    skills: "Python Data Science Pandas Visualization",
    goals: "Data analyst career",
    experience: "INTERMEDIATE",
    availability: "Weekends",
    timezone: "Europe/Berlin",
    bio: "Loves working with data",
  },

  // 💻 Backend
  {
    name: "Yusuf",
    email: "yusuf@test.com",
    skills: "Node.js Express PostgreSQL REST APIs",
    goals: "Build scalable backend systems",
    experience: "INTERMEDIATE",
    availability: "Evenings",
    timezone: "Asia/Dubai",
    bio: "Backend developer",
  },
  {
    name: "Hamza",
    email: "hamza@test.com",
    skills: "Java Spring Boot Kafka Microservices",
    goals: "Enterprise backend systems",
    experience: "ADVANCED",
    availability: "Weekdays",
    timezone: "Asia/Kolkata",
    bio: "Microservices architect",
  },

  // 🎨 Frontend
  {
    name: "Ali",
    email: "ali@test.com",
    skills: "React Next.js Tailwind CSS",
    goals: "Build modern web apps",
    experience: "INTERMEDIATE",
    availability: "Evenings",
    timezone: "Asia/Karachi",
    bio: "Frontend engineer",
  },
  {
    name: "Noor",
    email: "noor@test.com",
    skills: "HTML CSS JavaScript UI UX Design",
    goals: "Frontend design career",
    experience: "BEGINNER",
    availability: "Weekends",
    timezone: "Africa/Cairo",
    bio: "Learning frontend",
  },

  // 📱 Mobile
  {
    name: "Amina",
    email: "amina@test.com",
    skills: "Flutter Dart Firebase",
    goals: "Build mobile apps",
    experience: "INTERMEDIATE",
    availability: "Full-time",
    timezone: "Asia/Kolkata",
    bio: "Mobile developer",
  },
  {
    name: "Bilal",
    email: "bilal@test.com",
    skills: "Kotlin Android Jetpack Compose",
    goals: "Android startup",
    experience: "ADVANCED",
    availability: "Evenings",
    timezone: "Asia/Riyadh",
    bio: "Android expert",
  },

  // ☁️ DevOps / Cloud
  {
    name: "Zaid",
    email: "zaid@test.com",
    skills: "AWS Docker Kubernetes CI/CD",
    goals: "Cloud infrastructure",
    experience: "ADVANCED",
    availability: "Weekdays",
    timezone: "America/New_York",
    bio: "DevOps engineer",
  },
  {
    name: "Owais",
    email: "owais@test.com",
    skills: "Linux Bash Networking Servers",
    goals: "System administration",
    experience: "INTERMEDIATE",
    availability: "Full-time",
    timezone: "Asia/Karachi",
    bio: "System admin",
  },

  // 🎮 Game Dev
  {
    name: "Rehan",
    email: "rehan@test.com",
    skills: "Unity C# Game Development",
    goals: "Indie game studio",
    experience: "INTERMEDIATE",
    availability: "Weekends",
    timezone: "Europe/London",
    bio: "Game developer",
  },

  // 🔐 Cybersecurity
  {
    name: "Farhan",
    email: "farhan@test.com",
    skills: "Cybersecurity Ethical Hacking Networking",
    goals: "Security expert",
    experience: "ADVANCED",
    availability: "Full-time",
    timezone: "Asia/Kolkata",
    bio: "Security specialist",
  },

  // 🤖 Mixed / Fullstack
  {
    name: "Ahmed",
    email: "ahmed@test.com",
    skills: "React Node.js MongoDB Fullstack",
    goals: "Build SaaS products",
    experience: "INTERMEDIATE",
    availability: "Evenings",
    timezone: "Asia/Dubai",
    bio: "Fullstack developer",
  },
  {
    name: "Khalid",
    email: "khalid@test.com",
    skills: "Next.js Prisma PostgreSQL APIs",
    goals: "Startup founder",
    experience: "ADVANCED",
    availability: "Full-time",
    timezone: "Europe/Paris",
    bio: "Fullstack engineer",
  },

  // 🧪 Beginner random profiles (important for testing)
  {
    name: "Test1",
    email: "test1@test.com",
    skills: "HTML CSS",
    goals: "Learn coding",
    experience: "BEGINNER",
    availability: "Weekends",
    timezone: "Asia/Kolkata",
    bio: "Just starting",
  },
  {
    name: "Test2",
    email: "test2@test.com",
    skills: "Python basics loops",
    goals: "Become developer",
    experience: "BEGINNER",
    availability: "Evenings",
    timezone: "Asia/Kolkata",
    bio: "Learning Python",
  },
];

  for (const user of users) {
    await createUser(user);
  }

}
main()
  .catch((err) => console.error("❌ Error:", err))
  .finally(async () => prisma.$disconnect());