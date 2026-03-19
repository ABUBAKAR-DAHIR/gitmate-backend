import "dotenv/config"
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
});

async function main() {
  // 1. Create a user
  const user = await prisma.user.create({
    data: {
      name: "Abubakar",
      email: "abubakar@test.com",
      provider: "google",
      providerId: "12345",
    },
  });
  console.log("Created user:", user);

  // 2. Create a profile
  const profile = await prisma.profile.create({
    data: {
      userId: user.id,
      experience: "BEGINNER",
      skills: "JavaScript, Node.js",
      goals: "Find coding partner",
      availability: "Weekends",
      timezone: "Asia/Kolkata",
    },
  });
  console.log("Created profile:", profile);

  // 3. Create embedding
//   const embedding = await prisma.embedding.create({
//     data: {
//       userId: user.id,
//       embedding: Array(1536).fill(0), // dummy embedding
//     },
//   });
//   console.log("Created embedding:", embedding);

  // 4. Query user with profile and embedding
  const fullUser = await prisma.user.findUnique({
    where: { id: user.id },
    include: { profile: true, embedding: true },
  });
  console.log("Full user:", fullUser);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());