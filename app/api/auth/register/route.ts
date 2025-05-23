import prisma from "@/lib/prisma";
import { hash } from "bcryptjs";
import { NextResponse } from "next/server";
import validator from "validator";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Sanitize user input
    const cleanEmail = validator.normalizeEmail(email + "") || "";
    const cleanPassword = validator.escape(password + "");
    if (!cleanEmail || !cleanPassword) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const exists = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (exists) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hash(cleanPassword, 10);

    // Create a new user in the database
    const user = await prisma.user.create({
      data: { 
        email: cleanEmail, 
        password: hashedPassword 
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}