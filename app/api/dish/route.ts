import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Adjust path if needed

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { name, ingredients, description } = await req.json();

    if (!name || !ingredients || !Array.isArray(ingredients)) {
      return NextResponse.json({ error: "Missing required fields: name and ingredients" }, { status: 400 });
    }

    const dish = await prisma.dish.create({
      data: {
        userEmail: session.user.email, // Use email from session
        name,
        description: description || null, // Handle optional description
        ingredients: {
          create: ingredients.map((ingredient: any) => ({
            name: ingredient.ingredient, // Ensure these field names match your Ingredient type
            ingredientId: ingredient.ingredientId, // Ensure these field names match your Ingredient type
          })),
        },
      },
      include: {
        ingredients: true,
      },
    });
    return NextResponse.json(dish, { status: 201 }); // Use 201 for created resource
  } catch (error) {
    console.error("Error creating dish:", error);
    // Check for specific Prisma errors if needed
    // if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
    //   return NextResponse.json({ error: "Dish with this name already exists for your account" }, { status: 409 }); // Conflict
    // }
    return NextResponse.json({ error: "Failed to save dish" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // Optionally, get query params if needed
    // const url = new URL(req.url);
    // const dishId = url.searchParams.get('id');
    // If you want to fetch a specific dish, add logic here

    // Fetch all dishes for the user
    const dishes = await prisma.dish.findMany({
      where: { userEmail: session.user.email },
      include: { ingredients: true },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json(dishes, {
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=60, stale-while-revalidate=120"
      }
    });
  } catch (error) {
    console.error("Error fetching dishes:", error);
    return NextResponse.json({ error: "Failed to fetch dishes" }, { status: 500 });
  }
}

// Add GET, PUT, DELETE handlers here if needed, also with auth checks