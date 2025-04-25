// filepath: e:\Coding\CSP\CSP_Project-main\app\api\dish\all\route.ts
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if needed

export const dynamic = "force-dynamic"; // Keep this if you always want fresh data

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    // Return empty array or error depending on desired behavior for unauthenticated users
    // Option 1: Return empty array
    // return NextResponse.json([]);
    // Option 2: Return error
     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const dishesWithIngredients = await prisma.dish.findMany({
      where: {
        userEmail: session.user.email, // Filter by logged-in user
      },
      include: {
        ingredients: {
          select: {
            ingredientId: true,
            name: true,
          },
        },
      },
      orderBy: {
         // Optional: Add ordering, e.g., by name or creation date
         createdAt: 'desc',
      }
    });

    return NextResponse.json(dishesWithIngredients);
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return NextResponse.json({ error: "Failed to fetch dishes" }, { status: 500 });
  }
}