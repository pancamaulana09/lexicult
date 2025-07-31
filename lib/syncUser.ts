// lib/syncUser.ts
import { clerkClient } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export async function findOrCreateUser(clerkUserId: string) {
  // Try to find the local Prisma user
  const existingUser = await prisma.user.findUnique({
    where: { id: clerkUserId },
  });

  if (existingUser) return existingUser;

  // Fetch the user from Clerk
  const clerkUser = await clerkClient.users.getUser(clerkUserId);
  if (!clerkUser) throw new Error(`User not found in Clerk: ${clerkUserId}`);

  // Create user in local DB
  const newUser = await prisma.user.create({
    data: {
      id: clerkUser.id, // Use same ID for consistency
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
      name: `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim(),
      avatarUrl: clerkUser.imageUrl,
    },
  });

  return newUser;
}
